import React, { useState } from 'react';
import { PlanInputs, PlanRecommendation, User } from '../types';
import { calculatePlanRecommendation } from '../utils/calculator';
import { storageService } from '../services/storage';

interface PlanCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onPlanCreated: (plan: PlanRecommendation) => void;
}

export const PlanCalculatorModal: React.FC<PlanCalculatorModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onPlanCreated,
}) => {
  const [loanBalance, setLoanBalance] = useState<number>(45000);
  const [income, setIncome] = useState<number>(72000);
  const [filingStatus, setFilingStatus] = useState<PlanInputs['filingStatus']>('single');
  const [familySize, setFamilySize] = useState<number>(1);
  const [pslfPaymentsMade, setPslfPaymentsMade] = useState<number>(96);
  const [hasPre2014Loans, setHasPre2014Loans] = useState<boolean>(false);
  const [isSelfEmployed, setIsSelfEmployed] = useState<boolean>(false);
  const [hasPslfBuyback, setHasPslfBuyback] = useState<boolean>(false);
  const [noticeDeadlineDays, setNoticeDeadlineDays] = useState<number>(45);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);

    setTimeout(() => {
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

      const plan = calculatePlanRecommendation(
        inputs,
        currentUser.id,
        currentUser.name || currentUser.email.split('@')[0]
      );

      storageService.savePlan(plan);
      onPlanCreated(plan);
      setIsCalculating(false);
      onClose();
    }, 350);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C2733]/60 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-white border border-[#E4E0D6] rounded-[8px] max-w-[620px] w-full p-6 sm:p-8 my-8 relative"
        style={{ boxShadow: '0 4px 20px rgba(28,39,51,0.15)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-[#5B6672] hover:text-[#1C2733] rounded-[4px] hover:bg-[#FAF8F4] transition-colors"
          aria-label="Close"
        >
          ✕
        </button>

        <div className="mb-6">
          <span className="text-[12px] font-semibold uppercase tracking-wider text-[#1B7A54] bg-[#FAF8F4] px-2.5 py-1 rounded-[4px] border border-[#E4E0D6]">
            Intake Engine · Step 1 of 2
          </span>
          <h3 className="text-[24px] font-semibold text-[#1C2733] mt-2 mb-1">
            Model Your RAP vs IBR vs Standard Plan
          </h3>
          <p className="text-[14px] text-[#5B6672]">
            Enter your numbers. Our model computes real payments and PSLF timelines under the latest 2026 regulations.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-medium text-[#1C2733] mb-1">
                Total Direct Loan Balance ($)
              </label>
              <input
                type="number"
                min="1000"
                step="500"
                value={loanBalance}
                onChange={(e) => setLoanBalance(Number(e.target.value))}
                required
                className="w-full h-[44px] px-3.5 bg-white border border-[#E4E0D6] rounded-[8px] text-[15px] text-[#1C2733] focus:outline-hidden focus:border-[#1B7A54] focus:ring-1 focus:ring-[#1B7A54]"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#1C2733] mb-1">
                Annual AGI / Income ($)
              </label>
              <input
                type="number"
                min="0"
                step="1000"
                value={income}
                onChange={(e) => setIncome(Number(e.target.value))}
                required
                className="w-full h-[44px] px-3.5 bg-white border border-[#E4E0D6] rounded-[8px] text-[15px] text-[#1C2733] focus:outline-hidden focus:border-[#1B7A54] focus:ring-1 focus:ring-[#1B7A54]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-medium text-[#1C2733] mb-1">
                Tax Filing Status
              </label>
              <select
                value={filingStatus}
                onChange={(e) => setFilingStatus(e.target.value as any)}
                className="w-full h-[44px] px-3 bg-white border border-[#E4E0D6] rounded-[8px] text-[14px] text-[#1C2733] focus:outline-hidden focus:border-[#1B7A54] focus:ring-1 focus:ring-[#1B7A54]"
              >
                <option value="single">Single</option>
                <option value="married_filing_jointly">Married Filing Jointly</option>
                <option value="married_filing_separately">Married Filing Separately (MFS)</option>
              </select>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#1C2733] mb-1">
                Family Size
              </label>
              <input
                type="number"
                min="1"
                max="12"
                value={familySize}
                onChange={(e) => setFamilySize(Number(e.target.value))}
                required
                className="w-full h-[44px] px-3.5 bg-white border border-[#E4E0D6] rounded-[8px] text-[15px] text-[#1C2733] focus:outline-hidden focus:border-[#1B7A54] focus:ring-1 focus:ring-[#1B7A54]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-medium text-[#1C2733] mb-1">
                PSLF Qualifying Payments Made (0-120)
              </label>
              <input
                type="number"
                min="0"
                max="120"
                value={pslfPaymentsMade}
                onChange={(e) => setPslfPaymentsMade(Number(e.target.value))}
                required
                className="w-full h-[44px] px-3.5 bg-white border border-[#E4E0D6] rounded-[8px] text-[15px] text-[#1C2733] focus:outline-hidden focus:border-[#1B7A54] focus:ring-1 focus:ring-[#1B7A54]"
              />
              <span className="text-[11px] text-[#5B6672]">
                {120 - pslfPaymentsMade} payments left until full tax-free forgiveness
              </span>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#1C2733] mb-1">
                90-Day Notice Deadline (Days Left)
              </label>
              <input
                type="number"
                min="1"
                max="180"
                value={noticeDeadlineDays}
                onChange={(e) => setNoticeDeadlineDays(Number(e.target.value))}
                required
                className="w-full h-[44px] px-3.5 bg-white border border-[#E4E0D6] rounded-[8px] text-[15px] text-[#1C2733] focus:outline-hidden focus:border-[#1B7A54] focus:ring-1 focus:ring-[#1B7A54]"
              />
              <span className="text-[11px] text-[#5B6672]">
                Auto-enrolled into Standard if missed
              </span>
            </div>
          </div>

          {/* Complex Case Checkboxes */}
          <div className="pt-2 border-t border-[#E4E0D6]">
            <p className="text-[13px] font-semibold text-[#1C2733] mb-2">
              Complex Case Factors (Trigger Specialist Review Flag):
            </p>
            <div className="space-y-2 text-[13px] text-[#1C2733]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasPre2014Loans}
                  onChange={(e) => setHasPre2014Loans(e.target.checked)}
                  className="rounded-[4px] border-[#E4E0D6] text-[#1B7A54] focus:ring-[#1B7A54]"
                />
                <span>I have federal loans disbursed before July 1, 2014 (15% IBR tier)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isSelfEmployed}
                  onChange={(e) => setIsSelfEmployed(e.target.checked)}
                  className="rounded-[4px] border-[#E4E0D6] text-[#1B7A54] focus:ring-[#1B7A54]"
                />
                <span>Self-employed / 1099 income (needs Schedule C net profit modeling)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasPslfBuyback}
                  onChange={(e) => setHasPslfBuyback(e.target.checked)}
                  className="rounded-[4px] border-[#E4E0D6] text-[#1B7A54] focus:ring-[#1B7A54]"
                />
                <span>Applying for PSLF Buyback credit on months spent in administrative forbearance</span>
              </label>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary h-[44px] px-5 text-[14px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCalculating}
              className="btn-primary h-[44px] px-6 text-[14px] cursor-pointer"
            >
              {isCalculating ? 'Computing Models...' : 'Generate Plan Recommendation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
