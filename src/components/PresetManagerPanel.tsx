import { useState } from 'react';
import { Check, ExternalLink, RotateCcw, SlidersHorizontal } from 'lucide-react';
import {
  resetPresetOverride,
  savePresetOverride,
  type ExamPreset,
  type OutputImageFormat,
} from '@/src/config/examPresets';

interface PresetManagerPanelProps {
  preset: ExamPreset;
  onPresetUpdated: (updated: ExamPreset) => void;
  defaultOpen?: boolean;
  lockFormatToJpg?: boolean;
}

export function PresetManagerPanel({
  preset,
  onPresetUpdated,
  defaultOpen = false,
  lockFormatToJpg = false,
}: PresetManagerPanelProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [width, setWidth] = useState<string>(preset.width !== null ? String(preset.width) : '');
  const [height, setHeight] = useState<string>(preset.height !== null ? String(preset.height) : '');
  const [minKb, setMinKb] = useState<string>(preset.minFileSizeKb !== null ? String(preset.minFileSizeKb) : '');
  const [maxKb, setMaxKb] = useState<string>(preset.maxFileSizeKb !== null ? String(preset.maxFileSizeKb) : '');
  const [outputFormat, setOutputFormat] = useState<OutputImageFormat>(preset.outputFormat);
  const [verifiedDate, setVerifiedDate] = useState<string>(
    preset.lastVerifiedDate || new Date().toISOString().slice(0, 10)
  );
  const [savedBanner, setSavedBanner] = useState<string | null>(null);

  const handleSave = () => {
    const parsedW = width.trim() ? Number(width) : null;
    const parsedH = height.trim() ? Number(height) : null;
    const parsedMin = minKb.trim() ? Number(minKb) : null;
    const parsedMax = maxKb.trim() ? Number(maxKb) : null;

    const updated = savePresetOverride(preset.id, {
      width: parsedW && parsedW > 0 ? Math.round(parsedW) : null,
      height: parsedH && parsedH > 0 ? Math.round(parsedH) : null,
      minFileSizeKb: parsedMin && parsedMin > 0 ? Math.round(parsedMin) : null,
      maxFileSizeKb: parsedMax && parsedMax > 0 ? Math.round(parsedMax) : null,
      outputFormat: lockFormatToJpg ? 'image/jpeg' : outputFormat,
      aspectRatio: parsedW && parsedH && parsedW > 0 && parsedH > 0 ? parsedW / parsedH : null,
      lastVerifiedDate: verifiedDate || new Date().toISOString().slice(0, 10),
    });

    onPresetUpdated(updated);
    setSavedBanner('Preset saved in your browser for future sessions.');
    setTimeout(() => setSavedBanner(null), 3500);
  };

  const handleReset = () => {
    const fresh = resetPresetOverride(preset.id);
    setWidth(fresh.width !== null ? String(fresh.width) : '');
    setHeight(fresh.height !== null ? String(fresh.height) : '');
    setMinKb(fresh.minFileSizeKb !== null ? String(fresh.minFileSizeKb) : '');
    setMaxKb(fresh.maxFileSizeKb !== null ? String(fresh.maxFileSizeKb) : '');
    setOutputFormat(fresh.outputFormat);
    onPresetUpdated(fresh);
    setSavedBanner('Preset reset to unconfigured default.');
    setTimeout(() => setSavedBanner(null), 3500);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <SlidersHorizontal className="h-4.5 w-4.5 text-[#1D4ED8]" aria-hidden="true" />
          <div>
            <h3 className="text-sm font-semibold text-[#0F294A]">Configurable Preset Manager</h3>
            <p className="text-xs text-slate-500">
              Status:{' '}
              <span className="font-medium text-slate-700">
                {preset.verificationStatus === 'custom'
                  ? `Custom preset saved (${preset.lastVerifiedDate || 'today'})`
                  : 'Unconfigured (enter values from active notification)'}
              </span>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-[#0F294A] hover:bg-slate-100 transition-colors"
        >
          {open ? 'Hide Manager' : 'Configure Notification Preset'}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-[#F8FAFC] p-4 space-y-4">
          <p className="text-xs leading-relaxed text-slate-600">
            Update dimensions and KB limits below whenever a new recruitment notification is released. Saved presets are
            stored locally in your browser and loaded automatically next time you open this tool.
          </p>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <div>
              <label htmlFor={`pm-w-${preset.id}`} className="block text-xs font-medium text-slate-700">
                Width (px)
              </label>
              <input
                id={`pm-w-${preset.id}`}
                type="number"
                min={16}
                max={6000}
                placeholder="Unset"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm font-mono tabular-nums"
              />
            </div>

            <div>
              <label htmlFor={`pm-h-${preset.id}`} className="block text-xs font-medium text-slate-700">
                Height (px)
              </label>
              <input
                id={`pm-h-${preset.id}`}
                type="number"
                min={16}
                max={6000}
                placeholder="Unset"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm font-mono tabular-nums"
              />
            </div>

            <div>
              <label htmlFor={`pm-min-${preset.id}`} className="block text-xs font-medium text-slate-700">
                Min KB
              </label>
              <input
                id={`pm-min-${preset.id}`}
                type="number"
                min={1}
                placeholder="Unset"
                value={minKb}
                onChange={(e) => setMinKb(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm font-mono tabular-nums"
              />
            </div>

            <div>
              <label htmlFor={`pm-max-${preset.id}`} className="block text-xs font-medium text-slate-700">
                Max KB
              </label>
              <input
                id={`pm-max-${preset.id}`}
                type="number"
                min={1}
                placeholder="Unset"
                value={maxKb}
                onChange={(e) => setMaxKb(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm font-mono tabular-nums"
              />
            </div>

            <div>
              <label htmlFor={`pm-fmt-${preset.id}`} className="block text-xs font-medium text-slate-700">
                Format
              </label>
              <select
                id={`pm-fmt-${preset.id}`}
                disabled={lockFormatToJpg}
                value={lockFormatToJpg ? 'image/jpeg' : outputFormat}
                onChange={(e) => setOutputFormat(e.target.value as OutputImageFormat)}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm"
              >
                <option value="image/jpeg">JPG</option>
                {!lockFormatToJpg && <option value="image/png">PNG</option>}
              </select>
            </div>

            <div>
              <label htmlFor={`pm-date-${preset.id}`} className="block text-xs font-medium text-slate-700">
                Verified Date
              </label>
              <input
                id={`pm-date-${preset.id}`}
                type="date"
                value={verifiedDate}
                onChange={(e) => setVerifiedDate(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-mono"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <a
              href={preset.officialSourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-[#1D4ED8] hover:underline"
            >
              <span>Official portal: {preset.officialSourceLabel}</span>
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Reset to Unset</span>
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#0F294A] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#173A66]"
              >
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Save &amp; Apply Preset</span>
              </button>
            </div>
          </div>

          {savedBanner && (
            <p className="text-xs font-medium text-emerald-700" role="status">
              {savedBanner}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
