import { useMemo, useState } from 'react';
import { AlertTriangle, CalendarCheck2, CheckCircle2, ExternalLink, Info, RotateCcw, XCircle } from 'lucide-react';
import { calculateAgeEligibility, type BoundaryRule } from '@/src/utils/ageCalculator';

interface ExamShortcut {
  id: string;
  label: string;
  officialPortal: string;
  officialLabel: string;
  note: string;
}

const EXAM_SHORTCUTS: ExamShortcut[] = [
  {
    id: 'custom',
    label: 'Custom Notification',
    officialPortal: 'https://ncs.gov.in',
    officialLabel: 'National Career Service',
    note: 'Enter the exact cut-off date, minimum age, maximum age, and category relaxation from your recruitment advertisement.',
  },
  {
    id: 'ssc',
    label: 'SSC',
    officialPortal: 'https://ssc.gov.in',
    officialLabel: 'ssc.gov.in',
    note: 'SSC posts (CGL, CHSL, MTS, GD, CPO) have varying age limits and cut-off dates (e.g. Jan 1 or Aug 1) depending on post group and notification.',
  },
  {
    id: 'upsc',
    label: 'UPSC',
    officialPortal: 'https://upsc.gov.in',
    officialLabel: 'upsc.gov.in',
    note: 'UPSC examinations (CSE, CDS, NDA, CAPF) prescribe post-specific age ranges and exact birth-date brackets in each exam notice.',
  },
  {
    id: 'up-police',
    label: 'UP Police',
    officialPortal: 'https://uppbpb.gov.in',
    officialLabel: 'uppbpb.gov.in',
    note: 'UPPRPB Constable, SI, and Ministerial recruitments specify separate male/female and category relaxation limits per notification.',
  },
  {
    id: 'upsssc',
    label: 'UPSSSC',
    officialPortal: 'https://upsssc.gov.in',
    officialLabel: 'upsssc.gov.in',
    note: 'UPSSSC PET and Mains notifications specify exact cut-off dates (often July 1 of the recruitment year) and post-wise age brackets.',
  },
];

function getTodayKolkataIso(): string {
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return formatter.format(new Date());
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

export function AgeCalculator() {
  const [selectedExam, setSelectedExam] = useState<string>('custom');
  const [dob, setDob] = useState<string>('2001-05-15');
  const [cutoffDate, setCutoffDate] = useState<string>(() => getTodayKolkataIso());
  const [minAgeStr, setMinAgeStr] = useState<string>('');
  const [maxAgeStr, setMaxAgeStr] = useState<string>('');
  const [relaxationStr, setRelaxationStr] = useState<string>('0');
  const [minBoundary, setMinBoundary] = useState<BoundaryRule>('inclusive');
  const [maxBoundary, setMaxBoundary] = useState<BoundaryRule>('inclusive');

  const activeShortcut = EXAM_SHORTCUTS.find((s) => s.id === selectedExam) || EXAM_SHORTCUTS[0];

  const result = useMemo(() => {
    const minAgeYears = minAgeStr.trim() ? Number(minAgeStr) : null;
    const maxAgeYears = maxAgeStr.trim() ? Number(maxAgeStr) : null;
    const relaxationYears = relaxationStr.trim() ? Number(relaxationStr) : 0;

    return calculateAgeEligibility({
      dob,
      cutoffDate,
      minAgeYears,
      maxAgeYears,
      relaxationYears,
      minBoundary,
      maxBoundary,
    });
  }, [dob, cutoffDate, minAgeStr, maxAgeStr, relaxationStr, minBoundary, maxBoundary]);

  const handleReset = () => {
    setSelectedExam('custom');
    setDob('2001-05-15');
    setCutoffDate(getTodayKolkataIso());
    setMinAgeStr('');
    setMaxAgeStr('');
    setRelaxationStr('0');
    setMinBoundary('inclusive');
    setMaxBoundary('inclusive');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-xs sm:text-sm text-amber-900">
        <AlertTriangle className="h-4.5 w-4.5 shrink-0 text-amber-600 mt-0.5" aria-hidden="true" />
        <p>Age eligibility is subject to the official recruitment notification, category rules and prescribed cut-off date.</p>
      </div>

      {/* Examination Shortcuts */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-[#0F294A]">Select Examination Context</h2>
          <a
            href={activeShortcut.officialPortal}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-[#1D4ED8] hover:underline"
          >
            <span>Verify on {activeShortcut.officialLabel}</span>
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </a>
        </div>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Examination shortcuts">
          {EXAM_SHORTCUTS.map((exam) => {
            const active = selectedExam === exam.id;
            return (
              <button
                key={exam.id}
                type="button"
                onClick={() => setSelectedExam(exam.id)}
                className={`rounded-lg border px-3.5 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 min-h-[40px] ${
                  active
                    ? 'border-[#1D4ED8] bg-[#1D4ED8] text-white'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100'
                }`}
              >
                {exam.label}
              </button>
            );
          })}
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">{activeShortcut.note}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        {/* Inputs */}
        <div className="lg:col-span-6 rounded-xl border border-slate-200 bg-white p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#0F294A]">Dates &amp; Notification Age Rules</h2>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#0F294A]"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Reset</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="age-dob" className="block text-xs font-semibold text-slate-700">
                Date of Birth
              </label>
              <input
                id="age-dob"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-mono tabular-nums text-[#0F294A] focus:border-[#1D4ED8] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20"
              />
            </div>

            <div>
              <label htmlFor="age-cutoff" className="block text-xs font-semibold text-slate-700">
                Cut-off / Calculation Date
              </label>
              <input
                id="age-cutoff"
                type="date"
                value={cutoffDate}
                onChange={(e) => setCutoffDate(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-mono tabular-nums text-[#0F294A] focus:border-[#1D4ED8] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20"
              />
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-4">
            <p className="text-xs text-slate-600">
              Enter minimum and maximum age limits from your notification (leave blank if you only want exact age on the
              cut-off date).
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="age-min" className="block text-xs font-semibold text-slate-700">
                  Min Required Age (Yrs)
                </label>
                <input
                  id="age-min"
                  type="number"
                  min={0}
                  max={100}
                  inputMode="numeric"
                  placeholder="e.g. 18"
                  value={minAgeStr}
                  onChange={(e) => setMinAgeStr(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-mono tabular-nums text-[#0F294A] focus:border-[#1D4ED8] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20"
                />
              </div>

              <div>
                <label htmlFor="age-max" className="block text-xs font-semibold text-slate-700">
                  Max Permitted Age (Yrs)
                </label>
                <input
                  id="age-max"
                  type="number"
                  min={0}
                  max={100}
                  inputMode="numeric"
                  placeholder="e.g. 27"
                  value={maxAgeStr}
                  onChange={(e) => setMaxAgeStr(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-mono tabular-nums text-[#0F294A] focus:border-[#1D4ED8] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20"
                />
              </div>

              <div>
                <label htmlFor="age-relax" className="block text-xs font-semibold text-slate-700">
                  Age Relaxation (Yrs)
                </label>
                <input
                  id="age-relax"
                  type="number"
                  min={0}
                  max={50}
                  inputMode="numeric"
                  placeholder="0"
                  value={relaxationStr}
                  onChange={(e) => setRelaxationStr(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-mono tabular-nums text-[#0F294A] focus:border-[#1D4ED8] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="min-boundary" className="block text-xs font-medium text-slate-700">
                  Minimum Age Boundary Rule
                </label>
                <select
                  id="min-boundary"
                  value={minBoundary}
                  onChange={(e) => setMinBoundary(e.target.value as BoundaryRule)}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs sm:text-sm text-[#0F294A]"
                >
                  <option value="inclusive">Inclusive (exact min age allowed)</option>
                  <option value="exclusive">Exclusive (must exceed min age)</option>
                </select>
              </div>

              <div>
                <label htmlFor="max-boundary" className="block text-xs font-medium text-slate-700">
                  Maximum Age Boundary Rule
                </label>
                <select
                  id="max-boundary"
                  value={maxBoundary}
                  onChange={(e) => setMaxBoundary(e.target.value as BoundaryRule)}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs sm:text-sm text-[#0F294A]"
                >
                  <option value="inclusive">Inclusive (exact max age allowed)</option>
                  <option value="exclusive">Exclusive (must be strictly below max)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-6 rounded-xl border border-slate-200 bg-white p-5 sm:p-6 space-y-5">
          <h2 className="text-lg font-bold text-[#0F294A]">Calculated Age &amp; Eligibility Result</h2>

          {!result.valid ? (
            <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">
              <XCircle className="h-5 w-5 shrink-0 text-red-600 mt-0.5" aria-hidden="true" />
              <p>{result.errorMessage}</p>
            </div>
          ) : (
            <>
              <div
                className={`flex items-start gap-3 rounded-xl border p-4 ${
                  result.status === 'eligible'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-950'
                    : result.status === 'underage' || result.status === 'overage'
                      ? 'border-red-200 bg-red-50 text-red-950'
                      : 'border-blue-200 bg-[#EFF6FF] text-[#0F294A]'
                }`}
              >
                {result.status === 'eligible' ? (
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" aria-hidden="true" />
                ) : result.status === 'underage' || result.status === 'overage' ? (
                  <XCircle className="h-5 w-5 shrink-0 text-red-600 mt-0.5" aria-hidden="true" />
                ) : (
                  <Info className="h-5 w-5 shrink-0 text-[#1D4ED8] mt-0.5" aria-hidden="true" />
                )}
                <div>
                  <p className="text-sm font-bold">{result.statusLabel}</p>
                  <p className="mt-1 text-xs sm:text-sm leading-relaxed">{result.statusDetail}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-3.5 text-center">
                  <div className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums text-[#0F294A]">
                    {result.years}
                  </div>
                  <div className="mt-1 text-xs font-medium text-slate-600">Completed Years</div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-3.5 text-center">
                  <div className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums text-[#0F294A]">
                    {result.months}
                  </div>
                  <div className="mt-1 text-xs font-medium text-slate-600">Remaining Months</div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-3.5 text-center">
                  <div className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums text-[#0F294A]">
                    {result.days}
                  </div>
                  <div className="mt-1 text-xs font-medium text-slate-600">Remaining Days</div>
                </div>
              </div>

              <dl className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm">
                <div className="flex items-center justify-between gap-4 px-4 py-3">
                  <dt className="text-slate-600">Total Age in Days (leap years included)</dt>
                  <dd className="font-mono font-semibold tabular-nums text-[#0F294A]">
                    {result.totalDays.toLocaleString('en-IN')} days
                  </dd>
                </div>

                {result.diffFromMin && (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 px-4 py-3">
                    <dt className="text-slate-600">Difference from Minimum Age</dt>
                    <dd className="font-mono font-medium tabular-nums text-[#0F294A]">{result.diffFromMin}</dd>
                  </div>
                )}

                {result.diffFromMax && (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 px-4 py-3">
                    <dt className="text-slate-600">Difference from Maximum Age</dt>
                    <dd className="font-mono font-medium tabular-nums text-[#0F294A]">{result.diffFromMax}</dd>
                  </div>
                )}

                {(result.minBirthDateAllowed || result.maxBirthDateAllowed) && (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 px-4 py-3">
                    <dt className="flex items-center gap-1.5 text-slate-600">
                      <CalendarCheck2 className="h-4 w-4 text-[#1D4ED8]" aria-hidden="true" />
                      <span>Reference DOB Window (Inclusive)</span>
                    </dt>
                    <dd className="font-mono text-xs font-medium tabular-nums text-[#0F294A]">
                      {result.minBirthDateAllowed || 'Any'} to {result.maxBirthDateAllowed || 'Any'}
                    </dd>
                  </div>
                )}
              </dl>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
