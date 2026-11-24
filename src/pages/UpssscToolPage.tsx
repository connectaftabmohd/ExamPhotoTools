import { CompressionEngine } from '@/src/components/CompressionEngine';
import { ToolPageShell } from '@/src/components/ToolPageShell';

const UPSSSC_STEPS = [
  {
    title: 'Enter UPSSSC Limits',
    detail: 'Check your UPSSSC PET or Mains advertisement and enter the required width, height, and KB limits.',
  },
  {
    title: 'Upload & Crop',
    detail: 'Upload your JPG or PNG photograph and position your face cleanly inside the crop overlay.',
  },
  {
    title: 'Convert & Compress',
    detail: 'Select JPG or PNG output format and click Process & Compress Image to measure actual KB size.',
  },
  {
    title: 'Compare Original vs Final',
    detail: 'Verify clarity using the side-by-side comparison cards before downloading your file.',
  },
];

const UPSSSC_FAQS = [
  {
    question: 'Does this tool support UPSSSC PET, Lekhpal, and VDO applications?',
    answer:
      'Yes. Because all pixel dimensions, KB targets, and output format options (JPG/PNG) are configurable, you can prepare photographs for any UPSSSC recruitment advertisement.',
  },
  {
    question: 'Can I compare image sharpness before downloading?',
    answer:
      'Yes. The UPSSSC Photo Resizer displays your original uploaded image right next to the compressed output along with exact pixel dimensions and percentage size reduction.',
  },
];

export function UpssscToolPage() {
  return (
    <ToolPageShell
      routePath="/upsssc-photo-resizer"
      toolId="upsssc-photo-resizer"
      breadcrumbLabel="UPSSSC Photo Resizer"
      h1="UPSSSC Photo Resizer"
      intro="Upload, crop, resize, convert formats, and compress photographs for UPSSSC recruitment applications with side-by-side original versus final comparison."
      stepsTitle="How to Resize a Photograph for UPSSSC Forms"
      steps={UPSSSC_STEPS}
      faqs={UPSSSC_FAQS}
    >
      <CompressionEngine
        config={{ presetId: 'upsssc' }}
        filePrefix="upsssc-photo"
        uploadLabel="Upload UPSSSC Photograph (JPG or PNG)"
        warningNotice="Always verify dimensions, file-size limits, and format requirements in the official UPSSSC recruitment notification."
        showComparison
      />
    </ToolPageShell>
  );
}
