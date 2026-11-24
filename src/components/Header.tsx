import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FileCheck2, Menu, X } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Home', to: '/' },
  { label: 'All Tools', to: '/tools' },
  { label: 'SSC Tools', to: '/ssc-photo-resizer' },
  { label: 'UPSC Tools', to: '/upsc-photo-signature-resizer' },
  { label: 'UP Police Tools', to: '/up-police-photo-resizer' },
  { label: 'Age Calculator', to: '/age-calculator' },
  { label: 'About', to: '/about' },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-[#0F294A] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8] rounded-md"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0F294A] text-white">
            <FileCheck2 className="h-4.5 w-4.5" aria-hidden="true" />
          </span>
          <span>ExamFormTools</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-6" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `text-sm font-medium whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1D4ED8] ${
                  isActive
                    ? 'border-[#1D4ED8] text-[#0F294A]'
                    : 'border-transparent text-slate-600 hover:text-[#0F294A] hover:border-slate-300'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/tools"
            className="hidden sm:inline-flex items-center justify-center rounded-lg bg-[#1D4ED8] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1E40AF] transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
          >
            Explore Tools
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="inline-flex lg:hidden items-center justify-center rounded-lg border border-slate-200 p-2.5 text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-[#1D4ED8] min-h-[44px] min-w-[44px]"
          >
            {mobileOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          aria-label="Mobile navigation"
          className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 shadow-md"
        >
          <div className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2.5 text-sm font-medium transition-colors min-h-[44px] flex items-center ${
                    isActive
                      ? 'bg-[#EFF6FF] text-[#1D4ED8] font-semibold'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-[#0F294A]'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <div className="mt-2 pt-3 border-t border-slate-100">
              <Link
                to="/passport-photo-maker"
                onClick={() => setMobileOpen(false)}
                className="flex w-full items-center justify-center rounded-lg bg-[#1D4ED8] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1E40AF] min-h-[44px]"
              >
                Passport Photo Maker
              </Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
