import { CompressionEngine } from '@/src/components/CompressionEngine';
import { ToolPageShell } from '@/src/components/ToolPageShell';

const SIGN_STEPS = [
  {
    title: 'Capture Signature',
    detail: 'Sign cleanly on unruled white paper with a black or dark blue pen and take a well-lit photograph or scan.',
  },
  {
    title: 'Crop Tightly',
    detail: 'Upload your JPG or PNG, zoom in, and rotate if needed so only your signature and clean margins remain.',
  },
  {
    title: 'Choose Appearance Mode',
    detail: 'Keep "Preserve Original Signature Appearance" checked for natural ink, or enable subtle paper clean-up.',
  },
  {
    title: 'Convert & Download',
    detail: 'Set custom dimensions and target KB, convert to JPG with a white background, and download.',
  },
];

const SIGN_FAQS = [
  {
    question: 'What does "Preserve Original Signature Appearance" do?',
    answer:
      'When enabled, ExamPhotoTools keeps your original pen strokes, ink color, and natural texture unaltered while filling any transparent PNG background with crisp white when converting to JPG.',
  },
  {
    question: 'Can I remove dark shadows from paper if my phone photo looks grey?',
    answer:
      'Yes. Uncheck "Preserve Original Signature Appearance" to enable the White Paper Clean-up threshold slider, which brightens light paper shading to pure white while keeping your ink sharp.',
  },
  {
    question: 'Which dimensions should I enter for my signature?',
    answer:
      'Check your active recruitment portal (SSC, UPSC, RRB, IBPS, UP Police, or UPSSSC) for the exact pixel or centimetre box dimensions and KB range.',
  },
];

export function SignatureResizerPage() {
  return (
    <ToolPageShell
      routePath="/signature-resizer"
      toolId="signature-resizer"
      breadcrumbLabel="Signature Resizer"
      h1="Signature Resizer"
      intro="Crop handwritten signatures, convert PNG to white-background JPG, resize to custom pixel dimensions, and compress to exact KB limits in your browser."
      stepsTitle="How to Resize Your Signature for Exam Forms"
      steps={SIGN_STEPS}
      faqs={SIGN_FAQS}
    >
      <CompressionEngine
        config={{
          presetId: 'signature',
          defaultBackgroundColor: '#FFFFFF',
        }}
        filePrefix="signature"
        uploadLabel="Upload Handwritten Signature (JPG or PNG)"
        warningNotice="Always check the signature box dimensions, ink color rules, and KB limits in your official recruitment notification."
        showSignatureControls
        aspectPresets={[
          { label: 'Match Output', ratio: null },
          { label: '3 : 1 (Wide)', ratio: 3 },
          { label: '2.5 : 1', ratio: 2.5 },
          { label: '2 : 1', ratio: 2 },
        ]}
      />
    </ToolPageShell>
  );
}
