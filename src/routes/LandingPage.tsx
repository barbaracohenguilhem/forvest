import React, { useState } from 'react';
import { 
  FileCheck, 
  PenTool, 
  ShieldCheck, 
  Tag, 
  Clock, 
  Calendar,
  ChevronDown,
  User as UserIcon,
  ArrowRight
} from 'lucide-react';
import { ForvestLogo } from '../components/ForvestLogo';
import { HeroDocumentVisual } from '../components/HeroDocumentVisual';
import { DemoReport } from '../components/DemoReport';
import { EmailCaptureForm } from '../components/EmailCaptureForm';
import { CaptureModal } from '../components/CaptureModal';
import { AuthModal } from '../components/AuthModal';
import { api } from '../services/api';
import { User } from '../types';

interface LandingPageProps {
  onEnterApp: () => void;
  currentUser: User | null;
  onAuthSuccess: (user: User) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterApp,
  currentUser,
  onAuthSuccess,
}) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'signin' | 'signup'>('signin');
  const [isCaptureModalOpen, setIsCaptureModalOpen] = useState(false);
  const [selectedTierInfo, setSelectedTierInfo] = useState<{ name: string; price: string }>({
    name: 'Plan Picker',
    price: '$249',
  });

  const [openFaqIndices, setOpenFaqIndices] = useState<number[]>([0]);

  const toggleFaq = (index: number) => {
    setOpenFaqIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleOpenAuth = (mode: 'signin' | 'signup') => {
    setAuthInitialMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleTierClick = (name: string, price: string) => {
    api.trackEvent('checkout_clicked', { tier: name, price });
    setSelectedTierInfo({ name, price });
    setIsCaptureModalOpen(true);
  };

  const handleHeroCtaClick = () => {
    api.trackEvent('pricing_viewed', { source: 'hero_nav_cta' });
    if (currentUser) {
      onEnterApp();
    } else {
      handleOpenAuth('signup');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F4] text-[#1C2733] font-sans selection:bg-[#1B7A54]/20 selection:text-[#1C2733]">
      
      {/* 1. Top Navigation Bar (Strict Top Bar Contract) */}
      <nav className="h-[72px] bg-[#FAF8F4] border-b border-[#E4E0D6] sticky top-0 z-40">
        <div className="max-w-[1080px] h-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          <a href="#" className="flex items-center gap-2.5">
            <ForvestLogo size={24} className="shrink-0" />
            <span className="font-serif font-bold text-[22px] tracking-tight text-[#1C2733]">
              Forvest
            </span>
          </a>

          <div className="hidden md:flex items-center gap-8 text-[15px] font-medium text-[#5B6672]">
            <a href="#how-it-works" className="hover:text-[#1C2733] transition-colors">
              How it works
            </a>
            <a href="#pricing" className="hover:text-[#1C2733] transition-colors">
              Pricing
            </a>
            <a href="#faq" className="hover:text-[#1C2733] transition-colors">
              FAQ
            </a>
          </div>

          <div className="flex items-center gap-4">
            {currentUser ? (
              <button
                onClick={onEnterApp}
                className="text-[14px] font-semibold text-[#1B7A54] hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                <UserIcon className="w-4 h-4" />
                Go to Workspace
              </button>
            ) : (
              <button
                onClick={() => handleOpenAuth('signin')}
                className="text-[14px] font-medium text-[#5B6672] hover:text-[#1C2733] transition-colors cursor-pointer"
              >
                Sign in
              </button>
            )}

            <button
              onClick={handleHeroCtaClick}
              className="btn-primary text-[14px] px-4 py-2.5 sm:px-5 sm:py-2.5 cursor-pointer shadow-xs"
            >
              Lock in my $149 founding price
            </button>
          </div>

        </div>
      </nav>

      {/* 1. HERO SECTION */}
      <section className="bg-[#FAF8F4] py-16 sm:py-24">
        <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <h1 className="text-h1 text-[#1C2733]">
                Kicked off SAVE? Your new plan, picked in 48 hours.
              </h1>

              <p className="text-body text-[#5B6672] max-w-[58ch]">
                A written recommendation plus your switch application filled out — specialist-reviewed, delivered in two business days, for one flat fee.
              </p>

              <div className="pt-2 max-w-[500px]">
                <EmailCaptureForm 
                  source="hero_main" 
                  onSuccess={() => {
                    // Lead captured
                  }}
                />
              </div>

              <div className="pt-2">
                <p className="text-small text-[#5B6672] border-l-2 border-[#E4E0D6] pl-3 max-w-[54ch]">
                  Picking the wrong plan can cost $200–$400 a month. The only paid alternative charges $595 for a phone call — and leaves the paperwork to you.
                </p>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <HeroDocumentVisual />
            </div>

          </div>
        </div>
      </section>

      {/* 2. PROBLEM SECTION */}
      <section className="bg-white py-16 sm:py-24 border-y border-[#E4E0D6]">
        <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-[800px]">
            <h2 className="text-h2 text-[#1C2733] mb-8">
              90 days to decide, and no straight answers
            </h2>

            <div className="space-y-5 text-body text-[#1C2733]">
              <div className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-[#1C2733] mt-2.5 shrink-0" />
                <p>Your servicer's rep gives you one answer on Monday and a different one on Thursday — and neither will put it in writing.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-[#1C2733] mt-2.5 shrink-0" />
                <p>The studentaid.gov calculator shows Graduated as your cheapest plan. It doesn't tell you Graduated payments don't count toward PSLF.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-[#1C2733] mt-2.5 shrink-0" />
                <p>The free nonprofit help answers 12,000+ emails a year and has no phone line. Your deadline won't wait for the queue.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-[#1C2733] mt-2.5 shrink-0" />
                <p>Miss your notice deadline and you're auto-enrolled in Standard — whether it's right for you or not.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section id="how-it-works" className="bg-[#FAF8F4] py-16 sm:py-24">
        <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-h2 text-[#1C2733] mb-12">How it works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
            <div className="space-y-3">
              <span className="text-[14px] font-semibold text-[#1B7A54] tracking-wider uppercase">Step 1</span>
              <h3 className="text-h3 text-[#1C2733]">Enter your numbers.</h3>
              <p className="text-body text-[#5B6672]">
                Loan balances, income, filing status, and PSLF payment count. Takes about 10 minutes, no account with your servicer needed.
              </p>
            </div>
            <div className="space-y-3">
              <span className="text-[14px] font-semibold text-[#1B7A54] tracking-wider uppercase">Step 2</span>
              <h3 className="text-h3 text-[#1C2733]">We run every plan.</h3>
              <p className="text-body text-[#5B6672]">
                Our model calculates RAP, IBR, and Standard against your real numbers. A credentialed specialist reviews every complex case — PSLF buyback, pre-2014 loans, married filing separately, self-employed income.
              </p>
            </div>
            <div className="space-y-3">
              <span className="text-[14px] font-semibold text-[#1B7A54] tracking-wider uppercase">Step 3</span>
              <h3 className="text-h3 text-[#1C2733]">Get your plan in 48 hours.</h3>
              <p className="text-body text-[#5B6672]">
                A written recommendation with the math, the trade-offs, and the tax notes — plus your switch application filled out and ready to submit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. DEMO REPORT */}
      <DemoReport />

      {/* 5. BENEFITS */}
      <section className="bg-[#FAF8F4] py-16 sm:py-24">
        <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-h2 text-[#1C2733] mb-12">Why federal borrowers pick Forvest</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="forvest-card p-6 flex flex-col justify-between">
              <div className="space-y-3">
                <FileCheck className="w-6 h-6 text-[#1C2733]" strokeWidth={1.5} />
                <h3 className="text-h3 text-[#1C2733]">It's in writing.</h3>
                <p className="text-[15px] text-[#5B6672] leading-relaxed">
                  No scrambling to take notes on a call. Your recommendation, your numbers, and every assumption — in a document you keep.
                </p>
              </div>
            </div>

            <div className="forvest-card p-6 flex flex-col justify-between">
              <div className="space-y-3">
                <PenTool className="w-6 h-6 text-[#1C2733]" strokeWidth={1.5} />
                <h3 className="text-h3 text-[#1C2733]">The paperwork is done.</h3>
                <p className="text-[15px] text-[#5B6672] leading-relaxed">
                  Your plan-switch application arrives filled out. Review it, sign it, submit it.
                </p>
              </div>
            </div>

            <div className="forvest-card p-6 flex flex-col justify-between">
              <div className="space-y-3">
                <ShieldCheck className="w-6 h-6 text-[#1C2733]" strokeWidth={1.5} />
                <h3 className="text-h3 text-[#1C2733]">A specialist checks the hard cases.</h3>
                <p className="text-[15px] text-[#5B6672] leading-relaxed">
                  PSLF buyback, pre-2014 consolidation, MFS, self-employment — flagged automatically and reviewed by a credentialed human.
                </p>
              </div>
            </div>

            <div className="forvest-card p-6 flex flex-col justify-between">
              <div className="space-y-3">
                <Tag className="w-6 h-6 text-[#1C2733]" strokeWidth={1.5} />
                <h3 className="text-h3 text-[#1C2733]">Half the price of the alternative.</h3>
                <p className="text-[15px] text-[#5B6672] leading-relaxed">
                  $249 flat, versus $595 for an hour on Zoom with no paperwork included.
                </p>
              </div>
            </div>

            <div className="forvest-card p-6 flex flex-col justify-between">
              <div className="space-y-3">
                <Clock className="w-6 h-6 text-[#1C2733]" strokeWidth={1.5} />
                <h3 className="text-h3 text-[#1C2733]">Fast enough for your deadline.</h3>
                <p className="text-[15px] text-[#5B6672] leading-relaxed">
                  Two business days, not a two-month waitlist.
                </p>
              </div>
            </div>

            <div className="forvest-card p-6 flex flex-col justify-between">
              <div className="space-y-3">
                <Calendar className="w-6 h-6 text-[#1C2733]" strokeWidth={1.5} />
                <h3 className="text-h3 text-[#1C2733]">PSLF math done right.</h3>
                <p className="text-[15px] text-[#5B6672] leading-relaxed">
                  Your forgiveness date, your remaining payment count, and which plans protect the clock.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PRICING */}
      <section id="pricing" className="bg-white py-16 sm:py-24 border-y border-[#E4E0D6]">
        <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-[650px] mx-auto mb-16">
            <h2 className="text-h2 text-[#1C2733] mb-3">Simple, flat pricing. No subscriptions.</h2>
            <p className="text-body text-[#5B6672]">Founding users lock in $149 early pricing across all options.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch pt-4">
            
            {/* Tier 1 — Plan Picker */}
            <div 
              className="bg-white rounded-[8px] p-6 sm:p-8 flex flex-col justify-between relative order-first lg:order-2"
              style={{
                border: '2px solid #1B7A54',
                transform: 'scale(1.03)',
                boxShadow: '0 4px 20px rgba(27, 122, 84, 0.1)',
                zIndex: 10,
              }}
            >
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#1B7A54] text-white text-[12px] font-semibold uppercase tracking-wider px-3 py-1 rounded-[4px]">
                Recommended
              </div>

              <div>
                <h3 className="text-h3 text-[#1C2733]">Plan Picker</h3>
                <div className="mt-3 mb-1 flex items-baseline gap-2">
                  <span className="text-[36px] font-bold text-[#1C2733]">$249</span>
                  <span className="text-[14px] text-[#1B7A54] font-medium">($149 founding spot)</span>
                </div>
                <p className="text-[13px] text-[#5B6672] mb-6">
                  Best for: most borrowers holding a 90-day notice.
                </p>

                <ul className="space-y-3 text-[15px] text-[#1C2733] pb-6 border-b border-[#E4E0D6]">
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#1B7A54] font-bold">✓</span>
                    <span>Full RAP vs IBR vs Standard model on your numbers</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#1B7A54] font-bold">✓</span>
                    <span>Written recommendation with trade-offs and tax notes</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#1B7A54] font-bold">✓</span>
                    <span>Switch application filled out and ready to submit</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#1B7A54] font-bold">✓</span>
                    <span>Delivered in 2 business days</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => handleTierClick('Plan Picker', '$249')}
                  className="btn-primary w-full h-[48px] justify-center cursor-pointer"
                >
                  Reserve my Plan Picker spot
                </button>
              </div>
            </div>

            {/* Tier 2 — Complex Case Review */}
            <div className="forvest-card p-6 sm:p-8 flex flex-col justify-between order-2 lg:order-1">
              <div>
                <h3 className="text-h3 text-[#1C2733]">Complex Case Review</h3>
                <div className="mt-3 mb-1 flex items-baseline gap-2">
                  <span className="text-[36px] font-bold text-[#1C2733]">$449</span>
                </div>
                <p className="text-[13px] text-[#5B6672] mb-6">
                  Best for: borrowers whose situation doesn't fit the servicer's script.
                </p>

                <ul className="space-y-3 text-[15px] text-[#1C2733] pb-6 border-b border-[#E4E0D6]">
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#1B7A54] font-bold">✓</span>
                    <span>Everything in Plan Picker</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#1B7A54] font-bold">✓</span>
                    <span>Credentialed specialist works your full case file</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#1B7A54] font-bold">✓</span>
                    <span>Covers PSLF buyback, pre-2014, MFS, and self-employed scenarios</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#1B7A54] font-bold">✓</span>
                    <span>Written answers to up to 5 follow-up questions</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => handleTierClick('Complex Case Review', '$449')}
                  className="btn-secondary w-full h-[48px] justify-center cursor-pointer"
                >
                  Reserve my Complex Case spot
                </button>
              </div>
            </div>

            {/* Tier 3 — IDR Watch */}
            <div className="forvest-card p-6 sm:p-8 flex flex-col justify-between order-3">
              <div>
                <h3 className="text-h3 text-[#1C2733]">IDR Watch</h3>
                <div className="mt-3 mb-1 flex items-baseline gap-2">
                  <span className="text-[36px] font-bold text-[#1C2733]">$9</span>
                  <span className="text-[14px] text-[#5B6672]">/month</span>
                </div>
                <p className="text-[13px] text-[#5B6672] mb-6">
                  Best for: staying protected after your switch is done.
                </p>

                <ul className="space-y-3 text-[15px] text-[#1C2733] pb-6 border-b border-[#E4E0D6]">
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#1B7A54] font-bold">✓</span>
                    <span>Recertification deadline reminders</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#1B7A54] font-bold">✓</span>
                    <span>Alerts when rules change and affect your plan</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#1B7A54] font-bold">✓</span>
                    <span>Annual payment re-check on your numbers</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => handleTierClick('IDR Watch', '$9/month')}
                  className="btn-secondary w-full h-[48px] justify-center cursor-pointer"
                >
                  Join the IDR Watch list
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. FAQ */}
      <section id="faq" className="bg-[#FAF8F4] py-16 sm:py-24">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-h2 text-[#1C2733] mb-12">Frequently Asked Questions</h2>

          <div className="divide-y divide-[#E4E0D6] border-y border-[#E4E0D6]">
            
            {/* FAQ 1: Updated honestly per Phase 4 */}
            <div className="py-5">
              <button
                onClick={() => toggleFaq(0)}
                className="w-full flex items-center justify-between text-left text-[17px] font-semibold text-[#1C2733] cursor-pointer"
              >
                <span>Is this available yet?</span>
                <ChevronDown className={`w-5 h-5 text-[#5B6672] transition-transform duration-200 ${openFaqIndices.includes(0) ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndices.includes(0) && (
                <p className="mt-3 text-body text-[#5B6672] leading-relaxed">
                  Yes! Our Plan Comparison Engine and intake preview are live now in the app. Sign up today to lock your Plan Picker at $149 instead of $249, and run your side-by-side models immediately.
                </p>
              )}
            </div>

            {/* FAQ 2 */}
            <div className="py-5">
              <button
                onClick={() => toggleFaq(1)}
                className="w-full flex items-center justify-between text-left text-[17px] font-semibold text-[#1C2733] cursor-pointer"
              >
                <span>How do I know this isn't another loan-relief scam?</span>
                <ChevronDown className={`w-5 h-5 text-[#5B6672] transition-transform duration-200 ${openFaqIndices.includes(1) ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndices.includes(1) && (
                <p className="mt-3 text-body text-[#5B6672] leading-relaxed">
                  Fair question — the FTC has shut down bad actors in this space. Forvest never takes power of attorney, never touches your loans, and never contacts your servicer. We prepare advice and documents; you stay in control and submit everything yourself.
                </p>
              )}
            </div>

            {/* FAQ 3 */}
            <div className="py-5">
              <button
                onClick={() => toggleFaq(2)}
                className="w-full flex items-center justify-between text-left text-[17px] font-semibold text-[#1C2733] cursor-pointer"
              >
                <span>Why pay when free help exists?</span>
                <ChevronDown className={`w-5 h-5 text-[#5B6672] transition-transform duration-200 ${openFaqIndices.includes(2) ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndices.includes(2) && (
                <p className="mt-3 text-body text-[#5B6672] leading-relaxed">
                  If TISLA or your servicer can answer your question, use them. But the free channels are overwhelmed, can't model your specific numbers, and won't fill out your application. When a wrong pick costs $200–$400 a month, $249 once is cheap insurance.
                </p>
              )}
            </div>

            {/* FAQ 4 */}
            <div className="py-5">
              <button
                onClick={() => toggleFaq(3)}
                className="w-full flex items-center justify-between text-left text-[17px] font-semibold text-[#1C2733] cursor-pointer"
              >
                <span>Do you file the switch for me?</span>
                <ChevronDown className={`w-5 h-5 text-[#5B6672] transition-transform duration-200 ${openFaqIndices.includes(3) ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndices.includes(3) && (
                <p className="mt-3 text-body text-[#5B6672] leading-relaxed">
                  No — and that's deliberate. You get the application filled out and ready; you review, sign, and submit it through studentaid.gov or your servicer. You keep full control of your account.
                </p>
              )}
            </div>

            {/* FAQ 5 */}
            <div className="py-5">
              <button
                onClick={() => toggleFaq(4)}
                className="w-full flex items-center justify-between text-left text-[17px] font-semibold text-[#1C2733] cursor-pointer"
              >
                <span>My case is messy — buyback months, pre-2014 loans, married filing separately. Can you handle it?</span>
                <ChevronDown className={`w-5 h-5 text-[#5B6672] transition-transform duration-200 ${openFaqIndices.includes(4) ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndices.includes(4) && (
                <p className="mt-3 text-body text-[#5B6672] leading-relaxed">
                  Those are exactly the cases we built for. Anything complex is automatically flagged and reviewed by a credentialed specialist before your recommendation goes out.
                </p>
              )}
            </div>

            {/* FAQ 6 */}
            <div className="py-5">
              <button
                onClick={() => toggleFaq(5)}
                className="w-full flex items-center justify-between text-left text-[17px] font-semibold text-[#1C2733] cursor-pointer"
              >
                <span>What if the rules change again after I get my plan?</span>
                <ChevronDown className={`w-5 h-5 text-[#5B6672] transition-transform duration-200 ${openFaqIndices.includes(5) ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndices.includes(5) && (
                <p className="mt-3 text-body text-[#5B6672] leading-relaxed">
                  The recommendation is based on current regulations, dated and documented. If a rule change breaks our recommendation within 90 days of delivery, we re-run your case free.
                </p>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* 8. FINAL CTA */}
      <section className="bg-white py-16 sm:py-24 border-t border-[#E4E0D6]">
        <div className="max-w-[720px] mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-h2 text-[#1C2733]">
            One flat fee. One written plan. Your application done — before your deadline isn't.
          </h2>

          <p className="text-body text-[#5B6672]">
            Founding users lock the Plan Picker at $149 instead of $249. No payment now — you're reserving a spot, not buying.
          </p>

          <div className="pt-4 max-w-[480px] mx-auto text-left">
            <EmailCaptureForm source="final_cta" />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#FAF8F4] border-t border-[#E4E0D6] py-12">
        <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-[13px] text-[#5B6672]">
          <div className="flex items-center gap-2">
            <ForvestLogo size={20} />
            <span className="font-serif font-bold text-[16px] text-[#1C2733]">Forvest</span>
            <span className="ml-2">© {new Date().getFullYear()} Forvest Technologies. All rights reserved.</span>
          </div>

          <div className="text-center sm:text-right max-w-[500px]">
            Forvest provides document preparation and financial modeling software. We are not a loan servicer and do not take power of attorney.
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CaptureModal
        isOpen={isCaptureModalOpen}
        onClose={() => setIsCaptureModalOpen(false)}
        tierName={selectedTierInfo.name}
        tierPrice={selectedTierInfo.price}
        source={`pricing_${selectedTierInfo.name.toLowerCase().replace(/\s+/g, '_')}`}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={onAuthSuccess}
        initialMode={authInitialMode}
      />

    </div>
  );
};
