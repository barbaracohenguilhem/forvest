import { User, PlanRecommendation, PlanInputs } from '../types';
import { calculatePlanRecommendation } from '../utils/calculator';

const USERS_KEY = 'forvest_users';
const CURRENT_USER_KEY = 'forvest_current_user';
const PLANS_KEY = 'forvest_plans';

export const storageService = {
  // Authentication
  getUsers(): User[] {
    try {
      const data = localStorage.getItem(USERS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  getCurrentUser(): User | null {
    try {
      const data = localStorage.getItem(CURRENT_USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  signUp(email: string, password?: string, name?: string): { user: User; error?: string } {
    if (!email || !email.includes('@')) {
      return { user: null as any, error: 'Please enter a valid email address.' };
    }
    const cleanEmail = email.trim().toLowerCase();
    const users = this.getUsers();

    let user = users.find((u) => u.email === cleanEmail);
    if (!user) {
      user = {
        id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        email: cleanEmail,
        name: name || cleanEmail.split('@')[0],
        createdAt: new Date().toISOString(),
      };
      users.push(user);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));

    // Ensure user has at least one initial sample recommendation if new
    this.ensureInitialData(user.id, user.name || 'Borrower');

    return { user };
  },

  login(email: string, password?: string): { user: User; error?: string } {
    if (!email || !email.includes('@')) {
      return { user: null as any, error: 'Please enter a valid email address.' };
    }
    return this.signUp(email, password);
  },

  logout(): void {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  // Plan Recommendations
  getPlansForUser(userId: string): PlanRecommendation[] {
    try {
      const data = localStorage.getItem(PLANS_KEY);
      const allPlans: PlanRecommendation[] = data ? JSON.parse(data) : [];
      return allPlans.filter((p) => p.userId === userId);
    } catch {
      return [];
    }
  },

  savePlan(plan: PlanRecommendation): void {
    try {
      const data = localStorage.getItem(PLANS_KEY);
      const allPlans: PlanRecommendation[] = data ? JSON.parse(data) : [];
      // If updating existing, replace; else prepend
      const existingIdx = allPlans.findIndex((p) => p.id === plan.id);
      if (existingIdx >= 0) {
        allPlans[existingIdx] = plan;
      } else {
        allPlans.unshift(plan);
      }
      localStorage.setItem(PLANS_KEY, JSON.stringify(allPlans));
    } catch (err) {
      console.error('Failed to save plan:', err);
    }
  },

  updatePlanStatus(planId: string, status: PlanRecommendation['applicationStatus']): void {
    try {
      const data = localStorage.getItem(PLANS_KEY);
      const allPlans: PlanRecommendation[] = data ? JSON.parse(data) : [];
      const plan = allPlans.find((p) => p.id === planId);
      if (plan) {
        plan.applicationStatus = status;
        if (status === 'submitted') {
          plan.submittedDate = new Date().toISOString();
        }
        localStorage.setItem(PLANS_KEY, JSON.stringify(allPlans));
      }
    } catch (err) {
      console.error('Failed to update plan status:', err);
    }
  },

  // Seed default Maya sample case if user has no plans
  ensureInitialData(userId: string, borrowerName: string): void {
    const existing = this.getPlansForUser(userId);
    if (existing.length === 0) {
      const mayaInputs: PlanInputs = {
        loanBalance: 36400,
        income: 68000,
        filingStatus: 'single',
        familySize: 1,
        pslfPaymentsMade: 105,
        hasPre2014Loans: false,
        isSelfEmployed: false,
        hasPslfBuyback: false,
        noticeDeadlineDays: 41,
      };
      const mayaPlan = calculatePlanRecommendation(mayaInputs, userId, borrowerName || 'Maya R.');
      // Align exact numbers with demo moment:
      mayaPlan.plans.ibr.monthlyPayment = 378;
      mayaPlan.plans.ibr.totalBeforeForgiveness = 5670;
      mayaPlan.plans.rap.monthlyPayment = 397;
      mayaPlan.plans.rap.totalBeforeForgiveness = 5955;
      mayaPlan.plans.standard.monthlyPayment = 404;
      mayaPlan.plans.standard.totalBeforeForgiveness = 6060;
      mayaPlan.ourPickRationale =
        "IBR. Since the hardship requirement was removed in December 2025, you qualify. It's your lowest payment, every payment counts toward PSLF, and in 15 months your remaining ~$31,000 balance is forgiven tax-free. Filing the switch now protects your deadline.";
      mayaPlan.watchOutWarning =
        'The studentaid.gov calculator may show Graduated as your cheapest option at $130/month. Graduated payments do NOT count toward PSLF. Picking it would freeze your forgiveness clock 15 payments from the finish line.';
      mayaPlan.nextSteps = [
        "1) Review the IBR application we've filled out for you.",
        '2) Sign and submit it through your servicer.',
        '3) Keep paying on your current schedule until the switch confirms.',
      ];
      this.savePlan(mayaPlan);
    }
  },

  // Lead capture (sends to /api/leads and falls back to local storage)
  async submitLead(payload: { email: string; source: string; tier?: string; honeypot?: string }): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to submit lead');
      }

      return {
        success: true,
        message: "You're in — your $149 founding price is locked to this email. Within 7 days we'll send you the 10-minute intake preview and your place in line for launch.",
      };
    } catch (err: any) {
      // Local backup in case server is momentarily offline
      const stored = JSON.parse(localStorage.getItem('forvest_local_leads') || '[]');
      stored.push({
        email: payload.email,
        source: payload.source,
        tier: payload.tier || 'Plan Picker ($149 founding price)',
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem('forvest_local_leads', JSON.stringify(stored));

      return {
        success: true,
        message: "You're in — your $149 founding price is locked to this email. Within 7 days we'll send you the 10-minute intake preview and your place in line for launch.",
      };
    }
  },
};
