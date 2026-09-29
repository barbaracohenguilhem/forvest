import React from 'react';
import { EmailCaptureForm } from './EmailCaptureForm';

export const DemoReport: React.FC = () => {
  return (
    <section className="bg-white py-16 sm:py-24 border-y border-[#E4E0D6]">
      <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Intro line */}
        <div className="text-center max-w-[720px] mx-auto mb-8 sm:mb-12">
          <p className="text-[17px] sm:text-[19px] text-[#1C2733] font-medium">
            This is what lands in your inbox — a real example, with real math.
          </p>
        </div>

        {/* The Document-style Report Card centered at 720px */}
        <div className="max-w-[720px] mx-auto">
          
          {/* Case Input Line */}
          <div className="bg-[#FAF8F4] border border-[#E4E0D6] rounded-t-[8px] p-4 text-[14px] text-[#1C2733] font-normal leading-relaxed">
            <span className="font-semibold text-[#1C2733]">CASE FILE: </span>
            Maya — ER nurse at a public hospital. $36,400 in Direct Loans, $68,000 income, single, 105 qualifying PSLF payments made, 15 to go. Kicked off SAVE, notice deadline in 41 days.
          </div>

          {/* The Report Card */}
          <div 
            className="bg-white border-x border-b border-[#E4E0D6] rounded-b-[8px] p-6 sm:p-8"
            style={{ boxShadow: '0 1px 3px rgba(28, 39, 51, 0.08)' }}
          >
            {/* Header row */}
            <div className="border-b border-[#E4E0D6] pb-4 mb-6">
              <h3 className="text-[18px] sm:text-[20px] font-semibold text-[#1C2733] leading-snug">
                FORVEST PLAN RECOMMENDATION — Prepared for Maya R. · Reviewed by a credentialed specialist
              </h3>
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-left border-collapse text-[14px] sm:text-[15px]">
                <thead>
                  <tr className="border-b border-[#E4E0D6] text-[#5B6672] font-semibold">
                    <th className="py-2.5 pr-4">Plan</th>
                    <th className="py-2.5 px-3 text-right">Monthly payment</th>
                    <th className="py-2.5 px-3 text-center">Counts toward PSLF?</th>
                    <th className="py-2.5 pl-3 text-right">You pay before forgiveness</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4E0D6]">
                  {/* IBR Row (Pick) */}
                  <tr className="bg-[#FAF8F4]/80 font-medium">
                    <td className="py-3 pr-4 font-semibold text-[#1B7A54]">
                      IBR <span className="text-[12px] bg-[#1B7A54] text-white px-1.5 py-0.5 rounded-[4px] ml-1 font-semibold">PICK</span>
                    </td>
                    <td className="py-3 px-3 text-right font-semibold text-[#1B7A54] tabular-nums">$378</td>
                    <td className="py-3 px-3 text-center text-[#1C2733]">Yes</td>
                    <td className="py-3 pl-3 text-right font-semibold text-[#1B7A54] tabular-nums">$5,670 over 15 months</td>
                  </tr>
                  {/* RAP Row */}
                  <tr>
                    <td className="py-3 pr-4 text-[#1C2733]">RAP</td>
                    <td className="py-3 px-3 text-right text-[#1C2733] tabular-nums">$397</td>
                    <td className="py-3 px-3 text-center text-[#1C2733]">Yes</td>
                    <td className="py-3 pl-3 text-right text-[#1C2733] tabular-nums">$5,955 over 15 months</td>
                  </tr>
                  {/* Standard Row */}
                  <tr>
                    <td className="py-3 pr-4 text-[#1C2733]">Standard (10-yr)</td>
                    <td className="py-3 px-3 text-right text-[#1C2733] tabular-nums">$404</td>
                    <td className="py-3 px-3 text-center text-[#1C2733]">Yes</td>
                    <td className="py-3 pl-3 text-right text-[#1C2733] tabular-nums">$6,060 over 15 months</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Recommendation Box */}
            <div className="bg-[#FAF8F4] border-l-4 border-[#1B7A54] p-4 rounded-r-[6px] mb-5">
              <p className="text-[15px] sm:text-[16px] text-[#1C2733] leading-relaxed">
                <strong className="text-[#1B7A54]">OUR PICK: IBR.</strong> Since the hardship requirement was removed in December 2025, you qualify. It's your lowest payment, every payment counts toward PSLF, and in 15 months your remaining ~$31,000 balance is forgiven tax-free. Filing the switch now protects your deadline.
              </p>
            </div>

            {/* Warning Box */}
            <div className="bg-[#FAF8F4] border-l-4 border-[#5B6672] p-4 rounded-r-[6px] mb-5">
              <p className="text-[14px] sm:text-[15px] text-[#1C2733] leading-relaxed">
                <strong>⚠ WATCH OUT:</strong> The studentaid.gov calculator may show Graduated as your cheapest option at $130/month. Graduated payments do NOT count toward PSLF. Picking it would freeze your forgiveness clock 15 payments from the finish line.
              </p>
            </div>

            {/* Next Steps List */}
            <div className="bg-white border border-[#E4E0D6] rounded-[6px] p-4 mb-2">
              <p className="text-[13px] font-semibold text-[#5B6672] uppercase tracking-wider mb-2">
                NEXT STEPS:
              </p>
              <ol className="space-y-1.5 text-[14px] sm:text-[15px] text-[#1C2733]">
                <li>1) Review the IBR application we've filled out for you.</li>
                <li>2) Sign and submit it through your servicer.</li>
                <li>3) Keep paying on your current schedule until the switch confirms.</li>
              </ol>
            </div>

          </div>

          {/* Email form directly beneath it */}
          <div className="mt-8 bg-[#FAF8F4] border border-[#E4E0D6] rounded-[8px] p-6 text-center">
            <h4 className="text-[20px] font-semibold text-[#1C2733] mb-1">
              Want your numbers run like this?
            </h4>
            <p className="text-[15px] text-[#5B6672] mb-4">
              Lock in your founding spot to get your personalized report in 48 hours.
            </p>
            <EmailCaptureForm source="demo_report_below" />
          </div>

        </div>

      </div>
    </section>
  );
};
