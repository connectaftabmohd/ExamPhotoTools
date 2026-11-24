import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface FAQItem {
  question: string;
  answer: string;
}

export function FAQSection({
  title = 'Frequently Asked Questions',
  subtitle,
  items,
}: {
  title?: string;
  subtitle?: string;
  items: FAQItem[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section aria-labelledby="faq-heading" className="py-10">
      <div className="max-w-3xl">
        <h2 id="faq-heading" className="text-2xl font-bold tracking-tight text-[#0F294A]">
          {title}
        </h2>
        {subtitle && <p className="mt-2 text-sm sm:text-base text-slate-600">{subtitle}</p>}
      </div>

      <div className="mt-6 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
        {items.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={item.question}>
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm sm:text-base font-semibold text-[#0F294A] hover:bg-slate-50/70 transition-colors focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#1D4ED8] min-h-[52px]"
              >
                <span>{item.question}</span>
                <ChevronDown
                  className={`h-4.5 w-4.5 shrink-0 text-slate-500 transition-transform duration-150 ${
                    isOpen ? 'rotate-180 text-[#1D4ED8]' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-sm leading-relaxed text-slate-600">{item.answer}</div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
