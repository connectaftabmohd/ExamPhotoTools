import type { ReactNode } from 'react';
import { Breadcrumbs } from '@/src/components/Breadcrumbs';
import { FAQSection, type FAQItem } from '@/src/components/FAQSection';
import { RelatedTools } from '@/src/components/RelatedTools';
import { usePageMeta } from '@/src/hooks/usePageMeta';

interface ToolPageShellProps {
  routePath: string;
  toolId: string;
  breadcrumbLabel: string;
  h1: string;
  intro: string;
  children: ReactNode;
  stepsTitle: string;
  steps: Array<{ title: string; detail: string }>;
  faqs: FAQItem[];
}

export function ToolPageShell({
  routePath,
  toolId,
  breadcrumbLabel,
  h1,
  intro,
  children,
  stepsTitle,
  steps,
  faqs,
}: ToolPageShellProps) {
  usePageMeta({ routePath, faqs });

  return (
    <div className="bg-white">
      <section className="border-b border-slate-200 bg-[#F4F8FD]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'All Tools', to: '/tools' }, { label: breadcrumbLabel }]} />
          <h1 className="text-3xl font-extrabold tracking-tight text-[#0F294A] sm:text-4xl balance-text">{h1}</h1>
          <p className="mt-2.5 max-w-3xl text-sm sm:text-base leading-relaxed text-slate-600">{intro}</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
        <section aria-label={`${h1} workspace`}>{children}</section>

        <section aria-labelledby="how-to-steps-heading" className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-6 sm:p-8">
          <h2 id="how-to-steps-heading" className="text-2xl font-bold tracking-tight text-[#0F294A]">
            {stepsTitle}
          </h2>
          <ol className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, idx) => (
              <li key={step.title} className="space-y-1.5">
                <div className="text-xs font-semibold font-mono text-[#1D4ED8]">0{idx + 1}.</div>
                <h3 className="text-base font-bold text-[#0F294A]">{step.title}</h3>
                <p className="text-sm leading-relaxed text-slate-600">{step.detail}</p>
              </li>
            ))}
          </ol>
        </section>

        <FAQSection items={faqs} />

        <RelatedTools currentToolId={toolId} />
      </div>
    </div>
  );
}
