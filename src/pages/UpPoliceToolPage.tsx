import { CompressionEngine } from '@/src/components/CompressionEngine';
import { ToolPageShell } from '@/src/components/ToolPageShell';

const UP_POLICE_STEPS = [
  {
    title: 'Configure Notification Preset',
    detail: 'Use the Preset Manager below to enter and save the dimensions and KB limits from the latest UPPRPB notice.',
  },
  {
    title: 'Upload Your Photograph',
    detail: 'Drag and drop a clear, recent front-facing photograph in JPG or PNG format.',
  },
  {
    title: 'Crop & Compress to JPG',
    detail: 'Adjust framing, zoom, and rotation, then compress to JPG within your configured target KB.',
  },
  {
    title: 'Compare & Download',
    detail: 'Inspect the side-by-side original versus processed comparison and download the final JPG.',
  },
];

const UP_POLICE_FAQS = [
  {
    question: 'How does the UP Police Configurable Preset Manager work?',
    answer:
      'Whenever UPPRPB issues a new recruitment notification (Constable, Sub-Inspector, or ASI), an applicant or cyber-cafe administrator can enter the latest width, height, min KB, and max KB in the Preset Manager and click Save. The settings stay saved in your browser for future uploads.',
  },
  {
    question: 'Why is the output format set to JPG?',
    answer:
      'UP Police recruitment portals typically require JPEG/JPG photographs. The engine converts PNG or JPG uploads cleanly into a compliant JPG file.',
  },
  {
    question: 'Are my photos stored on any external server?',
    answer:
      'No. Only the numeric preset configuration (if you choose to save it) is stored in your browser localStorage. Your photograph never leaves your device.',
  },
];

export function UpPoliceToolPage() {
  return (
    <ToolPageShell
      routePath="/up-police-photo-resizer"
      toolId="up-police-photo-resizer"
      breadcrumbLabel="UP Police Photo Resizer"
      h1="UP Police Photo Resizer"
      intro="Dedicated browser utility for UP Police (UPPRPB) recruitment photographs featuring side-by-side preview comparison, JPG compression, and an editable Preset Manager."
      stepsTitle="How to Resize a UP Police Recruitment Photograph"
      steps={UP_POLICE_STEPS}
      faqs={UP_POLICE_FAQS}
    >
      <CompressionEngine
        config={{ presetId: 'up-police' }}
        filePrefix="up-police-photo"
        uploadLabel="Upload UP Police Photograph (JPG or PNG)"
        warningNotice="Please verify the latest UP Police recruitment notification before submitting your photograph."
        showComparison
        showPresetManager
        presetManagerDefaultOpen
        lockFormatToJpg
      />
    </ToolPageShell>
  );
}
