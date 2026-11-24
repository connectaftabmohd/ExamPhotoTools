import { Link } from 'react-router-dom';
import { FileCheck2, ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-[#09172B] text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2.5 text-lg font-bold text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1D4ED8] text-white">
                <FileCheck2 className="h-4.5 w-4.5" aria-hidden="true" />
              </span>
              <span>ExamPhotoTools</span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Free Photo, Signature &amp; Exam Form Tools for Indian government recruitment candidates.
            </p>
            <div className="mt-4 flex items-start gap-2 text-xs text-slate-400">
              <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" aria-hidden="true" />
              <span>100% browser-local processing. Zero image uploads to external servers.</span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Photo &amp; Signature Tools</h3>
            <ul className="mt-3 space-y-2.5 text-sm">
              <li>
                <Link to="/ssc-photo-resizer" className="hover:text-white transition-colors">
                  SSC Photo Resizer
                </Link>
              </li>
              <li>
                <Link to="/upsc-photo-signature-resizer" className="hover:text-white transition-colors">
                  UPSC Photo &amp; Signature
                </Link>
              </li>
              <li>
                <Link to="/up-police-photo-resizer" className="hover:text-white transition-colors">
                  UP Police Photo Resizer
                </Link>
              </li>
              <li>
                <Link to="/upsssc-photo-resizer" className="hover:text-white transition-colors">
                  UPSSSC Photo Resizer
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Form Utilities</h3>
            <ul className="mt-3 space-y-2.5 text-sm">
              <li>
                <Link to="/passport-photo-maker" className="hover:text-white transition-colors">
                  Passport Photo Maker
                </Link>
              </li>
              <li>
                <Link to="/signature-resizer" className="hover:text-white transition-colors">
                  Signature Resizer
                </Link>
              </li>
              <li>
                <Link to="/age-calculator" className="hover:text-white transition-colors">
                  Age Eligibility Calculator
                </Link>
              </li>
              <li>
                <Link to="/tools" className="hover:text-white transition-colors">
                  Browse All Tools
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Information &amp; Policies</h3>
            <ul className="mt-3 space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About ExamPhotoTools
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-and-conditions" className="hover:text-white transition-colors">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="hover:text-white transition-colors">
                  Official Notification Disclaimer
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-slate-800 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} ExamPhotoTools. Built for Indian government job aspirants.</p>
          <p>Timezone: Asia/Kolkata (IST) · Always verify specifications in official exam notifications.</p>
        </div>
      </div>
    </footer>
  );
}
