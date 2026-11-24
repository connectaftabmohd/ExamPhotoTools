import { AgeCalculator } from '@/src/components/AgeCalculator';
import { ToolPageShell } from '@/src/components/ToolPageShell';

const AGE_STEPS = [
  {
    title: 'Select Exam Context',
    detail: 'Choose SSC, UPSC, UP Police, UPSSSC, or Custom Notification to view the relevant official portal link.',
  },
  {
    title: 'Enter DOB & Cut-off Date',
    detail: 'Input your exact Date of Birth and the recruitment cut-off date stated in the official notification.',
  },
  {
    title: 'Configure Min/Max & Relaxation',
    detail: 'Type the minimum required age, maximum permitted age, and any explicit category relaxation years.',
  },
  {
    title: 'Check Exact Age & Margin',
    detail: 'View completed years, months, days, leap-year day count, and exact difference from min/max bounds.',
  },
];

const AGE_FAQS = [
  {
    question: 'Why does the Age Calculator not hardcode a universal age limit for SSC or UPSC?',
    answer:
      'Age limits vary widely across posts (for example, SSC MTS vs CGL vs CPO, or UPSC CSE vs NDA/CDS) and across categories. Leaving age fields editable ensures you check against the exact rules of your active notification.',
  },
  {
    question: 'Does the calculator handle February 29 leap-year birthdays?',
    answer:
      'Yes. The calendar difference algorithm computes exact month lengths and leap years accurately, including February 29 births and leap-year cut-off dates.',
  },
  {
    question: 'What is the difference between Inclusive and Exclusive boundary rules?',
    answer:
      'Some notifications state a candidate "must have attained 18 years and must not have attained 27 years" (exclusive upper bound or specific birth-date bracket), while others allow exact boundary dates. You can toggle each rule to match your notification wording.',
  },
];

export function AgeCalculatorPage() {
  return (
    <ToolPageShell
      routePath="/age-calculator"
      toolId="age-calculator"
      breadcrumbLabel="Age Eligibility Calculator"
      h1="Age Eligibility Calculator"
      intro="Calculate your exact calendar age in years, months, and days on any recruitment cut-off date—accurate across leap years with editable min/max limits and category relaxation."
      stepsTitle="How to Check Recruitment Age Eligibility"
      steps={AGE_STEPS}
      faqs={AGE_FAQS}
    >
      <AgeCalculator />
    </ToolPageShell>
  );
}
