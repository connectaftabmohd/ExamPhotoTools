export interface RouteSeoMeta {
  path: string;
  title: string;
  description: string;
  h1: string;
  breadcrumb: string;
  schemaType: 'WebApplication' | 'WebPage' | 'FAQPage' | 'AboutPage' | 'ContactPage';
}

export interface ToolSummary {
  id: string;
  title: string;
  shortTitle: string;
  path: string;
  category: 'Photo' | 'Photo & Signature' | 'Signature' | 'Passport' | 'Eligibility';
  examTag: string;
  description: string;
  featured: boolean;
}

export const SITE_BASE_URL = 'https://examformtools.in';

export const ROUTE_SEO_META: Record<string, RouteSeoMeta> = {
  '/': {
    path: '/',
    title: 'ExamFormTools – Free Photo, Signature & Exam Form Tools',
    description:
      'Prepare your photographs, signatures and documents for Indian government job applications with free browser-based online tools.',
    h1: 'Free Online Exam Form Photo & Signature Resizer',
    breadcrumb: 'Home',
    schemaType: 'WebApplication',
  },
  '/tools': {
    path: '/tools',
    title: 'All Exam Form Tools – Photo, Signature & Age Utilities | ExamFormTools',
    description:
      'Browse all free browser-based photo resizers, signature compressors, passport sheet makers, and age calculators for Indian government exams.',
    h1: 'All Indian Exam Form Preparation Tools',
    breadcrumb: 'All Tools',
    schemaType: 'WebPage',
  },
  '/ssc-photo-resizer': {
    path: '/ssc-photo-resizer',
    title: 'SSC Photo Resizer – Crop, Resize & Compress | ExamFormTools',
    description:
      'Crop, rotate, resize, and compress SSC application photographs to custom pixel dimensions and KB limits directly in your browser.',
    h1: 'SSC Photo Resizer',
    breadcrumb: 'SSC Photo Resizer',
    schemaType: 'WebApplication',
  },
  '/upsc-photo-signature-resizer': {
    path: '/upsc-photo-signature-resizer',
    title: 'UPSC Photo & Signature Resizer – Dual Editor | ExamFormTools',
    description:
      'Prepare your UPSC photograph and signature independently with custom pixel dimensions, JPEG/PNG conversion, and accurate KB compression.',
    h1: 'UPSC Photo & Signature Resizer',
    breadcrumb: 'UPSC Photo & Signature Resizer',
    schemaType: 'WebApplication',
  },
  '/up-police-photo-resizer': {
    path: '/up-police-photo-resizer',
    title: 'UP Police Photo Resizer & Preset Manager | ExamFormTools',
    description:
      'Resize, crop, and compress UP Police recruitment photographs to your target KB limit with an editable notification preset manager.',
    h1: 'UP Police Photo Resizer',
    breadcrumb: 'UP Police Photo Resizer',
    schemaType: 'WebApplication',
  },
  '/upsssc-photo-resizer': {
    path: '/upsssc-photo-resizer',
    title: 'UPSSSC Photo Resizer – Before & After Comparison | ExamFormTools',
    description:
      'Crop, resize, convert formats, and compress UPSSSC application photographs locally with live original-versus-output comparison.',
    h1: 'UPSSSC Photo Resizer',
    breadcrumb: 'UPSSSC Photo Resizer',
    schemaType: 'WebApplication',
  },
  '/passport-photo-maker': {
    path: '/passport-photo-maker',
    title: 'Passport Photo Maker & A4 Print Sheet Generator | ExamFormTools',
    description:
      'Create single passport-size photographs with custom solid backgrounds and export printable A4 multi-copy sheets locally in your browser.',
    h1: 'Passport Photo Maker',
    breadcrumb: 'Passport Photo Maker',
    schemaType: 'WebApplication',
  },
  '/signature-resizer': {
    path: '/signature-resizer',
    title: 'Signature Resizer – Crop, White Background & KB Compressor | ExamFormTools',
    description:
      'Crop and resize handwritten signatures for Indian exam forms, convert PNG to JPG with white background fill, and hit exact KB targets.',
    h1: 'Signature Resizer',
    breadcrumb: 'Signature Resizer',
    schemaType: 'WebApplication',
  },
  '/age-calculator': {
    path: '/age-calculator',
    title: 'Exam Age Eligibility Calculator – SSC, UPSC, UP Police | ExamFormTools',
    description:
      'Calculate exact age in years, months, and days on any recruitment cut-off date with editable min/max limits and optional category relaxation.',
    h1: 'Age Eligibility Calculator',
    breadcrumb: 'Age Calculator',
    schemaType: 'WebApplication',
  },
  '/about': {
    path: '/about',
    title: 'About ExamFormTools – Privacy-First Exam Utilities',
    description:
      'Learn how ExamFormTools helps Indian government job aspirants prepare compliant photographs, signatures, and age checks locally in the browser.',
    h1: 'About ExamFormTools',
    breadcrumb: 'About',
    schemaType: 'AboutPage',
  },
  '/contact': {
    path: '/contact',
    title: 'Contact ExamFormTools – Feedback & Corrections',
    description:
      'Reach out to the ExamFormTools team to report bugs, suggest new recruitment utilities, or share preset feedback.',
    h1: 'Contact ExamFormTools',
    breadcrumb: 'Contact',
    schemaType: 'ContactPage',
  },
  '/privacy-policy': {
    path: '/privacy-policy',
    title: 'Privacy Policy – Local Browser Processing | ExamFormTools',
    description:
      'Read our privacy policy: all image resizing, cropping, and compression happen locally in your browser with zero server uploads.',
    h1: 'Privacy Policy',
    breadcrumb: 'Privacy Policy',
    schemaType: 'WebPage',
  },
  '/terms-and-conditions': {
    path: '/terms-and-conditions',
    title: 'Terms and Conditions | ExamFormTools',
    description:
      'Terms of use for ExamFormTools free browser-based photo, signature, and age eligibility calculators.',
    h1: 'Terms and Conditions',
    breadcrumb: 'Terms & Conditions',
    schemaType: 'WebPage',
  },
  '/disclaimer': {
    path: '/disclaimer',
    title: 'Official Notification Disclaimer | ExamFormTools',
    description:
      'Important disclaimer: ExamFormTools is an independent utility and is not affiliated with SSC, UPSC, UPPRPB, UPSSSC, or any government body.',
    h1: 'Disclaimer',
    breadcrumb: 'Disclaimer',
    schemaType: 'WebPage',
  },
};

export const ALL_TOOLS: ToolSummary[] = [
  {
    id: 'ssc-photo-resizer',
    title: 'SSC Photo Resizer',
    shortTitle: 'SSC Photo',
    path: '/ssc-photo-resizer',
    category: 'Photo',
    examTag: 'SSC CGL · CHSL · MTS · GD',
    description:
      'Crop, rotate, resize to custom pixel dimensions, and compress photographs to your SSC notification KB range.',
    featured: true,
  },
  {
    id: 'upsc-photo-signature-resizer',
    title: 'UPSC Photo & Signature Resizer',
    shortTitle: 'UPSC Photo & Sign',
    path: '/upsc-photo-signature-resizer',
    category: 'Photo & Signature',
    examTag: 'UPSC CSE · CDS · NDA · OTR',
    description:
      'Two independent workbenches to resize, crop, and compress both your UPSC photograph and handwritten signature.',
    featured: true,
  },
  {
    id: 'up-police-photo-resizer',
    title: 'UP Police Photo Resizer',
    shortTitle: 'UP Police Photo',
    path: '/up-police-photo-resizer',
    category: 'Photo',
    examTag: 'UPPRPB Constable · SI · ASI',
    description:
      'Resize and compress UP Police application photos to JPG with a built-in configurable notification preset manager.',
    featured: true,
  },
  {
    id: 'upsssc-photo-resizer',
    title: 'UPSSSC Photo Resizer',
    shortTitle: 'UPSSSC Photo',
    path: '/upsssc-photo-resizer',
    category: 'Photo',
    examTag: 'UPSSSC PET · Lekhpal · VDO',
    description:
      'Adjust dimensions, convert formats, and compare original versus compressed UPSSSC photos side by side.',
    featured: true,
  },
  {
    id: 'passport-photo-maker',
    title: 'Passport Photo Maker',
    shortTitle: 'Passport Maker',
    path: '/passport-photo-maker',
    category: 'Passport',
    examTag: 'Single Photo · A4 Printable Sheet',
    description:
      'Crop to passport aspect ratios, select solid white or light-blue backgrounds, and export printable A4 multi-photo sheets.',
    featured: true,
  },
  {
    id: 'signature-resizer',
    title: 'Signature Resizer',
    shortTitle: 'Signature Resizer',
    path: '/signature-resizer',
    category: 'Signature',
    examTag: 'All Govt Portals · White BG',
    description:
      'Crop scanned signatures cleanly, convert to JPG with optional white background, and preserve natural ink strokes.',
    featured: true,
  },
  {
    id: 'age-calculator',
    title: 'Age Eligibility Calculator',
    shortTitle: 'Age Calculator',
    path: '/age-calculator',
    category: 'Eligibility',
    examTag: 'Cut-Off Date · Leap Year Accurate',
    description:
      'Compute exact age in years, months, and days on any recruitment cut-off date with configurable age relaxation.',
    featured: true,
  },
];

export const EXAM_CATEGORIES = [
  {
    name: 'Staff Selection Commission (SSC)',
    exams: 'SSC CGL, CHSL, MTS, CPO, JE, GD Constable',
    toolPath: '/ssc-photo-resizer',
    ctaLabel: 'Open SSC Photo Resizer',
  },
  {
    name: 'Union Public Service Commission (UPSC)',
    exams: 'Civil Services (IAS/IPS), CDS, NDA, CAPF, OTR',
    toolPath: '/upsc-photo-signature-resizer',
    ctaLabel: 'Open UPSC Dual Resizer',
  },
  {
    name: 'Uttar Pradesh Police (UPPRPB)',
    exams: 'Constable, Sub-Inspector (SI), Computer Operator',
    toolPath: '/up-police-photo-resizer',
    ctaLabel: 'Open UP Police Resizer',
  },
  {
    name: 'UPSSSC & State Selections',
    exams: 'UPSSSC PET, Lekhpal, Junior Assistant, VDO',
    toolPath: '/upsssc-photo-resizer',
    ctaLabel: 'Open UPSSSC Resizer',
  },
  {
    name: 'Railway & Banking (RRB / IBPS)',
    exams: 'RRB NTPC, Group D, ALP, IBPS PO/Clerk, SBI',
    toolPath: '/passport-photo-maker',
    ctaLabel: 'Open Passport & Signature Tools',
  },
];

export const HOME_FAQS = [
  {
    question: 'Are my photographs and signatures uploaded to any server?',
    answer:
      'No. All image decoding, cropping, resizing, and JPEG/PNG compression happen strictly inside your own web browser using the HTML Canvas and File APIs. Your files never leave your device.',
  },
  {
    question: 'Why are official pixel and KB limits left blank by default?',
    answer:
      'Indian recruitment commissions update photograph and signature rules frequently across notifications. Instead of guessing or displaying outdated numbers, ExamFormTools lets you enter and save the exact specifications written in your active notification.',
  },
  {
    question: 'How does the target KB compression work without cutting quality randomly?',
    answer:
      'When you enter a maximum file size in KB, the engine encodes your cropped image to a real JPEG Blob, measures its actual byte size, and iteratively adjusts JPEG compression quality using binary search until it meets your target limit—or warns you if the pixel dimensions are too large for that KB limit.',
  },
  {
    question: 'Is ExamFormTools completely free with no registration?',
    answer:
      'Yes. Every photo resizer, signature resizer, A4 passport sheet generator, and age eligibility calculator is 100% free with zero sign-up, zero watermarks, and zero daily limits.',
  },
  {
    question: 'Does the Age Calculator handle leap years and category relaxation accurately?',
    answer:
      'Yes. It calculates calendar-accurate completed years, remaining months, and days across leap years (including 29 February), and lets you explicitly enter any notification-prescribed minimum age, maximum age, relaxation years, and inclusive/exclusive boundary rule.',
  },
];
