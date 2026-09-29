# Forvest — Product Requirements Document (PRD)

## 1. Vision & Problem
Forvest gives 6 million federal student loan borrowers kicked off SAVE an immediate, transparent repayment recommendation and completed plan switch paperwork in 48 hours. We replace $595 phone consults and conflicting servicer advice with clear, specialist-reviewed algorithmic modeling.

* **Target User:** Federal borrowers kicked off SAVE holding 90-day notices, specifically public service workers (PSLF), pre-2014 borrowers, married filing separately (MFS), and self-employed individuals.
* **Core Problem:** The SAVE exit deadline forces borrowers to pick RAP, IBR, or Standard before auto-enrollment into Standard repayment. Servicer reps give contradictory advice, studentaid.gov calculators mislead PSLF borrowers with Graduated plan estimates, and free channels have weeks-long queues.

## 2. The ONE Hero Feature
* **Feature:** Plan Comparison Engine
* **Classification:** `data-processing`
* **Description:** Structured intake of loan balances, AGI, filing status, family size, and PSLF counts evaluated against 2026 regulations (removed IBR hardship gate, July 2026 RAP rules, and 10-year Standard amortization) via a secure server-side Gemini Pro model, returning normalized side-by-side metrics and a written recommendation.

## 3. MVP Scope (Max 5 Features)
1. **Plan Comparison Engine (Hero):** Structured intake modeling RAP vs IBR vs Standard with exact monthly payments, PSLF qualification, and forgiveness totals.
2. **Written Recommendation Report:** Formatted document detailing the picked plan, mathematical trade-offs, Graduated plan trap warnings, and tax notes.
3. **Complex-Case Flag & Review Queue:** Automated flagging for PSLF buyback, pre-2014 15% tier, spousal exclusion, and Schedule C self-employment.
4. **Pre-Filled Switch Application:** Auto-generation of OMB No. 1845-0102 IDR request form populated with borrower inputs, ready to print and submit.
5. **Interactive Repayment Quiz & Lifecycle Tracker:** Fast-path quiz for immediate qualification plus filing status tracking (*Drafted → Ready → Submitted → Confirmed*).

## 4. Success Criteria
* 100% normalized schema compliance on plan comparison outputs.
* Response time < 3 seconds for complete side-by-side modeling.
* Zero exposure of secrets or API keys in the client bundle.
* 100% data isolation: users access strictly their own plan records.
