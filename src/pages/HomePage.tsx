import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, CheckCircle2, Lock, Search, ShieldCheck, Sliders, Zap } from 'lucide-react';
import { ALL_TOOLS, EXAM_CATEGORIES, HOME_FAQS } from '@/src/data/routesMeta';
import { usePageMeta } from '@/src/hooks/usePageMeta';
import { ToolCard } from '@/src/components/ToolCard';
import { FAQSection } from '@/src/components/FAQSection';

const POPULAR_LINKS = [
  { label: 'SSC Photo Resizer', to: '/ssc-photo-resizer' },
  { label: 'UPSC Photo & Signature', to: '/upsc-photo-signature-resizer' },
  { label: 'Passport Photo Maker', to: '/passport-photo-maker' },
  { label: 'Age Calculator', to: '/age-calculator' },
];

const PREPARATION_GUIDES = [
  {
    title: 'How to Avoid Photograph Rejection in SSC & State Recruitment Portals',
    readTime: '4 min read',
    category: 'Photo Guidelines',
    summary:
      'Learn why portals reject uploads for wrong aspect ratio, shadows behind the head, or oversized KB files—and how to inspect final dimensions before submitting.',
    to: '/ssc-photo-resizer',
  },
  {
    title: 'Preparing Crisp Handwritten Signatures on White Paper Without Blur',
    readTime: '3 min read',
    category: 'Signature Prep',
    summary:
      'Use black or blue ballpoint ink on unruled paper in even daylight, crop close to the strokes, and convert PNGs cleanly to white-background JPGs.',
    to: '/signature-resizer',
  },
  {
    title: 'Understanding Cut-off Dates, Leap Years & Category Age Relaxation',
    readTime: '5 min read',
    category: 'Eligibility Rules',
    summary:
      'How commissions calculate exact completed age on January 1, July 1, or August 1 cut-off dates, and why inclusive versus exclusive boundaries matter.',
    to: '/age-calculator',
  },
];

export function HomePage() {
  usePageMeta({ routePath: '/', faqs: HOME_FAQS });
  const [searchQuery, setSearchQuery] = useState('');
  const [heroImgFailed, setHeroImgFailed] = useState(false);
  const [photoGuideFailed, setPhotoGuideFailed] = useState(false);
  const [signGuideFailed, setSignGuideFailed] = useState(false);
  const navigate = useNavigate();

  const matchingTools = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return ALL_TOOLS.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.examTag.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (matchingTools.length > 0) {
      navigate(matchingTools[0].path);
    } else if (searchQuery.trim()) {
      navigate('/tools');
    }
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="border-b border-slate-200 bg-gradient-to-b from-[#F4F8FD] to-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-stretch">
            <div className="lg:col-span-7 flex flex-col justify-center">
              <p className="text-xs sm:text-sm font-semibold text-[#1D4ED8]">
                100% Free · Browser-Local Processing · No Sign-Up Required
              </p>

              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0F294A] sm:text-5xl leading-[1.12] balance-text">
                Free Online Exam Form Photo &amp; Signature Resizer
              </h1>

              <p className="mt-4 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-600">
                Resize, crop and compress your photographs and signatures for government job applications in seconds.
              </p>

              {/* Search Tools Input */}
              <form onSubmit={handleSearchSubmit} className="relative mt-6 max-w-xl" role="search" aria-label="Search exam form tools">
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <div className="relative flex-1">
                    <Search
                      className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400"
                      aria-hidden="true"
                    />
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search tools (e.g., SSC, UPSC, Passport, Signature, Age)..."
                      aria-label="Search tools"
                      className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-[#0F294A] placeholder:text-slate-400 shadow-xs focus:border-[#1D4ED8] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 min-h-[46px]"
                    />
                  </div>
                  <Link
                    to="/tools"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1D4ED8] px-5 py-3 text-sm font-semibold text-white hover:bg-[#1E40AF] transition-colors whitespace-nowrap shrink-0 min-h-[46px]"
                  >
                    <span>Explore Tools</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>

                {searchQuery.trim() && (
                  <div className="mt-2 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                    {matchingTools.length > 0 ? (
                      <ul className="divide-y divide-slate-100">
                        {matchingTools.map((tool) => (
                          <li key={tool.id}>
                            <Link
                              to={tool.path}
                              className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-[#EFF6FF]"
                            >
                              <div>
                                <div className="font-semibold text-[#0F294A]">{tool.title}</div>
                                <div className="text-xs text-slate-500">{tool.examTag}</div>
                              </div>
                              <ArrowRight className="h-4 w-4 text-[#1D4ED8] shrink-0" aria-hidden="true" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="px-3 py-2 text-xs text-slate-500">
                        No exact tool match.{' '}
                        <Link to="/tools" className="font-semibold text-[#1D4ED8] hover:underline">
                          View all 7 tools
                        </Link>
                        .
                      </p>
                    )}
                  </div>
                )}
              </form>

              {/* Popular Tools */}
              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm">
                <span className="font-semibold text-slate-700">Popular tools:</span>
                {POPULAR_LINKS.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="font-medium text-[#1D4ED8] hover:text-[#1E40AF] hover:underline whitespace-nowrap"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 flex">
              <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-xs">
                {!heroImgFailed ? (
                  <img
                    src="/src/assets/images/hero_exam_prep_1795527282443.jpg"
                    alt="Clean study desk with laptop, application form sheet, and pen ready for government exam form submission"
                    referrerPolicy="no-referrer"
                    onError={() => setHeroImgFailed(true)}
                    className="h-full min-h-[240px] w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full min-h-[260px] flex-col items-center justify-center bg-[#0F294A] p-8 text-center text-white">
                    <ShieldCheck className="h-10 w-10 text-blue-300" aria-hidden="true" />
                    <p className="mt-3 text-base font-semibold">Privacy-First Form Preparation</p>
                    <p className="mt-1 text-xs text-slate-300">All Canvas processing runs locally in your browser.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tools Grid */}
      <section aria-labelledby="featured-tools-heading" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="featured-tools-heading" className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F294A]">
              Featured Exam Form Utilities
            </h2>
            <p className="mt-1.5 text-sm sm:text-base text-slate-600">
              Select a utility below to crop, resize, compress to exact KB, or verify age eligibility.
            </p>
          </div>
          <Link
            to="/tools"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1D4ED8] hover:underline whitespace-nowrap shrink-0"
          >
            <span>View All Tools</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ALL_TOOLS.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      {/* Browse by Examination */}
      <section aria-labelledby="browse-exam-heading" className="border-y border-slate-200 bg-[#F4F8FD]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 id="browse-exam-heading" className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F294A]">
            Browse by Examination
          </h2>
          <p className="mt-1.5 text-sm sm:text-base text-slate-600">
            Jump directly to dedicated tools tailored for India&apos;s major central and state recruitment boards.
          </p>

          <div className="mt-8 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
            {EXAM_CATEGORIES.map((cat) => (
              <div
                key={cat.name}
                className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between hover:bg-slate-50/70 transition-colors"
              >
                <div>
                  <h3 className="text-base font-bold text-[#0F294A]">{cat.name}</h3>
                  <p className="mt-0.5 text-sm text-slate-600">{cat.exams}</p>
                </div>
                <Link
                  to={cat.toolPath}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1D4ED8] hover:underline whitespace-nowrap shrink-0"
                >
                  <span>{cat.ctaLabel}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Resize Photograph & Signature */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
            {!photoGuideFailed ? (
              <img
                src="/src/assets/images/guide_photo_framing_1795527281246.jpg"
                alt="Portrait studio lighting and plain backdrop setup for passport photograph preparation"
                referrerPolicy="no-referrer"
                onError={() => setPhotoGuideFailed(true)}
                className="aspect-4/3 w-full object-cover"
              />
            ) : (
              <div className="flex aspect-4/3 items-center justify-center bg-[#EFF6FF] p-6 text-sm font-medium text-[#0F294A]">
                Photograph Framing Guide
              </div>
            )}
          </div>
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-[#0F294A]">How to Resize Your Photograph</h2>
            <p className="text-sm sm:text-base leading-relaxed text-slate-600">
              Follow these four steps before uploading your photograph to SSC, UPSC, UP Police, UPSSSC, or Railway
              portals:
            </p>
            <ol className="space-y-3 text-sm text-slate-700">
              <li className="flex gap-3">
                <span className="font-mono font-bold text-[#1D4ED8]">01.</span>
                <span>Check the official recruitment notification for exact pixel width, height, and KB range.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-mono font-bold text-[#1D4ED8]">02.</span>
                <span>Upload your recent front-facing photo taken against a plain light background.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-mono font-bold text-[#1D4ED8]">03.</span>
                <span>Crop and center your face &amp; shoulders using the interactive drag, zoom, and rotate controls.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-mono font-bold text-[#1D4ED8]">04.</span>
                <span>Enter your target dimensions and Max KB, verify the actual output file size, and download.</span>
              </li>
            </ol>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center border-t border-slate-200 pt-12">
          <div className="lg:col-span-7 space-y-4 order-2 lg:order-1">
            <h2 className="text-2xl font-bold tracking-tight text-[#0F294A]">How to Resize Your Signature</h2>
            <p className="text-sm sm:text-base leading-relaxed text-slate-600">
              Portals frequently reject blurry or oversized signature scans. Prepare a crisp, compliant signature image
              in seconds:
            </p>
            <ol className="space-y-3 text-sm text-slate-700">
              <li className="flex gap-3">
                <span className="font-mono font-bold text-[#1D4ED8]">01.</span>
                <span>Sign with a black or dark-blue pen on clean, unruled white paper in bright daylight.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-mono font-bold text-[#1D4ED8]">02.</span>
                <span>Open the Signature Resizer or UPSC Dual Resizer and upload your photo or scan.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-mono font-bold text-[#1D4ED8]">03.</span>
                <span>Crop tightly around the signature, rotate if tilted, and choose JPG with white background.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-mono font-bold text-[#1D4ED8]">04.</span>
                <span>Keep &ldquo;Preserve Original Signature Appearance&rdquo; enabled or clean paper shading lightly, then download.</span>
              </li>
            </ol>
          </div>
          <div className="lg:col-span-5 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 order-1 lg:order-2">
            {!signGuideFailed ? (
              <img
                src="/src/assets/images/guide_signature_scan_1795527283044.jpg"
                alt="Overhead photograph of neat black ink signature on clean white unruled paper"
                referrerPolicy="no-referrer"
                onError={() => setSignGuideFailed(true)}
                className="aspect-4/3 w-full object-cover"
              />
            ) : (
              <div className="flex aspect-4/3 items-center justify-center bg-[#EFF6FF] p-6 text-sm font-medium text-[#0F294A]">
                Signature Preparation Guide
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Why Use ExamPhotoTools */}
      <section aria-labelledby="why-use-heading" className="border-y border-slate-200 bg-[#F4F8FD]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 id="why-use-heading" className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F294A]">
            Why Use ExamPhotoTools?
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <Lock className="h-6 w-6 text-[#1D4ED8]" aria-hidden="true" />
              <h3 className="mt-4 text-base font-bold text-[#0F294A]">100% Local Privacy</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Your photos and signatures stay on your phone or computer. Nothing is uploaded to external servers.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <Zap className="h-6 w-6 text-[#1D4ED8]" aria-hidden="true" />
              <h3 className="mt-4 text-base font-bold text-[#0F294A]">True KB Compression</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Iterative Canvas Blob encoding verifies real output file sizes in KB rather than guessing quality values.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <Sliders className="h-6 w-6 text-[#1D4ED8]" aria-hidden="true" />
              <h3 className="mt-4 text-base font-bold text-[#0F294A]">No Invented Rules</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Configurable presets let you enter and save exact specs from the current notification without guesswork.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <CheckCircle2 className="h-6 w-6 text-emerald-600" aria-hidden="true" />
              <h3 className="mt-4 text-base font-bold text-[#0F294A]">Always Free</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                ₹0 cost, no accounts, no subscriptions, and no watermarks on single photos or printable A4 sheets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Exam Preparation Guides */}
      <section aria-labelledby="guides-heading" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-[#1D4ED8]" aria-hidden="true" />
          <h2 id="guides-heading" className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F294A]">
            Latest Exam Preparation Guides
          </h2>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {PREPARATION_GUIDES.map((guide) => (
            <article key={guide.title} className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-semibold text-[#1D4ED8]">{guide.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{guide.readTime}</span>
                </div>
                <h3 className="mt-3 text-lg font-bold text-[#0F294A]">{guide.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{guide.summary}</p>
              </div>
              <Link
                to={guide.to}
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1D4ED8] hover:underline"
              >
                <span>Open Related Utility</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <FAQSection items={HOME_FAQS} />
      </div>
    </div>
  );
}
