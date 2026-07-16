# REPORT 6 — Content & Compliance Audit

**Run:** 2026-07-14 · **Scope:** every user-facing string, claim, link and legal page in `web/`
**Method:** static analysis of the working tree (VERIFIED identical to HEAD and to the deployed repo —
see Report 0), plus live HTTP checks against `mvcleaningservices.in`.

> **Headline:** the site publishes a **refund policy the product structurally cannot honour**, ships a
> **dummy WhatsApp number on every page**, and presents **invented testimonials as real customers**.
> All three are live right now. Conversely, the fabricated "4.9★ rating" is **dead code, not live** —
> corrected below rather than inflated.

---

## LIVE vs DEAD — read this first

Severity here depends entirely on whether code is reachable. VERIFIED from `web/src/App.tsx`:

| Component | Routed / rendered? | Status |
|---|---|---|
| `StoreLayout.tsx` | Wraps **every** route (App.tsx:44) | 🔴 **LIVE** |
| `pages/app/AppHome.tsx` | `index` route = homepage (App.tsx:46) | 🔴 **LIVE** |
| `pages/Contact.tsx` | `/contact` (App.tsx:53) | 🔴 **LIVE** |
| `pages/Refunds.tsx` | `/refunds` (App.tsx:57) | 🔴 **LIVE** |
| `pages/Home.tsx` | **Not imported, not routed** | ⚪ dead code |
| `components/Layout.tsx` | **No importers found** | ⚪ dead code |
| `components/AppDownloadModal.tsx` | Only used by dead `Layout.tsx` / `Home.tsx` | ⚪ dead code |
| `components/StructuredData.tsx` `LOCAL_BUSINESS_SCHEMA` | Only imported by dead `Layout.tsx` | ⚪ dead code |

---

## Findings

| # | file:line | Issue | Type | Severity | Fix |
|---|---|---|---|---|---|
| 1 | `pages/Refunds.tsx` (live) vs backend | **Published policy the system cannot honour.** See §1. | legal-gap | 🔴 **CRITICAL** | Implement, or rewrite the policy to match reality |
| 2 | `components/StoreLayout.tsx:104` | `<WhatsAppButton phone="919999999999" />` — **dummy number on every page**. The "Chat with us" bubble is live and clickable. | placeholder | 🔴 **CRITICAL** | Real number, or remove the button |
| 3 | `pages/app/AppHome.tsx:29, 255` | **SAMPLE testimonials shown as real customers** — invented names + neighbourhoods ("Priya S., Indiranagar"). Code-flagged SAMPLE, but nothing tells the visitor. | false-claim | 🔴 **CRITICAL** | Real quotes w/ consent, or remove the section |
| 4 | `pages/app/AppHome.tsx:299, 300` | App Store / Google Play buttons are `href="#"` — **dead links on the live homepage**. | dead-link | 🟠 HIGH | Remove until the apps ship |
| 5 | `pages/app/AppHome.tsx` (app banner) | Copy claims the service is available **"on Android & iOS"** — the apps are **not published**. | false-claim | 🟠 HIGH | Remove the claim until stores are live |
| 6 | `pages/Contact.tsx:97` | `hello@mvcleaning.in` — **wrong domain** (live site is `mvcleaningservices.in`). Customer emails likely bounce. | inconsistency | 🟠 HIGH | Use a real, monitored address |
| 7 | `components/WhatsAppButton.tsx:7` | Dummy `919999999999` is the **default prop** — any future use silently ships a fake number. | placeholder | 🟠 HIGH | Remove default; require an explicit prop |
| 8 | `pages/Home.tsx:81-90` | **Fabricated stats**: `500+ Happy Homes`, **`4.9★ Average Rating`**, `₹49 Advance Only`. There is **no ratings system**, so 4.9★ is invented. **NOT live** (page unrouted) — but one import from shipping. | false-claim | 🟡 MEDIUM | **Delete the dead page** |
| 9 | `components/StructuredData.tsx:25` | `url: 'https://mvcleaning.in'` in `LOCAL_BUSINESS_SCHEMA` — wrong domain in SEO structured data. Currently **dead** (only dead `Layout.tsx` imports it). | inconsistency | 🟡 MEDIUM | Fix domain or delete with `Layout.tsx` |
| 10 | `components/Layout.tsx:187` | `hello@mvcleaning.in` — wrong domain. Dead code. | inconsistency | 🟡 MEDIUM | Delete dead shell |
| 11 | `components/AppDownloadModal.tsx:82, 90` | `href="#"` store links. Dead code. | dead-link | 🟢 LOW | Delete with dead pages |
| 12 | `public/images/hero.png` | **749,981 bytes (~750 KB)** for one hero image — VERIFIED over the wire. | performance | 🟢 LOW | Compress / WebP |
| 13 | deploy repo `.env` | Tracked in git; `.gitignore` covers only `*.local`. Holds only `VITE_API_URL` (Vite makes it public anyway) → **not a leak**, but a landmine. | hygiene | 🟢 LOW | gitignore + `git rm --cached` + Vercel env var |

---

## §1 — CRITICAL: the Refunds policy promises what the code cannot do

**The live `/refunds` page states** (VERIFIED in `web/src/pages/Refunds.tsx`):
- "**Free Cancellation:** cancel for free up to **2 hours** before your scheduled time slot… your full
  advance payment will be **automatically refunded**."
- "**Late Cancellation:** within 2 hours → the advance payment will be **forfeited**."
- "Rescheduling… without penalty up to **2 hours** before."
- Refunds processed within "**7 business days**".

**What the backend actually implements** (VERIFIED):

| Promise | Reality | Evidence |
|---|---|---|
| Customer can cancel | **No customer-facing cancel endpoint exists at all** | no `cancel` route in `bookings.controller.ts` |
| Full advance auto-refunded | **No refund logic anywhere.** The only `refund` in the entire backend is an unused enum value | `wallet/schemas/wallet-transaction.schema.ts:9` → `REFUND = 'refund'` |
| 2-hour window enforced | **No time-window check exists** | no match for any 2-hour/window logic in `backend/src` |
| Late cancel forfeits advance | No window logic ⇒ nothing to enforce | — |
| Refund in 7 business days | No refund mechanism exists | — |
| Reschedule | No reschedule endpoint found | — |

Admin cancellation (`modules/bookings/admin-orders.service.ts:169-170`) only does:
```ts
this.assertTransition(order.status, OrderStatus.CANCELLED);
order.status = OrderStatus.CANCELLED;
```
— a status flip. **No wallet credit. No refund. No money moves.**

**Why this is CRITICAL, not cosmetic:**
1. **Consumer-protection exposure** — you are publishing binding commitments (auto-refund, 7 days) that
   cannot be met. A policy the product can't keep is worse than having no policy.
2. **Payment-gateway risk** — Razorpay review checks exactly this alignment; a customer disputing a
   refund you never issue drives chargebacks.
3. **Dead end for users** — a customer who needs to cancel has **no way to do it in the product**.

**Two honest paths (pick one — do not ship as-is):**
- **(A) Match the policy to reality now (fast, safe):** rewrite `/refunds` to describe what actually
  happens today — cancellations handled manually via Contact/WhatsApp, refunds processed manually,
  and state a timeline you can genuinely hit. Requires **a real support contact** (see finding #2).
- **(B) Build to the promise (correct, slower):** customer cancel endpoint + 2-hour window check +
  automatic wallet/source refund + reschedule. Then the current copy becomes true.

⚠️ **Path A depends on finding #2**: the policy would route customers to WhatsApp — which is currently
a **dummy number**. Fixing the policy without fixing the contact just moves the dead end.

---

## Things that are CORRECT (verified, no action)

- **Legal pages all exist, are routed, footer-linked, and reachable by direct URL** — Privacy, Terms,
  Refunds, Contact, FAQ all returned **HTTP 200** on direct load after the SPA-rewrite fix (Report 0).
- **No fake ratings in the live booking UI.** Service cards show price only — no invented stars.
  (The one fabricated rating lives in dead code, finding #8.)
- **Advance-then-balance model is described honestly** in the live UI and matches the code.
- `you@example.com` in `Contact.tsx:71` / `Partner.tsx:96` are **input placeholders**, not published
  contact details — not a finding.

---

## Checks I could NOT perform, and why

1. **Is `mvcleaning.in` a domain you own?** If it is not, `hello@mvcleaning.in` is unreachable and
   finding #6 becomes CRITICAL. Requires a human/DNS check. **[MANUAL]**
2. **Is `919999999999` a real number belonging to someone else?** Sending customers to a stranger's
   WhatsApp is worse than a dead link. **[MANUAL]**
3. **Are the "500+" / "₹49" figures true?** Even in dead code, I cannot verify business facts.
   The `4.9★` is verifiably fabricated (no ratings system exists). **[MANUAL]**
4. **Do the live catalog prices match marketing copy?** The deployed site's `listServices` is mocked
   (`web/VERCEL_API_GLITCH.md`), so live prices come from hardcoded data, not the DB — a real
   comparison is impossible until the mock is reverted and the backend is live. **[MANUAL]**
5. **Visual/mobile rendering of the legal pages** — not determinable from code. **[MANUAL]**
6. **Whether a re-clean/satisfaction guarantee is claimed anywhere** — no such claim found in the live
   copy, but confirm against your marketing material outside this repo. **[MANUAL]**

---

## Recommended order

1. **#2 dummy WhatsApp** — one line, live on every page, and #1's fix depends on it.
2. **#1 refunds policy** — pick Path A or B. Highest legal/gateway exposure.
3. **#3 testimonials** — remove or replace; invented customers are the clearest misrepresentation.
4. **#4/#5 store links & "on Android & iOS"** — remove until the apps actually ship.
5. **#6 contact email** — real, monitored address.
6. **#8-#11 delete dead code** (`Home.tsx`, `Layout.tsx`, `AppDownloadModal.tsx`) — removes the
   fabricated 4.9★ and the wrong-domain schema in one stroke, and shrinks the bundle.
