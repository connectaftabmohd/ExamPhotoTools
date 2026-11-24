import { usePageMeta } from '@/src/hooks/usePageMeta';
import { Breadcrumbs } from '@/src/components/Breadcrumbs';

export function PrivacyPolicyPage() {
  usePageMeta({ routePath: '/privacy-policy' });

  return (
    <div className="bg-white">
      <section className="border-b border-slate-200 bg-[#F4F8FD]">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Privacy Policy' }]} />
          <h1 className="text-3xl font-extrabold tracking-tight text-[#0F294A] sm:text-4xl">Privacy Policy</h1>
          <p className="mt-3 text-base text-slate-600">
            How ExamPhotoTools handles your photographs, signatures, and personal form data.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 space-y-8 text-sm sm:text-base leading-relaxed text-slate-700">
        <section className="space-y-2.5">
          <h2 className="text-xl font-bold text-[#0F294A]">1. Local In-Browser Image Processing</h2>
          <p>
            Every image uploaded to ExamPhotoTools—including passport photographs, recruitment photographs, and
            handwritten signatures—is processed strictly locally inside your own web browser using native browser
            technologies (HTML Canvas API, File API, Blob API, and Web Workers).
          </p>
        </section>

        <section className="space-y-2.5">
          <h2 className="text-xl font-bold text-[#0F294A]">2. Zero Server Uploads</h2>
          <p>
            ExamPhotoTools does not upload your photographs, signatures, or Date of Birth inputs to our servers or any
            third-party external image-processing API. Your files never leave your device while using our tools.
          </p>
        </section>

        <section className="space-y-2.5">
          <h2 className="text-xl font-bold text-[#0F294A]">3. No Permanent Storage of Photographs or Signatures</h2>
          <p>
            ExamPhotoTools does not permanently store photographs or signatures. Temporary browser object URLs and canvas
            memory buffers used during editing are revoked and cleared when you click the Reset button, replace an
            image, or close/refresh the browser tab.
          </p>
        </section>

        <section className="space-y-2.5">
          <h2 className="text-xl font-bold text-[#0F294A]">4. Optional Local Preset Storage</h2>
          <p>
            If you explicitly choose to save custom numeric dimensions or KB limits inside the Configurable Preset
            Manager, only those numeric preset settings (not your images) are stored in your browser&apos;s{' '}
            <code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">localStorage</code>. You can clear
            them at any time using the &ldquo;Reset to Unset&rdquo; button.
          </p>
        </section>

        <section className="space-y-2.5">
          <h2 className="text-xl font-bold text-[#0F294A]">5. Guidance on Shared &amp; Public Devices</h2>
          <p>
            Because downloaded output files are saved directly to your device&apos;s Downloads folder by your browser,
            you should avoid using public, cyber-cafe, or shared computers for sensitive identity documents—or remember
            to permanently delete downloaded photographs and signatures from the shared machine once your form is
            submitted.
          </p>
        </section>
      </div>
    </div>
  );
}
