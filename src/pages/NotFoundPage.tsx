import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ALL_TOOLS } from '@/src/data/routesMeta';
import { usePageMeta } from '@/src/hooks/usePageMeta';

export function NotFoundPage() {
  usePageMeta({
    routePath: '/',
    customTitle: 'Page Not Found (404) | ExamFormTools',
    customDescription: 'The page you requested could not be found on ExamFormTools.',
  });

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <p className="font-mono text-sm font-semibold text-[#1D4ED8]">404 · Page Not Found</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#0F294A] sm:text-4xl">
          We couldn&apos;t find that page
        </h1>
        <p className="mt-3 text-base text-slate-600">
          The link may have moved or been typed incorrectly. Jump back to the homepage or pick one of our free exam
          form utilities below.
        </p>

        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg bg-[#1D4ED8] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1E40AF]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Back to Home</span>
          </Link>
          <Link
            to="/tools"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-[#0F294A] hover:bg-slate-50"
          >
            Explore All Tools
          </Link>
        </div>

        <div className="mt-12 border-t border-slate-200 pt-8 text-left">
          <h2 className="text-sm font-bold text-[#0F294A]">Quick Links to Tools</h2>
          <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 text-sm">
            {ALL_TOOLS.map((tool) => (
              <li key={tool.id}>
                <Link to={tool.path} className="text-[#1D4ED8] hover:underline">
                  {tool.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
