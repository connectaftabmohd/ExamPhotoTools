import { useRef, useState, type DragEvent } from 'react';
import { Lock, Upload } from 'lucide-react';

interface ImageUploaderProps {
  label?: string;
  helperText?: string;
  accept?: string;
  onFileSelected: (file: File) => void;
  compact?: boolean;
}

export function ImageUploader({
  label = 'Upload Photograph or Image',
  helperText = 'Drag and drop a JPG, JPEG, or PNG file here, or click to browse (max 25 MB).',
  accept = 'image/jpeg,image/png,.jpg,.jpeg,.png',
  onFileSelected,
  compact = false,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    onFileSelected(files[0]);
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={label}
      className={`cursor-pointer rounded-xl border-2 border-dashed transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8] ${
        isDragging
          ? 'border-[#1D4ED8] bg-[#EFF6FF]'
          : 'border-slate-300 bg-[#F8FAFC] hover:border-[#1D4ED8]/70 hover:bg-[#F4F8FD]'
      } ${compact ? 'p-6' : 'p-8 sm:p-10'}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = '';
        }}
      />

      <div className="flex flex-col items-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#1D4ED8]">
          <Upload className="h-6 w-6" aria-hidden="true" />
        </div>
        <h3 className="mt-4 text-base sm:text-lg font-semibold text-[#0F294A]">{label}</h3>
        <p className="mt-1.5 max-w-md text-xs sm:text-sm text-slate-600">{helperText}</p>
        <div className="mt-4 inline-flex items-center justify-center rounded-lg bg-[#1D4ED8] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1E40AF] transition-colors">
          Select Image File
        </div>
        <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-slate-500">
          <Lock className="h-3.5 w-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
          <span>Processed 100% locally in your browser — never uploaded to any server.</span>
        </p>
      </div>
    </div>
  );
}
