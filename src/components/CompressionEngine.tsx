import { AlertCircle, AlertTriangle, CheckCircle2, Loader2, RefreshCw, Sparkles, Upload } from 'lucide-react';
import { useImageProcessor, type ImageProcessorConfig } from '@/src/hooks/useImageProcessor';
import { ImageUploader } from '@/src/components/ImageUploader';
import { ImageCropper } from '@/src/components/ImageCropper';
import { DimensionControls } from '@/src/components/DimensionControls';
import { FileSizeControls } from '@/src/components/FileSizeControls';
import { ImagePreview } from '@/src/components/ImagePreview';
import { DownloadButton } from '@/src/components/DownloadButton';
import { PresetManagerPanel } from '@/src/components/PresetManagerPanel';

interface CompressionEngineProps {
  config: ImageProcessorConfig;
  title?: string;
  uploadLabel?: string;
  filePrefix: string;
  warningNotice: string;
  showComparison?: boolean;
  showPresetManager?: boolean;
  presetManagerDefaultOpen?: boolean;
  lockFormatToJpg?: boolean;
  showBackgroundControls?: boolean;
  showSignatureControls?: boolean;
  aspectPresets?: Array<{ label: string; ratio: number | null }>;
  onProcessedChange?: (result: ReturnType<typeof useImageProcessor>['processed']) => void;
}

export function CompressionEngine({
  config,
  title,
  uploadLabel,
  filePrefix,
  warningNotice,
  showComparison = false,
  showPresetManager = true,
  presetManagerDefaultOpen = false,
  lockFormatToJpg = false,
  showBackgroundControls = false,
  showSignatureControls = false,
  aspectPresets,
  onProcessedChange,
}: CompressionEngineProps) {
  const proc = useImageProcessor(config);

  const effectiveTargetW = proc.widthInput.trim()
    ? Math.max(16, Number(proc.widthInput) || 300)
    : proc.asset?.originalWidth || 300;
  const effectiveTargetH = proc.heightInput.trim()
    ? Math.max(16, Number(proc.heightInput) || 360)
    : proc.asset?.originalHeight || 360;

  const minKbVal = proc.minKbInput.trim() ? Number(proc.minKbInput) : null;
  const maxKbVal = proc.maxKbInput.trim() ? Number(proc.maxKbInput) : null;

  const handleProcessClick = async () => {
    const res = await proc.processNow();
    if (onProcessedChange) onProcessedChange(res);
  };

  const handleResetClick = () => {
    proc.resetAll();
    if (onProcessedChange) onProcessedChange(null);
  };

  return (
    <div className="space-y-6">
      {title && (
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <h2 className="text-xl font-bold text-[#0F294A]">{title}</h2>
          <span className="text-xs font-medium text-slate-500">
            Accepted: JPG, JPEG, PNG · Output: {proc.outputFormat === 'image/jpeg' ? 'JPG' : 'PNG'}
          </span>
        </div>
      )}

      {/* Official notification reminder */}
      <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-xs sm:text-sm text-amber-900">
        <AlertTriangle className="h-4.5 w-4.5 shrink-0 text-amber-600 mt-0.5" aria-hidden="true" />
        <p>{warningNotice}</p>
      </div>

      {showPresetManager && (
        <PresetManagerPanel
          preset={proc.preset}
          onPresetUpdated={proc.applyPresetValues}
          defaultOpen={presetManagerDefaultOpen}
          lockFormatToJpg={lockFormatToJpg}
        />
      )}

      {proc.errorMsg && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900"
        >
          <AlertCircle className="h-4.5 w-4.5 shrink-0 text-red-600 mt-0.5" aria-hidden="true" />
          <p>{proc.errorMsg}</p>
        </div>
      )}

      {!proc.asset ? (
        <ImageUploader label={uploadLabel || `Upload ${proc.preset.shortName}`} onFileSelected={proc.handleFileSelected} />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
          {/* Left column: Crop & Editor */}
          <div className="lg:col-span-7 space-y-5 rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-[#0F294A]">1. Crop, Rotate &amp; Frame</h3>
                <p className="text-xs text-slate-500 truncate max-w-xs sm:max-w-md">{proc.asset.name}</p>
              </div>
              <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-[#0F294A] hover:bg-slate-100">
                <Upload className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Replace Image</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,.jpg,.jpeg,.png"
                  className="sr-only"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) proc.handleFileSelected(file);
                    e.target.value = '';
                  }}
                />
              </label>
            </div>

            <ImageCropper
              asset={proc.asset}
              targetWidth={effectiveTargetW}
              targetHeight={effectiveTargetH}
              outputFormat={proc.outputFormat}
              transform={proc.transform}
              onChange={proc.setTransform}
              aspectPresets={aspectPresets}
              onSelectAspectPreset={(ratio) => {
                if (ratio && proc.widthInput.trim()) {
                  const w = Number(proc.widthInput);
                  if (Number.isFinite(w) && w > 0) {
                    proc.handleHeightChange(String(Math.max(16, Math.round(w / ratio))));
                  }
                }
              }}
            />

            {showBackgroundControls && (
              <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-4 space-y-3">
                <h4 className="text-sm font-semibold text-[#0F294A]">Background Color Options</h4>
                <p className="text-xs leading-relaxed text-slate-600">
                  Choose a solid fill for transparent PNG edges or enable simple uniform light-backdrop replacement.
                  Note: simple brightness-based background replacement is not AI portrait segmentation and does not alter
                  facial features.
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { label: 'White (#FFFFFF)', hex: '#FFFFFF' },
                    { label: 'Light Blue (#DBEAFE)', hex: '#DBEAFE' },
                    { label: 'Sky Blue (#E0F2FE)', hex: '#E0F2FE' },
                  ].map((swatch) => (
                    <button
                      key={swatch.hex}
                      type="button"
                      onClick={() => proc.setTransform({ ...proc.transform, backgroundColor: swatch.hex })}
                      className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium ${
                        proc.transform.backgroundColor.toUpperCase() === swatch.hex
                          ? 'border-[#1D4ED8] bg-[#EFF6FF] text-[#1D4ED8]'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span
                        className="h-3.5 w-3.5 rounded-sm border border-slate-300"
                        style={{ backgroundColor: swatch.hex }}
                        aria-hidden="true"
                      />
                      <span>{swatch.label}</span>
                    </button>
                  ))}

                  <label className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 cursor-pointer">
                    <span>Custom:</span>
                    <input
                      type="color"
                      value={proc.transform.backgroundColor}
                      onChange={(e) => proc.setTransform({ ...proc.transform, backgroundColor: e.target.value })}
                      className="h-5 w-7 cursor-pointer border-0 bg-transparent p-0"
                    />
                  </label>
                </div>

                <label className="flex items-start gap-2.5 pt-1 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={proc.transform.applySimpleBgReplace}
                    onChange={(e) => proc.setTransform({ ...proc.transform, applySimpleBgReplace: e.target.checked })}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-[#1D4ED8]"
                  />
                  <span>
                    <strong className="font-semibold text-[#0F294A]">
                      Replace uniform light studio background with selected color
                    </strong>
                    <span className="block text-slate-500">
                      Best for photos already taken against a plain off-white or pale wall.
                    </span>
                  </span>
                </label>

                {proc.transform.applySimpleBgReplace && (
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <label htmlFor={`bg-thresh-${config.presetId}`}>Backdrop Brightness Sensitivity</label>
                      <span className="font-mono tabular-nums">{proc.transform.bgThreshold}</span>
                    </div>
                    <input
                      id={`bg-thresh-${config.presetId}`}
                      type="range"
                      min={175}
                      max={248}
                      value={proc.transform.bgThreshold}
                      onChange={(e) =>
                        proc.setTransform({ ...proc.transform, bgThreshold: Number(e.target.value) })
                      }
                      className="mt-1 w-full accent-[#1D4ED8]"
                    />
                  </div>
                )}
              </div>
            )}

            {showSignatureControls && (
              <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-4 space-y-3">
                <h4 className="text-sm font-semibold text-[#0F294A]">Signature Appearance &amp; Background</h4>
                <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!proc.transform.signatureCleanPaperMode}
                    onChange={(e) =>
                      proc.setTransform({
                        ...proc.transform,
                        signatureCleanPaperMode: !e.target.checked,
                        backgroundColor: '#FFFFFF',
                      })
                    }
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-[#1D4ED8]"
                  />
                  <span>
                    <strong className="font-semibold text-[#0F294A]">Preserve Original Signature Appearance</strong>
                    <span className="block text-slate-500">
                      Keeps original ink color, pen texture, and natural paper shading untouched (fills transparent PNGs
                      with white when exporting JPG).
                    </span>
                  </span>
                </label>

                {proc.transform.signatureCleanPaperMode && (
                  <div className="pt-1 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <label htmlFor={`sig-thresh-${config.presetId}`}>White Paper Clean-up Threshold</label>
                      <span className="font-mono tabular-nums">{proc.transform.signaturePaperThreshold}</span>
                    </div>
                    <input
                      id={`sig-thresh-${config.presetId}`}
                      type="range"
                      min={150}
                      max={240}
                      value={proc.transform.signaturePaperThreshold}
                      onChange={(e) =>
                        proc.setTransform({ ...proc.transform, signaturePaperThreshold: Number(e.target.value) })
                      }
                      className="w-full accent-[#1D4ED8]"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right column: Dimensions, File size, Actions & Preview */}
          <div className="lg:col-span-5 space-y-5">
            <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 space-y-5">
              <h3 className="text-base font-bold text-[#0F294A]">2. Dimensions &amp; Compression</h3>

              <DimensionControls
                idPrefix={config.presetId}
                preset={proc.preset}
                widthInput={proc.widthInput}
                heightInput={proc.heightInput}
                onWidthChange={proc.handleWidthChange}
                onHeightChange={proc.handleHeightChange}
                preserveAspectRatio={proc.preserveAspectRatio}
                onTogglePreserveAspect={proc.setPreserveAspectRatio}
              />

              <div className="border-t border-slate-100 pt-4">
                <FileSizeControls
                  idPrefix={config.presetId}
                  minKbInput={proc.minKbInput}
                  maxKbInput={proc.maxKbInput}
                  onMinKbChange={proc.setMinKbInput}
                  onMaxKbChange={proc.setMaxKbInput}
                  outputFormat={proc.outputFormat}
                  onOutputFormatChange={proc.setOutputFormat}
                  manualQuality={proc.manualQuality}
                  onManualQualityChange={proc.setManualQuality}
                  allowAutoScaleDown={proc.allowAutoScaleDown}
                  onToggleAutoScaleDown={proc.setAllowAutoScaleDown}
                  lockFormatToJpg={lockFormatToJpg}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  disabled={proc.isProcessing}
                  onClick={handleProcessClick}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#1D4ED8] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1E40AF] disabled:opacity-60 transition-colors min-h-[44px]"
                >
                  {proc.isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" aria-hidden="true" />
                      <span>Process &amp; Compress Image</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleResetClick}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors min-h-[44px]"
                >
                  <RefreshCw className="h-4 w-4" aria-hidden="true" />
                  <span>Reset</span>
                </button>
              </div>

              {proc.successMsg && (
                <p role="status" className="flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                  <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{proc.successMsg}</span>
                </p>
              )}
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base font-bold text-[#0F294A]">3. Output &amp; Download</h3>
              </div>

              <ImagePreview
                asset={proc.asset}
                processed={proc.processed}
                minKb={minKbVal}
                maxKb={maxKbVal}
                showComparison={showComparison}
              />

              <div className="pt-1 flex flex-wrap items-center gap-3">
                <DownloadButton processed={proc.processed} filePrefix={filePrefix} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
