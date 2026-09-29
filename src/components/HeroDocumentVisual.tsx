import React from 'react';

/**
 * Hero visual matching the DESIGN SPEC:
 * Overhead shot of a printed loan-plan recommendation lying on a warm paper-white desk beside a calculator
 * and a green pen, a subtle green "REVIEWED" stamp on the page, soft window daylight, palette limited to
 * paper white #FAF8F4, ink navy #1C2733, and stamp green #1B7A54.
 */
export const HeroDocumentVisual: React.FC = () => {
  return (
    <div className="relative w-full max-w-[500px] mx-auto select-none">
      {/* Warm desk surface container with soft subtle daylight gradient */}
      <div 
        className="relative p-6 sm:p-8 rounded-[8px] border border-[#E4E0D6] overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #FAF8F4 0%, #F5F1E9 100%)',
          boxShadow: '0 4px 20px -2px rgba(28, 39, 51, 0.06)',
        }}
      >
        {/* Soft daylight wash reflection in top corner */}
        <div 
          className="absolute -top-12 -left-12 w-48 h-48 rounded-full pointer-events-none opacity-40 blur-2xl"
          style={{ background: '#FFFFFF' }}
        />

        {/* The Desk Layout Grid */}
        <div className="relative flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5">
          
          {/* 1. The Printed Loan-Plan Recommendation Document */}
          <div 
            className="relative flex-1 bg-white border border-[#E4E0D6] rounded-[6px] p-5 w-full"
            style={{
              boxShadow: '0 2px 10px rgba(28, 39, 51, 0.08), 0 1px 3px rgba(28, 39, 51, 0.04)',
              transform: 'rotate(-0.8deg)',
            }}
          >
            {/* Header with Case Metadata */}
            <div className="border-b border-[#E4E0D6] pb-3 mb-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold tracking-wider text-[#1C2733] uppercase">
                  Forvest Recommendation
                </span>
                <span className="text-[10px] text-[#5B6672]">
                  Ref: FV-9042
                </span>
              </div>
              <div className="text-[12px] text-[#5B6672] mt-0.5">
                Prepared for Maya R. · Direct Loans $36,400
              </div>
            </div>

            {/* Mini Plan Comparison Table */}
            <div className="space-y-1.5 text-[11px]">
              <div className="grid grid-cols-3 text-[#5B6672] font-medium border-b border-[#E4E0D6] pb-1">
                <span>Plan</span>
                <span className="text-right">Monthly</span>
                <span className="text-right">PSLF?</span>
              </div>
              <div className="grid grid-cols-3 font-semibold text-[#1B7A54] bg-[#FAF8F4] p-1 rounded-[4px]">
                <span>IBR (Pick)</span>
                <span className="text-right tabular-nums">$378</span>
                <span className="text-right">Yes</span>
              </div>
              <div className="grid grid-cols-3 text-[#1C2733] px-1">
                <span>RAP</span>
                <span className="text-right tabular-nums">$397</span>
                <span className="text-right">Yes</span>
              </div>
              <div className="grid grid-cols-3 text-[#5B6672] px-1">
                <span>Standard (10y)</span>
                <span className="text-right tabular-nums">$404</span>
                <span className="text-right">Yes</span>
              </div>
            </div>

            {/* Recommendation summary snippet */}
            <div className="mt-3 pt-2.5 border-t border-[#E4E0D6] text-[11px] leading-tight text-[#1C2733]">
              <span className="font-semibold text-[#1B7A54]">Action:</span> Switch application prepared and ready to submit to servicer.
            </div>

            {/* Subtle green "REVIEWED" stamp */}
            <div 
              aria-label="Reviewed Stamp"
              className="absolute -bottom-2 -right-2 px-3 py-1 border-2 border-[#1B7A54] text-[#1B7A54] font-bold text-[12px] tracking-widest uppercase rounded-[4px] bg-[#FFFFFF]/90 backdrop-blur-xs select-none"
              style={{
                transform: 'rotate(-12deg)',
                boxShadow: '0 1px 3px rgba(27, 122, 84, 0.15)',
              }}
            >
              ✓ REVIEWED
            </div>
          </div>

          {/* 2. Side accessories: Calculator & Green Pen */}
          <div className="flex sm:flex-col items-center justify-between gap-4 shrink-0 sm:pt-2">
            
            {/* Desktop Calculator */}
            <div 
              className="w-20 bg-[#FFFFFF] border border-[#E4E0D6] rounded-[6px] p-2"
              style={{
                boxShadow: '0 2px 6px rgba(28, 39, 51, 0.06)',
                transform: 'rotate(2deg)',
              }}
            >
              {/* Solar Strip */}
              <div className="bg-[#1C2733]/10 h-2 rounded-[2px] mb-1.5 flex items-center justify-around px-0.5">
                <span className="w-1.5 h-1 bg-[#1C2733]/30 rounded-xs" />
                <span className="w-1.5 h-1 bg-[#1C2733]/30 rounded-xs" />
                <span className="w-1.5 h-1 bg-[#1C2733]/30 rounded-xs" />
              </div>
              {/* LCD Display */}
              <div className="bg-[#FAF8F4] border border-[#E4E0D6] rounded-[2px] px-1 py-0.5 text-right font-mono text-[10px] text-[#1C2733] font-bold">
                $378.00
              </div>
              {/* Keypad Grid */}
              <div className="grid grid-cols-3 gap-1 mt-1.5">
                {[7, 8, 9, 4, 5, 6, 1, 2, 3].map((n) => (
                  <div key={n} className="h-2.5 bg-[#FAF8F4] border border-[#E4E0D6] rounded-[2px] text-[7px] text-[#5B6672] flex items-center justify-center font-mono">
                    {n}
                  </div>
                ))}
              </div>
            </div>

            {/* Green Pen with Clip */}
            <div 
              className="relative w-3 sm:w-2.5 h-28 sm:h-32 flex flex-col items-center"
              style={{ transform: 'rotate(8deg)' }}
              title="Specialist Review Pen"
            >
              {/* Pen Clicker / Top */}
              <div className="w-2 h-2.5 bg-[#1C2733] rounded-t-xs" />
              {/* Brass Clip */}
              <div className="absolute top-2 right-[-2px] w-1 h-8 bg-[#1C2733]/80 rounded-r-xs" />
              {/* Pen Barrel in Stamp Green #1B7A54 */}
              <div className="w-2.5 sm:w-2 flex-1 bg-[#1B7A54] rounded-sm" />
              {/* Pen Grip */}
              <div className="w-2.5 sm:w-2 h-4 bg-[#135E40]" />
              {/* Pen Tip */}
              <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[7px] border-t-[#1C2733]" />
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
