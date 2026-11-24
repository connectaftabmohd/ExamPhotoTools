import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve(process.cwd(), 'dist');
const templatePath = path.join(distDir, 'index.html');

if (!fs.existsSync(templatePath)) {
  console.error('Missing dist/index.html; run vite build first.');
  process.exit(1);
}

const template = fs.readFileSync(templatePath, 'utf-8');
const baseUrl = 'https://examphototools.in';

const routes = [
  {
    path: '/tools',
    title: 'All Exam Form Tools – Photo, Signature & Age Utilities | ExamPhotoTools',
    description:
      'Browse all free browser-based photo resizers, signature compressors, passport sheet makers, and age calculators for Indian government exams.',
  },
  {
    path: '/ssc-photo-resizer',
    title: 'SSC Photo Resizer – Crop, Resize & Compress | ExamPhotoTools',
    description:
      'Crop, rotate, resize, and compress SSC application photographs to custom pixel dimensions and KB limits directly in your browser.',
  },
  {
    path: '/upsc-photo-signature-resizer',
    title: 'UPSC Photo & Signature Resizer – Dual Editor | ExamPhotoTools',
    description:
      'Prepare your UPSC photograph and signature independently with custom pixel dimensions, JPEG/PNG conversion, and accurate KB compression.',
  },
  {
    path: '/up-police-photo-resizer',
    title: 'UP Police Photo Resizer & Preset Manager | ExamPhotoTools',
    description:
      'Resize, crop, and compress UP Police recruitment photographs to your target KB limit with an editable notification preset manager.',
  },
  {
    path: '/upsssc-photo-resizer',
    title: 'UPSSSC Photo Resizer – Before & After Comparison | ExamPhotoTools',
    description:
      'Crop, resize, convert formats, and compress UPSSSC application photographs locally with live original-versus-output comparison.',
  },
  {
    path: '/passport-photo-maker',
    title: 'Passport Photo Maker & A4 Print Sheet Generator | ExamPhotoTools',
    description:
      'Create single passport-size photographs with custom solid backgrounds and export printable A4 multi-copy sheets locally in your browser.',
  },
  {
    path: '/signature-resizer',
    title: 'Signature Resizer – Crop, White Background & KB Compressor | ExamPhotoTools',
    description:
      'Crop and resize handwritten signatures for Indian exam forms, convert PNG to JPG with white background fill, and hit exact KB targets.',
  },
  {
    path: '/age-calculator',
    title: 'Exam Age Eligibility Calculator – SSC, UPSC, UP Police | ExamPhotoTools',
    description:
      'Calculate exact age in years, months, and days on any recruitment cut-off date with editable min/max limits and optional category relaxation.',
  },
  {
    path: '/about',
    title: 'About ExamPhotoTools – Privacy-First Exam Utilities',
    description:
      'Learn how ExamPhotoTools helps Indian government job aspirants prepare compliant photographs, signatures, and age checks locally in the browser.',
  },
  {
    path: '/contact',
    title: 'Contact ExamPhotoTools – Feedback & Corrections',
    description:
      'Reach out to the ExamPhotoTools team to report bugs, suggest new recruitment utilities, or share preset feedback.',
  },
  {
    path: '/privacy-policy',
    title: 'Privacy Policy – Local Browser Processing | ExamPhotoTools',
    description:
      'Read our privacy policy: all image resizing, cropping, and compression happen locally in your browser with zero server uploads.',
  },
  {
    path: '/terms-and-conditions',
    title: 'Terms and Conditions | ExamPhotoTools',
    description:
      'Terms of use for ExamPhotoTools free browser-based photo, signature, and age eligibility calculators.',
  },
  {
    path: '/disclaimer',
    title: 'Official Notification Disclaimer | ExamPhotoTools',
    description:
      'Important disclaimer: ExamPhotoTools is an independent utility and is not affiliated with SSC, UPSC, UPPRPB, UPSSSC, or any government body.',
  },
];

function escapeHtmlAttr(str) {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

for (const route of routes) {
  const safeTitle = escapeHtmlAttr(route.title);
  const safeDesc = escapeHtmlAttr(route.description);
  const canonical = `${baseUrl}${route.path}`;

  let html = template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${safeTitle}</title>`)
    .replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/, `<meta name="description" content="${safeDesc}" />`)
    .replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${safeTitle}" />`)
    .replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/, `<meta property="og:description" content="${safeDesc}" />`)
    .replace(/<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/, `<meta name="twitter:title" content="${safeTitle}" />`)
    .replace(/<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/, `<meta name="twitter:description" content="${safeDesc}" />`)
    .replace(
      '</head>',
      `  <link rel="canonical" href="${canonical}" />\n    <meta property="og:url" content="${canonical}" />\n  </head>`
    );

  const routeDir = path.join(distDir, route.path.replace(/^\//, ''));
  fs.mkdirSync(routeDir, { recursive: true });
  fs.writeFileSync(path.join(routeDir, 'index.html'), html, 'utf-8');
}

console.log(`Generated static SEO entry HTML for ${routes.length} routes.`);
