import React, { useState } from 'react';
import { PlanInputs, PlanRecommendation } from '../types';
import { api } from '../services/api';
import { 
  Calculator, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Download, 
  RefreshCw,
  ShieldCheck,
  FileCheck
} from 'lucide-react';

interface CompareToolProps {
  onPlanCreated: (plan: PlanRecommendation) => void;
  onNavigateToApplication: (plan: PlanRecommendation) => void;
}

export const CompareTool: React.FC<CompareToolProps> = ({
  onPlanCreated,
  onNavigateToApplication,
}) => {
  const [loanBalance, setLoanBalance] = useState<number>(() => {
    const saved = sessionStorage.getItem('fv_loan_balance');
    return saved ? Number(saved) : 36400;
  });
  const [income, setIncome] = useState<number>(() => {
    const saved = sessionStorage.getItem('fv_income');
    return saved ? Number(saved) : 68000;
  });
  const [filingStatus, setFilingStatus] = useState<PlanInputs['filingStatus']>(() => {
    return (sessionStorage.getItem('fv_filing_status') as any) || 'single';
  });
  const [familySize, setFamilySize] = useState<number>(1);
  const [pslfPaymentsMade, setPslfPaymentsMade] = useState<number>(105);
  const [hasPre2014Loans, setHasPre2014Loans] = useState<boolean>(false);
  const [isSelfEmployed, setIsSelfEmployed] = useState<boolean>(false);
  const [hasPslfBuyback, setHasPslfBuyback] = useState<boolean>(false);
  const [noticeDeadlineDays, setNoticeDeadlineDays] = useState<number>(41);

  // Save changes to sessionStorage
  const updateBalance = (val: number) => {
    setLoanBalance(val);
    sessionStorage.setItem('fv_loan_balance', String(val));
  };
  const updateIncome = (val: number) => {
    setIncome(val);
    sessionStorage.setItem('fv_income', String(val));
  };
  const updateFiling = (val: PlanInputs['filingStatus']) => {
    setFilingStatus(val);
    sessionStorage.setItem('fv_filing_status', val);
  };

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [generatedPlan, setGeneratedPlan] = useState<PlanRecommendation | null>(null);

  const handleRunModel = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    setLoadingStep('Calculating RAP, IBR, and Standard payment baselines...');

    const inputs: PlanInputs = {
      loanBalance: Number(loanBalance),
      income: Number(income),
      filingStatus,
      familySize: Number(familySize),
      pslfPaymentsMade: Number(pslfPaymentsMade),
      hasPre2014Loans,
      isSelfEmployed,
      hasPslfBuyback,
      noticeDeadlineDays: Number(noticeDeadlineDays),
    };

    try {
      setTimeout(() => {
        setLoadingStep('Synthesizing specialist rationale with Gemini Pro...');
      }, 700);

      const plan = await api.comparePlans(inputs);
      setGeneratedPlan(plan);
      onPlanCreated(plan);
    } catch (err: any) {
      setError(err.message || 'Unable to generate plan model. Please check inputs and retry.');
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white border border-[#E4E0D6] rounded-[8px] p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1B7A54] bg-[#FAF8F4] px-2 py-0.5 rounded-[4px] border border-[#E4E0D6]">
              Hero Feature · Data-Processing Engine
            </span>
            <h1 className="text-[24px] font-bold text-[#1C2733] mt-1.5">
              Plan Comparison Engine
            </h1>
            <p className="text-[14px] text-[#5B6672] mt-0.5 max-w-[65ch]">
              Enter your loan parameters. We run RAP vs IBR vs Standard under 2026 guidelines, model your PSLF timeline, and prepare your pre-filled switch application.
            </p>
          </div>
          {generatedPlan && (
            <button
              onClick={() => {
                setGeneratedPlan(null);
              }}
              className="btn-secondary h-[40px] px-4 text-[13px] gap-2 shrink-0 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Adjust Numbers
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-[8px] flex items-start gap-3 text-[14px] text-red-800">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <strong className="block font-semibold">Modeling Failure</strong>
            <span>{error}</span>
            <button
              onClick={handleRunModel}
              className="block mt-2 font-semibold text-red-700 underline cursor-pointer"
            >
              Retry without losing work
            </button>
          </div>
        </div>
      )}

      {/* Input Form (Shown when no plan generated or when adjusting) */}
      {!generatedPlan && (
        <form onSubmit={handleRunModel} className="bg-white border border-[#E4E0D6] rounded-[8px] p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-[#E4E0D6] pb-3">
            <h3 className="text-[18px] font-semibold text-[#1C2733]">
              1. Loan Balances & Financial Profile
            </h3>
            <p className="text-[13px] text-[#5B6672]">
              All inputs are processed securely through our server-side engine.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div>
              <label className="block text-[13px] font-medium text-[#1C2733] mb-1">
                Direct Loan Balance ($)
              </label>
              <input
                type="number"
                min="500"
                step="500"
                value={loanBalance}
                onChange={(e) => updateBalance(Number(e.target.value))}
                required
                className="w-full h-[44px] px-3.5 bg-white border border-[#E4E0D6] rounded-[6px] text-[15px] text-[#1C2733] focus:border-[#1B7A54] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#1C2733] mb-1">
                Annual Adjusted Gross Income ($)
              </label>
              <input
                type="number"
                min="0"
                step="1000"
                value={income}
                onChange={(e) => updateIncome(Number(e.target.value))}
                required
                className="w-full h-[44px] px-3.5 bg-white border border-[#E4E0D6] rounded-[6px] text-[15px] text-[#1C2733] focus:border-[#1B7A54] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#1C2733] mb-1">
                Tax Filing Status
              </label>
              <select
                value={filingStatus}
                onChange={(e) => updateFiling(e.target.value as any)}
                className="w-full h-[44px] px-3 bg-white border border-[#E4E0D6] rounded-[6px] text-[14px] text-[#1C2733] focus:border-[#1B7A54] focus:outline-hidden"
              >
                <option value="single">Single</option>
                <option value="married_filing_jointly">Married Filing Jointly</option>
                <option value="married_filing_separately">Married Filing Separately (MFS)</option>
              </select>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#1C2733] mb-1">
                Family / Household Size
              </label>
              <input
                type="number"
                min="1"
                max="12"
                value={familySize}
                onChange={(e) => setFamilySize(Number(e.target.value))}
                required
                className="w-full h-[44px] px-3.5 bg-white border border-[#E4E0D6] rounded-[6px] text-[15px] text-[#1C2733] focus:border-[#1B7A54] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#1C2733] mb-1">
                PSLF Payments Made (0-120)
              </label>
              <input
                type="number"
                min="0"
                max="120"
                value={pslfPaymentsMade}
                onChange={(e) => setPslfPaymentsMade(Number(e.target.value))}
                required
                className="w-full h-[44px] px-3.5 bg-white border border-[#E4E0D6] rounded-[6px] text-[15px] text-[#1C2733] focus:border-[#1B7A54] focus:outline-hidden"
              />
              <span className="text-[11px] text-[#5B6672]">
                {120 - pslfPaymentsMade} payments remaining to tax-free forgiveness
              </span>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#1C2733] mb-1">
                Notice Deadline (Days Remaining)
              </label>
              <input
                type="number"
                min="1"
                max="180"
                value={noticeDeadlineDays}
                onChange={(e) => setNoticeDeadlineDays(Number(e.target.value))}
                required
                className="w-full h-[44px] px-3.5 bg-white border border-[#E4E0D6] rounded-[6px] text-[15px] text-[#1C2733] focus:border-[#1B7A54] focus:outline-hidden"
              />
              <span className="text-[11px] text-[#5B6672]">
                Auto-enrolled into Standard if missed
              </span>
            </div>
          </div>

          {/* Complex Case Flags */}
          <div className="pt-4 border-t border-[#E4E0D6]">
            <h4 className="text-[14px] font-semibold text-[#1C2733] mb-2.5">
              2. Special Circumstances & Specialist Review Triggers
            </h4>
            <div className="space-y-2.5 text-[13px] text-[#1C2733]">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasPre2014Loans}
                  onChange={(e) => setHasPre2014Loans(e.target.checked)}
                  className="rounded-[4px] border-[#E4E0D6] text-[#1B7A54] focus:ring-[#1B7A54]"
                />
                <span>I have Direct or FFEL loans disbursed before July 1, 2014 (triggers 15% discretionary tier)</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isSelfEmployed}
                  onChange={(e) => setIsSelfEmployed(e.target.checked)}
                  className="rounded-[4px] border-[#E4E0D6] text-[#1B7A54] focus:ring-[#1B7A54]"
                />
                <span>Self-employed / 1099 income (requires Schedule C deduction calculation)</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasPslfBuyback}
                  onChange={(e) => setHasPslfBuyback(e.target.checked)}
                  className="rounded-[4px] border-[#E4E0D6] text-[#1B7A54] focus:ring-[#1B7A54]"
                />
                <span>Requesting PSLF Buyback for months spent in SAVE administrative forbearance</span>
              </label>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-[#E4E0D6]">
            <span className="text-[13px] text-[#5B6672]">
              Response time: ~2 seconds via Gemini Pro backend
            </span>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary h-[48px] px-8 text-[15px] cursor-pointer disabled:opacity-60"
            >
              {isLoading ? 'Running Comparison Engine...' : 'Run Plan Comparison Model'}
            </button>
          </div>
        </form>
      )}

      {/* Loading feedback */}
      {isLoading && (
        <div className="bg-white border border-[#E4E0D6] rounded-[8px] p-8 text-center shadow-xs">
          <div className="w-10 h-10 border-3 border-[#1B7A54] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h3 className="text-[18px] font-semibold text-[#1C2733] mb-1">
            Running Plan Comparison Engine
          </h3>
          <p className="text-[14px] text-[#5B6672]">
            {loadingStep || 'Evaluating IBR, RAP, and Standard models against 2026 federal regulations...'}
          </p>
        </div>
      )}

      {/* Generated Plan Output (Normalized View) */}
      {generatedPlan && !isLoading && (
        <div className="bg-white border border-[#E4E0D6] rounded-[8px] p-6 sm:p-8 shadow-xs space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E4E0D6] gap-3">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1B7A54] bg-[#FAF8F4] px-2 py-0.5 rounded-[4px] border border-[#E4E0D6]">
                Comparison Result
              </span>
              <h2 className="text-[22px] font-bold text-[#1C2733] mt-1">
                FORVEST PLAN RECOMMENDATION — Prepared for {generatedPlan.borrowerName}
              </h2>
              <p className="text-[13px] text-[#5B6672]">
                Model ID: {generatedPlan.id} · Evaluated with Gemini Pro Specialist Engine
              </p>
            </div>

            <button
              onClick={() => onNavigateToApplication(generatedPlan)}
              className="btn-primary h-[42px] px-5 text-[14px] gap-2 shrink-0 cursor-pointer"
            >
              <FileCheck className="w-4 h-4" />
              View Pre-Filled Application
            </button>
          </div>

          {/* Side-by-side Comparison Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[14px]">
              <thead>
                <tr className="border-b border-[#E4E0D6] text-[#5B6672] font-semibold">
                  <th className="py-2.5 pr-4">Plan</th>
                  <th className="py-2.5 px-3 text-right">Monthly payment</th>
                  <th className="py-2.5 px-3 text-center">Counts toward PSLF?</th>
                  <th className="py-2.5 pl-3 text-right">You pay before forgiveness</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E0D6]">
                {/* IBR */}
                <tr className={generatedPlan.ourPick === 'IBR' ? 'bg-[#FAF8F4]/80 font-medium' : ''}>
                  <td className="py-3.5 pr-4 font-semibold text-[#1C2733]">
                    IBR {generatedPlan.ourPick === 'IBR' && (
                      <span className="text-[11px] bg-[#1B7A54] text-white px-1.5 py-0.5 rounded-[4px] ml-1.5 font-semibold">
                        OUR PICK
                      </span>
                    )}
                  </td>
                  <td className={`py-3.5 px-3 text-right font-semibold tabular-nums ${
                    generatedPlan.ourPick === 'IBR' ? 'text-[#1B7A54]' : 'text-[#1C2733]'
                  }`}>
                    ${generatedPlan.plans.ibr.monthlyPayment}
                  </td>
                  <td className="py-3.5 px-3 text-center text-[#1C2733]">
                    {generatedPlan.plans.ibr.countsTowardPslf ? 'Yes' : 'No'}
                  </td>
                  <td className={`py-3.5 pl-3 text-right font-medium tabular-nums ${
                    generatedPlan.ourPick === 'IBR' ? 'text-[#1B7A54]' : 'text-[#1C2733]'
                  }`}>
                    ${generatedPlan.plans.ibr.totalBeforeForgiveness.toLocaleString()} over {generatedPlan.plans.ibr.monthsToForgiveness} months
                  </td>
                </tr>

                {/* RAP */}
                <tr className={generatedPlan.ourPick === 'RAP' ? 'bg-[#FAF8F4]/80 font-medium' : ''}>
                  <td className="py-3.5 pr-4 font-semibold text-[#1C2733]">
                    RAP {generatedPlan.ourPick === 'RAP' && (
                      <span className="text-[11px] bg-[#1B7A54] text-white px-1.5 py-0.5 rounded-[4px] ml-1.5 font-semibold">
                        OUR PICK
                      </span>
                    )}
                  </td>
                  <td className={`py-3.5 px-3 text-right font-semibold tabular-nums ${
                    generatedPlan.ourPick === 'RAP' ? 'text-[#1B7A54]' : 'text-[#1C2733]'
                  }`}>
                    ${generatedPlan.plans.rap.monthlyPayment}
                  </td>
                  <td className="py-3.5 px-3 text-center text-[#1C2733]">
                    {generatedPlan.plans.rap.countsTowardPslf ? 'Yes' : 'No'}
                  </td>
                  <td className={`py-3.5 pl-3 text-right font-medium tabular-nums ${
                    generatedPlan.ourPick === 'RAP' ? 'text-[#1B7A54]' : 'text-[#1C2733]'
                  }`}>
                    ${generatedPlan.plans.rap.totalBeforeForgiveness.toLocaleString()} over {generatedPlan.plans.rap.monthsToForgiveness} months
                  </td>
                </tr>

                {/* Standard */}
                <tr className={generatedPlan.ourPick === 'Standard' ? 'bg-[#FAF8F4]/80 font-medium' : ''}>
                  <td className="py-3.5 pr-4 font-semibold text-[#1C2733]">
                    Standard (10-yr) {generatedPlan.ourPick === 'Standard' && (
                      <span className="text-[11px] bg-[#1B7A54] text-white px-1.5 py-0.5 rounded-[4px] ml-1.5 font-semibold">
                        OUR PICK
                      </span>
                    )}
                  </td>
                  <td className={`py-3.5 px-3 text-right font-semibold tabular-nums ${
                    generatedPlan.ourPick === 'Standard' ? 'text-[#1B7A54]' : 'text-[#1C2733]'
                  }`}>
                    ${generatedPlan.plans.standard.monthlyPayment}
                  </td>
                  <td className="py-3.5 px-3 text-center text-[#1C2733]">
                    {generatedPlan.plans.standard.countsTowardPslf ? 'Yes' : 'No'}
                  </td>
                  <td className={`py-3.5 pl-3 text-right font-medium tabular-nums ${
                    generatedPlan.ourPick === 'Standard' ? 'text-[#1B7A54]' : 'text-[#1C2733]'
                  }`}>
                    ${generatedPlan.plans.standard.totalBeforeForgiveness.toLocaleString()} over {generatedPlan.plans.standard.monthsToForgiveness} months
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Recommendation Box */}
          <div className="bg-[#FAF8F4] border-l-4 border-[#1B7A54] p-4 rounded-r-[6px]">
            <p className="text-[15px] text-[#1C2733] leading-relaxed">
              <strong className="text-[#1B7A54]">OUR PICK: {generatedPlan.ourPick}.</strong>{' '}
              {generatedPlan.ourPickRationale}
            </p>
          </div>

          {/* Warning Box */}
          <div className="bg-[#FAF8F4] border-l-4 border-[#5B6672] p-4 rounded-r-[6px]">
            <p className="text-[14px] text-[#1C2733] leading-relaxed">
              <strong>⚠ WATCH OUT:</strong> {generatedPlan.watchOutWarning}
            </p>
          </div>

          {/* Next steps */}
          <div className="bg-white border border-[#E4E0D6] rounded-[6px] p-4">
            <p className="text-[13px] font-semibold text-[#5B6672] uppercase tracking-wider mb-2">
              NEXT STEPS:
            </p>
            <ol className="space-y-1.5 text-[14px] text-[#1C2733]">
              {generatedPlan.nextSteps.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </div>

          {/* Complex Case Flags */}
          {generatedPlan.complexCaseFlags.length > 0 && (
            <div className="p-4 bg-[#FAF8F4] border border-[#E4E0D6] rounded-[6px]">
              <div className="flex items-center gap-2 text-[13px] font-semibold text-[#1C2733] mb-1.5">
                <ShieldCheck className="w-4 h-4 text-[#1B7A54]" />
                <span>Specialist Queue Flags</span>
              </div>
              <ul className="list-disc list-inside text-[13px] text-[#5B6672] space-y-1">
                {generatedPlan.complexCaseFlags.map((flag, idx) => (
                  <li key={idx}>{flag}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="pt-2 flex items-center justify-between">
            <span className="text-[13px] text-[#5B6672]">
              Record saved to your account in database.
            </span>
            <button
              onClick={() => onNavigateToApplication(generatedPlan)}
              className="btn-primary h-[44px] px-6 text-[14px] gap-2 cursor-pointer"
            >
              Proceed to Application Filing
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
