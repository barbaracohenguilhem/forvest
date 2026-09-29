import { User, PlanRecommendation, PlanInputs } from '../types';

const TOKEN_KEY = 'forvest_auth_token';
const USER_KEY = 'forvest_user_profile';

export const api = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  getCurrentUser(): User | null {
    try {
      const data = localStorage.getItem(USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setSession(user: User): void {
    localStorage.setItem(TOKEN_KEY, user.id);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  clearSession(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  // Google Sign-In (Tolerates null displayName)
  async signInWithGoogle(googleUser: { email: string; displayName?: string | null; uid?: string; photoURL?: string }): Promise<User> {
    const res = await fetch('/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: googleUser.email,
        displayName: googleUser.displayName || null,
        uid: googleUser.uid,
        photoURL: googleUser.photoURL,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to sign in with Google');
    }

    const data = await res.json();
    this.setSession(data.user);
    this.trackEvent('signup', { provider: 'google', email: data.user.email });
    return data.user;
  },

  // Email Sign-In / Sign-Up
  async signInWithEmail(email: string, name?: string): Promise<User> {
    const res = await fetch('/api/auth/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to authenticate');
    }

    const data = await res.json();
    this.setSession(data.user);
    this.trackEvent('signup', { provider: 'email', email: data.user.email });
    return data.user;
  },

  // HERO FEATURE: Generate plan comparison via server backend
  async comparePlans(inputs: PlanInputs): Promise<PlanRecommendation> {
    const token = this.getToken();
    if (!token) throw new Error('Authentication required to compare plans.');

    this.trackEvent('hero_feature_used', {
      loanBalance: inputs.loanBalance,
      income: inputs.income,
      pslfPaymentsMade: inputs.pslfPaymentsMade,
    });

    const res = await fetch('/api/compare-plans', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(inputs),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to generate plan recommendation.');
    }

    const data = await res.json();
    return data.plan;
  },

  // Fetch all saved plans for the authenticated user
  async getUserPlans(): Promise<PlanRecommendation[]> {
    const token = this.getToken();
    if (!token) return [];

    const res = await fetch('/api/user-plans', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return data.plans || [];
  },

  // Update application status
  async updatePlanStatus(planId: string, status: PlanRecommendation['applicationStatus']): Promise<PlanRecommendation> {
    const token = this.getToken();
    if (!token) throw new Error('Authentication required.');

    const res = await fetch('/api/update-plan-status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ planId, status }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update plan status.');
    }

    const data = await res.json();
    return data.plan;
  },

  // Lead capture
  async submitLead(payload: { email: string; source: string; tier?: string; honeypot?: string }): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to submit lead.');
    }

    return {
      success: true,
      message: "You're in — your $149 founding price is locked to this email. Within 7 days we'll send you the 10-minute intake preview and your place in line for launch.",
    };
  },

  // Analytics event tracking
  trackEvent(event: string, properties?: Record<string, any>): void {
    try {
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event, properties, timestamp: new Date().toISOString() }),
      }).catch(() => {});
    } catch {
      // Non-blocking
    }
  },
};
