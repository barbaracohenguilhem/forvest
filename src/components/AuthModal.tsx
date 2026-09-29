import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storage';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
  initialMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'signin',
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMode(initialMode);
    setError('');
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);
    try {
      let result;
      if (mode === 'signup') {
        result = storageService.signUp(email, password, name);
      } else {
        result = storageService.login(email, password);
      }

      if (result.error) {
        setError(result.error);
      } else if (result.user) {
        onSuccess(result.user);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C2733]/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div 
        className="bg-white border border-[#E4E0D6] rounded-[8px] max-w-[440px] w-full p-6 sm:p-8 relative"
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
          <h3 className="text-[24px] font-semibold text-[#1C2733]">
            {mode === 'signin' ? 'Sign in to My Plans' : 'Create your Forvest account'}
          </h3>
          <p className="text-[14px] text-[#5B6672] mt-1">
            {mode === 'signin'
              ? 'Access your saved loan models, plan recommendations, and switch filings.'
              : 'Save your customized loan recommendations and pre-filled switch applications.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-[13px] font-medium text-[#1C2733] mb-1">
                Your name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Maya Rodriguez"
                className="w-full h-[46px] px-3.5 bg-white border border-[#E4E0D6] rounded-[8px] text-[15px] text-[#1C2733] focus:outline-hidden focus:border-[#1B7A54] focus:ring-1 focus:ring-[#1B7A54]"
              />
            </div>
          )}

          <div>
            <label className="block text-[13px] font-medium text-[#1C2733] mb-1">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              required
              className="w-full h-[46px] px-3.5 bg-white border border-[#E4E0D6] rounded-[8px] text-[15px] text-[#1C2733] focus:outline-hidden focus:border-[#1B7A54] focus:ring-1 focus:ring-[#1B7A54]"
            />
          </div>

          <div>
            <label className="block text-[13px] font-medium text-[#1C2733] mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="w-full h-[46px] px-3.5 bg-white border border-[#E4E0D6] rounded-[8px] text-[15px] text-[#1C2733] focus:outline-hidden focus:border-[#1B7A54] focus:ring-1 focus:ring-[#1B7A54]"
            />
          </div>

          {error && (
            <p className="text-[#C53030] text-[13px] font-medium">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full h-[48px] justify-center mt-2 cursor-pointer disabled:opacity-70"
          >
            {isSubmitting
              ? 'Processing...'
              : mode === 'signin'
              ? 'Sign in to My Plans'
              : 'Create Account & Access Plans'}
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-[#E4E0D6] text-center text-[13px] text-[#5B6672]">
          {mode === 'signin' ? (
            <p>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="text-[#1B7A54] font-semibold hover:underline cursor-pointer"
              >
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="text-[#1B7A54] font-semibold hover:underline cursor-pointer"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
