import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { Header } from '@/src/components/Header';
import { Footer } from '@/src/components/Footer';
import { HomePage } from '@/src/pages/HomePage';

const ToolsIndexPage = lazy(() => import('@/src/pages/ToolsIndexPage').then((m) => ({ default: m.ToolsIndexPage })));
const SscPhotoResizerPage = lazy(() =>
  import('@/src/pages/SscPhotoResizerPage').then((m) => ({ default: m.SscPhotoResizerPage }))
);
const UpscToolPage = lazy(() => import('@/src/pages/UpscToolPage').then((m) => ({ default: m.UpscToolPage })));
const UpPoliceToolPage = lazy(() =>
  import('@/src/pages/UpPoliceToolPage').then((m) => ({ default: m.UpPoliceToolPage }))
);
const UpssscToolPage = lazy(() => import('@/src/pages/UpssscToolPage').then((m) => ({ default: m.UpssscToolPage })));
const PassportPhotoMakerPage = lazy(() =>
  import('@/src/pages/PassportPhotoMakerPage').then((m) => ({ default: m.PassportPhotoMakerPage }))
);
const SignatureResizerPage = lazy(() =>
  import('@/src/pages/SignatureResizerPage').then((m) => ({ default: m.SignatureResizerPage }))
);
const AgeCalculatorPage = lazy(() =>
  import('@/src/pages/AgeCalculatorPage').then((m) => ({ default: m.AgeCalculatorPage }))
);
const AboutPage = lazy(() => import('@/src/pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('@/src/pages/ContactPage').then((m) => ({ default: m.ContactPage })));
const PrivacyPolicyPage = lazy(() =>
  import('@/src/pages/PrivacyPolicyPage').then((m) => ({ default: m.PrivacyPolicyPage }))
);
const TermsPage = lazy(() => import('@/src/pages/TermsPage').then((m) => ({ default: m.TermsPage })));
const DisclaimerPage = lazy(() => import('@/src/pages/DisclaimerPage').then((m) => ({ default: m.DisclaimerPage })));
const NotFoundPage = lazy(() => import('@/src/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function PageFallback() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="h-8 w-64 animate-pulse rounded-lg bg-slate-200" />
      <div className="mt-4 h-4 w-96 max-w-full animate-pulse rounded bg-slate-100" />
      <div className="mt-8 h-64 w-full animate-pulse rounded-xl bg-slate-100" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="flex min-h-screen flex-col bg-white text-slate-900">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-[#0F294A] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to main content
        </a>

        <Header />

        <main id="main-content" className="flex-1">
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/tools" element={<ToolsIndexPage />} />
              <Route path="/ssc-photo-resizer" element={<SscPhotoResizerPage />} />
              <Route path="/upsc-photo-signature-resizer" element={<UpscToolPage />} />
              <Route path="/up-police-photo-resizer" element={<UpPoliceToolPage />} />
              <Route path="/upsssc-photo-resizer" element={<UpssscToolPage />} />
              <Route path="/passport-photo-maker" element={<PassportPhotoMakerPage />} />
              <Route path="/signature-resizer" element={<SignatureResizerPage />} />
              <Route path="/age-calculator" element={<AgeCalculatorPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms-and-conditions" element={<TermsPage />} />
              <Route path="/disclaimer" element={<DisclaimerPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}
