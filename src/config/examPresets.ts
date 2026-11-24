export type OutputImageFormat = 'image/jpeg' | 'image/png';
export type AcceptedFormat = 'image/jpeg' | 'image/png';
export type VerificationStatus = 'unverified' | 'custom';

export interface ExamPreset {
  id: string;
  name: string;
  shortName: string;
  category: 'photo' | 'signature' | 'passport';
  width: number | null;
  height: number | null;
  minFileSizeKb: number | null;
  maxFileSizeKb: number | null;
  acceptedFormats: AcceptedFormat[];
  outputFormat: OutputImageFormat;
  aspectRatio: number | null;
  aspectRatioLabel: string | null;
  lastVerifiedDate: string | null;
  officialSourceUrl: string;
  officialSourceLabel: string;
  verificationStatus: VerificationStatus;
  notificationNotice: string;
}

export const DEFAULT_EXAM_PRESETS: Record<string, ExamPreset> = {
  ssc: {
    id: 'ssc',
    name: 'SSC Photo Resizer',
    shortName: 'SSC Photograph',
    category: 'photo',
    width: null,
    height: null,
    minFileSizeKb: null,
    maxFileSizeKb: null,
    acceptedFormats: ['image/jpeg', 'image/png'],
    outputFormat: 'image/jpeg',
    aspectRatio: null,
    aspectRatioLabel: null,
    lastVerifiedDate: null,
    officialSourceUrl: 'https://ssc.gov.in',
    officialSourceLabel: 'Staff Selection Commission (ssc.gov.in)',
    verificationStatus: 'unverified',
    notificationNotice: 'Always verify the current photograph requirements in the official SSC recruitment notification.',
  },
  'upsc-photo': {
    id: 'upsc-photo',
    name: 'UPSC Photograph',
    shortName: 'UPSC Photo',
    category: 'photo',
    width: null,
    height: null,
    minFileSizeKb: null,
    maxFileSizeKb: null,
    acceptedFormats: ['image/jpeg', 'image/png'],
    outputFormat: 'image/jpeg',
    aspectRatio: null,
    aspectRatioLabel: null,
    lastVerifiedDate: null,
    officialSourceUrl: 'https://upsc.gov.in',
    officialSourceLabel: 'Union Public Service Commission (upsc.gov.in)',
    verificationStatus: 'unverified',
    notificationNotice: 'Always check the active UPSC examination notice and OTR portal instructions for exact pixel and KB rules.',
  },
  'upsc-signature': {
    id: 'upsc-signature',
    name: 'UPSC Signature',
    shortName: 'UPSC Signature',
    category: 'signature',
    width: null,
    height: null,
    minFileSizeKb: null,
    maxFileSizeKb: null,
    acceptedFormats: ['image/jpeg', 'image/png'],
    outputFormat: 'image/jpeg',
    aspectRatio: null,
    aspectRatioLabel: null,
    lastVerifiedDate: null,
    officialSourceUrl: 'https://upsc.gov.in',
    officialSourceLabel: 'Union Public Service Commission (upsc.gov.in)',
    verificationStatus: 'unverified',
    notificationNotice: 'Verify signature pixel dimensions, clarity, and KB limits in your official UPSC notification.',
  },
  'up-police': {
    id: 'up-police',
    name: 'UP Police Photo Resizer',
    shortName: 'UP Police Photo',
    category: 'photo',
    width: null,
    height: null,
    minFileSizeKb: null,
    maxFileSizeKb: null,
    acceptedFormats: ['image/jpeg', 'image/png'],
    outputFormat: 'image/jpeg',
    aspectRatio: null,
    aspectRatioLabel: null,
    lastVerifiedDate: null,
    officialSourceUrl: 'https://uppbpb.gov.in',
    officialSourceLabel: 'UP Police Recruitment & Promotion Board (uppbpb.gov.in)',
    verificationStatus: 'unverified',
    notificationNotice: 'Please verify the latest UP Police recruitment notification before submitting your photograph.',
  },
  upsssc: {
    id: 'upsssc',
    name: 'UPSSSC Photo Resizer',
    shortName: 'UPSSSC Photo',
    category: 'photo',
    width: null,
    height: null,
    minFileSizeKb: null,
    maxFileSizeKb: null,
    acceptedFormats: ['image/jpeg', 'image/png'],
    outputFormat: 'image/jpeg',
    aspectRatio: null,
    aspectRatioLabel: null,
    lastVerifiedDate: null,
    officialSourceUrl: 'https://upsssc.gov.in',
    officialSourceLabel: 'Uttar Pradesh Subordinate Services Selection Commission (upsssc.gov.in)',
    verificationStatus: 'unverified',
    notificationNotice: 'Always verify dimensions, file-size limits, and format rules in the active UPSSSC notification.',
  },
  passport: {
    id: 'passport',
    name: 'Passport Photo Maker',
    shortName: 'Passport Photo',
    category: 'passport',
    width: null,
    height: null,
    minFileSizeKb: null,
    maxFileSizeKb: null,
    acceptedFormats: ['image/jpeg', 'image/png'],
    outputFormat: 'image/jpeg',
    aspectRatio: null,
    aspectRatioLabel: null,
    lastVerifiedDate: null,
    officialSourceUrl: 'https://www.passportindia.gov.in',
    officialSourceLabel: 'Passport Seva Portal (passportindia.gov.in)',
    verificationStatus: 'unverified',
    notificationNotice: 'Enter the exact dimensions or print ratio specified by your target exam or passport application.',
  },
  signature: {
    id: 'signature',
    name: 'Signature Resizer',
    shortName: 'Signature',
    category: 'signature',
    width: null,
    height: null,
    minFileSizeKb: null,
    maxFileSizeKb: null,
    acceptedFormats: ['image/jpeg', 'image/png'],
    outputFormat: 'image/jpeg',
    aspectRatio: null,
    aspectRatioLabel: null,
    lastVerifiedDate: null,
    officialSourceUrl: 'https://ncs.gov.in',
    officialSourceLabel: 'National Career Service & Official Exam Portals',
    verificationStatus: 'unverified',
    notificationNotice: 'Set the width, height, and KB limit according to the active exam portal instructions.',
  },
};

const STORAGE_KEY = 'examformtools_preset_overrides_v1';

export type PresetOverridesMap = Record<string, Partial<ExamPreset>>;

export function loadPresetOverrides(): PresetOverridesMap {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      return parsed as PresetOverridesMap;
    }
    return {};
  } catch {
    return {};
  }
}

export function getPresetById(id: string): ExamPreset {
  const base = DEFAULT_EXAM_PRESETS[id];
  if (!base) {
    throw new Error(`Unknown exam preset: ${id}`);
  }
  const overrides = loadPresetOverrides();
  const custom = overrides[id];
  if (!custom) return base;
  return {
    ...base,
    ...custom,
    id: base.id,
  };
}

export function savePresetOverride(id: string, patch: Partial<ExamPreset>): ExamPreset {
  const overrides = loadPresetOverrides();
  const updated: Partial<ExamPreset> = {
    ...(overrides[id] || {}),
    ...patch,
    verificationStatus: 'custom',
    lastVerifiedDate: patch.lastVerifiedDate ?? new Date().toISOString().slice(0, 10),
  };
  overrides[id] = updated;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
  } catch {
    // Ignore storage quota errors cleanly
  }
  return getPresetById(id);
}

export function resetPresetOverride(id: string): ExamPreset {
  const overrides = loadPresetOverrides();
  delete overrides[id];
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
  } catch {
    // Ignore storage quota errors
  }
  return DEFAULT_EXAM_PRESETS[id];
}
