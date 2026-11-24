import type { OutputImageFormat } from '@/src/config/examPresets';

interface FileSizeControlsProps {
  idPrefix: string;
  minKbInput: string;
  maxKbInput: string;
  onMinKbChange: (val: string) => void;
  onMaxKbChange: (val: string) => void;
  outputFormat: OutputImageFormat;
  onOutputFormatChange: (fmt: OutputImageFormat) => void;
  manualQuality: number;
  onManualQualityChange: (q: number) => void;
  allowAutoScaleDown: boolean;
  onToggleAutoScaleDown: (val: boolean) => void;
  lockFormatToJpg?: boolean;
}

export function FileSizeControls({
  idPrefix,
  minKbInput,
  maxKbInput,
  onMinKbChange,
  onMaxKbChange,
  outputFormat,
  onOutputFormatChange,
  manualQuality,
  onManualQualityChange,
  allowAutoScaleDown,
  onToggleAutoScaleDown,
  lockFormatToJpg = false,
}: FileSizeControlsProps) {
  const hasMaxKb = maxKbInput.trim().length > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-[#0F294A]">File Size &amp; Format</h3>
        <span className="text-xs text-slate-500">Target KB compression</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor={`${idPrefix}-minkb`} className="block text-xs font-medium text-slate-700">
            Min File Size (KB)
          </label>
          <input
            id={`${idPrefix}-minkb`}
            type="number"
            min={1}
            max={10000}
            inputMode="numeric"
            placeholder="Optional"
            value={minKbInput}
            onChange={(e) => onMinKbChange(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-mono tabular-nums text-[#0F294A] focus:border-[#1D4ED8] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20"
          />
        </div>

        <div>
          <label htmlFor={`${idPrefix}-maxkb`} className="block text-xs font-medium text-slate-700">
            Max File Size (KB)
          </label>
          <input
            id={`${idPrefix}-maxkb`}
            type="number"
            min={1}
            max={10000}
            inputMode="numeric"
            placeholder="Optional"
            value={maxKbInput}
            onChange={(e) => onMaxKbChange(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-mono tabular-nums text-[#0F294A] focus:border-[#1D4ED8] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20"
          />
        </div>
      </div>

      <div>
        <span className="block text-xs font-medium text-slate-700">Output Format</span>
        <div className="mt-1.5 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onOutputFormatChange('image/jpeg')}
            className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors min-h-[40px] ${
              outputFormat === 'image/jpeg'
                ? 'border-[#1D4ED8] bg-[#EFF6FF] text-[#1D4ED8]'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            JPG / JPEG
          </button>
          <button
            type="button"
            disabled={lockFormatToJpg}
            onClick={() => onOutputFormatChange('image/png')}
            className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors min-h-[40px] ${
              lockFormatToJpg
                ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400'
                : outputFormat === 'image/png'
                  ? 'border-[#1D4ED8] bg-[#EFF6FF] text-[#1D4ED8]'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            PNG {lockFormatToJpg ? '(Disabled)' : ''}
          </button>
        </div>
      </div>

      {outputFormat === 'image/jpeg' && !hasMaxKb && (
        <div>
          <div className="flex items-center justify-between text-xs font-medium text-slate-700">
            <label htmlFor={`${idPrefix}-quality`}>JPEG Quality</label>
            <span className="font-mono tabular-nums text-[#0F294A]">{Math.round(manualQuality * 100)}%</span>
          </div>
          <input
            id={`${idPrefix}-quality`}
            type="range"
            min={0.15}
            max={1}
            step={0.01}
            value={manualQuality}
            onChange={(e) => onManualQualityChange(Number(e.target.value))}
            className="mt-1.5 w-full accent-[#1D4ED8]"
          />
        </div>
      )}

      {hasMaxKb && (
        <label className="flex items-start gap-2.5 rounded-lg border border-slate-200 bg-slate-50/70 p-3 text-xs text-slate-700 cursor-pointer">
          <input
            type="checkbox"
            checked={allowAutoScaleDown}
            onChange={(e) => onToggleAutoScaleDown(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-[#1D4ED8]"
          />
          <span>
            <strong className="font-semibold text-[#0F294A]">Auto-adjust dimensions if needed</strong>
            <span className="block text-slate-500 mt-0.5">
              If lowest reasonable JPEG quality still exceeds your Max KB limit, gradually scale dimensions down so the
              target size can be reached.
            </span>
          </span>
        </label>
      )}
    </div>
  );
}
