export type BoundaryRule = 'inclusive' | 'exclusive';

export interface AgeCalculationInput {
  dob: string; // YYYY-MM-DD
  cutoffDate: string; // YYYY-MM-DD
  minAgeYears: number | null;
  maxAgeYears: number | null;
  relaxationYears: number;
  minBoundary: BoundaryRule;
  maxBoundary: BoundaryRule;
}

export interface AgeDifference {
  years: number;
  months: number;
  days: number;
  isAtOrAbove: boolean;
}

export interface AgeCalculationResult {
  valid: boolean;
  errorMessage?: string;
  years: number;
  months: number;
  days: number;
  totalDays: number;
  effectiveMaxAgeYears: number | null;
  status: 'eligible' | 'underage' | 'overage' | 'calculated_only';
  statusLabel: string;
  statusDetail: string;
  diffFromMin: string | null;
  diffFromMax: string | null;
  minBirthDateAllowed: string | null;
  maxBirthDateAllowed: string | null;
}

function parseIsoDate(iso: string): { year: number; month: number; day: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const probe = new Date(Date.UTC(year, month - 1, day));
  if (
    probe.getUTCFullYear() !== year ||
    probe.getUTCMonth() !== month - 1 ||
    probe.getUTCDate() !== day
  ) {
    return null;
  }
  return { year, month, day };
}

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function daysInMonth(year: number, month1To12: number): number {
  const days = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return days[month1To12 - 1];
}

export function diffCalendarDates(
  start: { year: number; month: number; day: number },
  end: { year: number; month: number; day: number }
): { years: number; months: number; days: number; totalDays: number } {
  let years = end.year - start.year;
  let months = end.month - start.month;
  let days = end.day - start.day;

  if (days < 0) {
    let prevMonth = end.month - 1;
    let prevYear = end.year;
    if (prevMonth === 0) {
      prevMonth = 12;
      prevYear -= 1;
    }
    days += daysInMonth(prevYear, prevMonth);
    months -= 1;
  }

  if (months < 0) {
    months += 12;
    years -= 1;
  }

  const startUtc = Date.UTC(start.year, start.month - 1, start.day);
  const endUtc = Date.UTC(end.year, end.month - 1, end.day);
  const totalDays = Math.round((endUtc - startUtc) / (1000 * 60 * 60 * 24));

  return { years, months, days, totalDays };
}

function addYearsToDate(
  date: { year: number; month: number; day: number },
  deltaYears: number
): { year: number; month: number; day: number } {
  const targetYear = date.year + deltaYears;
  const maxDay = daysInMonth(targetYear, date.month);
  const clampedDay = Math.min(date.day, maxDay);
  return { year: targetYear, month: date.month, day: clampedDay };
}

function compareDates(
  a: { year: number; month: number; day: number },
  b: { year: number; month: number; day: number }
): number {
  if (a.year !== b.year) return a.year - b.year;
  if (a.month !== b.month) return a.month - b.month;
  return a.day - b.day;
}

function formatYmd(d: { year: number; month: number; day: number }): string {
  const mm = String(d.month).padStart(2, '0');
  const dd = String(d.day).padStart(2, '0');
  return `${d.year}-${mm}-${dd}`;
}

function formatYmdHuman(d: { year: number; month: number; day: number }): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${String(d.day).padStart(2, '0')} ${months[d.month - 1]} ${d.year}`;
}

function formatDuration(y: number, m: number, d: number): string {
  return `${y} yr${y === 1 ? '' : 's'} ${m} mo${m === 1 ? '' : 's'} ${d} day${d === 1 ? '' : 's'}`;
}

export function calculateAgeEligibility(input: AgeCalculationInput): AgeCalculationResult {
  const dob = parseIsoDate(input.dob);
  const cutoff = parseIsoDate(input.cutoffDate);

  if (!dob || !cutoff) {
    return {
      valid: false,
      errorMessage: 'Please enter valid calendar dates for both Date of Birth and Cut-off Date.',
      years: 0,
      months: 0,
      days: 0,
      totalDays: 0,
      effectiveMaxAgeYears: null,
      status: 'calculated_only',
      statusLabel: 'Invalid Dates',
      statusDetail: 'Check that both dates are valid calendar dates.',
      diffFromMin: null,
      diffFromMax: null,
      minBirthDateAllowed: null,
      maxBirthDateAllowed: null,
    };
  }

  if (compareDates(dob, cutoff) > 0) {
    return {
      valid: false,
      errorMessage: 'Date of Birth cannot be later than the Cut-off Date.',
      years: 0,
      months: 0,
      days: 0,
      totalDays: 0,
      effectiveMaxAgeYears: null,
      status: 'calculated_only',
      statusLabel: 'Date Order Error',
      statusDetail: 'Cut-off date must be on or after the Date of Birth.',
      diffFromMin: null,
      diffFromMax: null,
      minBirthDateAllowed: null,
      maxBirthDateAllowed: null,
    };
  }

  const exactAge = diffCalendarDates(dob, cutoff);
  const minAge = input.minAgeYears !== null && !Number.isNaN(input.minAgeYears) ? input.minAgeYears : null;
  const baseMax = input.maxAgeYears !== null && !Number.isNaN(input.maxAgeYears) ? input.maxAgeYears : null;
  const relaxation = Number.isFinite(input.relaxationYears) ? Math.max(0, input.relaxationYears) : 0;
  const effectiveMax = baseMax !== null ? baseMax + relaxation : null;

  let meetsMin = true;
  let meetsMax = true;
  let diffFromMin: string | null = null;
  let diffFromMax: string | null = null;
  let maxBirthDateAllowed: string | null = null;
  let minBirthDateAllowed: string | null = null;

  if (minAge !== null) {
    // Candidate must have reached minAge on or before cutoff
    const minMilestoneDate = addYearsToDate(dob, minAge);
    const cmp = compareDates(cutoff, minMilestoneDate); // >= 0 means reached minAge
    meetsMin = input.minBoundary === 'inclusive' ? cmp >= 0 : cmp > 0;

    // Latest eligible DOB for minAge
    const latestDob = addYearsToDate(cutoff, -minAge);
    maxBirthDateAllowed = formatYmdHuman(latestDob);

    if (cmp >= 0) {
      const overMin = diffCalendarDates(minMilestoneDate, cutoff);
      diffFromMin = `${formatDuration(overMin.years, overMin.months, overMin.days)} above minimum (${minAge} yrs)`;
    } else {
      const shortOfMin = diffCalendarDates(cutoff, minMilestoneDate);
      diffFromMin = `${formatDuration(shortOfMin.years, shortOfMin.months, shortOfMin.days)} below minimum (${minAge} yrs)`;
    }
  }

  if (effectiveMax !== null) {
    const maxMilestoneDate = addYearsToDate(dob, effectiveMax);
    const cmp = compareDates(cutoff, maxMilestoneDate); // <= 0 means not older than maxAge
    meetsMax = input.maxBoundary === 'inclusive' ? cmp <= 0 : cmp < 0;

    // Earliest eligible DOB for effectiveMax
    const earliestDob = addYearsToDate(cutoff, -effectiveMax);
    minBirthDateAllowed = formatYmdHuman(earliestDob);

    if (cmp <= 0) {
      const underMax = diffCalendarDates(cutoff, maxMilestoneDate);
      diffFromMax = `${formatDuration(underMax.years, underMax.months, underMax.days)} remaining before max (${effectiveMax} yrs)`;
    } else {
      const exceededMax = diffCalendarDates(maxMilestoneDate, cutoff);
      diffFromMax = `${formatDuration(exceededMax.years, exceededMax.months, exceededMax.days)} above maximum (${effectiveMax} yrs)`;
    }
  }

  let status: AgeCalculationResult['status'] = 'calculated_only';
  let statusLabel = 'Exact Age Calculated';
  let statusDetail = `On ${formatYmd(cutoff)}, your exact age is ${formatDuration(exactAge.years, exactAge.months, exactAge.days)}.`;

  if (minAge !== null || effectiveMax !== null) {
    if (!meetsMin) {
      status = 'underage';
      statusLabel = 'Not Eligible (Underage)';
      statusDetail = `Candidate has not reached the configured minimum age (${minAge} years, ${input.minBoundary}) as of ${formatYmdHuman(cutoff)}.`;
    } else if (!meetsMax) {
      status = 'overage';
      statusLabel = 'Not Eligible (Overage)';
      statusDetail = `Candidate exceeds the configured maximum age (${effectiveMax} years${relaxation > 0 ? ` including ${relaxation} yr relaxation` : ''}, ${input.maxBoundary}) as of ${formatYmdHuman(cutoff)}.`;
    } else {
      status = 'eligible';
      statusLabel = 'Eligible Under Configured Limits';
      statusDetail = `Matches your configured minimum/maximum age range as of ${formatYmdHuman(cutoff)}.`;
    }
  }

  return {
    valid: true,
    years: exactAge.years,
    months: exactAge.months,
    days: exactAge.days,
    totalDays: exactAge.totalDays,
    effectiveMaxAgeYears: effectiveMax,
    status,
    statusLabel,
    statusDetail,
    diffFromMin,
    diffFromMax,
    minBirthDateAllowed,
    maxBirthDateAllowed,
  };
}
