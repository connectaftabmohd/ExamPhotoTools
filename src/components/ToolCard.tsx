import { Link } from 'react-router-dom';
import { ArrowRight, Calculator, Camera, FileImage, PenTool, UserSquare2 } from 'lucide-react';
import type { ToolSummary } from '@/src/data/routesMeta';

function getCategoryIcon(category: ToolSummary['category']) {
  switch (category) {
    case 'Signature':
      return PenTool;
    case 'Passport':
      return UserSquare2;
    case 'Eligibility':
      return Calculator;
    case 'Photo & Signature':
      return FileImage;
    default:
      return Camera;
  }
}

export function ToolCard({ tool }: { tool: ToolSummary }) {
  const Icon = getCategoryIcon(tool.category);

  return (
    <Link
      to={tool.path}
      className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 transition-all duration-150 hover:border-[#1D4ED8]/50 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
    >
      <div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-[#1D4ED8]">{tool.category}</span>
            <span aria-hidden="true">·</span>
            <span>{tool.examTag}</span>
          </div>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#1D4ED8] group-hover:bg-[#1D4ED8] group-hover:text-white transition-colors">
            <Icon className="h-4.5 w-4.5" aria-hidden="true" />
          </span>
        </div>

        <h3 className="mt-4 text-lg font-bold text-[#0F294A] group-hover:text-[#1D4ED8] transition-colors">
          {tool.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{tool.description}</p>
      </div>

      <div className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-[#1D4ED8]">
        <span>Open Tool</span>
        <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-1" aria-hidden="true" />
      </div>
    </Link>
  );
}
