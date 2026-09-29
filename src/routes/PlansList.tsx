import React, { useState, useEffect } from 'react';
import { PlanRecommendation, User } from '../types';
import { api } from '../services/api';
import { 
  FileText, 
  Plus, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  Download, 
  ArrowRight,
  ShieldCheck 
} from 'lucide-react';

interface PlansListProps {
  currentUser: User;
  onNavigateToCompare: () => void;
  onNavigateToApplication: (plan: PlanRecommendation) => void;
}

export const PlansList: React.FC<PlansListProps> = ({
  currentUser,
  onNavigateToCompare,
  onNavigateToApplication,
}) => {
  const [plans, setPlans] = useState<PlanRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [downloadNotice, setDownloadNotice] = useState(false);

  useEffect(() => {
    let isMounted = true;
    api.getUserPlans().then((data) => {
      if (isMounted) {
        setPlans(data);
        if (data.length > 0) {
          setSelectedPlanId(data[0].id);
        }
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const selectedPlan = plans.find((p) => p.id === selectedPlanId) || plans[0];

  const handleDownloadReport = () => {
    setDownloadNotice(true);
    setTimeout(() => setDownloadNotice(false), 3000);
  };

  if (loading) {
    return (
      <div className="bg-white border border-[#E4E0D6] rounded-[8px] p-12 text-center shadow-xs">
        <div className="w-8 h-8 border-2 border-[#1B7A54] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-[14px] text-[#5B6672]">Loading your saved plan models...</p>
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="bg-white border border-[#E4E0D6] rounded-[8px] p-8 sm:p-12 text-center shadow-xs max-w-[620px] mx-auto my-8 space-y-4">
        <div className="w-12 h-12 rounded-full bg-[#FAF8F4] border border-[#E4E0D6] flex items-center justify-center mx-auto text-[#1C2733]">
          <FileText className="w-6 h-6" strokeWidth={1.5} />
        </div>
        <h3 className="text-[20px] font-semibold text-[#1C2733]">
          No Plan Recommendations Yet
        </h3>
        <p className="text-[14px] text-[#5B6672] max-w-[460px] mx-auto leading-relaxed">
          You haven't run any loan numbers yet. Model RAP vs IBR vs Standard against your real balance, income, and PSLF credits under 2026 rules.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onNavigateToCompare}
            className="btn-primary h-[46px] px-6 text-[14px] gap-2 cursor-pointer w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            Model Your Real Loans
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#E4E0D6] rounded-[8px] p-6 shadow-xs">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1B7A54] bg-[#FAF8F4] px-2 py-0.5 rounded-[4px] border border-[#E4E0D6]">
            Plan Workspace
          </span>
          <h1 className="text-[24px] font-bold text-[#1C2733] mt-1">
            My Loan Plan Models ({plans.length})
          </h1>
          <p className="text-[14px] text-[#5B6672] mt-0.5">
            Compare recommendations, monitor deadlines, and track your switch application.
          </p>
        </div>

        <button
          onClick={onNavigateToCompare}
          className="btn-primary h-[44px] px-5 text-[14px] gap-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Model Another Scenario
        </button>
      </div>

      {downloadNotice && (
        <div className="p-3 bg-[#FAF8F4] border border-[#1B7A54] rounded-[6px] text-[13px] text-[#1B7A54] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          Plan recommendation PDF downloaded successfully.
        </div>
      )}

      {/* Grid: Plan Selector + Detailed View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Saved Plans List (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-3">
          <span className="text-[12px] font-semibold uppercase tracking-wider text-[#5B6672] px-1 block">
            Select Model Run
          </span>

          {plans.map((p) => {
            const isSelected = p.id === selectedPlan?.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPlanId(p.id)}
                className={`w-full text-left p-4 rounded-[8px] border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#1B7A54] bg-[#FAF8F4] ring-1 ring-[#1B7A54]'
                    : 'border-[#E4E0D6] bg-white hover:border-[#1C2733]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[15px] font-semibold text-[#1C2733]">
                    Recommended: {p.ourPick}
                  </span>
                  <span className="text-[12px] font-semibold text-[#1B7A54] bg-white border border-[#E4E0D6] px-2 py-0.5 rounded-[4px]">
                    ${p.plans[p.ourPick.toLowerCase() as 'ibr' | 'rap' | 'standard']?.monthlyPayment}/mo
                  </span>
                </div>

                <div className="text-[12px] text-[#5B6672] flex justify-between">
                  <span>Balance: ${p.inputs.loanBalance.toLocaleString()}</span>
                  <span>{p.inputs.pslfPaymentsMade}/120 PSLF</span>
                </div>

                <div className="mt-2.5 pt-2 border-t border-[#E4E0D6]/60 flex items-center justify-between text-[11px]">
                  <span className="text-[#5B6672]">
                    ● {p.applicationStatus.replace(/_/g, ' ')}
                  </span>
                  <span className="text-[#5B6672]/80">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Detailed Plan Report & Application Status (lg:col-span-8) */}
        {selectedPlan && (
          <div className="lg:col-span-8 bg-white border border-[#E4E0D6] rounded-[8px] p-6 sm:p-8 shadow-xs space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E4E0D6] gap-3">
              <div>
                <h3 className="text-[20px] font-bold text-[#1C2733]">
                  FORVEST PLAN RECOMMENDATION — Prepared for {selectedPlan.borrowerName}
                </h3>
                <p className="text-[13px] text-[#5B6672] mt-0.5">
                  Run on {new Date(selectedPlan.createdAt).toLocaleDateString()} · Specialist Verification Signed
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadReport}
                  className="btn-secondary h-[38px] px-3 text-[13px] gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  PDF
                </button>
                <button
                  onClick={() => onNavigateToApplication(selectedPlan)}
                  className="btn-primary h-[38px] px-4 text-[13px] gap-1.5 cursor-pointer"
                >
                  Application
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[14px]">
                <thead>
                  <tr className="border-b border-[#E4E0D6] text-[#5B6672] font-semibold">
                    <th className="py-2 pr-4">Plan</th>
                    <th className="py-2 px-3 text-right">Monthly</th>
                    <th className="py-2 px-3 text-center">PSLF?</th>
                    <th className="py-2 pl-3 text-right">Total Before Forgiveness</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4E0D6]">
                  <tr className={selectedPlan.ourPick === 'IBR' ? 'bg-[#FAF8F4] font-medium' : ''}>
                    <td className="py-2.5 pr-4 font-semibold text-[#1C2733]">
                      IBR {selectedPlan.ourPick === 'IBR' && <span className="text-[11px] bg-[#1B7A54] text-white px-1.5 py-0.5 rounded-[4px] ml-1">PICK</span>}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums text-[#1B7A54] font-semibold">
                      ${selectedPlan.plans.ibr.monthlyPayment}
                    </td>
                    <td className="py-2.5 px-3 text-center">Yes</td>
                    <td className="py-2.5 pl-3 text-right tabular-nums">
                      ${selectedPlan.plans.ibr.totalBeforeForgiveness.toLocaleString()}
                    </td>
                  </tr>
                  <tr className={selectedPlan.ourPick === 'RAP' ? 'bg-[#FAF8F4] font-medium' : ''}>
                    <td className="py-2.5 pr-4 font-semibold text-[#1C2733]">
                      RAP {selectedPlan.ourPick === 'RAP' && <span className="text-[11px] bg-[#1B7A54] text-white px-1.5 py-0.5 rounded-[4px] ml-1">PICK</span>}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums">
                      ${selectedPlan.plans.rap.monthlyPayment}
                    </td>
                    <td className="py-2.5 px-3 text-center">Yes</td>
                    <td className="py-2.5 pl-3 text-right tabular-nums">
                      ${selectedPlan.plans.rap.totalBeforeForgiveness.toLocaleString()}
                    </td>
                  </tr>
                  <tr className={selectedPlan.ourPick === 'Standard' ? 'bg-[#FAF8F4] font-medium' : ''}>
                    <td className="py-2.5 pr-4 font-semibold text-[#1C2733]">
                      Standard (10y)
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums">
                      ${selectedPlan.plans.standard.monthlyPayment}
                    </td>
                    <td className="py-2.5 px-3 text-center">Yes</td>
                    <td className="py-2.5 pl-3 text-right tabular-nums">
                      ${selectedPlan.plans.standard.totalBeforeForgiveness.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Recommendation box */}
            <div className="p-4 bg-[#FAF8F4] border-l-4 border-[#1B7A54] rounded-r-[6px] text-[14px] leading-relaxed">
              <strong className="text-[#1B7A54]">OUR PICK: {selectedPlan.ourPick}.</strong> {selectedPlan.ourPickRationale}
            </div>

            {/* Warning box */}
            <div className="p-4 bg-[#FAF8F4] border-l-4 border-[#5B6672] rounded-r-[6px] text-[13px] leading-relaxed">
              <strong>⚠ WATCH OUT:</strong> {selectedPlan.watchOutWarning}
            </div>

            {/* Application status snippet */}
            <div className="p-4 border border-[#E4E0D6] rounded-[6px] flex items-center justify-between bg-white text-[13px]">
              <div>
                <span className="text-[#5B6672] block">Switch Application Status</span>
                <span className="font-semibold text-[#1C2733] capitalize">
                  ● {selectedPlan.applicationStatus.replace(/_/g, ' ')}
                </span>
              </div>
              <button
                onClick={() => onNavigateToApplication(selectedPlan)}
                className="text-[#1B7A54] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                Manage Filing <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
