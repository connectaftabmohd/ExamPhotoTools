import { AlertTriangle, CheckCircle2, ImageIcon } from 'lucide-react';
import { formatKb, type LoadedImageAsset, type ProcessedImageResult } from '@/src/utils/imageEngine';

interface ImagePreviewProps {
  asset: LoadedImageAsset | null;
  processed: ProcessedImageResult | null;
  minKb?: number | null;
  maxKb?: number | null;
  showComparison?: boolean;
  emptyLabel?: string;
}

export function ImagePreview({
  asset,
  processed,
  minKb = null,
  maxKb = null,
  showComparison = false,
  emptyLabel = 'Processed image preview will appear here after you apply settings.',
}: ImagePreviewProps) {
  if (!asset) {
    return (
      <div className="flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-6 text-center">
        <ImageIcon className="h-8 w-8 text-slate-400" aria-hidden="true" />
        <p className="mt-2 text-sm text-slate-500">{emptyLabel}</p>
      </div>
    );
  }

  if (!processed) {
    return (
      <div className="flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-[#F4F8FD] p-6 text-center">
        <p className="text-sm font-medium text-[#0F294A]">Source image ready</p>
        <p className="mt-1 text-xs text-slate-600 font-mono tabular-nums">
          {asset.originalWidth}×{asset.originalHeight} px · {formatKb(asset.originalSizeBytes)}
        </p>
        <p className="mt-3 text-xs text-slate-500">Click &ldquo;Process &amp; Compress Image&rdquo; to generate the output file.</p>
      </div>
    );
  }

  const exceedsMax = maxKb !== null && processed.sizeKb > maxKb;
  const belowMin = minKb !== null && processed.sizeKb < minKb;
  const withinBounds = !exceedsMax && !belowMin;

  return (
    <div className="space-y-4">
      <div
        className={`flex items-start gap-2.5 rounded-lg border px-3.5 py-2.5 text-xs sm:text-sm ${
          withinBounds
            ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
            : 'border-amber-200 bg-amber-50 text-amber-900'
        }`}
      >
        {withinBounds ? (
          <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-emerald-600 mt-0.5" aria-hidden="true" />
        ) : (
          <AlertTriangle className="h-4.5 w-4.5 shrink-0 text-amber-600 mt-0.5" aria-hidden="true" />
        )}
        <div>
          <p className="font-semibold">
            {withinBounds
              ? 'Output generated successfully'
              : exceedsMax
                ? 'Output exceeds configured Max KB limit'
                : 'Output is below configured Min KB limit'}
          </p>
          {processed.warning && <p className="mt-0.5 text-xs leading-relaxed">{processed.warning}</p>}
        </div>
      </div>

      {showComparison ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Original Image</span>
              <span className="font-mono tabular-nums">
                {asset.originalWidth}×{asset.originalHeight} · {formatKb(asset.originalSizeBytes)}
              </span>
            </div>
            <div className="flex h-48 items-center justify-center rounded-lg bg-slate-100 p-2 overflow-hidden">
              <img
                src={asset.objectUrl}
                alt="Original uploaded photograph before resizing"
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-[#1D4ED8]">Final Processed</span>
              <span className="font-mono tabular-nums text-[#0F294A]">
                {processed.width}×{processed.height} · {processed.sizeKb.toFixed(2)} KB
              </span>
            </div>
            <div className="flex h-48 items-center justify-center rounded-lg bg-slate-100 p-2 overflow-hidden">
              <img
                src={processed.objectUrl}
                alt={`Processed output image ${processed.width} by ${processed.height} pixels`}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-slate-100 p-4 flex items-center justify-center">
          <img
            src={processed.objectUrl}
            alt={`Processed image preview ${processed.width} by ${processed.height} pixels`}
            className="max-h-64 max-w-full rounded border border-slate-300 bg-white object-contain shadow-xs"
          />
        </div>
      )}

      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4 rounded-xl border border-slate-200 bg-white p-3.5 text-xs">
        <div>
          <dt className="text-slate-500">Output Dimensions</dt>
          <dd className="mt-0.5 font-mono font-semibold tabular-nums text-[#0F294A]">
            {processed.width} × {processed.height} px
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">Actual File Size</dt>
          <dd className="mt-0.5 font-mono font-semibold tabular-nums text-[#0F294A]">
            {processed.sizeKb.toFixed(2)} KB
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">Format</dt>
          <dd className="mt-0.5 font-mono font-semibold text-[#0F294A]">
            {processed.format === 'image/jpeg' ? 'JPEG (.jpg)' : 'PNG (.png)'}
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">Size vs Original</dt>
          <dd className="mt-0.5 font-mono font-semibold tabular-nums text-[#0F294A]">
            {asset.originalSizeBytes > 0
              ? `${Math.round((processed.sizeBytes / asset.originalSizeBytes) * 100)}%`
              : '—'}
          </dd>
        </div>
      </dl>
    </div>
  );
}
