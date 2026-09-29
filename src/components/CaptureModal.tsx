import React, { useEffect } from 'react';
import { EmailCaptureForm } from './EmailCaptureForm';

interface CaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  tierName?: string;
  tierPrice?: string;
  source?: string;
}

export const CaptureModal: React.FC<CaptureModalProps> = ({
  isOpen,
  onClose,
  tierName = 'Plan Picker',
  tierPrice = '$249',
  source = 'pricing_modal',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C2733]/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div 
        className="bg-white border border-[#E4E0D6] rounded-[8px] max-w-[500px] w-full p-6 sm:p-8 relative"
        style={{ boxShadow: '0 4px 20px rgba(28,39,51,0.15)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-[#5B6672] hover:text-[#1C2733] rounded-[4px] hover:bg-[#FAF8F4] transition-colors"
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className="mb-5">
          <span className="text-[12px] font-semibold uppercase tracking-wider text-[#1B7A54] bg-[#FAF8F4] px-2.5 py-1 rounded-[4px] border border-[#E4E0D6]">
            Early Access Spot · {tierName}
          </span>
          <h3 className="text-[24px] font-semibold text-[#1C2733] mt-2 mb-1">
            Lock in your founding price
          </h3>
          <p className="text-[15px] text-[#5B6672]">
            Founding users lock the {tierName} (regularly {tierPrice}) at <strong className="text-[#1C2733]">$149 flat</strong>. No payment required today.
          </p>
        </div>

        <EmailCaptureForm
          source={source}
          selectedTier={tierName}
          onSuccess={() => {
            // keep open for user to read confirmation
          }}
        />
      </div>
    </div>
  );
};
