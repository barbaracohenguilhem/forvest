import React, { useState } from 'react';
import { User, PlanRecommendation } from '../types';
import { ForvestLogo } from './ForvestLogo';
import { storageService } from '../services/storage';
import { PlanCalculatorModal } from './PlanCalculatorModal';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  Send, 
  Plus, 
  AlertTriangle, 
  Download, 
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Calendar
} from 'lucide-react';

interface DashboardViewProps {
  currentUser: User;
  onLogout: () => void;
  onBackToHome: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  onLogout,
  onBackToHome,
}) => {
  const [plans, setPlans] = useState<PlanRecommendation[]>(() =>
    storageService.getPlansForUser(currentUser.id)
  );
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(() =>
    plans.length > 0 ? plans[0].id : null
  );
  const [activeTab, setActiveTab] = useState<'recommendation' | 'application' | 'history'>('recommendation');
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const selectedPlan = plans.find((p) => p.id === selectedPlanId) || plans[0];

  const handlePlanCreated = (newPlan: PlanRecommendation) => {
    setPlans(storageService.getPlansForUser(currentUser.id));
    setSelectedPlanId(newPlan.id);
    setActiveTab('recommendation');
  };

  const handleStatusChange = (status: PlanRecommendation['applicationStatus']) => {
    if (!selectedPlan) return;
    storageService.updatePlanStatus(selectedPlan.id, status);
    setPlans(storageService.getPlansForUser(currentUser.id));
  };

  const handleSimulateDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F4] flex flex-col font-sans text-[#1C2733]">
      
      {/* 1. App Shell Header (compact: logo mark + area name + user menu) */}
      <header className="h-[60px] bg-white border-b border-[#E4E0D6] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 text-[#5B6672] hover:text-[#1C2733] text-[13px] font-medium transition-colors cursor-pointer mr-2 pr-3 border-r border-[#E4E0D6]"
            title="Return to public site"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={1.75} />
            <span className="hidden sm:inline">Overview</span>
          </button>

          <div className="flex items-center gap-2">
            <ForvestLogo size={22} />
            <span className="font-serif font-bold text-[18px] text-[#1C2733] tracking-tight">
              Forvest
            </span>
            <span className="text-[#5B6672] text-[13px]">/</span>
            <span className="text-[14px] font-semibold text-[#1C2733]">
              My Plans
            </span>
          </div>
        </div>

        {/* User profile & actions */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-[13px] font-semibold text-[#1C2733]">
              {currentUser.name || currentUser.email.split('@')[0]}
            </span>
            <span className="text-[11px] text-[#5B6672]">
              {currentUser.email}
            </span>
          </div>
          <button
            onClick={onLogout}
            className="text-[13px] text-[#5B6672] hover:text-[#1C2733] px-3 py-1.5 rounded-[4px] border border-[#E4E0D6] hover:bg-[#FAF8F4] transition-colors cursor-pointer"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* 2. Main Content Layout */}
      <div className="flex-1 max-w-[1200px] w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col md:flex-row gap-6">
        
        {/* Left Sidebar: Plan History & Primary Action */}
        <aside className="w-full md:w-[320px] shrink-0 flex flex-col gap-4">
          
          {/* Primary Action Button */}
          <button
            onClick={() => setIsCalculatorOpen(true)}
            className="btn-primary w-full h-[48px] gap-2 cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" strokeWidth={2} />
            Model a New Plan
          </button>

          {/* Plan History Card List */}
          <div className="bg-white border border-[#E4E0D6] rounded-[8px] p-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4E0D6] mb-3">
              <span className="text-[12px] font-semibold uppercase tracking-wider text-[#5B6672]">
                Your Saved Plans ({plans.length})
              </span>
            </div>

            {plans.length === 0 ? (
              <div className="py-8 text-center text-[#5B6672]">
                <FileText className="w-8 h-8 mx-auto mb-2 text-[#5B6672]/60" strokeWidth={1.5} />
                <p className="text-[14px]">No plan models saved yet.</p>
                <p className="text-[12px] text-[#5B6672]/80 mt-1">
                  Click 'Model a New Plan' above to run your loan numbers.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {plans.map((p) => {
                  const isSelected = p.id === (selectedPlan?.id);
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSelectedPlanId(p.id);
                        setActiveTab('recommendation');
                      }}
                      className={`w-full text-left p-3 rounded-[6px] border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#1B7A54] bg-[#FAF8F4] ring-1 ring-[#1B7A54]'
                          : 'border-[#E4E0D6] bg-white hover:border-[#1C2733]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[14px] font-semibold text-[#1C2733]">
                          Pick: {p.ourPick}
                        </span>
                        <span className="text-[11px] text-[#5B6672]">
                          ${p.plans[p.ourPick.toLowerCase() as 'ibr' | 'rap' | 'standard']?.monthlyPayment}/mo
                        </span>
                      </div>
                      
                      <div className="text-[12px] text-[#5B6672] mt-1 flex items-center justify-between">
                        <span>Balance: ${p.inputs.loanBalance.toLocaleString()}</span>
                        <span>{p.inputs.pslfPaymentsMade}/120 PSLF</span>
                      </div>

                      <div className="mt-2 pt-2 border-t border-[#E4E0D6]/60 flex items-center justify-between text-[11px]">
                        <span className={`capitalize font-medium ${
                          p.applicationStatus === 'confirmed' ? 'text-[#1B7A54]' :
                          p.applicationStatus === 'submitted' ? 'text-[#2B6CB0]' : 'text-[#5B6672]'
                        }`}>
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
            )}
          </div>

          {/* Quick Notice Deadline Alert */}
          {selectedPlan && (
            <div className="bg-white border border-[#E4E0D6] rounded-[8px] p-4 text-[13px] text-[#1C2733]">
              <div className="flex items-center gap-2 text-[#1C2733] font-semibold mb-1">
                <Clock className="w-4 h-4 text-[#1B7A54]" strokeWidth={1.75} />
                <span>Notice Deadline Tracker</span>
              </div>
              <p className="text-[#5B6672] text-[12px]">
                {selectedPlan.inputs.noticeDeadlineDays || 41} days remaining to switch plans before automatic enrollment into standard 10-year repayment.
              </p>
            </div>
          )}

        </aside>

        {/* Right Area: Detail View with Tabs */}
        <main className="flex-1 flex flex-col gap-4">
          
          {selectedPlan ? (
            <>
              {/* Tab Navigation */}
              <div className="flex items-center gap-2 bg-white border border-[#E4E0D6] p-1.5 rounded-[8px]">
                <button
                  onClick={() => setActiveTab('recommendation')}
                  className={`flex-1 py-2 px-4 text-[14px] font-medium rounded-[6px] transition-colors cursor-pointer text-center ${
                    activeTab === 'recommendation'
                      ? 'bg-[#FAF8F4] text-[#1B7A54] font-semibold border border-[#E4E0D6]'
                      : 'text-[#5B6672] hover:text-[#1C2733]'
                  }`}
                >
                  Plan Recommendation
                </button>
                <button
                  onClick={() => setActiveTab('application')}
                  className={`flex-1 py-2 px-4 text-[14px] font-medium rounded-[6px] transition-colors cursor-pointer text-center ${
                    activeTab === 'application'
                      ? 'bg-[#FAF8F4] text-[#1B7A54] font-semibold border border-[#E4E0D6]'
                      : 'text-[#5B6672] hover:text-[#1C2733]'
                  }`}
                >
                  Switch Application & Status
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`flex-1 py-2 px-4 text-[14px] font-medium rounded-[6px] transition-colors cursor-pointer text-center ${
                    activeTab === 'history'
                      ? 'bg-[#FAF8F4] text-[#1B7A54] font-semibold border border-[#E4E0D6]'
                      : 'text-[#5B6672] hover:text-[#1C2733]'
                  }`}
                >
                  Case Input Details
                </button>
              </div>

              {/* TAB 1: RECOMMENDATION REPORT */}
              {activeTab === 'recommendation' && (
                <div className="bg-white border border-[#E4E0D6] rounded-[8px] p-6 sm:p-8 shadow-xs">
                  
                  {/* Report Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E4E0D6] gap-3">
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1B7A54] bg-[#FAF8F4] px-2 py-0.5 rounded-[4px] border border-[#E4E0D6]">
                        Verified Plan Report
                      </span>
                      <h2 className="text-[22px] sm:text-[26px] font-bold text-[#1C2733] mt-1.5">
                        FORVEST PLAN RECOMMENDATION — Prepared for {selectedPlan.borrowerName}
                      </h2>
                      <p className="text-[13px] text-[#5B6672] mt-0.5">
                        Generated {new Date(selectedPlan.createdAt).toLocaleDateString()} · Reviewed by a credentialed specialist
                      </p>
                    </div>

                    <button
                      onClick={handleSimulateDownload}
                      className="btn-secondary h-[40px] px-4 text-[13px] gap-2 shrink-0 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" strokeWidth={1.75} />
                      {downloadSuccess ? 'Downloaded PDF' : 'Download Report'}
                    </button>
                  </div>

                  {downloadSuccess && (
                    <div className="mt-4 p-3 bg-[#FAF8F4] border border-[#1B7A54] rounded-[6px] text-[13px] text-[#1B7A54] font-medium flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Official PDF recommendation report exported successfully.
                    </div>
                  )}

                  {/* Comparison Table */}
                  <div className="mt-6 overflow-x-auto">
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
                        <tr className={selectedPlan.ourPick === 'IBR' ? 'bg-[#FAF8F4]/80 font-medium' : ''}>
                          <td className="py-3.5 pr-4 font-semibold text-[#1C2733]">
                            IBR {selectedPlan.ourPick === 'IBR' && (
                              <span className="text-[11px] bg-[#1B7A54] text-white px-1.5 py-0.5 rounded-[4px] ml-1.5 font-semibold">
                                OUR PICK
                              </span>
                            )}
                          </td>
                          <td className={`py-3.5 px-3 text-right font-semibold tabular-nums ${
                            selectedPlan.ourPick === 'IBR' ? 'text-[#1B7A54]' : 'text-[#1C2733]'
                          }`}>
                            ${selectedPlan.plans.ibr.monthlyPayment}
                          </td>
                          <td className="py-3.5 px-3 text-center text-[#1C2733]">
                            {selectedPlan.plans.ibr.countsTowardPslf ? 'Yes' : 'No'}
                          </td>
                          <td className={`py-3.5 pl-3 text-right font-medium tabular-nums ${
                            selectedPlan.ourPick === 'IBR' ? 'text-[#1B7A54]' : 'text-[#1C2733]'
                          }`}>
                            ${selectedPlan.plans.ibr.totalBeforeForgiveness.toLocaleString()} over {selectedPlan.plans.ibr.monthsToForgiveness} months
                          </td>
                        </tr>

                        {/* RAP */}
                        <tr className={selectedPlan.ourPick === 'RAP' ? 'bg-[#FAF8F4]/80 font-medium' : ''}>
                          <td className="py-3.5 pr-4 font-semibold text-[#1C2733]">
                            RAP {selectedPlan.ourPick === 'RAP' && (
                              <span className="text-[11px] bg-[#1B7A54] text-white px-1.5 py-0.5 rounded-[4px] ml-1.5 font-semibold">
                                OUR PICK
                              </span>
                            )}
                          </td>
                          <td className={`py-3.5 px-3 text-right font-semibold tabular-nums ${
                            selectedPlan.ourPick === 'RAP' ? 'text-[#1B7A54]' : 'text-[#1C2733]'
                          }`}>
                            ${selectedPlan.plans.rap.monthlyPayment}
                          </td>
                          <td className="py-3.5 px-3 text-center text-[#1C2733]">
                            {selectedPlan.plans.rap.countsTowardPslf ? 'Yes' : 'No'}
                          </td>
                          <td className={`py-3.5 pl-3 text-right font-medium tabular-nums ${
                            selectedPlan.ourPick === 'RAP' ? 'text-[#1B7A54]' : 'text-[#1C2733]'
                          }`}>
                            ${selectedPlan.plans.rap.totalBeforeForgiveness.toLocaleString()} over {selectedPlan.plans.rap.monthsToForgiveness} months
                          </td>
                        </tr>

                        {/* Standard */}
                        <tr className={selectedPlan.ourPick === 'Standard' ? 'bg-[#FAF8F4]/80 font-medium' : ''}>
                          <td className="py-3.5 pr-4 font-semibold text-[#1C2733]">
                            Standard (10-yr) {selectedPlan.ourPick === 'Standard' && (
                              <span className="text-[11px] bg-[#1B7A54] text-white px-1.5 py-0.5 rounded-[4px] ml-1.5 font-semibold">
                                OUR PICK
                              </span>
                            )}
                          </td>
                          <td className={`py-3.5 px-3 text-right font-semibold tabular-nums ${
                            selectedPlan.ourPick === 'Standard' ? 'text-[#1B7A54]' : 'text-[#1C2733]'
                          }`}>
                            ${selectedPlan.plans.standard.monthlyPayment}
                          </td>
                          <td className="py-3.5 px-3 text-center text-[#1C2733]">
                            {selectedPlan.plans.standard.countsTowardPslf ? 'Yes' : 'No'}
                          </td>
                          <td className={`py-3.5 pl-3 text-right font-medium tabular-nums ${
                            selectedPlan.ourPick === 'Standard' ? 'text-[#1B7A54]' : 'text-[#1C2733]'
                          }`}>
                            ${selectedPlan.plans.standard.totalBeforeForgiveness.toLocaleString()} over {selectedPlan.plans.standard.monthsToForgiveness} months
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Recommendation Rationale Box */}
                  <div className="mt-6 bg-[#FAF8F4] border-l-4 border-[#1B7A54] p-4 rounded-r-[6px]">
                    <p className="text-[15px] sm:text-[16px] text-[#1C2733] leading-relaxed">
                      <strong className="text-[#1B7A54]">OUR PICK: {selectedPlan.ourPick}.</strong>{' '}
                      {selectedPlan.ourPickRationale}
                    </p>
                  </div>

                  {/* Watch Out Warning Box */}
                  <div className="mt-4 bg-[#FAF8F4] border-l-4 border-[#5B6672] p-4 rounded-r-[6px]">
                    <p className="text-[14px] text-[#1C2733] leading-relaxed">
                      <strong>⚠ WATCH OUT:</strong> {selectedPlan.watchOutWarning}
                    </p>
                  </div>

                  {/* Next Steps List */}
                  <div className="mt-4 bg-white border border-[#E4E0D6] rounded-[6px] p-4">
                    <p className="text-[13px] font-semibold text-[#5B6672] uppercase tracking-wider mb-2">
                      NEXT STEPS:
                    </p>
                    <ol className="space-y-1.5 text-[14px] text-[#1C2733]">
                      {selectedPlan.nextSteps.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ol>
                  </div>

                  {/* Complex Case Flags (if any) */}
                  {selectedPlan.complexCaseFlags.length > 0 && (
                    <div className="mt-4 p-4 border border-[#E4E0D6] rounded-[6px] bg-[#FAF8F4]">
                      <div className="flex items-center gap-2 text-[13px] font-semibold text-[#1C2733] mb-1.5">
                        <ShieldCheck className="w-4 h-4 text-[#1B7A54]" />
                        <span>Specialist Case Flags Triggered</span>
                      </div>
                      <ul className="list-disc list-inside text-[13px] text-[#5B6672] space-y-1">
                        {selectedPlan.complexCaseFlags.map((flag, idx) => (
                          <li key={idx}>{flag}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Action Banner to View Pre-filled Application */}
                  <div className="mt-6 pt-4 border-t border-[#E4E0D6] flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-[14px] text-[#5B6672]">
                      Your plan switch application for <strong className="text-[#1C2733]">{selectedPlan.ourPick}</strong> has been generated.
                    </div>
                    <button
                      onClick={() => setActiveTab('application')}
                      className="btn-primary h-[42px] px-5 text-[14px] gap-2 cursor-pointer shrink-0"
                    >
                      View Pre-Filled Application
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              )}

              {/* TAB 2: SWITCH APPLICATION & STATUS */}
              {activeTab === 'application' && (
                <div className="bg-white border border-[#E4E0D6] rounded-[8px] p-6 sm:p-8 shadow-xs">
                  
                  <div className="pb-4 border-b border-[#E4E0D6]">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1B7A54] bg-[#FAF8F4] px-2 py-0.5 rounded-[4px] border border-[#E4E0D6]">
                      Paperwork Done
                    </span>
                    <h2 className="text-[22px] sm:text-[24px] font-bold text-[#1C2733] mt-1.5">
                      IDR Plan Switch Application Form
                    </h2>
                    <p className="text-[14px] text-[#5B6672] mt-0.5">
                      OMB No. 1845-0102 · Income-Driven Repayment Plan Request Form pre-filled for your servicer.
                    </p>
                  </div>

                  {/* Application Status Tracker */}
                  <div className="mt-6 bg-[#FAF8F4] border border-[#E4E0D6] rounded-[8px] p-5">
                    <p className="text-[13px] font-semibold text-[#5B6672] uppercase tracking-wider mb-3">
                      Application Filing Lifecycle
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { key: 'draft', label: '1. Drafted', desc: 'Pre-filled by Forvest' },
                        { key: 'ready_to_submit', label: '2. Ready to Submit', desc: 'Reviewed & verified' },
                        { key: 'submitted', label: '3. Submitted', desc: 'Sent to loan servicer' },
                        { key: 'confirmed', label: '4. Confirmed', desc: 'New rate active' },
                      ].map((step) => {
                        const isCurrent = selectedPlan.applicationStatus === step.key;
                        return (
                          <button
                            key={step.key}
                            onClick={() => handleStatusChange(step.key as any)}
                            className={`p-3 rounded-[6px] border text-left transition-all cursor-pointer ${
                              isCurrent
                                ? 'bg-white border-[#1B7A54] ring-1 ring-[#1B7A54]'
                                : 'bg-[#FAF8F4] border-[#E4E0D6] hover:bg-white'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className={`text-[13px] font-semibold ${isCurrent ? 'text-[#1B7A54]' : 'text-[#1C2733]'}`}>
                                {step.label}
                              </span>
                              {isCurrent && <CheckCircle2 className="w-3.5 h-3.5 text-[#1B7A54]" />}
                            </div>
                            <span className="text-[11px] text-[#5B6672] leading-tight block">
                              {step.desc}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Pre-Filled Application Form Preview */}
                  <div className="mt-6 border border-[#E4E0D6] rounded-[6px] p-5 bg-white space-y-4 text-[14px]">
                    <div className="border-b border-[#E4E0D6] pb-3 flex justify-between items-center">
                      <div>
                        <span className="font-semibold text-[#1C2733]">Section 1: Borrower Information</span>
                      </div>
                      <span className="text-[12px] text-[#1B7A54] font-medium">✓ Completed</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px]">
                      <div>
                        <span className="text-[#5B6672] block">Borrower Name:</span>
                        <span className="font-medium text-[#1C2733]">{selectedPlan.borrowerName}</span>
                      </div>
                      <div>
                        <span className="text-[#5B6672] block">Contact Email:</span>
                        <span className="font-medium text-[#1C2733]">{currentUser.email}</span>
                      </div>
                      <div>
                        <span className="text-[#5B6672] block">Requested Repayment Plan:</span>
                        <span className="font-semibold text-[#1B7A54]">{selectedPlan.ourPick} (Code: IDR-SW-26)</span>
                      </div>
                      <div>
                        <span className="text-[#5B6672] block">PSLF Certification Request:</span>
                        <span className="font-medium text-[#1C2733]">Yes ({selectedPlan.inputs.pslfPaymentsMade}/120 certified)</span>
                      </div>
                    </div>

                    <div className="border-t border-[#E4E0D6] pt-3">
                      <span className="font-semibold text-[#1C2733]">Section 2: Repayment Plan Selection & Income Verification</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px]">
                      <div>
                        <span className="text-[#5B6672] block">Adjusted Gross Income (AGI):</span>
                        <span className="font-medium text-[#1C2733]">${selectedPlan.inputs.income.toLocaleString()} / year</span>
                      </div>
                      <div>
                        <span className="text-[#5B6672] block">Tax Filing Status:</span>
                        <span className="font-medium text-[#1C2733] capitalize">
                          {selectedPlan.inputs.filingStatus.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <div>
                        <span className="text-[#5B6672] block">Family / Household Size:</span>
                        <span className="font-medium text-[#1C2733]">{selectedPlan.inputs.familySize}</span>
                      </div>
                      <div>
                        <span className="text-[#5B6672] block">Calculated Monthly Rate:</span>
                        <span className="font-semibold text-[#1B7A54]">
                          ${selectedPlan.plans[selectedPlan.ourPick.toLowerCase() as 'ibr' | 'rap' | 'standard']?.monthlyPayment}/month
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Submission Instructions */}
                  <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-[#FAF8F4] border border-[#E4E0D6] rounded-[6px]">
                    <div className="text-[13px] text-[#1C2733]">
                      <strong>Instructions:</strong> Download your filled PDF, log into your servicer (studentaid.gov or MOHELA/Aidvantage), upload to document submission, and mark your status as <em>Submitted</em>.
                    </div>
                    <button
                      onClick={handleSimulateDownload}
                      className="btn-primary h-[42px] px-6 text-[13px] gap-2 shrink-0 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      Download Pre-Filled PDF
                    </button>
                  </div>

                </div>
              )}

              {/* TAB 3: INPUT DETAILS */}
              {activeTab === 'history' && (
                <div className="bg-white border border-[#E4E0D6] rounded-[8px] p-6 sm:p-8 shadow-xs">
                  <div className="pb-4 border-b border-[#E4E0D6]">
                    <h2 className="text-[20px] font-bold text-[#1C2733]">
                      Raw Case Inputs & Assumptions
                    </h2>
                    <p className="text-[14px] text-[#5B6672] mt-0.5">
                      The exact financial parameters used to compute this recommendation.
                    </p>
                  </div>

                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-[14px]">
                    <div className="p-3.5 bg-[#FAF8F4] border border-[#E4E0D6] rounded-[6px]">
                      <span className="text-[#5B6672] text-[12px] block">Direct Loan Balance</span>
                      <strong className="text-[18px] text-[#1C2733]">${selectedPlan.inputs.loanBalance.toLocaleString()}</strong>
                    </div>

                    <div className="p-3.5 bg-[#FAF8F4] border border-[#E4E0D6] rounded-[6px]">
                      <span className="text-[#5B6672] text-[12px] block">Annual AGI / Income</span>
                      <strong className="text-[18px] text-[#1C2733]">${selectedPlan.inputs.income.toLocaleString()}</strong>
                    </div>

                    <div className="p-3.5 bg-[#FAF8F4] border border-[#E4E0D6] rounded-[6px]">
                      <span className="text-[#5B6672] text-[12px] block">PSLF Payments Made</span>
                      <strong className="text-[18px] text-[#1C2733]">{selectedPlan.inputs.pslfPaymentsMade} / 120</strong>
                      <span className="text-[12px] text-[#5B6672] block mt-0.5">
                        {Math.max(0, 120 - selectedPlan.inputs.pslfPaymentsMade)} payments remaining
                      </span>
                    </div>

                    <div className="p-3.5 bg-[#FAF8F4] border border-[#E4E0D6] rounded-[6px]">
                      <span className="text-[#5B6672] text-[12px] block">Notice Deadline Remaining</span>
                      <strong className="text-[18px] text-[#1C2733]">{selectedPlan.inputs.noticeDeadlineDays || 41} days</strong>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#E4E0D6]">
                    <button
                      onClick={() => setIsCalculatorOpen(true)}
                      className="btn-secondary h-[42px] px-5 text-[14px] cursor-pointer"
                    >
                      Re-run with Adjusted Numbers
                    </button>
                  </div>
                </div>
              )}

            </>
          ) : (
            <div className="bg-white border border-[#E4E0D6] rounded-[8px] p-12 text-center shadow-xs">
              <FileText className="w-12 h-12 mx-auto text-[#5B6672]/60 mb-3" strokeWidth={1.5} />
              <h3 className="text-[20px] font-semibold text-[#1C2733] mb-1">
                No Plan Recommendation Selected
              </h3>
              <p className="text-[15px] text-[#5B6672] max-w-[400px] mx-auto mb-6">
                Start by entering your loan numbers to model RAP vs IBR vs Standard in real time.
              </p>
              <button
                onClick={() => setIsCalculatorOpen(true)}
                className="btn-primary h-[46px] px-6 text-[15px] cursor-pointer"
              >
                Model Your First Plan
              </button>
            </div>
          )}

        </main>

      </div>

      {/* Plan Calculator Intake Modal */}
      <PlanCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        currentUser={currentUser}
        onPlanCreated={handlePlanCreated}
      />

    </div>
  );
};
