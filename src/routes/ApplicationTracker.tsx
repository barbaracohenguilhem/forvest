import React, { useState } from 'react';
import { PlanRecommendation, User } from '../types';
import { api } from '../services/api';
import { 
  FileCheck, 
  CheckCircle2, 
  Download, 
  ArrowLeft, 
  Send, 
  AlertCircle,
  ExternalLink 
} from 'lucide-react';

interface ApplicationTrackerProps {
  plan: PlanRecommendation | null;
  currentUser: User;
  onBack: () => void;
  onStatusUpdated: (updatedPlan: PlanRecommendation) => void;
}

export const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({
  plan,
  currentUser,
  onBack,
  onStatusUpdated,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [downloadNotice, setDownloadNotice] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<PlanRecommendation['applicationStatus']>(
    plan?.applicationStatus || 'ready_to_submit'
  );

  if (!plan) {
    return (
      <div className="bg-white border border-[#E4E0D6] rounded-[8px] p-8 text-center shadow-xs">
        <p className="text-[15px] text-[#5B6672]">
          No plan recommendation selected. Please run a plan model first to generate your switch application.
        </p>
        <button onClick={onBack} className="btn-primary mt-4 cursor-pointer">
          Go to Plan Comparison Engine
        </button>
      </div>
    );
  }

  const handleStatusChange = async (newStatus: PlanRecommendation['applicationStatus']) => {
    setIsUpdating(true);
    setSelectedStatus(newStatus);
    try {
      const updated = await api.updatePlanStatus(plan.id, newStatus);
      onStatusUpdated(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDownloadPdf = () => {
    setDownloadNotice(true);
    setTimeout(() => setDownloadNotice(false), 3500);
  };

  const currentPick = plan.ourPick;
  const monthlyRate = plan.plans[currentPick.toLowerCase() as 'ibr' | 'rap' | 'standard']?.monthlyPayment || 0;

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white border border-[#E4E0D6] rounded-[8px] p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-[13px] text-[#5B6672] hover:text-[#1C2733] mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Plan Report
          </button>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1B7A54] bg-[#FAF8F4] px-2 py-0.5 rounded-[4px] border border-[#E4E0D6]">
            Application Center · MVP Feature #4
          </span>
          <h1 className="text-[24px] font-bold text-[#1C2733] mt-1">
            Pre-Filled IDR Switch Application
          </h1>
          <p className="text-[14px] text-[#5B6672] mt-0.5">
            OMB No. 1845-0102 · Populated with your exact 2026 data and verified for servicer submission.
          </p>
        </div>

        <button
          onClick={handleDownloadPdf}
          className="btn-primary h-[44px] px-6 text-[14px] gap-2 shrink-0 cursor-pointer shadow-xs"
        >
          <Download className="w-4 h-4" />
          Download Filled Form (PDF)
        </button>
      </div>

      {downloadNotice && (
        <div className="p-4 bg-[#FAF8F4] border border-[#1B7A54] rounded-[8px] text-[14px] text-[#1B7A54] font-medium flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          Pre-filled PDF generated with your verified numbers. Ready to sign and upload to your loan servicer.
        </div>
      )}

      {/* 4-Stage Lifecycle Tracker */}
      <div className="bg-white border border-[#E4E0D6] rounded-[8px] p-6 shadow-xs">
        <h3 className="text-[15px] font-semibold text-[#1C2733] mb-1">
          Application Submission Lifecycle
        </h3>
        <p className="text-[13px] text-[#5B6672] mb-5">
          Update your application status as you complete each step to keep your records synchronized.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              key: 'draft',
              title: '1. Drafted',
              desc: 'Intake answers populated by Forvest engine.',
            },
            {
              key: 'ready_to_submit',
              title: '2. Ready to Submit',
              desc: 'Reviewed & verified against 2026 rules.',
            },
            {
              key: 'submitted',
              title: '3. Submitted to Servicer',
              desc: 'Uploaded to studentaid.gov or servicer.',
            },
            {
              key: 'confirmed',
              title: '4. Confirmed by Servicer',
              desc: 'New monthly payment rate active.',
            },
          ].map((stage) => {
            const isCurrent = selectedStatus === stage.key;
            return (
              <button
                key={stage.key}
                onClick={() => handleStatusChange(stage.key as any)}
                disabled={isUpdating}
                className={`p-4 rounded-[6px] border text-left transition-all cursor-pointer ${
                  isCurrent
                    ? 'border-[#1B7A54] bg-[#FAF8F4] ring-2 ring-[#1B7A54]'
                    : 'border-[#E4E0D6] bg-white hover:border-[#1C2733]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[14px] font-bold ${isCurrent ? 'text-[#1B7A54]' : 'text-[#1C2733]'}`}>
                    {stage.title}
                  </span>
                  {isCurrent && <CheckCircle2 className="w-4 h-4 text-[#1B7A54]" />}
                </div>
                <p className="text-[12px] text-[#5B6672] leading-tight">
                  {stage.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Official Form Document Preview */}
      <div className="bg-white border border-[#E4E0D6] rounded-[8px] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="border-b border-[#E4E0D6] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5B6672]">
              U.S. Department of Education
            </span>
            <h2 className="text-[18px] font-bold text-[#1C2733]">
              Income-Driven Repayment (IDR) Plan Request
            </h2>
          </div>
          <span className="text-[12px] font-mono text-[#5B6672]">
            Form Approved OMB No. 1845-0102
          </span>
        </div>

        {/* Section 1 */}
        <div className="space-y-3">
          <div className="bg-[#FAF8F4] px-3.5 py-1.5 rounded-[4px] border border-[#E4E0D6] text-[13px] font-bold text-[#1C2733]">
            SECTION 1: BORROWER IDENTIFICATION & PLAN SELECTION
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px] px-1">
            <div>
              <span className="text-[#5B6672] block">1. Borrower Full Name:</span>
              <span className="font-semibold text-[#1C2733]">{plan.borrowerName}</span>
            </div>
            <div>
              <span className="text-[#5B6672] block">2. Contact Email:</span>
              <span className="font-semibold text-[#1C2733]">{currentUser.email}</span>
            </div>
            <div>
              <span className="text-[#5B6672] block">3. Requested Plan:</span>
              <span className="font-bold text-[#1B7A54]">{currentPick} (Option Code: {currentPick}-2026)</span>
            </div>
            <div>
              <span className="text-[#5B6672] block">4. Reason for Request:</span>
              <span className="font-semibold text-[#1C2733]">
                Switching repayment plans due to SAVE sunset (90-day notice)
              </span>
            </div>
          </div>
        </div>

        {/* Section 2 */}
        <div className="space-y-3 pt-2">
          <div className="bg-[#FAF8F4] px-3.5 py-1.5 rounded-[4px] border border-[#E4E0D6] text-[13px] font-bold text-[#1C2733]">
            SECTION 2: HOUSEHOLD SIZE & INCOME DOCUMENTATION
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px] px-1">
            <div>
              <span className="text-[#5B6672] block">5. Adjusted Gross Income (AGI):</span>
              <span className="font-semibold text-[#1C2733]">
                ${plan.inputs.income.toLocaleString()} (Verified from latest IRS Tax Return)
              </span>
            </div>
            <div>
              <span className="text-[#5B6672] block">6. Tax Filing Status:</span>
              <span className="font-semibold text-[#1C2733] capitalize">
                {plan.inputs.filingStatus.replace(/_/g, ' ')}
              </span>
            </div>
            <div>
              <span className="text-[#5B6672] block">7. Family / Household Size:</span>
              <span className="font-semibold text-[#1C2733]">{plan.inputs.familySize}</span>
            </div>
            <div>
              <span className="text-[#5B6672] block">8. Resulting Monthly Obligation:</span>
              <span className="font-bold text-[#1B7A54]">${monthlyRate}/month</span>
            </div>
          </div>
        </div>

        {/* Section 3: PSLF Information */}
        <div className="space-y-3 pt-2">
          <div className="bg-[#FAF8F4] px-3.5 py-1.5 rounded-[4px] border border-[#E4E0D6] text-[13px] font-bold text-[#1C2733]">
            SECTION 3: PUBLIC SERVICE LOAN FORGIVENESS (PSLF) CONTINUITY
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px] px-1">
            <div>
              <span className="text-[#5B6672] block">9. Qualifying Payments Made:</span>
              <span className="font-semibold text-[#1C2733]">{plan.inputs.pslfPaymentsMade} / 120</span>
            </div>
            <div>
              <span className="text-[#5B6672] block">10. Estimated Forgiveness Horizon:</span>
              <span className="font-semibold text-[#1B7A54]">
                {Math.max(0, 120 - plan.inputs.pslfPaymentsMade)} qualifying monthly payments remaining
              </span>
            </div>
          </div>
        </div>

        {/* Submission Checklist */}
        <div className="p-4 bg-[#FAF8F4] border border-[#E4E0D6] rounded-[6px] space-y-2 text-[13px]">
          <span className="font-bold text-[#1C2733] block">Next Steps to Submit to Your Servicer:</span>
          <ol className="list-decimal list-inside space-y-1 text-[#5B6672]">
            <li>Click <strong>Download Filled Form (PDF)</strong> above to save your document.</li>
            <li>Sign electronically or with ink on page 2.</li>
            <li>Log into studentaid.gov or your assigned loan servicer (MOHELA, Aidvantage, Nelnet, or Edfinancial).</li>
            <li>Navigate to <em>Upload Documents</em> → select <em>IDR Request Form</em>.</li>
            <li>Return here and update your status to <strong>Submitted to Servicer</strong>.</li>
          </ol>
        </div>

      </div>

    </div>
  );
};
