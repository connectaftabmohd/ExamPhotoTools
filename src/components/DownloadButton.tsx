import { Download } from 'lucide-react';
import type { ProcessedImageResult } from '@/src/utils/imageEngine';

interface DownloadButtonProps {
  processed: ProcessedImageResult | null;
  filePrefix: string;
  label?: string;
}

export function DownloadButton({ processed, filePrefix, label }: DownloadButtonProps) {
  if (!processed) {
    return (
      <button
        type="button"
        disabled
        className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-500 cursor-not-allowed min-h-[44px]"
      >
        <Download className="h-4 w-4" aria-hidden="true" />
        <span>{label || 'Download Processed Image'}</span>
      </button>
    );
  }

  const ext = processed.format === 'image/jpeg' ? 'jpg' : 'png';
  const filename = `${filePrefix}-${processed.width}x${processed.height}-${Math.round(processed.sizeKb)}kb.${ext}`;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = processed.objectUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors min-h-[44px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
    >
      <Download className="h-4 w-4" aria-hidden="true" />
      <span>{label || `Download ${ext.toUpperCase()} (${processed.sizeKb.toFixed(1)} KB)`}</span>
    </button>
  );
}
