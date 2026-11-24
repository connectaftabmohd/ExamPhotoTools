# ExamPhotoTools

Free, browser-native photo, signature, and age eligibility utilities built for Indian government recruitment form applicants (SSC, UPSC, UP Police, UPSSSC, Railways, and more).

## Privacy & Processing Guarantee

All image cropping, resizing, format conversion, and KB-target compression run locally inside your browser using the HTML Canvas API, File API, Blob API, and Web Workers (`OffscreenCanvas` with main-thread fallback). No images or personal dates are uploaded to any external server.

## Configurable Presets

All examination presets live in `src/config/examPresets.ts`. Unverified official requirements remain `null` (unconfigured) by default and can be entered directly in any tool or updated via the built-in Preset Manager (`localStorage` overrides) when a new official notification is released.

## Development

```bash
npm install
npm run dev
```

## Production Build & Static Prerendering

```bash
npm run build
```

The production build compiles the static Vite bundle into `dist/` and generates route-specific static HTML entry pages (`dist/<route>/index.html`) with route-specific SEO `<title>`, `<meta name="description">`, `<link rel="canonical">`, OpenGraph, and Schema.org JSON-LD metadata.

## Free Static Deployment

Deploy `dist/` to any static host with zero backend or API keys required:

- **Netlify**: Drag & drop `dist/` or connect your Git repository (`netlify.toml` and `public/_redirects` included).
- **Cloudflare Pages**: Build command `npm run build`, output directory `dist`.
- **Vercel / GitHub Pages**: Serve `dist/` as a static SPA.
