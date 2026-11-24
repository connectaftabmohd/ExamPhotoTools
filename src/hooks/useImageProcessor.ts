import { useCallback, useEffect, useRef, useState } from 'react';
import { getPresetById, type ExamPreset, type OutputImageFormat } from '@/src/config/examPresets';
import {
  loadImageAsset,
  processImageWithEngine,
  type CropTransformSettings,
  type LoadedImageAsset,
  type ProcessedImageResult,
} from '@/src/utils/imageEngine';

export interface ImageProcessorConfig {
  presetId: string;
  defaultTargetWidth?: number;
  defaultTargetHeight?: number;
  defaultBackgroundColor?: string;
  allowAutoScaleDown?: boolean;
}

const DEFAULT_TRANSFORM: CropTransformSettings = {
  zoom: 1,
  offsetX: 0,
  offsetY: 0,
  rotationDeg: 0,
  cropAspectRatio: null,
  backgroundColor: '#FFFFFF',
  applySimpleBgReplace: false,
  bgThreshold: 225,
  signatureCleanPaperMode: false,
  signaturePaperThreshold: 205,
};

export function useImageProcessor(config: ImageProcessorConfig) {
  const [preset, setPreset] = useState<ExamPreset>(() => getPresetById(config.presetId));
  const [asset, setAsset] = useState<LoadedImageAsset | null>(null);
  const [processed, setProcessed] = useState<ProcessedImageResult | null>(null);

  const [widthInput, setWidthInput] = useState<string>(() =>
    preset.width !== null ? String(preset.width) : config.defaultTargetWidth ? String(config.defaultTargetWidth) : ''
  );
  const [heightInput, setHeightInput] = useState<string>(() =>
    preset.height !== null ? String(preset.height) : config.defaultTargetHeight ? String(config.defaultTargetHeight) : ''
  );
  const [preserveAspectRatio, setPreserveAspectRatio] = useState<boolean>(false);

  const [minKbInput, setMinKbInput] = useState<string>(() =>
    preset.minFileSizeKb !== null ? String(preset.minFileSizeKb) : ''
  );
  const [maxKbInput, setMaxKbInput] = useState<string>(() =>
    preset.maxFileSizeKb !== null ? String(preset.maxFileSizeKb) : ''
  );
  const [outputFormat, setOutputFormat] = useState<OutputImageFormat>(preset.outputFormat);
  const [manualQuality, setManualQuality] = useState<number>(0.88);
  const [allowAutoScaleDown, setAllowAutoScaleDown] = useState<boolean>(config.allowAutoScaleDown ?? false);

  const [transform, setTransform] = useState<CropTransformSettings>(() => ({
    ...DEFAULT_TRANSFORM,
    cropAspectRatio: preset.aspectRatio,
    backgroundColor: config.defaultBackgroundColor || '#FFFFFF',
  }));

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const assetUrlRef = useRef<string | null>(null);
  const processedUrlRef = useRef<string | null>(null);

  const revokeAssetUrl = useCallback(() => {
    if (assetUrlRef.current) {
      URL.revokeObjectURL(assetUrlRef.current);
      assetUrlRef.current = null;
    }
  }, []);

  const revokeProcessedUrl = useCallback(() => {
    if (processedUrlRef.current) {
      URL.revokeObjectURL(processedUrlRef.current);
      processedUrlRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      revokeAssetUrl();
      revokeProcessedUrl();
    };
  }, [revokeAssetUrl, revokeProcessedUrl]);

  const applyPresetValues = useCallback((nextPreset: ExamPreset) => {
    setPreset(nextPreset);
    if (nextPreset.width !== null) setWidthInput(String(nextPreset.width));
    if (nextPreset.height !== null) setHeightInput(String(nextPreset.height));
    if (nextPreset.minFileSizeKb !== null) setMinKbInput(String(nextPreset.minFileSizeKb));
    else setMinKbInput('');
    if (nextPreset.maxFileSizeKb !== null) setMaxKbInput(String(nextPreset.maxFileSizeKb));
    else setMaxKbInput('');
    setOutputFormat(nextPreset.outputFormat);
    setTransform((prev) => ({
      ...prev,
      cropAspectRatio: nextPreset.aspectRatio,
    }));
  }, []);

  const handleFileSelected = useCallback(
    async (file: File) => {
      setErrorMsg(null);
      setSuccessMsg(null);
      try {
        const loaded = await loadImageAsset(file);
        revokeAssetUrl();
        revokeProcessedUrl();
        assetUrlRef.current = loaded.objectUrl;
        setAsset(loaded);
        setProcessed(null);

        // If width/height are unconfigured, default to original dimensions (capped reasonably if huge) or keep preset
        if (!widthInput && !heightInput) {
          setWidthInput(String(loaded.originalWidth));
          setHeightInput(String(loaded.originalHeight));
        }

        setTransform((prev) => ({
          ...prev,
          zoom: 1,
          offsetX: 0,
          offsetY: 0,
          rotationDeg: 0,
        }));
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : 'Unable to load the selected image.');
      }
    },
    [heightInput, revokeAssetUrl, revokeProcessedUrl, widthInput]
  );

  const handleWidthChange = useCallback(
    (nextWidthStr: string) => {
      setWidthInput(nextWidthStr);
      if (preserveAspectRatio && asset) {
        const w = Number(nextWidthStr);
        if (Number.isFinite(w) && w > 0) {
          const ratio = asset.originalHeight / asset.originalWidth;
          setHeightInput(String(Math.max(1, Math.round(w * ratio))));
        }
      }
    },
    [asset, preserveAspectRatio]
  );

  const handleHeightChange = useCallback(
    (nextHeightStr: string) => {
      setHeightInput(nextHeightStr);
      if (preserveAspectRatio && asset) {
        const h = Number(nextHeightStr);
        if (Number.isFinite(h) && h > 0) {
          const ratio = asset.originalWidth / asset.originalHeight;
          setWidthInput(String(Math.max(1, Math.round(h * ratio))));
        }
      }
    },
    [asset, preserveAspectRatio]
  );

  const processNow = useCallback(async (): Promise<ProcessedImageResult | null> => {
    if (!asset) {
      setErrorMsg('Please upload a JPG or PNG image first.');
      return null;
    }

    const parsedW = widthInput.trim() ? Number(widthInput) : asset.originalWidth;
    const parsedH = heightInput.trim() ? Number(heightInput) : asset.originalHeight;

    if (!Number.isFinite(parsedW) || parsedW < 16 || parsedW > 6000) {
      setErrorMsg('Please enter a valid target Width between 16 and 6000 pixels.');
      return null;
    }
    if (!Number.isFinite(parsedH) || parsedH < 16 || parsedH > 6000) {
      setErrorMsg('Please enter a valid target Height between 16 and 6000 pixels.');
      return null;
    }

    const minKb = minKbInput.trim() ? Number(minKbInput) : null;
    const maxKb = maxKbInput.trim() ? Number(maxKbInput) : null;

    if (minKb !== null && (!Number.isFinite(minKb) || minKb < 1)) {
      setErrorMsg('Minimum file size must be at least 1 KB.');
      return null;
    }
    if (maxKb !== null && (!Number.isFinite(maxKb) || maxKb < 1)) {
      setErrorMsg('Maximum file size must be at least 1 KB.');
      return null;
    }
    if (minKb !== null && maxKb !== null && minKb > maxKb) {
      setErrorMsg('Minimum file size cannot exceed Maximum file size.');
      return null;
    }

    setIsProcessing(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const result = await processImageWithEngine(asset, {
        targetWidth: Math.round(parsedW),
        targetHeight: Math.round(parsedH),
        outputFormat,
        minKb,
        maxKb,
        manualQuality,
        allowAutoScaleDown,
        transform,
      });

      revokeProcessedUrl();
      processedUrlRef.current = result.objectUrl;
      setProcessed(result);

      if (result.warning) {
        setSuccessMsg(`Processed to ${result.width}×${result.height} px (${result.sizeKb.toFixed(2)} KB) with a notice.`);
      } else {
        setSuccessMsg(
          `Ready to download: ${result.width}×${result.height} px · ${result.sizeKb.toFixed(2)} KB (${result.format === 'image/jpeg' ? 'JPG' : 'PNG'}).`
        );
      }
      return result;
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Image processing failed.');
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [
    allowAutoScaleDown,
    asset,
    heightInput,
    manualQuality,
    maxKbInput,
    minKbInput,
    outputFormat,
    revokeProcessedUrl,
    transform,
    widthInput,
  ]);

  const resetAll = useCallback(() => {
    revokeAssetUrl();
    revokeProcessedUrl();
    setAsset(null);
    setProcessed(null);
    setErrorMsg(null);
    setSuccessMsg(null);
    const fresh = getPresetById(config.presetId);
    setPreset(fresh);
    setWidthInput(
      fresh.width !== null ? String(fresh.width) : config.defaultTargetWidth ? String(config.defaultTargetWidth) : ''
    );
    setHeightInput(
      fresh.height !== null ? String(fresh.height) : config.defaultTargetHeight ? String(config.defaultTargetHeight) : ''
    );
    setMinKbInput(fresh.minFileSizeKb !== null ? String(fresh.minFileSizeKb) : '');
    setMaxKbInput(fresh.maxFileSizeKb !== null ? String(fresh.maxFileSizeKb) : '');
    setOutputFormat(fresh.outputFormat);
    setTransform({
      ...DEFAULT_TRANSFORM,
      cropAspectRatio: fresh.aspectRatio,
      backgroundColor: config.defaultBackgroundColor || '#FFFFFF',
    });
  }, [config.defaultBackgroundColor, config.defaultTargetHeight, config.defaultTargetWidth, config.presetId, revokeAssetUrl, revokeProcessedUrl]);

  return {
    preset,
    applyPresetValues,
    asset,
    processed,
    widthInput,
    heightInput,
    handleWidthChange,
    handleHeightChange,
    preserveAspectRatio,
    setPreserveAspectRatio,
    minKbInput,
    setMinKbInput,
    maxKbInput,
    setMaxKbInput,
    outputFormat,
    setOutputFormat,
    manualQuality,
    setManualQuality,
    allowAutoScaleDown,
    setAllowAutoScaleDown,
    transform,
    setTransform,
    isProcessing,
    errorMsg,
    successMsg,
    handleFileSelected,
    processNow,
    resetAll,
  };
}
