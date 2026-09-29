export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
}

export interface PlanInputs {
  loanBalance: number;
  income: number;
  filingStatus: 'single' | 'married_filing_jointly' | 'married_filing_separately';
  familySize: number;
  pslfPaymentsMade: number;
  hasPre2014Loans: boolean;
  isSelfEmployed: boolean;
  hasPslfBuyback: boolean;
  noticeDeadlineDays?: number;
}

export interface PlanMetric {
  planName: string;
  code: 'IBR' | 'RAP' | 'Standard';
  monthlyPayment: number;
  countsTowardPslf: boolean;
  totalBeforeForgiveness: number;
  monthsToForgiveness: number;
  estimatedForgivenAmount: number;
  taxNotes: string;
}

export interface PlanRecommendation {
  id: string;
  userId: string;
  borrowerName: string;
  createdAt: string;
  inputs: PlanInputs;
  plans: {
    ibr: PlanMetric;
    rap: PlanMetric;
    standard: PlanMetric;
  };
  ourPick: 'IBR' | 'RAP' | 'Standard';
  ourPickRationale: string;
  watchOutWarning: string;
  nextSteps: string[];
  complexCaseFlags: string[];
  applicationStatus: 'draft' | 'ready_to_submit' | 'submitted' | 'confirmed';
  submittedDate?: string;
  servicerName?: string;
}

export interface StoredLead {
  id: string;
  email: string;
  source: string;
  tier?: string;
  createdAt: string;
}
