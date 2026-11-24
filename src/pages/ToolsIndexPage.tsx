import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { ALL_TOOLS, type ToolSummary } from '@/src/data/routesMeta';
import { usePageMeta } from '@/src/hooks/usePageMeta';
import { Breadcrumbs } from '@/src/components/Breadcrumbs';
import { ToolCard } from '@/src/components/ToolCard';

const CATEGORIES: Array<'All' | ToolSummary['category']> = [
  'All',
  'Photo',
  'Photo & Signature',
  'Passport',
  'Signature',
  'Eligibility',
];

export function ToolsIndexPage() {
  usePageMeta({ routePath: '/tools' });
  const [category, setCategory] = useState<'All' | ToolSummary['category']>('All');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ALL_TOOLS.filter((tool) => {
      const catOk = category === 'All' || tool.category === category;
      const textOk =
        !q ||
        tool.title.toLowerCase().includes(q) ||
        tool.examTag.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q);
      return catOk && textOk;
    });
  }, [category, query]);

  return (
    <div className="bg-white">
      <section className="border-b border-slate-200 bg-[#F4F8FD]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'All Tools' }]} />
          <h1 className="text-3xl font-extrabold tracking-tight text-[#0F294A] sm:text-4xl">
            All Indian Exam Form Preparation Tools
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm sm:text-base text-slate-600">
            Free, local browser utilities to resize photographs, prepare signatures, print A4 passport sheets, and
            verify age eligibility.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-1.5 rounded-xl bg-slate-100 p-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                  category === cat ? 'bg-white text-[#0F294A] shadow-xs' : 'text-slate-600 hover:text-[#0F294A]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-80">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter tools by exam or keyword..."
              aria-label="Filter tools"
              className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-[#0F294A] focus:border-[#1D4ED8] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20"
            />
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center">
            <p className="text-sm text-slate-600">No tools matched your filter.</p>
            <button
              type="button"
              onClick={() => {
                setCategory('All');
                setQuery('');
              }}
              className="mt-3 text-sm font-semibold text-[#1D4ED8] hover:underline"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
