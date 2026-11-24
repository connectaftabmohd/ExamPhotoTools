import { Link2, Link2Off } from 'lucide-react';
import type { ExamPreset } from '@/src/config/examPresets';

interface DimensionControlsProps {
  idPrefix: string;
  preset: ExamPreset;
  widthInput: string;
  heightInput: string;
  onWidthChange: (val: string) => void;
  onHeightChange: (val: string) => void;
  preserveAspectRatio: boolean;
  onTogglePreserveAspect: (val: boolean) => void;
}

export function DimensionControls({
  idPrefix,
  preset,
  widthInput,
  heightInput,
  onWidthChange,
  onHeightChange,
  preserveAspectRatio,
  onTogglePreserveAspect,
}: DimensionControlsProps) {
  const isUnconfigured = preset.width === null || preset.height === null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-[#0F294A]">Pixel Dimensions</h3>
        <button
          type="button"
          onClick={() => onTogglePreserveAspect(!preserveAspectRatio)}
          aria-pressed={preserveAspectRatio}
          className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
            preserveAspectRatio
              ? 'border-[#1D4ED8] bg-[#EFF6FF] text-[#1D4ED8]'
              : 'border-slate-200 bg-white text-slate-600 hover:text-[#0F294A]'
          }`}
        >
          {preserveAspectRatio ? (
            <Link2 className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <Link2Off className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          <span>{preserveAspectRatio ? 'Aspect Locked' : 'Free Dimensions'}</span>
        </button>
      </div>

      {isUnconfigured && (
        <p className="text-xs text-slate-600">
          Official dimensions are not pre-filled for this preset. Enter the exact width and height in pixels from your
          notification, or leave blank to keep original dimensions.
        </p>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor={`${idPrefix}-width`} className="block text-xs font-medium text-slate-700">
            Width (px)
          </label>
          <input
            id={`${idPrefix}-width`}
            type="number"
            min={16}
            max={6000}
            inputMode="numeric"
            placeholder="e.g. 200"
            value={widthInput}
            onChange={(e) => onWidthChange(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-mono tabular-nums text-[#0F294A] focus:border-[#1D4ED8] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20"
          />
        </div>

        <div>
          <label htmlFor={`${idPrefix}-height`} className="block text-xs font-medium text-slate-700">
            Height (px)
          </label>
          <input
            id={`${idPrefix}-height`}
            type="number"
            min={16}
            max={6000}
            inputMode="numeric"
            placeholder="e.g. 230"
            value={heightInput}
            onChange={(e) => onHeightChange(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-mono tabular-nums text-[#0F294A] focus:border-[#1D4ED8] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20"
          />
        </div>
      </div>
    </div>
  );
}
