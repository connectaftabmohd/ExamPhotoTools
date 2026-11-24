import { Link } from 'react-router-dom';
import { ArrowRight, Lock, ShieldCheck, Sliders } from 'lucide-react';
import { usePageMeta } from '@/src/hooks/usePageMeta';
import { Breadcrumbs } from '@/src/components/Breadcrumbs';

export function AboutPage() {
  usePageMeta({ routePath: '/about' });

  return (
    <div className="bg-white">
      <section className="border-b border-slate-200 bg-[#F4F8FD]">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'About' }]} />
          <h1 className="text-3xl font-extrabold tracking-tight text-[#0F294A] sm:text-4xl">About ExamFormTools</h1>
          <p className="mt-3 text-base leading-relaxed text-slate-600">
            Free, privacy-first online utilities built for Indian government recruitment candidates preparing SSC, UPSC,
            UP Police, UPSSSC, Railway, and state examination applications.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 space-y-10 text-sm sm:text-base leading-relaxed text-slate-700">
        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-[#0F294A]">Why We Built ExamFormTools</h2>
          <p>
            Every year, millions of candidates across India fill out online forms for Staff Selection Commission (SSC),
            Union Public Service Commission (UPSC), Uttar Pradesh Police (UPPRPB), UPSSSC, RRB, and banking exams. A
            single mismatched pixel dimension, blurry signature, or oversized JPEG can delay or invalidate an application.
          </p>
          <p>
            Many random online resizers upload sensitive personal photographs to remote servers, add watermarks, or show
            outdated exam presets that contradict newly released notifications. ExamFormTools solves this by running
            everything inside your browser at zero cost (₹0).
          </p>
        </section>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-5">
            <Lock className="h-5 w-5 text-[#1D4ED8]" aria-hidden="true" />
            <h3 className="mt-3 text-base font-bold text-[#0F294A]">Local Browser Engine</h3>
            <p className="mt-1.5 text-sm text-slate-600">
              HTML Canvas, File API, Blob API, and Web Workers process your documents strictly on your device.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-5">
            <Sliders className="h-5 w-5 text-[#1D4ED8]" aria-hidden="true" />
            <h3 className="mt-3 text-base font-bold text-[#0F294A]">Honest Presets</h3>
            <p className="mt-1.5 text-sm text-slate-600">
              We never invent unverified exam dimensions. All fields remain editable to match active official notices.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-5">
            <ShieldCheck className="h-5 w-5 text-emerald-600" aria-hidden="true" />
            <h3 className="mt-3 text-base font-bold text-[#0F294A]">Always Free</h3>
            <p className="mt-1.5 text-sm text-slate-600">
              No login walls, no subscriptions, and no hidden fees for students or cyber-cafe operators.
            </p>
          </div>
        </div>

        <section className="space-y-3 border-t border-slate-200 pt-8">
          <h2 className="text-2xl font-bold text-[#0F294A]">Start Preparing Your Documents</h2>
          <p>Choose any utility from our catalog to resize photos, clean up signatures, or verify age eligibility.</p>
          <div className="pt-2">
            <Link
              to="/tools"
              className="inline-flex items-center gap-2 rounded-lg bg-[#1D4ED8] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1E40AF] transition-colors"
            >
              <span>Browse All Tools</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
