# Master Audit Prompts — MV Cleaning Services (v2, optimized)

> **What this is:** 6 self-contained audit prompts. **Run ONE per session**, not all at once.
> **What changed from v1:** see [§ Changelog](#changelog--what-was-optimized-and-why) at the bottom.

---

## HOW TO RUN THIS (read first — this determines whether the output is real or fiction)

1. **Run it in an agent with repo access that can execute commands** (Claude Code / Cursor / Codex CLI).
   Pasting this into a browser chat AI with no repo access will produce confident, well-formatted
   **fiction** for every runtime question (build results, Lighthouse, rendering, payment UI).
2. **One report per session.** v1 asked for 5 exhaustive reports in one run — context runs out and the
   last reports degrade into generic filler exactly where the deployment risk lives.
3. **Paste the two blocks below (`GROUND TRUTH` + `RULES`) at the top of every report prompt.**
   They are what stop the model from inventing findings.
4. **REPORT 0 is already done** (2026-07-14) — it established that the deployed code matches this
   monorepo, so the other reports are safe to trust. Read its findings before running anything else;
   don't re-run it. **Start with REPORT 6 (Content & Compliance)** — with drift ruled out and the SPA
   404s fixed, that is where the remaining launch blockers actually live.

---

## BLOCK A — GROUND TRUTH (paste with every report)

```
GROUND TRUTH — these facts are VERIFIED against the codebase. Do NOT contradict them, and do NOT
"discover" problems that these facts already rule out. If your analysis contradicts anything here,
STOP and flag the contradiction instead of writing a finding.

REPO
- Monorepo at the project root with four apps: backend/ (NestJS+Mongoose), admin/ (React+Vite),
  web/ (React+Vite+React Router), mobile/ (React Native + Expo).
- The LIVE website does NOT deploy from this monorepo's web/ folder. It deploys from a SEPARATE
  GitHub repo, `digistrivemedia-dot/mv-cleaning-frontend-web`. In that repo the web app's files sit
  at the REPO ROOT (index.html, package.json, src/ at top level) — not under a web/ subfolder, so
  Vercel Root Directory = "./" is CORRECT there.
- DRIFT IS TRIVIAL — do not treat this as a crisis (VERIFIED 2026-07-14 via
  `git diff main:web origin/main`). The deploy repo is a 2-commit SNAPSHOT of web/
  ("Initial commit: frontend only" → "fix: removed unused imports…" → "fix: add SPA rewrite…").
  The git HISTORIES are unrelated (no common ancestor), but the CONTENT is in sync. The COMPLETE
  content difference is three files:
    1. `.env` — exists only in the deploy repo (2 lines: a comment + VITE_API_URL).
    2. `src/components/StoreLayout.tsx` — deploy repo removed an unused `Sparkles` import.
    3. `src/pages/app/Login.tsx` — deploy repo removed an unused `Sparkles` import.
  Nothing else differs. There is NO unreproducible work stranded in the deploy repo.

WEB ROUTES (from web/src/App.tsx) — there is NO "/app/*" route zone. The homepage IS the booking app.
- "/"            → AppHome (booking discovery; browsable WITHOUT login)
- "/login"       → standalone OTP login
- "/services" "/about" "/blog" "/blog/:slug" "/contact" "/faq" "/privacy" "/terms" "/partner"
- Login-gated (RequireAuth): "/checkout" "/bookings" "/wallet" "/account"
- "/refunds"     → Refunds (Cancellation & Refunds). VERIFIED to exist in BOTH the monorepo
                   (web/src/pages/Refunds.tsx, routed at web/src/App.tsx:57) and the deploy repo.
- "*"            → NotFound
- Router = BrowserRouter (clean URLs). Static hosts therefore REQUIRE an SPA rewrite to index.html.
  STATUS: FIXED 2026-07-14 — `vercel.json` (catch-all rewrite → /index.html) is committed at the
  DEPLOY repo root (commit 97dc7b8) and verified live: /refunds, /privacy, /terms all return HTTP 200
  on direct load, and static assets (/images/*, /sitemap.xml) still serve correctly. Before this,
  every direct/shared link 404'd. Do not re-report this as an open bug — verify it still holds.

IMAGES — do not assume "base64 in MongoDB" as a blanket statement. The truth is split:
- Service images: `imageUrl: string` on the Service schema = a URL string (often empty; the apps then
  fall back to bundled, name-matched local images). NOT base64.
- Proof-of-work images: `proofImages: string[]` on the Booking schema = base64 data URLs stored INLINE
  in Mongo, guarded by MAX_PROOF_IMAGES=5 and MAX_PROOF_CHARS=2_800_000 (~2MB)
  (backend/src/modules/bookings/admin-orders.service.ts). THIS is the real Cloudinary migration target.

SEEDING — backend/src/modules/services/services.service.ts `onModuleInit` returns early when
env === 'production', and only seeds when the collection is empty. Production Atlas therefore starts
EMPTY. Dev uses an in-memory Mongo that resets on restart.

DEV PORTS: backend 3000, mobile 8081, admin 8082, web 8083. Dev pincode 560001. Dev OTP is returned
in the API response (devOtp) and shown on screen. Admin dev login: superadmin / DevPass123!.

KNOWN, ALREADY-DOCUMENTED ISSUES (do not report these as new discoveries; verify status instead):
- web/src/api.ts `listServices` is MOCKED to hardcoded services so the site renders without a backend.
  Documented in web/VERCEL_API_GLITCH.md. Must be reverted before launch.
- Homepage testimonials are SAMPLE data, code-flagged, and must be replaced with real quotes.
- There is no ratings/reviews system. Any star rating in the UI would be fabricated. Do NOT recommend
  adding fake ratings; treat "real ratings" as a backend feature request.
```

## BLOCK B — RULES (paste with every report)

```
RULES — anti-hallucination. These override any instinct to sound thorough.

1. EVERY finding MUST cite `path/to/file.ts:LINE`. A finding without a citation is not a finding.
2. Tag every finding as exactly one of:
   - [VERIFIED]  — I executed something (build/test/curl/grep) and observed the result. Include the
                   command and the relevant output.
   - [INFERRED]  — I read the code and reasoned. No runtime observation.
   - [MANUAL]    — Cannot be determined from code or by running anything available to me; a human must
                   check this in a browser/device/dashboard. Say exactly what to check and how.
3. NEVER state a runtime result you did not execute. No invented Lighthouse scores, no "renders
   correctly on mobile", no "build passes" unless you ran it and paste the output.
4. If a file, route, endpoint, or field you expected does not exist — say "not found", do not invent it.
5. If the instruction rests on a premise you cannot confirm, challenge the premise instead of
   answering it. Flag it under "Bad premises in the prompt".
6. Prefer reading fewer files thoroughly over skimming everything. If you are running out of context,
   STOP and say so — deliver a partial report that is TRUE rather than a complete report that guesses.
7. Severity definitions (use these exactly):
   - CRITICAL — money loss, data loss, security hole, or the product cannot function in prod.
   - HIGH     — a core user journey is broken or a launch/compliance blocker.
   - MEDIUM   — degraded UX/maintainability; workaround exists.
   - LOW      — polish, cleanup, nice-to-have.
8. Output format per finding:
   `[SEVERITY] [VERIFIED|INFERRED|MANUAL] file.ts:42 — one-line problem. Impact: … Fix: …`
9. End every report with: "Checks I could NOT perform, and why" — an explicit list. This section is
   mandatory and is the most valuable part of the report.
```

---

# REPORT 0: `source_of_truth_audit.md` — ✅ ALREADY RUN (2026-07-14)

**Status: COMPLETE. Do not re-run from scratch — verify the findings below still hold, then move on.**
Why it existed: auditing code that isn't what's deployed produces a beautiful, useless report.

**Findings (all VERIFIED by command, not inference):**

| # | Finding | Status |
|---|---|---|
| 1 | **Drift is trivial.** Deploy repo = a 2-commit snapshot of `web/`. Histories unrelated, but content in sync — only `.env` + two unused-`Sparkles`-import removals differ (`git diff main:web origin/main`). No stranded work. | ✅ Resolved — not a risk |
| 2 | **`/refunds` exists in BOTH** trees (`web/src/pages/Refunds.tsx`, routed `App.tsx:57`). An earlier claim that it was deploy-only was **wrong**. | ✅ Corrected |
| 3 | **`vercel.json` was MISSING from the deploy repo** → every direct link (`/refunds`, `/privacy`, `/terms`) returned Vercel's 404. | ✅ FIXED — commit `97dc7b8`, verified live (all HTTP 200; assets unaffected) |
| 4 | **`.env` is tracked** in the deploy repo; `.gitignore` excludes only `*.local`. Holds only `VITE_API_URL`, which Vite bakes into the public bundle anyway → **NOT a secret leak**, but a landmine for the first real key. | 🟡 Open (LOW) |
| 5 | Vercel **Root Directory `./` is CORRECT** for the deploy repo (app files are at its root). | ✅ No action |

**Still open from Report 0 — carry these forward:**
```
1. .env hygiene (LOW): add `.env` to .gitignore in the deploy repo, `git rm --cached .env`, and set
   VITE_API_URL as a Vercel environment variable instead. Confirm no non-VITE_ secret ever lands there.
2. SOURCE-OF-TRUTH STRATEGY (MEDIUM — still undecided): the monorepo and the deploy repo are separate
   trees kept in sync BY HAND. That worked so far only because the drift is trivial. Decide and
   document ONE of: (a) monorepo authoritative + a scripted sync/subtree push to the deploy repo,
   (b) deploy repo authoritative for web and the monorepo's web/ becomes a mirror, or (c) formally
   accept manual sync with a written checklist. Give exact commands for the chosen option.
   NOTE: their histories share no common ancestor, so a plain `git push` from the monorepo is NOT
   possible — any unification requires force-push or subtree/graft. Do not attempt without a backup.
3. ADMIN & MOBILE: neither appears deployed yet. Confirm whether separate deploy repos exist for them,
   or whether they will deploy from this monorepo (and with which Root Directory).
```

---

# REPORT 1: `backend_audit.md`

```
Audit backend/ (NestJS + Mongoose). Read the modules thoroughly; cite file:line for everything.

ARCHITECTURE & CODE QUALITY
- Is every module (controller/service/schema/DTO) properly structured and layered (logic in services,
  not controllers)?
- Unused imports, dead code, stray console.log, leftover TODOs?
- Do all DTOs use class-validator decorators? List any endpoint accepting unvalidated input.
- Are Mongoose schemas indexed for the queries actually run (check each find/aggregate against indexes)?
- Any circular module dependencies?

SECURITY (verify in code — quote the lines; do not trust comments)
- Password hashing: which algorithm, what cost factor, where?
- JWT: is the secret from env (never hardcoded)? What is the expiry? Is there refresh handling?
- OTP: is rate-limiting REAL and reachable (ThrottlerModule wired to the OTP routes)? What are the
  limits? Can OTP be brute-forced? Is the dev `devOtp` response gated so it can NEVER leak in prod?
- Razorpay webhook: signature verified with a TIMING-SAFE comparison? Quote it.
- Idempotency: can a replayed/duplicate webhook double-credit a wallet or double-confirm a booking?
  Trace the exact code path and prove it.
- Are all admin routes behind RolesGuard with correct roles? List any unguarded admin route.
- CORS: wildcard or an explicit origin allowlist? What happens in prod vs dev?
- Any place user input reaches a query unsafely?
- Is .env gitignored here, and does .env.example list every required var?

API COMPLETENESS
- Enumerate EVERY endpoint: method, route, purpose, auth/role required, validation, error handling,
  status codes. Present as a table.
- Cross-check against the frontends: endpoints the clients call that do NOT exist (broken), and
  endpoints no client calls (dead). Cite both sides.

DATABASE
- List every schema and its fields. Flag fields never read/written.
- Flag anything the frontends expect that the schema lacks.
- Confirm the in-memory dev Mongo is cleanly separated from prod Atlas config (cite the wiring).
- GROUND TRUTH says the prod DB starts EMPTY (seed is disabled in production). Assess the impact and
  propose a safe production seeding/migration path.

PROOF IMAGES (real issue, precise scope)
- `proofImages: string[]` stores base64 data URLs INLINE in the Booking document (≤5 images,
  ≤2.8M chars). Assess: document-size risk vs Mongo's 16MB limit, query/bandwidth cost of fetching
  bookings with proofs, and admin-list performance. Propose the Cloudinary (or S3) migration with
  concrete steps and the env vars required.

ENV & CONFIG
- Table: every env var, purpose, default (if any), REQUIRED?, and what breaks without it.

DELIVERABLE
- backend_audit.md with a numbered checklist ordered CRITICAL → HIGH → MEDIUM → LOW, then the
  mandatory "Checks I could NOT perform, and why".
```

---

# REPORT 2: `admin_audit.md`

```
Audit admin/ (React + Vite + TS). Cite file:line.

SCREENS
- List every screen/route. For each: data shown, actions available, and whether loading / error /
  empty states are handled (cite the code for each state, or mark it missing).
- Is Super Admin vs Sub Admin role visibility correctly enforced in the UI — and, more importantly, is
  the UI check backed by a server-side guard? (A UI-only check is a CRITICAL finding.)

API INTEGRATION
- How does it call the backend? Is the base URL an env var or hardcoded to localhost? Cite it.
- List every API call; confirm each backend endpoint exists; flag request/response type mismatches.
- Is 401 handled by redirecting to login? Is 403 handled gracefully? Cite the interceptor/handler.

FORMS & VALIDATION
- For each form: client validation, visible error messages, submit disabled while pending, success
  feedback. Cite or mark missing.

STATE
- Where is the JWT stored (localStorage/memory/cookie) and what are the XSS implications?
- Is it attached to every request? Does logout clear ALL state?

BUILD  ← RUN IT, don't guess
- Execute `npm run build` in admin/ and PASTE the real output. If it fails, that is the top finding.
- Are TS errors suppressed anywhere (@ts-ignore, `any` in API types, build flags)? Cite.
- Is vite config production-ready (base, env handling)?

TABLET/RESPONSIVE  → mark [MANUAL] unless you can actually render it. Instead of guessing, list the
specific layouts most likely to break (fixed widths, wide tables) with file:line, and give a human a
short check-list of what to look at.

DELIVERABLE: admin_audit.md, severity-ordered checklist + "Checks I could NOT perform, and why".
```

---

# REPORT 3: `web_audit.md`

```
Audit web/ (React + Vite + React Router). Cite file:line.
NOTE: See GROUND TRUTH. There is NO "/app/*" route zone — the homepage "/" IS the booking app. Do not
look for /app/*. Also audit against the DEPLOY repo where they differ (see REPORT 0).

MOCK DATA — highest priority
- web/VERCEL_API_GLITCH.md documents that `listServices` in web/src/api.ts is mocked with hardcoded
  services. Find EVERY mock/hardcoded data block (not just that one) and list each with file:line and
  the exact real API call that must replace it.
- List every other place data is hardcoded rather than fetched.

PAGES & ROUTES
- Enumerate every route from web/src/App.tsx. For each: static marketing vs live-data; SEO present
  (title/meta/structured data — cite the Seo component usage); and any route that exists in the deploy
  repo but not here (or vice versa).
- Confirm /refunds (Cancellation & Refunds) exists, is routed, and is linked from the footer. It is
  required for payment-gateway review.

BOOKING FLOW — trace it end to end, citing each step
  pincode gate → service listing → service detail sheet → cart → login gate → checkout
  (date/slot/address) → advance payment → confirmation → /bookings
- For each step: does it call the real backend or a mock? Any dead ends?
- Is OTP login functional on web? Is the wallet reachable? Cite.
- Cart persistence: where is it stored, and does it survive the login redirect?

API INTEGRATION
- Is the base URL an env var (VITE_API_URL) everywhere, with no hardcoded localhost? Cite.
- If the backend is DOWN: does the user get a helpful error or a blank page? Trace the error path for
  the homepage specifically — cite the catch/fallback.

SPA HOSTING — already FIXED (2026-07-14); re-verify only, do not re-report as a new bug.
- BrowserRouter + static hosting REQUIRES a catch-all rewrite to /index.html or every deep link 404s.
  `vercel.json` is now committed at the DEPLOY repo root (97dc7b8); /refunds, /privacy, /terms were
  verified returning HTTP 200 on direct load, with /images/* and /sitemap.xml still served correctly.
  Re-confirm this still holds, then move on.

PERFORMANCE & SEO
- Are images optimized? Give real file sizes from public/images (run `ls -la`), not guesses.
- sitemap.xml + robots.txt present and correct (do they list the real routes, incl. /refunds)?
- Render-blocking resources? Cite the <link>/<script> tags.
- Lighthouse: mark [MANUAL] — you cannot run it. Instead list code-level issues that would COST
  Lighthouse points, each with file:line.

RESPONSIVENESS → [MANUAL] unless you can render. List the specific CSS/layout risks with file:line
(fixed px widths, grids that won't collapse, touch targets <44px) and hand a human a check-list.

DELIVERABLE: web_audit.md, severity-ordered checklist + "Checks I could NOT perform, and why".
```

---

# REPORT 4: `mobile_audit.md`

```
Audit mobile/ (React Native + Expo). Cite file:line.
NOTE: `npx tsc` is NOT a valid check here (it crashes on RN navigation generics). Use
`npx expo export --platform web` to verify it compiles, and paste the real output.

SCREENS & NAVIGATION
- List every screen; map the navigation graph (which screen leads where).
- Per screen: loading / error / empty states handled? Cite or mark missing.

API
- How does it call the backend? Is the base URL configurable (not hardcoded localhost)? Cite.
- List every API call; confirm the backend endpoint exists.
- Offline/no-internet behaviour: what does the user see? Cite the handler, or report its absence.

AUTH
- Is OTP login complete? Is the JWT in expo-secure-store (not AsyncStorage)? Cite.
- Auto-login on restart? Token expiry handling? What happens on 401 mid-session?
- Confirm the dev OTP shortcut can never ship in a production build. Cite the gate.

PAYMENTS
- Is react-native-razorpay actually wired, or stubbed/dev-only? Trace the real code path and say
  plainly which it is.
- Is verification (client → backend → webhook) complete and idempotent?

STORE READINESS (check app.json/app.config.js and cite)
- bundle identifier / package name, app icon, splash, permissions, name, version, EAS config.
- Expo SDK deprecation warnings.
- List EXACTLY what is still missing to submit to Play Store and App Store.

PERFORMANCE
- Long lists without FlatList, avoidable re-renders, image caching. Cite each.

DELIVERABLE: mobile_audit.md, severity-ordered checklist + "Checks I could NOT perform, and why".
```

---

# REPORT 5: `wiring_and_deployment_audit.md`

```
How the four apps connect and what is required to go live.
Targets: backend → Render.com + MongoDB Atlas; admin → Vercel (admin.mvcleaningservices.in);
web → Vercel (mvcleaningservices.in, already live); mobile → EAS → Play/App Store;
all wired to api.mvcleaningservices.in.

ENV MASTER LIST
- Table: | App | Variable | Purpose | Example | Required? | What breaks without it |

API WIRING
- Current base URL per frontend; exact change needed to point at production.
- CORS: enumerate the exact origins prod must allow (apex + www + admin subdomain + Vercel preview
  URLs + mobile). Flag that Vercel PREVIEW deployments get random URLs — say how to handle them.

AUTH FLOW — trace consumer-mobile, consumer-web, and admin end to end; flag mismatches.

PAYMENT FLOW — trace: initiate → Razorpay order → checkout UI → payment → webhook → confirmation.
- Required Razorpay env vars; webhook URL for prod; how webhook signature + idempotency behave under
  retries. Explicitly state what CANNOT be tested without live keys.

IMAGE FLOW — precise (see GROUND TRUTH): service `imageUrl` is a URL string; `proofImages` are inline
base64. Scope the Cloudinary migration to proofImages (+ optionally admin-uploaded service images).
Give steps + env vars.

DEPLOYMENT — exact, step-by-step, per app:
- Backend → Render: build/start commands, health check (/api/health), env vars, Atlas IP allowlist,
  custom domain + DNS.
- Admin → Vercel: root directory, build, env, domain + DNS.
- Web → Vercel: ALREADY LIVE. Cover (a) reverting the api.ts mock, (b) VITE_API_URL, (c) the
  vercel.json SPA rewrite, (d) WHICH REPO to push to (see REPORT 0 — this is a real trap).
- Mobile → EAS: eas.json, build commands, signing/credentials, store listing assets.

DNS TABLE: | Type | Name | Value | Purpose | — for mvcleaningservices.in (apex, www, api, admin).

MISSING FROM v1 — cover these explicitly, they are launch blockers:
1. SMS/DLT: India requires DLT registration (sender ID + template approval) for transactional SMS via
   MSG91. Without it OTP does not deliver and NOBODY can log in. Document the process + lead time.
2. PRODUCTION SEEDING: the seed is disabled in production, so Atlas starts EMPTY and the live site will
   show no services. Define who seeds the catalog and how (admin UI vs migration script).
3. ROLLBACK & BACKUP: rollback procedure per app; Atlas backup policy; what to do on a bad deploy.
4. OWNERSHIP: who owns the Razorpay, MSG91, Atlas, Vercel, Render, and domain accounts; where secrets
   live; rotation plan.
5. COST: monthly cost per service at expected volume; which free tiers sleep/throttle (Render free tier
   cold starts will hurt OTP latency — assess).
6. MONITORING: uptime checks, error tracking, log retention. What exists today (be honest: likely
   nothing) and the minimum viable setup.

POST-DEPLOY VERIFICATION — a numbered, literally-executable checklist (OTP on mobile, OTP on web,
browse, book+pay, admin sees booking, admin assigns worker, consumer sees worker, wallet, reporting,
marketing pages, blog, and every legal page by DIRECT URL to catch SPA-rewrite 404s).

DELIVERABLE: wiring_and_deployment_audit.md ending with a master go-live checklist ordered by
DEPENDENCY (what must happen first), each item marked [BLOCKER] or [NICE-TO-HAVE].
```

---

# REPORT 6 (NEW): `content_and_compliance_audit.md`

**Why:** v1 audited whether the code *works*, never whether the site *tells the truth*. Payment-gateway
and app-store reviewers check exactly this, and misleading claims carry real legal risk.

```
Audit every user-facing string, claim, link, and legal page across web/, mobile/, admin/.

TRUTHFULNESS (each finding = file:line + the fix)
- Fabricated or unverifiable stats/claims (e.g. hero counters like "X happy customers", "N+ pros").
  Either prove them from real data or flag for removal.
- Testimonials: homepage testimonials are SAMPLE/code-flagged. Any sample content presented as a real
  customer quote is a CRITICAL trust/legal finding until replaced.
- Ratings: there is NO ratings system. Flag any star/rating UI as fabricated. Do NOT propose fake data.
- Placeholder contact details: dummy WhatsApp number (e.g. 919999999999), placeholder emails/addresses.
- Domain consistency: any reference to a domain that is not the live one (e.g. mvcleaning.in vs the
  actual mvcleaningservices.in) in copy, SEO tags, sitemap, canonical URLs, OG tags, structured data.
- Dead links: any href="#" (e.g. App Store / Google Play buttons that go nowhere). Either wire them to
  real listings or remove until the apps ship. Do not fabricate store URLs or use official badge assets
  you do not have rights to.

LEGAL / GATEWAY REQUIREMENTS
- Confirm these exist, are routed, linked in the footer, and reachable BY DIRECT URL: Privacy, Terms,
  Contact (with a real address + phone), Cancellation & Refunds (/refunds), Pricing transparency.
- Refund page: do the stated windows/timelines match what the CODE actually does (advance-to-confirm +
  balance-after)? Flag any promise the system cannot honour — a policy the product can't keep is worse
  than no policy.
- Is a re-clean/satisfaction guarantee claimed anywhere? If yes, flag it for owner confirmation — do
  not assume it is real.

CONSISTENCY
- Do prices/service names in marketing copy match the live catalog from the backend?
- Is brand naming consistent (MV Cleaning / MV Cleaning Services / MV) across apps and store listings?

DELIVERABLE: content_and_compliance_audit.md — a table:
| file:line | Issue | Type (false-claim / placeholder / dead-link / legal-gap / inconsistency) | Severity | Fix |
Ordered by severity. Everything that could mislead a customer or a reviewer = CRITICAL or HIGH.
```

---

## Changelog — what was optimized, and why

### 1. Fixed false premises that would have manufactured fake findings
| v1 said | Reality (verified) | Why it mattered |
|---|---|---|
| "the /app/* routes" | No `/app/*` zone exists. Homepage `/` **is** the booking app (`web/src/App.tsx`) | The auditor would hunt a nonexistent zone and report false "missing screens" |
| "images currently handled (base64 in MongoDB)" | Split: service `imageUrl` = **URL string**; only `proofImages` are **inline base64** (≤5, ≤2.8M chars) | A false premise makes the model "find" and "fix" a problem you don't have, and miss the one you do |
| "screens mentioned in the scope (PDF §4, §6)" | The AI never receives that PDF | Guaranteed hallucinated scope gaps |

### 2. Neutralised checks no code-reading AI can perform
Lighthouse scores, "renders correctly on mobile/desktop", "build completes without warnings", "does the
Razorpay UI actually open" — all previously phrased as answerable questions, so a model **will** answer
them with fiction. Now each is either **run it and paste real output**, or explicitly **[MANUAL]** with
a concrete human check-list. Added the mandatory closing section *"Checks I could NOT perform, and why"* —
usually the most valuable part of an audit.

### 3. Added anti-hallucination rules (BLOCK B)
Mandatory `file:line` citations; every finding tagged **[VERIFIED] / [INFERRED] / [MANUAL]**; explicit
"never state a runtime result you didn't execute"; "challenge bad premises instead of answering them";
fixed severity definitions; a required output format; and permission to **stop and deliver a partial
report that is true** rather than a complete one that guesses.

### 4. Added GROUND TRUTH (BLOCK A)
Pre-loads verified architecture facts + already-known issues, so the auditor spends context on
*discovery* instead of re-deriving basics — and can't "discover" things that are already documented.

### 5. Split into 6 single-session runs
v1's "read every file, do NOT summarize" × 4 apps × 5 reports in one pass exhausts context; reports 4–5
(mobile, wiring) degrade into filler precisely where the deployment risk concentrates.

### 6. NEW Report 0 — Source of Truth (now RUN and CLOSED)
v1's biggest blind spot: it assumed one monorepo ships everything, when the live site actually deploys
from a **separate repo**. Report 0 was run on 2026-07-14 and settled it:
- **The scare was overstated.** The histories are unrelated, but the **content is in sync** — the whole
  difference is `.env` + two unused-import removals. No stranded work. Other reports are safe to trust.
- **It caught a real, live bug the other reports never would have:** `vercel.json` was missing from the
  deploy repo, so every shared/direct link (`/refunds`, `/privacy`, `/terms`) returned a 404. Fixed and
  verified live (commit `97dc7b8`).
- **It corrected two of the auditor's own claims** (`/refunds` exists in both trees; drift is trivial) —
  which is exactly why Rule 5 ("challenge premises, including your own") is in BLOCK B.
- `.env` hygiene and the long-term source-of-truth strategy remain open, carried forward in Report 0.

### 7. NEW Report 6 — Content & Compliance
v1 audited whether the code *works*, never whether the site *tells the truth*: fabricated stats, SAMPLE
testimonials shown as real quotes, dummy WhatsApp number, wrong domain, `href="#"` store links, and
whether the refund policy matches what the code actually does. These are exactly what payment-gateway
and app-store reviewers check, and false claims carry legal risk.

### 8. Added the missing launch blockers to Report 5
**DLT/SMS registration** (without it OTP never delivers and nobody can log in — a hard blocker absent
from v1), **production seeding** (seed is disabled in prod → Atlas starts empty → live site shows no
services), plus rollback/backup, account ownership & secret rotation, cost/free-tier cold starts, and
monitoring.

### 9. Sharpened the security section
Changed "is X implemented?" to **"quote the lines that prove it"** — comments lie, code doesn't. Added
specifics v1 missed: whether the dev `devOtp` response can leak in production, whether admin UI role
checks are backed by **server-side** guards (a UI-only check is critical), OTP brute-force resistance,
and Vercel **preview URLs** breaking a strict CORS allowlist.

### 10. Corrected tooling landmines
Told Report 4 not to use `npx tsc` on the Expo app (it crashes on RN navigation generics) and to use
`npx expo export --platform web` instead — v1 would have produced a false "TypeScript is broken" finding.
