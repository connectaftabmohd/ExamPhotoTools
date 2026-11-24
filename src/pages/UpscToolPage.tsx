import { useState } from 'react';
import { AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { CompressionEngine } from '@/src/components/CompressionEngine';
import { ToolPageShell } from '@/src/components/ToolPageShell';
import type { ProcessedImageResult } from '@/src/utils/imageEngine';

const UPSC_STEPS = [
  {
    title: 'Review UPSC Rules',
    detail: 'Check the active UPSC exam notice or OTR instructions for separate photograph and signature dimensions.',
  },
  {
    title: 'Process Photograph',
    detail: 'Use Panel A to upload, crop, resize, and compress your passport-style photograph independently.',
  },
  {
    title: 'Process Signature',
    detail: 'Use Panel B to crop your handwritten signature tightly on white paper and compress it to target KB.',
  },
  {
    title: 'Verify Both Outputs',
    detail: 'Check the independent output status badges for both files before downloading and uploading to UPSC.',
  },
];

const UPSC_FAQS = [
  {
    question: 'Why are the UPSC Photograph and Signature editors separated?',
    answer:
      'UPSC applications require different pixel dimensions, aspect ratios, and KB limits for your photograph versus your handwritten signature. Independent panels let you configure and download each without overwriting the other.',
  },
  {
    question: 'Does ExamPhotoTools guarantee that my output satisfies every UPSC notification?',
    answer:
      'No. ExamPhotoTools does not claim that generated images automatically satisfy every UPSC notification. Always double-check pixel bounds, KB range, background rules, and file format in the official UPSC examination notice.',
  },
  {
    question: 'Can I convert a PNG signature scan to JPG for UPSC?',
    answer:
      'Yes. Upload your PNG or JPG signature in Panel B, select JPG output, and enable white background preservation so transparent areas become clean white.',
  },
];

export function UpscToolPage() {
  const [photoOut, setPhotoOut] = useState<ProcessedImageResult | null>(null);
  const [signOut, setSignOut] = useState<ProcessedImageResult | null>(null);

  return (
    <ToolPageShell
      routePath="/upsc-photo-signature-resizer"
      toolId="upsc-photo-signature-resizer"
      breadcrumbLabel="UPSC Photo & Signature Resizer"
      h1="UPSC Photo & Signature Resizer"
      intro="Prepare your UPSC photograph and signature in two independent local editing panels with custom pixel dimensions, file-size limits, and format conversion."
      stepsTitle="How to Prepare UPSC Photograph and Signature Files"
      steps={UPSC_STEPS}
      faqs={UPSC_FAQS}
    >
      <div className="space-y-8">
        {/* Independent status summary bar */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
            <div className="flex items-center gap-2.5">
              {photoOut ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" aria-hidden="true" />
              ) : (
                <Clock className="h-5 w-5 text-slate-400 shrink-0" aria-hidden="true" />
              )}
              <div>
                <div className="text-sm font-bold text-[#0F294A]">Panel A · Photograph Status</div>
                <div className="text-xs text-slate-600 font-mono tabular-nums">
                  {photoOut
                    ? `Ready · ${photoOut.width}×${photoOut.height} px · ${photoOut.sizeKb.toFixed(2)} KB`
                    : 'Not processed yet'}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
            <div className="flex items-center gap-2.5">
              {signOut ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" aria-hidden="true" />
              ) : (
                <Clock className="h-5 w-5 text-slate-400 shrink-0" aria-hidden="true" />
              )}
              <div>
                <div className="text-sm font-bold text-[#0F294A]">Panel B · Signature Status</div>
                <div className="text-xs text-slate-600 font-mono tabular-nums">
                  {signOut
                    ? `Ready · ${signOut.width}×${signOut.height} px · ${signOut.sizeKb.toFixed(2)} KB`
                    : 'Not processed yet'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2.5 rounded-xl border border-blue-200 bg-[#EFF6FF] px-4 py-3 text-xs sm:text-sm text-[#0F294A]">
          <AlertTriangle className="h-4.5 w-4.5 shrink-0 text-[#1D4ED8] mt-0.5" aria-hidden="true" />
          <p>
            Important: Processing an image here does not claim automatic compliance with every UPSC notification. Always
            verify exact pixel dimensions, KB limits, and naming/date rules in the current UPSC notice.
          </p>
        </div>

        {/* Panel A: Photograph */}
        <div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-4 sm:p-6">
          <CompressionEngine
            config={{ presetId: 'upsc-photo' }}
            title="A. UPSC Photograph Editor"
            uploadLabel="Upload UPSC Photograph (JPG or PNG)"
            filePrefix="upsc-photograph"
            warningNotice="Verify UPSC photograph pixel dimensions, white/light background instructions, and KB range in your active UPSC notification."
            onProcessedChange={setPhotoOut}
          />
        </div>

        {/* Panel B: Signature */}
        <div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-4 sm:p-6">
          <CompressionEngine
            config={{ presetId: 'upsc-signature' }}
            title="B. UPSC Signature Editor"
            uploadLabel="Upload UPSC Signature (JPG or PNG)"
            filePrefix="upsc-signature"
            warningNotice="Verify UPSC signature pixel dimensions and KB range in your active UPSC notification."
            showSignatureControls
            aspectPresets={[
              { label: 'Match Output', ratio: null },
              { label: '3 : 1', ratio: 3 },
              { label: '2.5 : 1', ratio: 2.5 },
              { label: '1 : 1', ratio: 1 },
            ]}
            onProcessedChange={setSignOut}
          />
        </div>
      </div>
    </ToolPageShell>
  );
}
