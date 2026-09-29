import { PlanInputs, PlanMetric, PlanRecommendation } from '../types';

export function calculatePlanRecommendation(
  inputs: PlanInputs,
  userId: string,
  borrowerName: string
): PlanRecommendation {
  const {
    loanBalance,
    income,
    familySize = 1,
    pslfPaymentsMade = 0,
    hasPre2014Loans,
    isSelfEmployed,
    hasPslfBuyback,
    filingStatus,
  } = inputs;

  // 2026 Federal Poverty Guideline (contiguous US)
  const basePoverty = 15650;
  const perPerson = 5380;
  const fpl = basePoverty + (Math.max(1, familySize) - 1) * perPerson;

  // 1. Standard 10-year Plan Calculation (standard amortization at ~6.8%)
  const monthlyRate = 0.068 / 12;
  const numPayments = 120;
  const standardMonthly = Math.round(
    (loanBalance * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
      (Math.pow(1 + monthlyRate, numPayments) - 1)
  );

  // 2. IBR Calculation:
  // Dec 2025 rule update removed the partial financial hardship gate.
  // 150% FPL discretionary income.
  // Rate: 10% of discretionary income for new borrowers post-2014, 15% for pre-2014.
  const ibrDiscretionary = Math.max(0, income - fpl * 1.5);
  const ibrRate = hasPre2014Loans ? 0.15 : 0.10;
  const ibrMonthly = Math.max(0, Math.round((ibrDiscretionary * ibrRate) / 12));

  // 3. RAP Calculation (Repayment Assistance Plan, launched July 2026):
  // 225% of FPL protected income, 10% of discretionary income.
  const rapDiscretionary = Math.max(0, income - fpl * 2.25);
  const rapMonthly = Math.max(0, Math.round((rapDiscretionary * 0.10) / 12));

  // PSLF payments remaining (120 total)
  const pslfMonthsRemaining = Math.max(0, 120 - pslfPaymentsMade);

  // Pay before forgiveness calculations
  const ibrTotalBeforeForgiveness = pslfMonthsRemaining > 0 
    ? ibrMonthly * pslfMonthsRemaining 
    : ibrMonthly * 240; // 20-yr standard IDR forgiveness

  const rapTotalBeforeForgiveness = pslfMonthsRemaining > 0 
    ? rapMonthly * pslfMonthsRemaining 
    : rapMonthly * 240;

  const standardTotalBeforeForgiveness = pslfMonthsRemaining > 0 
    ? standardMonthly * pslfMonthsRemaining 
    : standardMonthly * 120;

  const estimatedForgiven = Math.max(
    0,
    Math.round(loanBalance - (ibrMonthly * pslfMonthsRemaining * 0.4))
  );

  const ibrMetric: PlanMetric = {
    planName: 'Income-Based Repayment',
    code: 'IBR',
    monthlyPayment: ibrMonthly,
    countsTowardPslf: true,
    totalBeforeForgiveness: ibrTotalBeforeForgiveness,
    monthsToForgiveness: pslfMonthsRemaining,
    estimatedForgivenAmount: estimatedForgiven,
    taxNotes: 'PSLF forgiveness is 100% tax-free at federal level (IRC Sec 108(f)).',
  };

  const rapMetric: PlanMetric = {
    planName: 'Repayment Assistance Plan',
    code: 'RAP',
    monthlyPayment: rapMonthly,
    countsTowardPslf: true,
    totalBeforeForgiveness: rapTotalBeforeForgiveness,
    monthsToForgiveness: pslfMonthsRemaining,
    estimatedForgivenAmount: estimatedForgiven,
    taxNotes: 'PSLF forgiveness is tax-free. Non-PSLF IDR forgiveness taxability depends on post-2025 extension rules.',
  };

  const standardMetric: PlanMetric = {
    planName: 'Standard Repayment (10-Year)',
    code: 'Standard',
    monthlyPayment: standardMonthly,
    countsTowardPslf: true,
    totalBeforeForgiveness: standardTotalBeforeForgiveness,
    monthsToForgiveness: pslfMonthsRemaining,
    estimatedForgivenAmount: 0,
    taxNotes: 'Standard 10-year pays full principal & interest. Counts toward PSLF only on Direct consolidated/original loans.',
  };

  // Complex case flags
  const flags: string[] = [];
  if (hasPre2014Loans) flags.push('Pre-2014 Loans (15% IBR tier)');
  if (filingStatus === 'married_filing_separately') flags.push('Married Filing Separately (Spousal income exclusion)');
  if (isSelfEmployed) flags.push('Self-Employed / 1099 Income (Schedule C deductions)');
  if (hasPslfBuyback) flags.push('PSLF Buyback eligibility review');

  // Decision logic: which is best?
  let ourPick: 'IBR' | 'RAP' | 'Standard' = 'IBR';
  let rationale = '';

  if (pslfMonthsRemaining > 0) {
    // Under PSLF, cheapest payment wins because remaining balance is forgiven tax-free!
    if (ibrMonthly <= rapMonthly && ibrMonthly <= standardMonthly) {
      ourPick = 'IBR';
      rationale = `IBR. Since the hardship requirement was removed in December 2025, you qualify. It's your lowest payment, every payment counts toward PSLF, and in ${pslfMonthsRemaining} months your remaining balance is forgiven tax-free. Filing the switch now protects your deadline.`;
    } else if (rapMonthly <= ibrMonthly && rapMonthly <= standardMonthly) {
      ourPick = 'RAP';
      rationale = `RAP. With 225% poverty line protection, RAP yields your lowest monthly payment of $${rapMonthly}. Every payment qualifies for PSLF, protecting your forgiveness clock.`;
    } else {
      ourPick = 'Standard';
      rationale = `Standard. At $${standardMonthly}/month, this plan provides a direct fixed schedule and qualifies for PSLF.`;
    }
  } else {
    // Non PSLF
    if (rapMonthly < standardMonthly) {
      ourPick = 'RAP';
      rationale = `RAP minimizes your immediate cash outlay at $${rapMonthly}/month under the new 2026 rules.`;
    } else {
      ourPick = 'Standard';
      rationale = `Standard 10-year payoff minimizes total interest over the life of your debt.`;
    }
  }

  const watchOutWarning =
    'The studentaid.gov calculator may show Graduated as your cheapest option. Graduated payments do NOT count toward PSLF. Picking it would freeze your forgiveness clock.';

  const nextSteps = [
    `1) Review the ${ourPick} application we've prepared with your exact numbers.`,
    '2) Sign and submit it through your loan servicer online portal or studentaid.gov.',
    '3) Keep paying on your current schedule until the switch confirms.',
  ];

  return {
    id: 'rec_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    userId,
    borrowerName: borrowerName || 'Borrower',
    createdAt: new Date().toISOString(),
    inputs,
    plans: {
      ibr: ibrMetric,
      rap: rapMetric,
      standard: standardMetric,
    },
    ourPick,
    ourPickRationale: rationale,
    watchOutWarning,
    nextSteps,
    complexCaseFlags: flags,
    applicationStatus: 'ready_to_submit',
    servicerName: 'Aidvantage / MOHELA / Nelnet',
  };
}
