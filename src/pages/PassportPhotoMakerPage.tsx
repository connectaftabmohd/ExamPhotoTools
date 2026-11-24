import { useEffect, useRef, useState } from 'react';
import { Download, Grid, Info, Loader2, Printer } from 'lucide-react';
import { CompressionEngine } from '@/src/components/CompressionEngine';
import { ToolPageShell } from '@/src/components/ToolPageShell';
import { generateA4PassportSheet, type ProcessedImageResult } from '@/src/utils/imageEngine';

const PASSPORT_STEPS = [
  {
    title: 'Upload & Select Aspect Ratio',
    detail: 'Upload a front-facing portrait and pick a passport aspect ratio (such as 3.5:4.5 or 1:1) or custom size.',
  },
  {
    title: 'Set Background Color',
    detail: 'Choose white, light blue, or a custom solid fill color for transparent edges or plain studio backdrops.',
  },
  {
    title: 'Export Single JPEG',
    detail: 'Enter your target pixel dimensions and KB limit, then process and download the single passport photograph.',
  },
  {
    title: 'Generate A4 Printable Sheet',
    detail: 'Use the A4 Sheet Generator below to arrange 4 to 16 copies with cut guides for home or shop printing.',
  },
];

const PASSPORT_FAQS = [
  {
    question: 'Is simple background-color replacement the same as AI background removal?',
    answer:
      'No. Simple background-color replacement uses edge-connected brightness thresholding to fill uniform light studio backdrops with white, light blue, or another solid color. It is not AI semantic segmentation and works best when the original photo already has a plain light wall behind you.',
  },
  {
    question: 'Does Passport Photo Maker alter or retouch facial features?',
    answer:
      'No. Your facial features, proportions, skin tone, and expression are never artificially modified.',
  },
  {
    question: 'What size is the printable A4 passport photo sheet?',
    answer:
      'At 300 DPI, the generated A4 sheet measures 2480 × 3508 pixels (standard 210 × 297 mm A4 paper), ready for borderless or standard photo-paper printing.',
  },
];

export function PassportPhotoMakerPage() {
  const [singlePhoto, setSinglePhoto] = useState<ProcessedImageResult | null>(null);
  const [copies, setCopies] = useState<number>(8);
  const [dpi, setDpi] = useState<150 | 300>(300);
  const [cutGuides, setCutGuides] = useState<boolean>(true);
  const [sheetResult, setSheetResult] = useState<ProcessedImageResult | null>(null);
  const [sheetLoading, setSheetLoading] = useState<boolean>(false);
  const [sheetError, setSheetError] = useState<string | null>(null);
  const sheetUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (sheetUrlRef.current) {
        URL.revokeObjectURL(sheetUrlRef.current);
      }
    };
  }, []);

  const handleGenerateSheet = async () => {
    if (!singlePhoto) return;
    setSheetLoading(true);
    setSheetError(null);
    try {
      const res = await generateA4PassportSheet(singlePhoto.blob, singlePhoto.width, singlePhoto.height, {
        copies,
        dpi,
        cutGuides,
        outputFormat: 'image/jpeg',
      });
      if (sheetUrlRef.current) URL.revokeObjectURL(sheetUrlRef.current);
      sheetUrlRef.current = res.objectUrl;
      setSheetResult(res);
    } catch (err) {
      setSheetError(err instanceof Error ? err.message : 'Unable to generate A4 passport sheet.');
    } finally {
      setSheetLoading(false);
    }
  };

  const handleDownloadSheet = () => {
    if (!sheetResult) return;
    const link = document.createElement('a');
    link.href = sheetResult.objectUrl;
    link.download = `a4-passport-sheet-${copies}-copies-${dpi}dpi.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <ToolPageShell
      routePath="/passport-photo-maker"
      toolId="passport-photo-maker"
      breadcrumbLabel="Passport Photo Maker"
      h1="Passport Photo Maker"
      intro="Create passport-size photographs with custom dimensions, solid background options, and printable multi-copy A4 sheets locally in your browser."
      stepsTitle="How to Make Passport Photos & A4 Print Sheets"
      steps={PASSPORT_STEPS}
      faqs={PASSPORT_FAQS}
    >
      <div className="space-y-8">
        <div className="flex items-start gap-2.5 rounded-xl border border-blue-200 bg-[#EFF6FF] px-4 py-3 text-xs sm:text-sm text-[#0F294A]">
          <Info className="h-4.5 w-4.5 shrink-0 text-[#1D4ED8] mt-0.5" aria-hidden="true" />
          <p>
            Privacy &amp; Authenticity Note: Simple solid background replacement is not AI background removal, and this
            tool never artificially alters a person&apos;s facial features.
          </p>
        </div>

        <CompressionEngine
          config={{
            presetId: 'passport',
            defaultTargetWidth: 413,
            defaultTargetHeight: 531,
            defaultBackgroundColor: '#FFFFFF',
          }}
          filePrefix="passport-photo"
          uploadLabel="Upload Portrait Photograph (JPG or PNG)"
          warningNotice="Verify exact passport or exam photograph dimensions (e.g. 3.5×4.5 cm or 2×2 inch) and background color rules in your target application."
          showBackgroundControls
          lockFormatToJpg
          aspectPresets={[
            { label: '3.5 : 4.5 (India Standard)', ratio: 3.5 / 4.5 },
            { label: '1 : 1 (Square 2×2 in)', ratio: 1 },
            { label: '3 : 4', ratio: 3 / 4 },
            { label: 'Match Output', ratio: null },
          ]}
          onProcessedChange={(res) => {
            setSinglePhoto(res);
            if (!res) {
              if (sheetUrlRef.current) URL.revokeObjectURL(sheetUrlRef.current);
              sheetUrlRef.current = null;
              setSheetResult(null);
            }
          }}
        />

        {/* Printable A4 Sheet Section */}
        <section
          aria-labelledby="a4-sheet-heading"
          className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-5 sm:p-6 space-y-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0F294A] text-white">
                <Printer className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h2 id="a4-sheet-heading" className="text-lg font-bold text-[#0F294A]">
                  Printable A4 Passport Photo Sheet Generator
                </h2>
                <p className="text-xs text-slate-600">
                  Arrange multiple copies of your processed passport photograph onto a standard A4 canvas.
                </p>
              </div>
            </div>
          </div>

          {!singlePhoto ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-600">
              First upload and click <strong>Process &amp; Compress Image</strong> above to unlock the A4 Printable
              Sheet Generator.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
              <div className="lg:col-span-5 space-y-4 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
                <div>
                  <label htmlFor="a4-copies" className="block text-xs font-semibold text-slate-700">
                    Number of Copies on A4 Sheet
                  </label>
                  <select
                    id="a4-copies"
                    value={copies}
                    onChange={(e) => setCopies(Number(e.target.value))}
                    className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-[#0F294A]"
                  >
                    <option value={4}>4 Copies (2 × 2 Grid)</option>
                    <option value={6}>6 Copies (3 × 2 Grid)</option>
                    <option value={8}>8 Copies (3 × 3 Grid)</option>
                    <option value={12}>12 Copies (4 × 3 Grid)</option>
                    <option value={16}>16 Copies (4 × 4 Grid)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="a4-dpi" className="block text-xs font-semibold text-slate-700">
                    Print Resolution
                  </label>
                  <select
                    id="a4-dpi"
                    value={dpi}
                    onChange={(e) => setDpi(Number(e.target.value) as 150 | 300)}
                    className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-[#0F294A]"
                  >
                    <option value={300}>300 DPI High Quality (2480 × 3508 px)</option>
                    <option value={150}>150 DPI Standard Print (1240 × 1754 px)</option>
                  </select>
                </div>

                <label className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cutGuides}
                    onChange={(e) => setCutGuides(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 accent-[#1D4ED8]"
                  />
                  <span>Draw subtle cut-guide borders around each photo</span>
                </label>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    disabled={sheetLoading}
                    onClick={handleGenerateSheet}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#1D4ED8] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1E40AF] disabled:opacity-60 min-h-[44px]"
                  >
                    {sheetLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                        <span>Building A4 Sheet...</span>
                      </>
                    ) : (
                      <>
                        <Grid className="h-4 w-4" aria-hidden="true" />
                        <span>Generate A4 Sheet</span>
                      </>
                    )}
                  </button>

                  {sheetResult && (
                    <button
                      type="button"
                      onClick={handleDownloadSheet}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 min-h-[44px]"
                    >
                      <Download className="h-4 w-4" aria-hidden="true" />
                      <span>Download A4 JPG</span>
                    </button>
                  )}
                </div>

                {sheetError && <p className="text-xs text-red-700">{sheetError}</p>}
              </div>

              <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
                {sheetResult ? (
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
                      <span className="font-semibold text-[#0F294A]">A4 Sheet Preview ({copies} copies)</span>
                      <span className="font-mono tabular-nums">
                        {sheetResult.width}×{sheetResult.height} px · {sheetResult.sizeKb.toFixed(1)} KB
                      </span>
                    </div>
                    <div className="flex justify-center rounded-lg bg-slate-100 p-4">
                      <img
                        src={sheetResult.objectUrl}
                        alt={`Printable A4 passport sheet containing ${copies} copies`}
                        className="max-h-96 rounded border border-slate-300 bg-white shadow-sm object-contain"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex min-h-[220px] items-center justify-center text-center text-sm text-slate-500">
                    Choose your number of copies and click &ldquo;Generate A4 Sheet&rdquo; to preview the printable layout.
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </ToolPageShell>
  );
}
