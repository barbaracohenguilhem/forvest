import React, { useState } from 'react';
import { CheckCircle2, ArrowRight, RotateCcw, AlertTriangle } from 'lucide-react';

interface QuizToolProps {
  onNavigateToCompare: () => void;
}

export const QuizTool: React.FC<QuizToolProps> = ({ onNavigateToCompare }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    pslf: '',
    disbursementYear: '',
    priority: '',
    filing: '',
  });

  const questions = [
    {
      id: 'pslf',
      question: 'Are you working in public service or pursuing PSLF?',
      options: [
        { label: 'Yes — ER nurse, teacher, government, or 501(c)(3) employee', value: 'yes' },
        { label: 'No — Private sector or self-employed without qualifying employer', value: 'no' },
        { label: 'Not sure — I need to verify qualifying employment', value: 'unsure' },
      ],
    },
    {
      id: 'disbursementYear',
      question: 'When did you first take out federal student loans?',
      options: [
        { label: 'Before July 1, 2014 (Older loans — 15% discretionary tier)', value: 'pre2014' },
        { label: 'After July 1, 2014 (Newer borrower — 10% discretionary tier)', value: 'post2014' },
        { label: 'I have a mix of both / consolidated loans', value: 'mix' },
      ],
    },
    {
      id: 'priority',
      question: 'What is your #1 financial priority right now?',
      options: [
        { label: 'Lowest possible monthly cash outlay while protecting forgiveness', value: 'lowest_payment' },
        { label: 'Paying off debt as fast as possible with minimum total interest', value: 'payoff' },
        { label: 'Meeting my 90-day deadline before auto-enrollment into Standard', value: 'deadline' },
      ],
    },
    {
      id: 'filing',
      question: 'What is your current or planned tax filing status?',
      options: [
        { label: 'Single', value: 'single' },
        { label: 'Married Filing Separately (MFS to exclude spouse income)', value: 'mfs' },
        { label: 'Married Filing Jointly (MFJ)', value: 'mfj' },
      ],
    },
  ];

  const handleSelectOption = (value: string) => {
    const qKey = questions[step].id;
    const nextAnswers = { ...answers, [qKey]: value };
    setAnswers(nextAnswers);

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setStep(questions.length); // Results
    }
  };

  const isCompleted = step >= questions.length;

  return (
    <div className="max-w-[700px] mx-auto space-y-6">
      
      {/* Quiz Card */}
      <div className="bg-white border border-[#E4E0D6] rounded-[8px] p-6 sm:p-8 shadow-xs">
        
        <div className="border-b border-[#E4E0D6] pb-4 mb-6">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1B7A54] bg-[#FAF8F4] px-2 py-0.5 rounded-[4px] border border-[#E4E0D6]">
            Free Repayment Plan Quiz
          </span>
          <h1 className="text-[22px] sm:text-[24px] font-bold text-[#1C2733] mt-1.5">
            Which Plan Fits Your Situation After SAVE?
          </h1>
          <p className="text-[14px] text-[#5B6672] mt-0.5">
            Answer 4 rapid questions to filter your eligibility for RAP, IBR, and Standard.
          </p>
        </div>

        {!isCompleted ? (
          <div>
            <div className="flex items-center justify-between text-[12px] text-[#5B6672] font-semibold mb-3">
              <span>Question {step + 1} of {questions.length}</span>
              <span>{Math.round(((step + 1) / questions.length) * 100)}% Complete</span>
            </div>

            <div className="w-full bg-[#FAF8F4] h-1.5 rounded-full overflow-hidden mb-6 border border-[#E4E0D6]">
              <div 
                className="bg-[#1B7A54] h-full transition-all duration-300"
                style={{ width: `${((step + 1) / questions.length) * 100}%` }}
              />
            </div>

            <h3 className="text-[18px] font-semibold text-[#1C2733] mb-4">
              {questions[step].question}
            </h3>

            <div className="space-y-3">
              {questions[step].options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleSelectOption(opt.value)}
                  className="w-full p-4 text-left rounded-[6px] border border-[#E4E0D6] bg-white hover:bg-[#FAF8F4] hover:border-[#1C2733] transition-colors cursor-pointer text-[15px] font-medium text-[#1C2733] flex items-center justify-between group"
                >
                  <span>{opt.label}</span>
                  <ArrowRight className="w-4 h-4 text-[#5B6672] group-hover:text-[#1C2733] transition-colors" />
                </button>
              ))}
            </div>

            {step > 0 && (
              <div className="mt-6 pt-4 border-t border-[#E4E0D6] flex justify-between">
                <button
                  onClick={() => setStep(step - 1)}
                  className="text-[13px] text-[#5B6672] hover:text-[#1C2733] cursor-pointer"
                >
                  ← Back to previous question
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Quiz Results */
          <div className="space-y-5">
            <div className="p-4 bg-[#FAF8F4] border border-[#1B7A54] rounded-[6px]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#1B7A54]">
                Quiz Assessment
              </span>
              <h3 className="text-[19px] font-bold text-[#1C2733] mt-1">
                {answers.pslf === 'yes' ? 'Primary Recommendation: IBR with PSLF Protection' : 'Primary Recommendation: RAP (Repayment Assistance Plan)'}
              </h3>
              <p className="text-[14px] text-[#5B6672] mt-1 leading-relaxed">
                {answers.pslf === 'yes'
                  ? 'Because you are pursuing PSLF, your sole objective is the lowest qualifying monthly payment. With the IBR hardship gate removed in December 2025, IBR guarantees every payment counts toward your 120 finish line while keeping payments low.'
                  : 'Under the new July 2026 rules, RAP protects up to 225% of the federal poverty line with a 10% discretionary cap. It minimizes cash outflow and prevents interest runaway.'}
              </p>
            </div>

            <div className="p-4 border border-[#E4E0D6] rounded-[6px] bg-white text-[13px] text-[#1C2733] space-y-2">
              <strong className="block text-[#1C2733]">Critical Rules Identified For You:</strong>
              {answers.disbursementYear === 'pre2014' && (
                <p>• <strong>Pre-2014 Disbursal:</strong> You fall under the 15% discretionary tier. We will verify if consolidation offers a 10% RAP advantage.</p>
              )}
              {answers.filing === 'mfs' && (
                <p>• <strong>Married Filing Separately:</strong> Both IBR and RAP allow excluding spousal income on your switch application.</p>
              )}
              {answers.pslf === 'yes' && (
                <p>• <strong>Graduated Plan Trap:</strong> Do not select Graduated even if your servicer suggests it is cheaper; it does NOT count toward PSLF.</p>
              )}
            </div>

            <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => {
                  setAnswers({ pslf: '', disbursementYear: '', priority: '', filing: '' });
                  setStep(0);
                }}
                className="text-[13px] text-[#5B6672] hover:text-[#1C2733] flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Retake Quiz
              </button>

              <button
                onClick={onNavigateToCompare}
                className="btn-primary h-[44px] px-6 text-[14px] gap-2 cursor-pointer w-full sm:w-auto"
              >
                Run Plan Comparison With Real Numbers
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
