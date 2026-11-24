import type { OutputImageFormat } from '@/src/config/examPresets';
import type { CompressionWorkerRequest, CompressionWorkerResponse } from '@/src/workers/compressionWorker';

export const MAX_UPLOAD_BYTES = 25 * 1024 * 1024; // 25 MB safety limit
export const ACCEPTED_MIME_TYPES = ['image/jpeg', 'image/png'] as const;

export interface LoadedImageAsset {
  file: File;
  name: string;
  originalSizeBytes: number;
  originalWidth: number;
  originalHeight: number;
  mimeType: string;
  objectUrl: string;
  element: HTMLImageElement;
}

export interface CropTransformSettings {
  zoom: number; // 1.0 to 4.0
  offsetX: number; // -1 to 1 normalized pan
  offsetY: number; // -1 to 1 normalized pan
  rotationDeg: number; // -180 to 180
  cropAspectRatio: number | null; // null = free crop / matches output ratio
  backgroundColor: string; // e.g. '#FFFFFF', '#DBEAFE'
  applySimpleBgReplace: boolean;
  bgThreshold: number; // 180 to 250 luminance threshold for light studio backdrops
  signatureCleanPaperMode: boolean; // false = preserve original signature appearance
  signaturePaperThreshold: number; // 170 to 240
}

export interface ProcessImageOptions {
  targetWidth: number;
  targetHeight: number;
  outputFormat: OutputImageFormat;
  minKb: number | null;
  maxKb: number | null;
  manualQuality: number; // 0.1 to 1.0
  allowAutoScaleDown: boolean;
  transform: CropTransformSettings;
}

export interface ProcessedImageResult {
  blob: Blob;
  objectUrl: string;
  width: number;
  height: number;
  sizeBytes: number;
  sizeKb: number;
  format: OutputImageFormat;
  qualityUsed: number;
  scaledDown: boolean;
  warning?: string;
}

export function formatKb(bytes: number): string {
  return `${(bytes / 1024).toFixed(2)} KB`;
}

export function validateUploadFile(file: File): string | null {
  const validMime = file.type === 'image/jpeg' || file.type === 'image/png';
  const validExt = /\.(jpe?g|png)$/i.test(file.name);
  if (!validMime && !validExt) {
    return 'Unsupported file type. Please upload a valid JPG, JPEG, or PNG image.';
  }
  if (file.size === 0) {
    return 'The selected file appears to be empty (0 bytes).';
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return `File is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Maximum allowed size is 25 MB.`;
  }
  return null;
}

export async function loadImageAsset(file: File): Promise<LoadedImageAsset> {
  const validationError = validateUploadFile(file);
  if (validationError) {
    throw new Error(validationError);
  }

  const objectUrl = URL.createObjectURL(file);

  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error('Could not decode image. The file may be corrupted or not a valid JPG/PNG.'));
      el.src = objectUrl;
    });

    if (img.naturalWidth < 1 || img.naturalHeight < 1) {
      throw new Error('Decoded image has invalid dimensions (0 px).');
    }

    return {
      file,
      name: file.name,
      originalSizeBytes: file.size,
      originalWidth: img.naturalWidth,
      originalHeight: img.naturalHeight,
      mimeType: file.type || (file.name.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg'),
      objectUrl,
      element: img,
    };
  } catch (err) {
    URL.revokeObjectURL(objectUrl);
    throw err;
  }
}

export function renderTransformedCanvas(
  img: HTMLImageElement,
  outWidth: number,
  outHeight: number,
  transform: CropTransformSettings,
  outputFormat: OutputImageFormat
): HTMLCanvasElement {
  const safeW = Math.max(16, Math.min(6000, Math.round(outWidth)));
  const safeH = Math.max(16, Math.min(6000, Math.round(outHeight)));

  const canvas = document.createElement('canvas');
  canvas.width = safeW;
  canvas.height = safeH;

  const ctx = canvas.getContext('2d', { willReadFrequently: transform.applySimpleBgReplace || transform.signatureCleanPaperMode });
  if (!ctx) {
    throw new Error('Browser Canvas 2D context is unavailable.');
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Fill background color (always filled for JPEG or when explicit solid color selected)
  if (outputFormat === 'image/jpeg' || transform.backgroundColor) {
    ctx.fillStyle = transform.backgroundColor || '#FFFFFF';
    ctx.fillRect(0, 0, safeW, safeH);
  }

  // Compute cover scale so source covers the output frame at zoom = 1
  const rad = (transform.rotationDeg * Math.PI) / 180;
  const cos = Math.abs(Math.cos(rad));
  const sin = Math.abs(Math.sin(rad));
  const rotatedBoundW = img.naturalWidth * cos + img.naturalHeight * sin;
  const rotatedBoundH = img.naturalWidth * sin + img.naturalHeight * cos;

  const coverScale = Math.max(safeW / rotatedBoundW, safeH / rotatedBoundH);
  const effectiveScale = coverScale * Math.max(0.5, transform.zoom);

  const panX = transform.offsetX * safeW * 0.5;
  const panY = transform.offsetY * safeH * 0.5;

  ctx.save();
  ctx.translate(safeW / 2 + panX, safeH / 2 + panY);
  ctx.rotate(rad);
  ctx.scale(effectiveScale, effectiveScale);
  ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
  ctx.restore();

  // Optional simple uniform bright-background replacement (non-AI thresholding)
  if (transform.applySimpleBgReplace) {
    applySimpleSolidBackgroundReplacement(ctx, safeW, safeH, transform.backgroundColor, transform.bgThreshold);
  }

  // Optional signature paper clean-up when user disables "Preserve Original Signature Appearance"
  if (transform.signatureCleanPaperMode) {
    applySignaturePaperCleanup(ctx, safeW, safeH, transform.signaturePaperThreshold, transform.backgroundColor || '#FFFFFF');
  }

  return canvas;
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    return [
      parseInt(clean[0] + clean[0], 16) || 255,
      parseInt(clean[1] + clean[1], 16) || 255,
      parseInt(clean[2] + clean[2], 16) || 255,
    ];
  }
  const num = parseInt(clean, 16);
  if (Number.isNaN(num)) return [255, 255, 255];
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

/**
 * Simple flood-fill / edge-connected bright-backdrop replacement.
 * Only replaces light uniform background pixels connected to the canvas border
 * so bright eyes/shirts/teeth inside the portrait are much less affected.
 */
function applySimpleSolidBackgroundReplacement(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  targetHex: string,
  threshold: number
): void {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const [tr, tg, tb] = hexToRgb(targetHex);
  const total = width * height;
  const visited = new Uint8Array(total);
  const queue = new Int32Array(total);
  let head = 0;
  let tail = 0;

  const isLightNeutral = (idx: number): boolean => {
    const p = idx * 4;
    const r = data[p];
    const g = data[p + 1];
    const b = data[p + 2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    const spread = Math.max(r, g, b) - Math.min(r, g, b);
    return lum >= threshold && spread <= 48;
  };

  const enqueue = (idx: number) => {
    if (visited[idx]) return;
    if (!isLightNeutral(idx)) return;
    visited[idx] = 1;
    queue[tail++] = idx;
  };

  for (let x = 0; x < width; x++) {
    enqueue(x);
    enqueue((height - 1) * width + x);
  }
  for (let y = 0; y < height; y++) {
    enqueue(y * width);
    enqueue(y * width + (width - 1));
  }

  while (head < tail) {
    const idx = queue[head++];
    const p = idx * 4;
    data[p] = tr;
    data[p + 1] = tg;
    data[p + 2] = tb;
    data[p + 3] = 255;

    const x = idx % width;
    const y = (idx - x) / width;

    if (x > 0) enqueue(idx - 1);
    if (x < width - 1) enqueue(idx + 1);
    if (y > 0) enqueue(idx - width);
    if (y < height - 1) enqueue(idx + width);
  }

  ctx.putImageData(imageData, 0, 0);
}

function applySignaturePaperCleanup(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  threshold: number,
  bgHex: string
): void {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const [br, bg, bb] = hexToRgb(bgHex);

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    if (lum >= threshold) {
      data[i] = br;
      data[i + 1] = bg;
      data[i + 2] = bb;
    } else {
      // Gently deepen ink contrast while keeping original hue
      const factor = 0.85;
      data[i] = Math.max(0, Math.round(r * factor));
      data[i + 1] = Math.max(0, Math.round(g * factor));
      data[i + 2] = Math.max(0, Math.round(b * factor));
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

function canvasToBlobAsync(canvas: HTMLCanvasElement, format: OutputImageFormat, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Failed to encode canvas image to Blob.'));
          return;
        }
        resolve(blob);
      },
      format,
      quality
    );
  });
}

let workerInstance: Worker | null = null;
let workerJobSeq = 1;

function getCompressionWorker(): Worker | null {
  if (typeof Worker === 'undefined' || typeof OffscreenCanvas === 'undefined') {
    return null;
  }
  if (!workerInstance) {
    try {
      workerInstance = new Worker(new URL('../workers/compressionWorker.ts', import.meta.url), {
        type: 'module',
      });
    } catch {
      return null;
    }
  }
  return workerInstance;
}

async function compressOnMainThread(
  sourceCanvas: HTMLCanvasElement,
  options: ProcessImageOptions
): Promise<CompressionWorkerResponse> {
  const { targetWidth, targetHeight, outputFormat, minKb, maxKb, manualQuality, allowAutoScaleDown } = options;

  const encodeScaled = async (w: number, h: number, q: number): Promise<Blob> => {
    if (w === sourceCanvas.width && h === sourceCanvas.height) {
      return canvasToBlobAsync(sourceCanvas, outputFormat, q);
    }
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const ctx = c.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context unavailable.');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    if (outputFormat === 'image/jpeg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, w, h);
    }
    ctx.drawImage(sourceCanvas, 0, 0, w, h);
    return canvasToBlobAsync(c, outputFormat, q);
  };

  if (outputFormat === 'image/png') {
    let w = targetWidth;
    let h = targetHeight;
    let blob = await encodeScaled(w, h, 1);
    let scaledDown = false;
    let warning: string | undefined;

    if (maxKb !== null && blob.size > maxKb * 1024) {
      if (allowAutoScaleDown) {
        for (const factor of [0.9, 0.8, 0.7, 0.6, 0.5, 0.4]) {
          w = Math.max(40, Math.round(targetWidth * factor));
          h = Math.max(40, Math.round(targetHeight * factor));
          blob = await encodeScaled(w, h, 1);
          scaledDown = true;
          if (blob.size <= maxKb * 1024) break;
        }
      }
      if (blob.size > maxKb * 1024) {
        warning = `PNG is lossless and reached ${(blob.size / 1024).toFixed(1)} KB, above your ${maxKb} KB limit. Switch to JPEG or reduce dimensions.`;
      } else if (scaledDown) {
        warning = `Dimensions were adjusted to ${w}×${h} px to meet the ${maxKb} KB PNG target.`;
      }
    }

    return { id: 0, ok: true, blob, width: w, height: h, qualityUsed: 1, scaledDown, warning };
  }

  if (maxKb === null) {
    let blob = await encodeScaled(targetWidth, targetHeight, manualQuality);
    let q = manualQuality;
    let warning: string | undefined;
    if (minKb !== null && blob.size < minKb * 1024) {
      const highBlob = await encodeScaled(targetWidth, targetHeight, 0.99);
      blob = highBlob;
      q = 0.99;
      if (blob.size < minKb * 1024) {
        warning = `Output size (${(blob.size / 1024).toFixed(1)} KB) is below ${minKb} KB at ${targetWidth}×${targetHeight} px. Increase dimensions if a larger file is required.`;
      }
    }
    return { id: 0, ok: true, blob, width: targetWidth, height: targetHeight, qualityUsed: q, scaledDown: false, warning };
  }

  const maxBytes = maxKb * 1024;
  const minBytes = minKb !== null ? minKb * 1024 : 0;

  let bestBlob = await encodeScaled(targetWidth, targetHeight, 0.92);
  let bestQ = 0.92;

  if (bestBlob.size <= maxBytes) {
    if (minBytes > 0 && bestBlob.size < minBytes) {
      const q99 = await encodeScaled(targetWidth, targetHeight, 0.99);
      if (q99.size <= maxBytes) {
        bestBlob = q99;
        bestQ = 0.99;
      }
    }
    const warning =
      minBytes > 0 && bestBlob.size < minBytes
        ? `File size (${(bestBlob.size / 1024).toFixed(1)} KB) is below ${minKb} KB at ${targetWidth}×${targetHeight} px.`
        : undefined;
    return { id: 0, ok: true, blob: bestBlob, width: targetWidth, height: targetHeight, qualityUsed: bestQ, scaledDown: false, warning };
  }

  let low = 0.12;
  let high = 0.92;
  let found: { blob: Blob; quality: number } | null = null;
  for (let i = 0; i < 8; i++) {
    const mid = Number(((low + high) / 2).toFixed(3));
    const candidate = await encodeScaled(targetWidth, targetHeight, mid);
    if (candidate.size <= maxBytes) {
      found = { blob: candidate, quality: mid };
      low = mid;
    } else {
      high = mid;
    }
  }

  if (found) {
    const warning =
      minBytes > 0 && found.blob.size < minBytes
        ? `Achieved ${(found.blob.size / 1024).toFixed(1)} KB (within ${maxKb} KB max, slightly below ${minKb} KB min).`
        : undefined;
    return {
      id: 0,
      ok: true,
      blob: found.blob,
      width: targetWidth,
      height: targetHeight,
      qualityUsed: found.quality,
      scaledDown: false,
      warning,
    };
  }

  let finalBlob = await encodeScaled(targetWidth, targetHeight, 0.12);
  let finalW = targetWidth;
  let finalH = targetHeight;
  let finalQ = 0.12;
  let scaledDown = false;

  if (allowAutoScaleDown) {
    for (const factor of [0.9, 0.82, 0.74, 0.65, 0.56, 0.48, 0.4]) {
      finalW = Math.max(40, Math.round(targetWidth * factor));
      finalH = Math.max(40, Math.round(targetHeight * factor));
      const probe = await encodeScaled(finalW, finalH, 0.55);
      finalBlob = probe;
      finalQ = 0.55;
      scaledDown = true;
      if (probe.size <= maxBytes) break;
      const lowProbe = await encodeScaled(finalW, finalH, 0.18);
      finalBlob = lowProbe;
      finalQ = 0.18;
      if (lowProbe.size <= maxBytes) break;
    }
  }

  let warning: string | undefined;
  if (finalBlob.size > maxBytes) {
    warning = `Target size of ${maxKb} KB could not be achieved at ${finalW}×${finalH} px without severe quality loss (minimum reached: ${(finalBlob.size / 1024).toFixed(1)} KB). Try smaller dimensions or a higher KB limit.`;
  } else if (scaledDown) {
    warning = `Dimensions were reduced to ${finalW}×${finalH} px to fit within ${maxKb} KB.`;
  }

  return {
    id: 0,
    ok: true,
    blob: finalBlob,
    width: finalW,
    height: finalH,
    qualityUsed: finalQ,
    scaledDown,
    warning,
  };
}

export async function processImageWithEngine(
  asset: LoadedImageAsset,
  options: ProcessImageOptions
): Promise<ProcessedImageResult> {
  const renderedCanvas = renderTransformedCanvas(
    asset.element,
    options.targetWidth,
    options.targetHeight,
    options.transform,
    options.outputFormat
  );

  const worker = getCompressionWorker();
  let response: CompressionWorkerResponse | null = null;

  if (worker && typeof createImageBitmap === 'function') {
    try {
      const bitmap = await createImageBitmap(renderedCanvas);
      const jobId = workerJobSeq++;
      response = await new Promise<CompressionWorkerResponse>((resolve) => {
        const handleMsg = (ev: MessageEvent<CompressionWorkerResponse>) => {
          if (ev.data.id !== jobId) return;
          worker.removeEventListener('message', handleMsg);
          worker.removeEventListener('error', handleErr);
          resolve(ev.data);
        };
        const handleErr = () => {
          worker.removeEventListener('message', handleMsg);
          worker.removeEventListener('error', handleErr);
          resolve({
            id: jobId,
            ok: false,
            width: options.targetWidth,
            height: options.targetHeight,
            qualityUsed: options.manualQuality,
            scaledDown: false,
            error: 'WORKER_FAILED',
          });
        };
        worker.addEventListener('message', handleMsg);
        worker.addEventListener('error', handleErr);
        const payload: CompressionWorkerRequest = {
          id: jobId,
          imageBitmap: bitmap,
          targetWidth: renderedCanvas.width,
          targetHeight: renderedCanvas.height,
          outputFormat: options.outputFormat,
          minKb: options.minKb,
          maxKb: options.maxKb,
          manualQuality: options.manualQuality,
          allowAutoScaleDown: options.allowAutoScaleDown,
        };
        worker.postMessage(payload, [bitmap]);
      });
    } catch {
      response = null;
    }
  }

  if (!response || !response.ok || !response.blob) {
    response = await compressOnMainThread(renderedCanvas, options);
  }

  if (!response.blob) {
    throw new Error(response.error || 'Image processing failed.');
  }

  const outUrl = URL.createObjectURL(response.blob);
  return {
    blob: response.blob,
    objectUrl: outUrl,
    width: response.width,
    height: response.height,
    sizeBytes: response.blob.size,
    sizeKb: Number((response.blob.size / 1024).toFixed(2)),
    format: options.outputFormat,
    qualityUsed: response.qualityUsed,
    scaledDown: response.scaledDown,
    warning: response.warning,
  };
}

export interface A4SheetOptions {
  copies: number; // e.g., 4, 6, 8, 12, 16
  dpi: 150 | 300;
  cutGuides: boolean;
  outputFormat: OutputImageFormat;
}

export async function generateA4PassportSheet(
  singlePhotoBlob: Blob,
  photoWidthPx: number,
  photoHeightPx: number,
  options: A4SheetOptions
): Promise<ProcessedImageResult> {
  // Standard A4 size: 8.27 x 11.69 inches
  const a4W = options.dpi === 300 ? 2480 : 1240;
  const a4H = options.dpi === 300 ? 3508 : 1754;

  const photoUrl = URL.createObjectURL(singlePhotoBlob);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error('Could not read processed passport photograph for A4 sheet.'));
      el.src = photoUrl;
    });

    const canvas = document.createElement('canvas');
    canvas.width = a4W;
    canvas.height = a4H;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D unavailable.');

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, a4W, a4H);

    const margin = Math.round(a4W * 0.05);
    const gap = Math.round(a4W * 0.025);
    const usableW = a4W - margin * 2;
    const usableH = a4H - margin * 2;

    // Target print size: ~35mm x 45mm scaled nicely or preserving aspect ratio
    const aspect = photoWidthPx / photoHeightPx || 35 / 45;
    const cols = options.copies <= 4 ? 2 : options.copies <= 9 ? 3 : 4;
    const rowsNeeded = Math.ceil(options.copies / cols);

    const maxCellW = Math.floor((usableW - gap * (cols - 1)) / cols);
    const maxCellH = Math.floor((usableH - gap * (rowsNeeded - 1)) / rowsNeeded);

    // Keep standard passport print width ~35-42mm at chosen DPI unless cell is tighter
    const idealW = Math.round((35 / 25.4) * options.dpi);
    let drawW = Math.min(maxCellW, idealW);
    let drawH = Math.round(drawW / aspect);
    if (drawH > maxCellH) {
      drawH = maxCellH;
      drawW = Math.round(drawH * aspect);
    }

    let placed = 0;
    for (let r = 0; r < rowsNeeded && placed < options.copies; r++) {
      for (let c = 0; c < cols && placed < options.copies; c++) {
        const x = margin + c * (drawW + gap);
        const y = margin + r * (drawH + gap);

        ctx.drawImage(img, x, y, drawW, drawH);
        if (options.cutGuides) {
          ctx.strokeStyle = '#CBD5E1';
          ctx.lineWidth = options.dpi === 300 ? 2 : 1;
          ctx.strokeRect(x, y, drawW, drawH);
        }
        placed++;
      }
    }

    const blob = await canvasToBlobAsync(canvas, options.outputFormat, 0.94);
    const objectUrl = URL.createObjectURL(blob);

    return {
      blob,
      objectUrl,
      width: a4W,
      height: a4H,
      sizeBytes: blob.size,
      sizeKb: Number((blob.size / 1024).toFixed(2)),
      format: options.outputFormat,
      qualityUsed: 0.94,
      scaledDown: false,
    };
  } finally {
    URL.revokeObjectURL(photoUrl);
  }
}
