import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { Move, RotateCcw, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';
import { renderTransformedCanvas, type CropTransformSettings, type LoadedImageAsset } from '@/src/utils/imageEngine';

interface ImageCropperProps {
  asset: LoadedImageAsset;
  targetWidth: number;
  targetHeight: number;
  outputFormat: 'image/jpeg' | 'image/png';
  transform: CropTransformSettings;
  onChange: (next: CropTransformSettings) => void;
  aspectPresets?: Array<{ label: string; ratio: number | null }>;
  onSelectAspectPreset?: (ratio: number | null) => void;
}

const DEFAULT_ASPECT_PRESETS: Array<{ label: string; ratio: number | null }> = [
  { label: 'Match Output', ratio: null },
  { label: '3.5 : 4.5', ratio: 3.5 / 4.5 },
  { label: '1 : 1', ratio: 1 },
  { label: '3 : 1', ratio: 3 },
];

export function ImageCropper({
  asset,
  targetWidth,
  targetHeight,
  outputFormat,
  transform,
  onChange,
  aspectPresets = DEFAULT_ASPECT_PRESETS,
  onSelectAspectPreset,
}: ImageCropperProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dragStateRef = useRef<{
    dragging: boolean;
    startX: number;
    startY: number;
    origOffsetX: number;
    origOffsetY: number;
  }>({
    dragging: false,
    startX: 0,
    startY: 0,
    origOffsetX: 0,
    origOffsetY: 0,
  });

  const [isDragging, setIsDragging] = useState(false);

  const previewRatio =
    transform.cropAspectRatio && transform.cropAspectRatio > 0
      ? transform.cropAspectRatio
      : targetWidth > 0 && targetHeight > 0
        ? targetWidth / targetHeight
        : asset.originalWidth / asset.originalHeight;

  const previewW = 360;
  const previewH = Math.max(110, Math.min(420, Math.round(previewW / previewRatio)));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rendered = renderTransformedCanvas(
      asset.element,
      previewW,
      previewH,
      transform,
      outputFormat
    );

    canvas.width = previewW;
    canvas.height = previewH;
    ctx.clearRect(0, 0, previewW, previewH);
    ctx.drawImage(rendered, 0, 0);
  }, [asset, outputFormat, previewH, previewW, transform]);

  const handlePointerDown = (e: PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStateRef.current = {
      dragging: true,
      startX: e.clientX,
      startY: e.clientY,
      origOffsetX: transform.offsetX,
      origOffsetY: transform.offsetY,
    };
    setIsDragging(true);
  };

  const handlePointerMove = (e: PointerEvent<HTMLCanvasElement>) => {
    if (!dragStateRef.current.dragging) return;
    const dx = e.clientX - dragStateRef.current.startX;
    const dy = e.clientY - dragStateRef.current.startY;
    const nextX = Math.max(-1.5, Math.min(1.5, dragStateRef.current.origOffsetX + dx / (previewW * 0.5)));
    const nextY = Math.max(-1.5, Math.min(1.5, dragStateRef.current.origOffsetY + dy / (previewH * 0.5)));
    onChange({
      ...transform,
      offsetX: Number(nextX.toFixed(3)),
      offsetY: Number(nextY.toFixed(3)),
    });
  };

  const handlePointerUp = (e: PointerEvent<HTMLCanvasElement>) => {
    if (dragStateRef.current.dragging) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
      dragStateRef.current.dragging = false;
      setIsDragging(false);
    }
  };

  const rotateBy = (delta: number) => {
    let next = transform.rotationDeg + delta;
    if (next > 180) next -= 360;
    if (next < -180) next += 360;
    onChange({ ...transform, rotationDeg: next });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600">
          <Move className="h-3.5 w-3.5 text-[#1D4ED8]" aria-hidden="true" />
          Drag inside frame to reposition · Output aspect{' '}
          <span className="font-mono tabular-nums text-[#0F294A]">
            {targetWidth}×{targetHeight} px
          </span>
        </span>

        {aspectPresets.length > 0 && (
          <div className="flex flex-wrap items-center gap-1 rounded-lg bg-slate-100 p-1">
            {aspectPresets.map((ap) => {
              const active =
                (ap.ratio === null && transform.cropAspectRatio === null) ||
                (ap.ratio !== null &&
                  transform.cropAspectRatio !== null &&
                  Math.abs(ap.ratio - transform.cropAspectRatio) < 0.01);
              return (
                <button
                  key={ap.label}
                  type="button"
                  onClick={() => {
                    onChange({ ...transform, cropAspectRatio: ap.ratio });
                    if (onSelectAspectPreset) onSelectAspectPreset(ap.ratio);
                  }}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    active ? 'bg-white text-[#0F294A] shadow-xs' : 'text-slate-600 hover:text-[#0F294A]'
                  }`}
                >
                  {ap.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="relative flex items-center justify-center rounded-xl border border-slate-200 bg-slate-100 p-4 overflow-hidden">
        <div className="relative inline-block shadow-sm">
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            aria-label="Interactive crop and position canvas. Drag to move image."
            className={`block max-w-full rounded border border-slate-300 bg-white touch-none ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            style={{ width: previewW, height: 'auto', aspectRatio: `${previewW} / ${previewH}` }}
          />
          {/* Subtle rule-of-thirds crop guide overlay */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3 border border-[#1D4ED8]/40 rounded"
          >
            {Array.from({ length: 9 }).map((_, idx) => (
              <div key={idx} className="border border-white/30" />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-3">
          <div className="flex items-center justify-between text-xs font-medium text-slate-700">
            <label htmlFor={`zoom-${asset.name}`}>Zoom</label>
            <span className="font-mono tabular-nums text-[#0F294A]">{transform.zoom.toFixed(2)}×</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => onChange({ ...transform, zoom: Math.max(0.6, Number((transform.zoom - 0.1).toFixed(2))) })}
              aria-label="Zoom out"
              className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              <ZoomOut className="h-4 w-4" aria-hidden="true" />
            </button>
            <input
              id={`zoom-${asset.name}`}
              type="range"
              min={0.6}
              max={3.5}
              step={0.05}
              value={transform.zoom}
              onChange={(e) => onChange({ ...transform, zoom: Number(e.target.value) })}
              className="w-full accent-[#1D4ED8]"
            />
            <button
              type="button"
              onClick={() => onChange({ ...transform, zoom: Math.min(3.5, Number((transform.zoom + 0.1).toFixed(2))) })}
              aria-label="Zoom in"
              className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              <ZoomIn className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-3">
          <div className="flex items-center justify-between text-xs font-medium text-slate-700">
            <label htmlFor={`rotate-${asset.name}`}>Rotate</label>
            <span className="font-mono tabular-nums text-[#0F294A]">{transform.rotationDeg}°</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => rotateBy(-90)}
              aria-label="Rotate 90 degrees left"
              title="Rotate -90°"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
            </button>
            <input
              id={`rotate-${asset.name}`}
              type="range"
              min={-180}
              max={180}
              step={1}
              value={transform.rotationDeg}
              onChange={(e) => onChange({ ...transform, rotationDeg: Number(e.target.value) })}
              className="w-full accent-[#1D4ED8]"
            />
            <button
              type="button"
              onClick={() => rotateBy(90)}
              aria-label="Rotate 90 degrees right"
              title="Rotate +90°"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              <RotateCw className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
        <button
          type="button"
          onClick={() =>
            onChange({
              ...transform,
              zoom: 1,
              offsetX: 0,
              offsetY: 0,
              rotationDeg: 0,
            })
          }
          className="font-medium text-[#1D4ED8] hover:underline"
        >
          Center &amp; Reset Crop Position
        </button>
        <span className="font-mono tabular-nums">
          Original: {asset.originalWidth}×{asset.originalHeight} px
        </span>
      </div>
    </div>
  );
}
