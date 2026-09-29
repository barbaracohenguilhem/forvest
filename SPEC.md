# Forvest — Hero Feature Specification: Plan Comparison Engine

## User Story
As a federal student loan borrower holding a 90-day SAVE notice, I want to input my loan balance, income, filing status, and PSLF payment history so that I can see an exact side-by-side comparison of RAP, IBR, and Standard plans with a clear written recommendation and warning against plan traps.

## Acceptance Criteria
1. **Input Validation:** Backend strictly validates loan balance (>0), income (>=0), family size (>=1), and PSLF payments made (0–120).
2. **Deterministic & Normalized Output:** Server computes exact 2026 mathematical baselines (IBR 150% FPL, RAP 225% FPL, 10-year Standard amortization) and passes them to Gemini Pro for specialist rationale generation. Output is normalized to a rigid TypeScript schema before UI rendering.
3. **PSLF Safeguard:** If PSLF payments made > 0, the system must prioritize plans that count toward PSLF and warn against Graduated or extended plans.
4. **Complex-Case Flagging:** Flags cases with pre-2014 loans, married filing separately, self-employment, or PSLF buyback for specialist review.
5. **Security & Authorization:** Endpoint requires valid session/auth token; responses are stored associated strictly with the authenticated user ID.

## Technical Notes
* **Classification:** `data-processing`.
* **API Endpoint:** `POST /api/compare-plans`.
* **Model:** `@google/genai` utilizing `gemini-2.5-pro` on the backend only with structured JSON response schema. Rate limited to 15 requests per minute per IP/user.
* **Fallback:** If external model latency exceeds timeout, mathematical deterministic engine delivers the verified recommendation with zero downtime.
