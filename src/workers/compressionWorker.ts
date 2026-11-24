// Web Worker for non-blocking JPEG/PNG canvas encoding & binary-search KB compression

export interface CompressionWorkerRequest {
  id: number;
  imageBitmap: ImageBitmap;
  targetWidth: number;
  targetHeight: number;
  outputFormat: 'image/jpeg' | 'image/png';
  minKb: number | null;
  maxKb: number | null;
  manualQuality: number;
  allowAutoScaleDown: boolean;
}

export interface CompressionWorkerResponse {
  id: number;
  ok: boolean;
  blob?: Blob;
  width: number;
  height: number;
  qualityUsed: number;
  scaledDown: boolean;
  warning?: string;
  error?: string;
}

async function encodeOffscreen(
  bitmap: ImageBitmap,
  width: number,
  height: number,
  format: 'image/jpeg' | 'image/png',
  quality: number
): Promise<Blob> {
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Unable to initialize OffscreenCanvas 2D context.');
  }
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  if (format === 'image/jpeg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);
  }
  ctx.drawImage(bitmap, 0, 0, width, height);
  return await canvas.convertToBlob({ type: format, quality });
}

self.onmessage = async (event: MessageEvent<CompressionWorkerRequest>) => {
  const req = event.data;
  const { id, imageBitmap, targetWidth, targetHeight, outputFormat, minKb, maxKb, manualQuality, allowAutoScaleDown } =
    req;

  try {
    if (typeof OffscreenCanvas === 'undefined') {
      self.postMessage({
        id,
        ok: false,
        width: targetWidth,
        height: targetHeight,
        qualityUsed: manualQuality,
        scaledDown: false,
        error: 'OFFSCREEN_UNSUPPORTED',
      } satisfies CompressionWorkerResponse);
      return;
    }

    if (outputFormat === 'image/png') {
      let currentW = targetWidth;
      let currentH = targetHeight;
      let blob = await encodeOffscreen(imageBitmap, currentW, currentH, 'image/png', 1);
      let scaledDown = false;
      let warning: string | undefined;

      if (maxKb !== null && blob.size > maxKb * 1024) {
        if (allowAutoScaleDown) {
          const scales = [0.9, 0.8, 0.7, 0.6, 0.5, 0.4];
          for (const factor of scales) {
            const nextW = Math.max(40, Math.round(targetWidth * factor));
            const nextH = Math.max(40, Math.round(targetHeight * factor));
            const candidate = await encodeOffscreen(imageBitmap, nextW, nextH, 'image/png', 1);
            currentW = nextW;
            currentH = nextH;
            blob = candidate;
            scaledDown = true;
            if (blob.size <= maxKb * 1024) break;
          }
        }
        if (blob.size > maxKb * 1024) {
          const achievedKb = (blob.size / 1024).toFixed(1);
          warning = `PNG is lossless and reached ${achievedKb} KB, above your ${maxKb} KB target. Switch output format to JPEG or reduce pixel dimensions.`;
        } else if (scaledDown) {
          warning = `Dimensions were automatically reduced to ${currentW}×${currentH} px to fit the ${maxKb} KB PNG target.`;
        }
      }

      imageBitmap.close();
      self.postMessage({
        id,
        ok: true,
        blob,
        width: currentW,
        height: currentH,
        qualityUsed: 1,
        scaledDown,
        warning,
      } satisfies CompressionWorkerResponse);
      return;
    }

    // JPEG compression pipeline
    if (maxKb === null) {
      const blob = await encodeOffscreen(imageBitmap, targetWidth, targetHeight, 'image/jpeg', manualQuality);
      let warning: string | undefined;
      if (minKb !== null && blob.size < minKb * 1024) {
        const highBlob = await encodeOffscreen(imageBitmap, targetWidth, targetHeight, 'image/jpeg', 0.99);
        if (highBlob.size >= minKb * 1024) {
          imageBitmap.close();
          self.postMessage({
            id,
            ok: true,
            blob: highBlob,
            width: targetWidth,
            height: targetHeight,
            qualityUsed: 0.99,
            scaledDown: false,
          } satisfies CompressionWorkerResponse);
          return;
        }
        warning = `Output size (${(highBlob.size / 1024).toFixed(1)} KB) is below the ${minKb} KB minimum at ${targetWidth}×${targetHeight} px. Increase dimensions if a larger file is required.`;
        imageBitmap.close();
        self.postMessage({
          id,
          ok: true,
          blob: highBlob,
          width: targetWidth,
          height: targetHeight,
          qualityUsed: 0.99,
          scaledDown: false,
          warning,
        } satisfies CompressionWorkerResponse);
        return;
      }

      imageBitmap.close();
      self.postMessage({
        id,
        ok: true,
        blob,
        width: targetWidth,
        height: targetHeight,
        qualityUsed: manualQuality,
        scaledDown: false,
        warning,
      } satisfies CompressionWorkerResponse);
      return;
    }

    const maxBytes = maxKb * 1024;
    const minBytes = minKb !== null ? minKb * 1024 : 0;

    // 1. Try initial high quality
    let bestBlob = await encodeOffscreen(imageBitmap, targetWidth, targetHeight, 'image/jpeg', 0.92);
    let bestQ = 0.92;

    if (bestBlob.size <= maxBytes) {
      // If below minBytes, check higher quality
      if (minBytes > 0 && bestBlob.size < minBytes) {
        const q98 = await encodeOffscreen(imageBitmap, targetWidth, targetHeight, 'image/jpeg', 0.99);
        if (q98.size <= maxBytes) {
          bestBlob = q98;
          bestQ = 0.99;
        }
      }

      let warning: string | undefined;
      if (minBytes > 0 && bestBlob.size < minBytes) {
        warning = `File size (${(bestBlob.size / 1024).toFixed(1)} KB) is below ${minKb} KB even at maximum JPEG quality for ${targetWidth}×${targetHeight} px. Try slightly larger pixel dimensions.`;
      }

      imageBitmap.close();
      self.postMessage({
        id,
        ok: true,
        blob: bestBlob,
        width: targetWidth,
        height: targetHeight,
        qualityUsed: bestQ,
        scaledDown: false,
        warning,
      } satisfies CompressionWorkerResponse);
      return;
    }

    // 2. Binary search JPEG quality between 0.12 and 0.92
    let low = 0.12;
    let high = 0.92;
    let foundUnderMax: { blob: Blob; quality: number } | null = null;

    for (let i = 0; i < 8; i++) {
      const mid = Number(((low + high) / 2).toFixed(3));
      const candidate = await encodeOffscreen(imageBitmap, targetWidth, targetHeight, 'image/jpeg', mid);
      if (candidate.size <= maxBytes) {
        foundUnderMax = { blob: candidate, quality: mid };
        low = mid;
      } else {
        high = mid;
      }
    }

    if (foundUnderMax) {
      let warning: string | undefined;
      if (minBytes > 0 && foundUnderMax.blob.size < minBytes) {
        warning = `Achieved ${(foundUnderMax.blob.size / 1024).toFixed(1)} KB (within ${maxKb} KB max, slightly under ${minKb} KB min).`;
      }
      imageBitmap.close();
      self.postMessage({
        id,
        ok: true,
        blob: foundUnderMax.blob,
        width: targetWidth,
        height: targetHeight,
        qualityUsed: foundUnderMax.quality,
        scaledDown: false,
        warning,
      } satisfies CompressionWorkerResponse);
      return;
    }

    // 3. Even quality 0.12 exceeded maxBytes
    const minQualityBlob = await encodeOffscreen(imageBitmap, targetWidth, targetHeight, 'image/jpeg', 0.12);
    let finalBlob = minQualityBlob;
    let finalW = targetWidth;
    let finalH = targetHeight;
    let finalQ = 0.12;
    let scaledDown = false;
    let warning: string | undefined;

    if (allowAutoScaleDown) {
      const scales = [0.9, 0.82, 0.74, 0.65, 0.56, 0.48, 0.4];
      for (const factor of scales) {
        const nextW = Math.max(40, Math.round(targetWidth * factor));
        const nextH = Math.max(40, Math.round(targetHeight * factor));
        const probe = await encodeOffscreen(imageBitmap, nextW, nextH, 'image/jpeg', 0.55);
        finalW = nextW;
        finalH = nextH;
        finalBlob = probe;
        finalQ = 0.55;
        scaledDown = true;
        if (probe.size <= maxBytes) {
          break;
        }
        const lowProbe = await encodeOffscreen(imageBitmap, nextW, nextH, 'image/jpeg', 0.18);
        finalBlob = lowProbe;
        finalQ = 0.18;
        if (lowProbe.size <= maxBytes) {
          break;
        }
      }
    }

    if (finalBlob.size > maxBytes) {
      warning = `Target size of ${maxKb} KB could not be achieved at ${finalW}×${finalH} px without extreme distortion (minimum reached: ${(finalBlob.size / 1024).toFixed(1)} KB). Try reducing dimensions or raising the KB limit.`;
    } else if (scaledDown) {
      warning = `Dimensions were gradually adjusted to ${finalW}×${finalH} px so the JPEG fits within ${maxKb} KB.`;
    }

    imageBitmap.close();
    self.postMessage({
      id,
      ok: true,
      blob: finalBlob,
      width: finalW,
      height: finalH,
      qualityUsed: finalQ,
      scaledDown,
      warning,
    } satisfies CompressionWorkerResponse);
  } catch (err) {
    try {
      imageBitmap.close();
    } catch {
      // ignore
    }
    self.postMessage({
      id,
      ok: false,
      width: targetWidth,
      height: targetHeight,
      qualityUsed: manualQuality,
      scaledDown: false,
      error: err instanceof Error ? err.message : 'Compression worker failed.',
    } satisfies CompressionWorkerResponse);
  }
};
