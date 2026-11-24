import { usePageMeta } from '@/src/hooks/usePageMeta';
import { Breadcrumbs } from '@/src/components/Breadcrumbs';

export function TermsPage() {
  usePageMeta({ routePath: '/terms-and-conditions' });

  return (
    <div className="bg-white">
      <section className="border-b border-slate-200 bg-[#F4F8FD]">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Terms & Conditions' }]} />
          <h1 className="text-3xl font-extrabold tracking-tight text-[#0F294A] sm:text-4xl">Terms and Conditions</h1>
          <p className="mt-3 text-base text-slate-600">Guidelines governing the use of ExamPhotoTools free utilities.</p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 space-y-6 text-sm sm:text-base leading-relaxed text-slate-700">
        <section className="space-y-2">
          <h2 className="text-xl font-bold text-[#0F294A]">1. Free Utility Access</h2>
          <p>
            ExamPhotoTools provides free browser-based utilities for cropping, resizing, compressing images, generating
            printable A4 sheets, and checking calendar age eligibility. No registration or payment is required.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="text-xl font-bold text-[#0F294A]">2. User Responsibility</h2>
          <p>
            You are solely responsible for verifying the exact photograph dimensions, file size in KB, image format,
            background color, and age eligibility rules published in the official recruitment notification before
            submitting any application.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="text-xl font-bold text-[#0F294A]">3. No Guarantee of Portal Acceptance</h2>
          <p>
            ExamPhotoTools provides tools &ldquo;as is&rdquo; without warranties of any kind. Different recruitment
            portals enforce automated and manual checks (such as facial clarity, spectacles, date stamps, or signature
            legibility) that remain the applicant&apos;s responsibility.
          </p>
        </section>
      </div>
    </div>
  );
}
