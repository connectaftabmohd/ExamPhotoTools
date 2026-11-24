import { ALL_TOOLS } from '@/src/data/routesMeta';
import { ToolCard } from '@/src/components/ToolCard';

export function RelatedTools({ currentToolId }: { currentToolId: string }) {
  const related = ALL_TOOLS.filter((t) => t.id !== currentToolId).slice(0, 3);

  return (
    <section aria-labelledby="related-tools-heading" className="py-10 border-t border-slate-200">
      <h2 id="related-tools-heading" className="text-2xl font-bold tracking-tight text-[#0F294A]">
        Related Exam Form Tools
      </h2>
      <p className="mt-1.5 text-sm text-slate-600">
        Complete your recruitment application with our other free browser-based utilities.
      </p>
      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
        {related.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </section>
  );
}
