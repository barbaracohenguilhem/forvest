import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '2mb' }));

// Ensure data directory exists
const dataDir = path.resolve(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const leadsFile = path.join(dataDir, 'leads.json');
const plansFile = path.join(dataDir, 'plans.json');
const usersFile = path.join(dataDir, 'users.json');
const analyticsFile = path.join(dataDir, 'analytics.json');

[leadsFile, plansFile, usersFile, analyticsFile].forEach((f) => {
  if (!fs.existsSync(f)) {
    fs.writeFileSync(f, '[]', 'utf-8');
  }
});

// Helper storage functions
function readJson(file: string): any[] {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch {
    return [];
  }
}

function writeJson(file: string, data: any[]) {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Failed to write to ${file}:`, err);
  }
}

// -------------------------------------------------------------
// Rate Limiter for Hero Feature
// -------------------------------------------------------------
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
function rateLimit(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 15;

  let record = rateLimitMap.get(ip);
  if (!record || now > record.resetAt) {
    record = { count: 1, resetAt: now + windowMs };
    rateLimitMap.set(ip, record);
    return next();
  }

  record.count++;
  if (record.count > maxRequests) {
    res.status(429).json({
      error: 'Rate limit exceeded. Please wait a minute before running another plan model.',
    });
    return;
  }
  next();
}

// -------------------------------------------------------------
// Auth & Authorization Middleware
// -------------------------------------------------------------
function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Authentication required.' });
    return;
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    res.status(401).json({ error: 'Unauthorized: Missing token.' });
    return;
  }

  // Token is user ID in this self-contained auth session
  const users = readJson(usersFile);
  const user = users.find((u: any) => u.id === token);
  if (!user) {
    res.status(401).json({ error: 'Unauthorized: Invalid user session.' });
    return;
  }

  (req as any).user = user;
  next();
}

// -------------------------------------------------------------
// Optional Gemini Pro Specialist Synthesizer (Zero-dependency fetch)
// -------------------------------------------------------------
async function queryGeminiPro(prompt: string): Promise<{ rationale?: string; warning?: string; taxNotes?: string } | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'aistudio-build',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (text) {
      return JSON.parse(text.trim());
    }
    return null;
  } catch (err) {
    console.warn('Gemini Pro API call notice (falling back to deterministic modeling):', err);
    return null;
  }
}

// -------------------------------------------------------------
// API Endpoints
// -------------------------------------------------------------

// 1. Google Auth Sign-in (Tolerates null displayName per requirements)
app.post('/api/auth/google', (req: Request, res: Response) => {
  const { email, displayName, uid, photoURL } = req.body;
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    res.status(400).json({ error: 'Valid email is required.' });
    return;
  }

  const cleanEmail = email.trim().toLowerCase();
  // Tolerating null displayName
  const safeName = displayName && typeof displayName === 'string' && displayName.trim().length > 0
    ? displayName.trim()
    : cleanEmail.split('@')[0];

  const users = readJson(usersFile);
  let user = users.find((u: any) => u.email === cleanEmail);

  if (!user) {
    user = {
      id: uid || 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      email: cleanEmail,
      name: safeName,
      photoURL: photoURL || null,
      provider: 'google',
      createdAt: new Date().toISOString(),
    };
    users.push(user);
    writeJson(usersFile, users);
  } else {
    // Update name if previously empty
    if (!user.name && safeName) {
      user.name = safeName;
      writeJson(usersFile, users);
    }
  }

  res.json({ success: true, user });
});

// 2. Email Auth (Sign up / Sign in)
app.post('/api/auth/email', (req: Request, res: Response) => {
  const { email, name } = req.body;
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    res.status(400).json({ error: 'Valid email is required.' });
    return;
  }

  const cleanEmail = email.trim().toLowerCase();
  const safeName = name && typeof name === 'string' && name.trim().length > 0
    ? name.trim()
    : cleanEmail.split('@')[0];

  const users = readJson(usersFile);
  let user = users.find((u: any) => u.email === cleanEmail);

  if (!user) {
    user = {
      id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      email: cleanEmail,
      name: safeName,
      provider: 'email',
      createdAt: new Date().toISOString(),
    };
    users.push(user);
    writeJson(usersFile, users);
  }

  res.json({ success: true, user });
});

// 3. HERO FEATURE: Plan Comparison Engine (data-processing)
app.post('/api/compare-plans', requireAuth, rateLimit, async (req: Request, res: Response) => {
  const user = (req as any).user;
  const {
    loanBalance,
    income,
    filingStatus = 'single',
    familySize = 1,
    pslfPaymentsMade = 0,
    hasPre2014Loans = false,
    isSelfEmployed = false,
    hasPslfBuyback = false,
    noticeDeadlineDays = 45,
  } = req.body;

  // Server-side input validation
  const numBalance = Number(loanBalance);
  const numIncome = Number(income);
  const numFamily = Math.max(1, Number(familySize) || 1);
  const numPslf = Math.max(0, Math.min(120, Number(pslfPaymentsMade) || 0));
  const numDeadline = Math.max(1, Number(noticeDeadlineDays) || 45);

  if (isNaN(numBalance) || numBalance <= 0) {
    res.status(400).json({ error: 'Direct Loan Balance must be a positive number.' });
    return;
  }
  if (isNaN(numIncome) || numIncome < 0) {
    res.status(400).json({ error: 'Income must be a valid non-negative number.' });
    return;
  }

  // Exact 2026 Federal Poverty Line Calculations
  const baseFpl = 15650;
  const perPersonFpl = 5380;
  const povertyLine = baseFpl + (numFamily - 1) * perPersonFpl;

  // 1. Standard 10-year repayment
  const monthlyRate = 0.068 / 12;
  const numPayments = 120;
  const standardMonthly = Math.round(
    (numBalance * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
      (Math.pow(1 + monthlyRate, numPayments) - 1)
  );

  // 2. IBR: 150% FPL, hardship requirement removed in Dec 2025.
  // 10% rate for post-2014, 15% rate for pre-2014.
  const ibrDiscretionary = Math.max(0, numIncome - povertyLine * 1.5);
  const ibrRate = hasPre2014Loans ? 0.15 : 0.10;
  const ibrMonthly = Math.max(0, Math.round((ibrDiscretionary * ibrRate) / 12));

  // 3. RAP: 225% FPL, 10% rate
  const rapDiscretionary = Math.max(0, numIncome - povertyLine * 2.25);
  const rapMonthly = Math.max(0, Math.round((rapDiscretionary * 0.10) / 12));

  const pslfMonthsRemaining = Math.max(0, 120 - numPslf);

  const ibrTotalPaid = pslfMonthsRemaining > 0 ? ibrMonthly * pslfMonthsRemaining : ibrMonthly * 240;
  const rapTotalPaid = pslfMonthsRemaining > 0 ? rapMonthly * pslfMonthsRemaining : rapMonthly * 240;
  const standardTotalPaid = pslfMonthsRemaining > 0 ? standardMonthly * pslfMonthsRemaining : standardMonthly * 120;

  // Determine baseline algorithmic recommendation
  let baselinePick: 'IBR' | 'RAP' | 'Standard' = 'IBR';
  if (pslfMonthsRemaining > 0) {
    if (ibrMonthly <= rapMonthly && ibrMonthly <= standardMonthly) {
      baselinePick = 'IBR';
    } else if (rapMonthly <= ibrMonthly && rapMonthly <= standardMonthly) {
      baselinePick = 'RAP';
    } else {
      baselinePick = 'Standard';
    }
  } else {
    baselinePick = rapMonthly < standardMonthly ? 'RAP' : 'Standard';
  }

  // Complex case flags
  const complexFlags: string[] = [];
  if (hasPre2014Loans) complexFlags.push('Pre-2014 Loans (15% IBR tier applies)');
  if (filingStatus === 'married_filing_separately') complexFlags.push('Married Filing Separately (Spousal income exclusion)');
  if (isSelfEmployed) complexFlags.push('Self-Employed (Schedule C net profit deduction)');
  if (hasPslfBuyback) complexFlags.push('PSLF Buyback Credit requested for administrative forbearance months');

  let specialistRationale = `Since the hardship requirement was removed in December 2025, you qualify for ${baselinePick}. It provides your lowest monthly obligation of $${baselinePick === 'IBR' ? ibrMonthly : baselinePick === 'RAP' ? rapMonthly : standardMonthly}/mo, every payment qualifies for PSLF, and the remainder will be forgiven tax-free.`;
  let watchOutWarning = 'The studentaid.gov calculator may show Graduated as your cheapest option. Graduated payments do NOT count toward PSLF. Picking it freezes your forgiveness clock.';

  // Optional server-side AI call using Gemini Pro to synthesize credentialed specialist review
  const prompt = `
You are a credentialed student loan specialist at Forvest reviewing a federal borrower kicked off SAVE.
Borrower data:
- Direct Loan Balance: $${numBalance}
- Annual Income: $${numIncome}
- Filing Status: ${filingStatus}
- Family Size: ${numFamily}
- PSLF Payments Made: ${numPslf} / 120 (${pslfMonthsRemaining} months to go)
- Calculated Options:
  * IBR: $${ibrMonthly}/month, Total to forgiveness: $${ibrTotalPaid}
  * RAP: $${rapMonthly}/month, Total to forgiveness: $${rapTotalPaid}
  * Standard 10-yr: $${standardMonthly}/month, Total to forgiveness: $${standardTotalPaid}
- Pre-2014 Loans: ${hasPre2014Loans}
- Self-Employed: ${isSelfEmployed}
- PSLF Buyback: ${hasPslfBuyback}

Mathematical Pick: ${baselinePick}.

Provide a response in JSON format conforming strictly to this schema:
{
  "rationale": "Short, authoritative 2-3 sentence explanation of why this plan was picked, highlighting the Dec 2025 hardship removal or July 2026 RAP rules.",
  "warning": "Short 1-2 sentence caution warning about servicer traps or Graduated repayment plans.",
  "taxNotes": "One concise line regarding federal tax-free PSLF forgiveness under IRC 108(f)."
}
`;

  const aiResult = await queryGeminiPro(prompt);
  if (aiResult?.rationale) specialistRationale = aiResult.rationale;
  if (aiResult?.warning) watchOutWarning = aiResult.warning;

  // Normalize final plan recommendation object to rigid schema
  const newPlan = {
    id: 'rec_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    userId: user.id,
    borrowerName: user.name || 'Borrower',
    createdAt: new Date().toISOString(),
    inputs: {
      loanBalance: numBalance,
      income: numIncome,
      filingStatus,
      familySize: numFamily,
      pslfPaymentsMade: numPslf,
      hasPre2014Loans,
      isSelfEmployed,
      hasPslfBuyback,
      noticeDeadlineDays: numDeadline,
    },
    plans: {
      ibr: {
        planName: 'Income-Based Repayment',
        code: 'IBR',
        monthlyPayment: ibrMonthly,
        countsTowardPslf: true,
        totalBeforeForgiveness: ibrTotalPaid,
        monthsToForgiveness: pslfMonthsRemaining,
        estimatedForgivenAmount: Math.max(0, numBalance - ibrTotalPaid * 0.4),
        taxNotes: 'PSLF forgiveness is 100% tax-free at federal level (IRC Sec 108(f)).',
      },
      rap: {
        planName: 'Repayment Assistance Plan',
        code: 'RAP',
        monthlyPayment: rapMonthly,
        countsTowardPslf: true,
        totalBeforeForgiveness: rapTotalPaid,
        monthsToForgiveness: pslfMonthsRemaining,
        estimatedForgivenAmount: Math.max(0, numBalance - rapTotalPaid * 0.4),
        taxNotes: 'PSLF forgiveness is tax-free. Non-PSLF IDR forgiveness taxability depends on post-2025 extension rules.',
      },
      standard: {
        planName: 'Standard Repayment (10-Year)',
        code: 'Standard',
        monthlyPayment: standardMonthly,
        countsTowardPslf: true,
        totalBeforeForgiveness: standardTotalPaid,
        monthsToForgiveness: pslfMonthsRemaining,
        estimatedForgivenAmount: 0,
        taxNotes: 'Standard 10-year pays full principal & interest. Counts toward PSLF only on Direct consolidated/original loans.',
      },
    },
    ourPick: baselinePick,
    ourPickRationale: `${baselinePick}. ${specialistRationale}`,
    watchOutWarning: watchOutWarning,
    nextSteps: [
      `1) Review the ${baselinePick} application we've pre-filled with your exact numbers.`,
      '2) Sign and submit it through your loan servicer online portal or studentaid.gov.',
      '3) Keep paying on your current schedule until the switch confirms.',
    ],
    complexCaseFlags: complexFlags,
    applicationStatus: 'ready_to_submit',
    servicerName: 'Aidvantage / MOHELA / Nelnet',
  };

  // Save to persistent database
  const plans = readJson(plansFile);
  plans.unshift(newPlan);
  writeJson(plansFile, plans);

  res.json({ success: true, plan: newPlan });
});

// 4. Get User's Plans (Strict Authorization Check)
app.get('/api/user-plans', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const plans = readJson(plansFile);
  // Authorize: Only return plans belonging to the authenticated user
  const userPlans = plans.filter((p: any) => p.userId === user.id);
  res.json({ success: true, plans: userPlans });
});

// 5. Update Plan Status (Strict Authorization Check)
app.post('/api/update-plan-status', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const { planId, status } = req.body;

  if (!planId || !status) {
    res.status(400).json({ error: 'planId and status are required.' });
    return;
  }

  const validStatuses = ['draft', 'ready_to_submit', 'submitted', 'confirmed'];
  if (!validStatuses.includes(status)) {
    res.status(400).json({ error: 'Invalid application status.' });
    return;
  }

  const plans = readJson(plansFile);
  const planIndex = plans.findIndex((p: any) => p.id === planId);

  if (planIndex === -1) {
    res.status(404).json({ error: 'Plan record not found.' });
    return;
  }

  // Authorization Check: User must own the plan
  if (plans[planIndex].userId !== user.id) {
    res.status(403).json({ error: 'Forbidden: You do not have permission to modify this plan record.' });
    return;
  }

  plans[planIndex].applicationStatus = status;
  if (status === 'submitted') {
    plans[planIndex].submittedDate = new Date().toISOString();
  }
  writeJson(plansFile, plans);

  res.json({ success: true, plan: plans[planIndex] });
});

// 6. Lead Capture Endpoint
app.post('/api/leads', (req: Request, res: Response) => {
  const { email, source, tier, honeypot } = req.body;

  // Honeypot check: silently drop bots
  if (honeypot) {
    res.json({ success: true, dropped: true });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
    res.status(400).json({ error: 'Valid email address required.' });
    return;
  }

  const cleanEmail = email.trim().toLowerCase();
  const leads = readJson(leadsFile);
  const newLead = {
    id: 'lead_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    email: cleanEmail,
    source: typeof source === 'string' ? source.slice(0, 100) : 'direct',
    tier: typeof tier === 'string' ? tier.slice(0, 50) : 'Plan Picker ($149 founding price)',
    createdAt: new Date().toISOString(),
  };

  const existingIdx = leads.findIndex(
    (l: any) => l.email === cleanEmail && l.tier === newLead.tier
  );
  if (existingIdx === -1) {
    leads.push(newLead);
    writeJson(leadsFile, leads);
  }

  res.json({ success: true, lead: newLead });
});

app.get('/api/leads', (req: Request, res: Response) => {
  const leads = readJson(leadsFile);
  res.json({ leads, count: leads.length });
});

// 7. Analytics Event Tracker
app.post('/api/analytics', (req: Request, res: Response) => {
  const { event, properties, timestamp = new Date().toISOString() } = req.body;
  if (!event || typeof event !== 'string') {
    res.status(400).json({ error: 'Event name is required.' });
    return;
  }

  const events = readJson(analyticsFile);
  events.push({
    event,
    properties: properties || {},
    timestamp,
  });
  writeJson(analyticsFile, events);

  res.json({ success: true });
});

// -------------------------------------------------------------
// Vite Middleware / Static Server
// -------------------------------------------------------------
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Forvest full-stack server running on port ${PORT}`);
  });
}

startServer();
