import React, { useState } from 'react';
import { ForvestLogo } from './ForvestLogo';
import { api } from '../services/api';
import { User } from '../types';

interface SignInViewProps {
  onSuccess: (user: User) => void;
  onBackToHome: () => void;
}

export const SignInView: React.FC<SignInViewProps> = ({ onSuccess, onBackToHome }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    setError('');
    try {
      // Google OAuth flow simulation / payload (tolerating null displayName)
      const mockGoogleAccount = {
        email: email && email.includes('@') ? email.trim() : 'borrower.google@gmail.com',
        displayName: name || null, // Deliberately testing null displayName tolerance
        uid: 'g_' + Date.now(),
      };
      const user = await api.signInWithGoogle(mockGoogleAccount);
      onSuccess(user);
    } catch (err: any) {
      setError(err.message || 'Google sign-in encountered an error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    setIsSubmitting(true);
    setError('');
    try {
      const user = await api.signInWithEmail(email, name);
      onSuccess(user);
    } catch (err: any) {
      setError(err.message || 'Sign in failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F4] flex flex-col items-center justify-center p-4 font-sans text-[#1C2733]">
      <div className="max-w-[420px] w-full bg-white border border-[#E4E0D6] rounded-[8px] p-6 sm:p-8 shadow-xs">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-2">
            <ForvestLogo size={32} />
          </div>
          <h2 className="font-serif font-bold text-[24px] text-[#1C2733]">
            Sign in to Forvest
          </h2>
          <p className="text-[14px] text-[#5B6672] mt-1">
            Access your student loan plan recommendations, comparison models, and pre-filled switch filings.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-[13px] rounded-[6px]">
            {error}
          </div>
        )}

        {/* Google OAuth Default */}
        <button
          onClick={handleGoogleSignIn}
          disabled={isSubmitting}
          className="w-full h-[46px] border border-[#E4E0D6] rounded-[8px] bg-white hover:bg-[#FAF8F4] text-[#1C2733] font-medium text-[14px] flex items-center justify-center gap-3 transition-colors cursor-pointer shadow-2xs disabled:opacity-60"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Continue with Google
        </button>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#E4E0D6]"></div>
          </div>
          <span className="relative bg-white px-3 text-[12px] text-[#5B6672] uppercase tracking-wider">
            Or with email
          </span>
        </div>

        {/* Email Fallback */}
        <form onSubmit={handleEmailSubmit} className="space-y-3.5">
          <div>
            <label className="block text-[13px] font-medium text-[#1C2733] mb-1">
              Your Name (Optional)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Maya Rodriguez"
              className="w-full h-[42px] px-3 bg-white border border-[#E4E0D6] rounded-[6px] text-[14px] text-[#1C2733] focus:border-[#1B7A54] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-[13px] font-medium text-[#1C2733] mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              required
              className="w-full h-[42px] px-3 bg-white border border-[#E4E0D6] rounded-[6px] text-[14px] text-[#1C2733] focus:border-[#1B7A54] focus:outline-hidden"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full h-[44px] justify-center text-[14px] mt-2 cursor-pointer disabled:opacity-60"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In with Email'}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-[#E4E0D6] text-center">
          <button
            onClick={onBackToHome}
            className="text-[13px] text-[#5B6672] hover:text-[#1C2733] cursor-pointer"
          >
            ← Back to Forvest Overview
          </button>
        </div>

      </div>
    </div>
  );
};
