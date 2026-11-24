import { usePageMeta } from '@/src/hooks/usePageMeta';
import { Breadcrumbs } from '@/src/components/Breadcrumbs';

export function DisclaimerPage() {
  usePageMeta({ routePath: '/disclaimer' });

  return (
    <div className="bg-white">
      <section className="border-b border-slate-200 bg-[#F4F8FD]">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Disclaimer' }]} />
          <h1 className="text-3xl font-extrabold tracking-tight text-[#0F294A] sm:text-4xl">Disclaimer</h1>
          <p className="mt-3 text-base text-slate-600">
            Important notice regarding official government recruitment bodies and notification rules.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 space-y-6 text-sm sm:text-base leading-relaxed text-slate-700">
        <section className="space-y-2">
          <h2 className="text-xl font-bold text-[#0F294A]">No Government Affiliation</h2>
          <p>
            ExamPhotoTools is an independent, non-government online utility website. It is not affiliated with, endorsed
            by, or connected to the Staff Selection Commission (SSC), Union Public Service Commission (UPSC), Uttar
            Pradesh Police Recruitment &amp; Promotion Board (UPPRPB), UPSSSC, Railway Recruitment Boards (RRB), or any
            state or central government agency.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="text-xl font-bold text-[#0F294A]">Official Notifications Prevail</h2>
          <p>
            Recruitment requirements—including pixel dimensions, file size limits, age cut-off dates, and category
            relaxation rules—change from notification to notification. Always refer to the official advertisement
            published on the respective commission&apos;s official website before uploading files or determining
            eligibility.
          </p>
        </section>
      </div>
    </div>
  );
}
