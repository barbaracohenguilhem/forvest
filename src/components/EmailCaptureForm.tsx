import React, { useState } from 'react';
import { storageService } from '../services/storage';

interface EmailCaptureFormProps {
  source: string;
  selectedTier?: string;
  className?: string;
  onSuccess?: () => void;
  compact?: boolean;
}

export const EmailCaptureForm: React.FC<EmailCaptureFormProps> = ({
  source,
  selectedTier,
  className = '',
  onSuccess,
  compact = false,
}) => {
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Honeypot check
    if (honeypot) {
      setIsSuccess(true);
      return;
    }

    // Basic email check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      await storageService.submitLead({
        email: email.trim(),
        source,
        tier: selectedTier || 'Plan Picker ($149 founding price)',
        honeypot,
      });

      setIsSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div 
        className={`bg-white border border-[#1B7A54] rounded-[8px] p-5 text-left text-[15px] text-[#1C2733] ${className}`}
        style={{ boxShadow: '0 1px 3px rgba(28,39,51,0.08)' }}
      >
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 rounded-full bg-[#1B7A54] text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
            ✓
          </div>
          <div>
            <p className="font-semibold text-[#1C2733] mb-1">
              You're in — your $149 founding price is locked to this email.
            </p>
            <p className="text-[14px] text-[#5B6672]">
              Within 7 days we'll send you the 10-minute intake preview and your place in line for launch.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`w-full ${className}`}>
      {/* Honeypot field - visually hidden */}
      <div className="absolute left-[-9999px] top-[-9999px]" aria-hidden="true">
        <label htmlFor={`hp_${source}`}>Do not fill this</label>
        <input
          type="text"
          id={`hp_${source}`}
          name="company_title"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div className={`flex flex-col ${compact ? 'sm:flex-col' : 'sm:flex-row'} items-stretch gap-3`}>
        <div className="relative flex-1">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errorMessage) setErrorMessage('');
            }}
            placeholder="you@email.com"
            required
            aria-label="Email address"
            className="w-full h-[50px] px-4 bg-white border border-[#E4E0D6] rounded-[8px] text-[16px] text-[#1C2733] placeholder-[#5B6672]/70 focus:outline-hidden focus:border-[#1B7A54] focus:ring-1 focus:ring-[#1B7A54] transition-colors"
          />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary h-[50px] px-7 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Securing spot...' : 'Lock in my $149 founding price'}
        </button>
      </div>

      {errorMessage && (
        <p className="text-[#C53030] text-[13px] mt-2 font-medium">
          {errorMessage}
        </p>
      )}

      <p className="text-[13px] text-[#5B6672] mt-2.5">
        We only email you about Forvest. No selling your address, ever.
      </p>
    </form>
  );
};
