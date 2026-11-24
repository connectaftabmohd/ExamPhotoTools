import { CompressionEngine } from '@/src/components/CompressionEngine';
import { ToolPageShell } from '@/src/components/ToolPageShell';

const SSC_STEPS = [
  {
    title: 'Check SSC Notice',
    detail: 'Read your active SSC CGL, CHSL, MTS, GD, or CPO notification for the required pixel size and KB range.',
  },
  {
    title: 'Upload & Frame',
    detail: 'Drop your JPG or PNG photograph, zoom gently, and center your face and shoulders inside the crop frame.',
  },
  {
    title: 'Set Size & Max KB',
    detail: 'Enter the exact pixel width, height, and maximum file size in KB, then select JPG or PNG output.',
  },
  {
    title: 'Compress & Download',
    detail: 'Click Process & Compress Image, inspect the actual KB size and dimensions, and download your file.',
  },
];

const SSC_FAQS = [
  {
    question: 'Does SSC Photo Resizer automatically invent or lock dimensions?',
    answer:
      'No. ExamFormTools never invents official SSC specifications. Width, height, minimum KB, and maximum KB fields are fully editable so you can enter the exact rules from your current SSC notification.',
  },
  {
    question: 'Can I save my SSC notification dimensions for later?',
    answer:
      'Yes. Open the Configurable Preset Manager above the uploader to save your dimensions and KB limits in your browser for future form sessions.',
  },
  {
    question: 'Will my SSC photograph be uploaded to a server?',
    answer:
      'No. All cropping, rotation, resizing, and JPEG/PNG compression happen inside your browser using the HTML Canvas API.',
  },
];

export function SscPhotoResizerPage() {
  return (
    <ToolPageShell
      routePath="/ssc-photo-resizer"
      toolId="ssc-photo-resizer"
      breadcrumbLabel="SSC Photo Resizer"
      h1="SSC Photo Resizer"
      intro="Crop, rotate, resize, and compress your photograph for Staff Selection Commission (SSC) online application forms using browser-native Canvas processing."
      stepsTitle="How to Prepare an SSC Application Photograph"
      steps={SSC_STEPS}
      faqs={SSC_FAQS}
    >
      <CompressionEngine
        config={{ presetId: 'ssc' }}
        filePrefix="ssc-photo"
        uploadLabel="Upload SSC Photograph (JPG, JPEG, or PNG)"
        warningNotice="Always verify the current photograph requirements in the official SSC recruitment notification."
      />
    </ToolPageShell>
  );
}
