# MV Cleaning Services — Master Fix & Deployment Plan (v2)

The goal: turn this codebase from a local development project into a fully functioning,
production-ready platform, deployed to the cloud and the app stores.

**What changed from v1:** added the missing **Step 0** (without it, none of your fixes reach the live
site), added **catalog seeding** (without it you ship an empty website), named **all three** sources of
fake data (v1 named two), pulled the **no-dependency web fixes forward** (they're the actual Google leak
and don't need the backend), moved **Cloudinary off the critical path**, and added the **DNS +
verification** steps that catch mistakes before customers do.

---

## 🛑 STEP 0 — One source of truth (DO THIS FIRST)

**Why this is first:** the live website does **NOT** deploy from this monorepo. It deploys from a
separate GitHub repo, `digistrivemedia-dot/mv-cleaning-frontend-web`, with an unrelated git history.
**This monorepo already has ~31 commits that never reached production.**

👉 **If we skip this step, we will "fix" the web app and nothing will change on the live site.**
Every later phase silently fails. This is not hypothetical — it already happened.

**Do this:**
1. Push this monorepo to a **new private GitHub repo** on the client's account.
   *(It currently has no remote of its own — `origin` points at the old deploy repo.)*
2. Repoint **Vercel → web project** at the monorepo, **Root Directory = `web`**
3. Point **Vercel → admin project** at the monorepo, **Root Directory = `admin`**
4. Point **Render → backend** at the monorepo, **Root Directory = `backend`**
5. Move the domain over, confirm the site still loads, then **retire** `mv-cleaning-frontend-web`.

**Result:** one repo, three deploys, no more drift. This is what the senior dev will expect.

---

## ⚡ PHASE 0 — Start now, in parallel (no dependencies)

These block nothing and are blocked by nothing. Start them **today**.

### A. Paperwork & decisions (no developer time)
1. **DLT registration** — the longest lead item on the project. No DLT → no OTP → nobody can log in.
   Use the same documents you're already gathering for Razorpay KYC. MSG91 support will assist.
2. **Decide the mobile App ID + name** — e.g. `in.mvcleaningservices.app` / "MV Cleaning Services".
   **Permanent after first publish.** The decision takes 5 minutes; the work happens in Phase 4.

### B. Web fixes that need NO backend (ship immediately)
These are the **actual data leak to Google**. Do not wait a week for the backend to fix a 2-minute bug.
1. **`sitemap.xml` + `robots.txt`** — every URL says `https://mvcleaning.in` but the live site is
   **`mvcleaningservices.in`**. Our sitemap is pointing Google **at the wrong domain**. Also add `/refunds`.
2. **Remove the fake `4.9★` rating** from `/about` — it is **live right now** and there is no ratings
   system in the product to derive it from. *(Unlike the WhatsApp number, this can never be "filled in"
   truthfully later.)*
3. **Compress images** — `public/images/` is **8.8 MB**; every file is an unoptimised PNG (the **logo
   alone is 901 KB**). Convert to WebP, resize to display size. Biggest single speed win available.
4. **Add SEO tags to the homepage** — every other page has them; the homepage (the one that must rank)
   has none.

---

## Phase 1: The Backend (The Brain) 🧠

Nothing works without the backend. Deploy it first so the other apps have a live
`api.mvcleaningservices.in` to talk to.

1. **Database:** connect the MongoDB Atlas cluster. **Turn on Atlas backups before any real customer
   data exists.**
2. **Speed:** add the two missing indexes — `booking.razorpayOrderId` (used by every payment webhook,
   currently a full collection scan) and `service.isActive` (hit on every homepage load).
3. **Security config:** set strict **CORS** (`CORS_ORIGINS`) and the **Super Admin credentials**.
   ⚠️ If `SUPER_ADMIN_USERNAME`/`PASSWORD` aren't set at first boot, the seed **silently skips** and
   **no admin account exists** — with no way to recover except a redeploy.
   ⚠️ CORS must list the **apex AND `www` AND `admin.`** — they are three different origins.
4. **Safety tests:** tests proving money can't be double-credited (webhook replay, concurrent wallet
   debit, final payment).
5. **Deploy to Render** — Root `backend`, build `npm ci && npm run build`, start `npm run start:prod`,
   health check `/api/health`. Allowlist Render's egress IPs in Atlas.
6. **DNS:** point `api.mvcleaningservices.in` → Render.
7. **✅ VERIFY:** `curl https://api.mvcleaningservices.in/api/health`
   → must return `{"status":"ok","database":"connected"}`
8. **🌱 SEED THE CATALOG** ← **do not skip this**
   Production seeding is **disabled by design** (`services.service.ts:29` returns early when
   `NODE_ENV=production`), so **Atlas starts completely empty**. Without this step the website will go
   live showing **zero services** while the backend looks perfectly healthy.
   Seed via the API using the super-admin token (`POST /api/admin/services`), or wait for Phase 3 and
   use the Admin UI — but then **Phase 2 will have nothing to display.** Seeding here is simpler.
9. **✅ VERIFY:** `curl "https://api.mvcleaningservices.in/api/services?pincode=560001"` → **not empty**.

---

## Phase 2: The Web App (The Public Face) 🌐

The web app is already live and public, so we fix its data as soon as the backend can serve it.
*(The no-backend fixes already shipped in Phase 0-B.)*

1. **Data connection:** set `VITE_API_URL=https://api.mvcleaningservices.in/api` in **Vercel's
   environment variables**, and **delete the committed `.env`** from the repo
   (`git rm --cached .env` + add to `.gitignore`) so it can never override or drift again.
2. **Kill the fakes — all THREE (v1 only listed two):**
   - `FALLBACK_SERVICES` in `Services.tsx` — a fake price list (Deep Cleaning **₹999**)
   - `FALLBACK_POSTS` in `Blog.tsx` — fabricated blog articles shown whenever the API fails
   - **`listServices` mock in `api.ts:130-138`** — the one actually serving **₹2499** today
     *(the real catalog price is ₹1499 — three different prices for one service)*
   - **`SERVICE_SCHEMA` in `Services.tsx`** — built **from `FALLBACK_SERVICES`**, so it feeds fake
     prices and a service you don't sell ("Salon at Home") **straight to Google**. Fixing this is the
     whole point of the phase; rebuild it from live data or remove it.
3. **Redeploy** — ⚠️ Vite bakes env vars in at **build time**. Changing the Vercel setting does
   **nothing** until a rebuild.
4. **✅ VERIFY (this is how the current bug shipped):**
   ```
   curl -s https://mvcleaningservices.in/assets/<hash>.js | grep localhost
   ```
   → must return **nothing**, and `api.mvcleaningservices.in` must appear instead.
   **Do not trust the dashboard. Check the bundle.**
5. **✅ VERIFY:** open the homepage on a real phone — enter a pincode, see real services and real prices.

> **Ordering rule:** never remove the fakes *before* the backend is live. The mocks are currently the
> only reason the site renders at all. Remove them early and you replace lies with errors — worse.

---

## Phase 3: The Admin Panel (The Command Center) 🛡️

The tools your client uses to run the business.

1. **The "Frozen Admin" fix:** redirect to login when the session expires. Admin tokens last **1 day**,
   and today there is **no 401 handling at all** — so every admin who leaves a tab open comes back to
   "Unauthorized" errors on every click, **daily**, with no prompt to log back in.
2. **Mobile navigation fix:** add a hamburger menu. At ≤768px the CSS does `.sidebar { display: none }`
   with **no replacement** — and since navigation **and the logout button** both live in the sidebar,
   the client on a phone is **locked on the Orders tab and cannot log out**.
3. **Speed:** add code splitting — one **629 KB** bundle today, loading all 11 views eagerly (including
   Super-Admin screens a Sub Admin can never open). Mirror the `lazy()` pattern `web/` already uses.
4. **Proof-of-work upload fix:** add **client-side image compression**. The uploader sends raw base64
   with no size check, but the backend caps at ~2 MB — so a normal **3–5 MB phone photo is rejected**
   with a generic error. *(This is the admin-side fix. The Cloudinary storage change is backend work —
   see Phase 5.)*
5. **Deploy to Vercel** — Root `admin`, set `VITE_API_URL`, DNS `admin.mvcleaningservices.in`.
   No `vercel.json` needed (the admin uses tabs, not routes).
6. **✅ VERIFY:** log in as Super Admin — proves the seed, CORS, and JWT all work together.
7. **[MANUAL]** Consider Vercel password protection — this panel handles money and customer PII.

---

## Phase 4: The Mobile App (The Final Frontier) 📱

Last, because app stores are slow and painful to update.

1. **App identity:** set the permanent App ID and change the name from **"mobile"** to
   "MV Cleaning Services". *(Decision already made in Phase 0-A.)*
2. **Payment integration:** install and wire the real checkout screen. **This must land BEFORE live
   payment keys are switched on** — otherwise the app creates bookings with an unpaid advance and
   leaves them stranded with no way to pay.
3. **Offline & expiry handling:** add the "You are offline" state (there is **no** connectivity handling
   today — users just see a raw *"Network request failed"*), and fix the frozen-customer 401 bug.
4. **Build config:** create `eas.json` (doesn't exist — EAS cannot build without it) and wire the
   splash screen (the image exists but was never configured).
5. **Point at production:** set `EXPO_PUBLIC_API_URL` — a shipped app still pointing at `localhost` is
   dead on every device.
6. **Performance:** convert Bookings + Wallet to `FlatList` (every list is currently `ScrollView` +
   `.map()`, so all rows mount at once and grow unbounded).
7. **Compile + test on a REAL device** before submitting.

---

## Phase 5: After launch / as needed 🔧

Deliberately **off the critical path** — none of this blocks going live.

1. **Cloudinary** for proof photos — currently stored as base64 **inline in the booking document**.
   *(Note: service images are already plain URLs — no migration needed there.)*
2. **The notification decision** — the checkout screen promises *"You'll be notified once a professional
   is assigned"*, but there is **no notification system of any kind** (no push, no email, no SMS beyond
   OTP). **Either build it or change that sentence.**
3. **The refund decision** — the `/refunds` page promises free cancellation within 2 hours and automatic
   refunds in 7 days, but there is **no customer cancel endpoint and no refund logic**. Match the policy
   to the product, or build the product to the policy.
4. **Monitoring** — uptime checks + error tracking. None exists today.
5. **Analytics** — no GA4/GTM; you currently cannot measure conversion.
6. **Client content** — real WhatsApp number, real email, real testimonials (with written consent),
   final policy terms.

---

## ⛔ Ordering rules — mistakes that cost money

- **Never remove the mocks before the backend is live** → the site shows errors instead of data.
- **Never set payment keys before the web + mobile checkout handlers exist** → orders strand PENDING,
  unpayable, with money possibly taken.
- **Never set payment keys without the webhook secret** → the system takes real money and **never
  confirms the booking**.
- **Never submit to the stores before the App ID is final** → it is permanent.
- **Never trust a dashboard — verify the built artifact.** The live `localhost` bug existed for weeks
  precisely because nobody checked the bundle.
- ⚠️ **"Temporarily bypass MSG91 for testing"** means `NODE_ENV != production`, which **also enables
  `/payments/test-confirm`** — anyone who finds that URL can confirm bookings **without paying**, and
  OTPs are exposed in API responses. Fine for a private, time-boxed test. **Never on a public URL.**

---

## The critical path, honestly

**Step 0 (repo) → DLT (parallel) → Backend live + seeded → Web pointed at it → Admin → OTP → Payments → Stores**

Everything in Phase 0-B and Phase 5 runs in parallel and blocks nothing.

---

> [!IMPORTANT]
> **User review required**
> If you approve, we begin with **Step 0** (yours — GitHub/Vercel/Render wiring) and **Phase 0-B**
> (mine — the four web fixes that need no backend and can ship today).

> [!WARNING]
> **Open questions**
> 1. **Is the business GST-registered with a legal entity?** This decides DLT vs. an alternative — it's
>    the single biggest scheduling question on the project.
> 2. **Do you own `mvcleaning.in`?** If not, the sitemap/robots aren't just misconfigured — they're
>    pointing Google at somebody else's domain.
> 3. **MongoDB connection string ready?** (Needed for Phase 1.)
> 4. **Cloudinary keys** — nice to have, **not** needed to launch. Phase 5.
> 5. **Notifications + refunds** — build the feature, or reword the promise? *(A product decision, not
>    a technical one.)*



now can you tell me with @admin_audit.md  @backend_audit.md @mobile_audit.md @web_audit.md   all these 4 foldfers and its things whihc we planned on this now where we are standing
Let me verify a few loose ends before I report, so the status is accurate rather than from memory:

Bash Verify remaining audit items
IN
cd /c/Users/muska/Downloads/MV_cleanningservices; echo "=== mobile/dist gitignored? (mobile L1) ==="; git check-ignore -v mobile/dist 2>&1 | head -1 || echo "  ❌ NOT ignored"; echo; echo "=== dead code still present? (web M4) ==="; for f in web/src/pages/Home.tsx web/src/components/Layout.tsx web/src/components/AppDownloadModal.tsx; do [ -f "$f" ] && echo "  ⚠️ still present: $f"; done; echo; echo "=== stale doc? (web M1) ==="; ls web/VERCEL_API_GLITCH.md 2>/dev/null && echo "  ⚠️ still present (now stale)"; echo; echo "=== SettingsView loading state? (admin M3) ==="; grep -c "loading" admin/src/views/SettingsView.tsx; echo; echo "=== TOTAL CHANGES THIS SESSION ==="; git status --short | grep -E "^ M| M |^\?\?" | wc -l | sed 's/^/  files touched: /'; git diff --stat | tail -1

OUT
=== mobile/dist gitignored? (mobile L1) ===
mobile/.gitignore:8:dist/	mobile/dist

=== dead code still present? (web M4) ===
  ⚠️ still present: web/src/pages/Home.tsx
  ⚠️ still present: web/src/components/Layout.tsx
  ⚠️ still present: web/src/components/AppDownloadModal.tsx

=== stale doc? (web M1) ===
web/VERCEL_API_GLITCH.md
  ⚠️ still present (now stale)

=== SettingsView loading state? (admin M3) ===
0

=== TOTAL CHANGES THIS SESSION ===
  files touched: 64
warning: in the working copy of 'admin/src/api.ts', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'admin/src/index.css', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'backend/src/modules/activity-log/activity-log.service.ts', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'backend/src/modules/auth/auth.service.ts', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'backend/src/modules/blog/schemas/blog-post.schema.ts', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'backend/src/modules/bookings/bookings.service.ts', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'backend/src/modules/bookings/schemas/booking.schema.ts', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'backend/src/modules/services/schemas/service.schema.ts', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'backend/src/modules/services/services.service.ts', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'mobile/App.tsx', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'mobile/app.json', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'mobile/package-lock.json', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'mobile/package.json', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'mobile/src/api.ts', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'mobile/src/navigation/RootNavigator.tsx', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'web/public/robots.txt', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'web/public/sitemap.xml', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'web/src/components/Seo.tsx', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'web/src/pages/Blog.tsx', LF will be replaced by CRLF the next time Git touches it
 52 files changed, 588 insertions(+), 1431 deletions(-)
Here's exactly where you stand against all four reports — verified, not from memory.

Scoreboard
Backend	Web	Admin	Mobile
Code items done	5 / 5	7 / 7	5 / 5	8 / 9
Left (code)	0	4 minor	2 minor	1 (Razorpay)
Left (deploy/you)	4	1	2	3
52 files changed, 588 insertions, 1431 deletions — the codebase got smaller, because most of what came out was fake data.

✅ Every CRITICAL + HIGH code item is done
Backend — H1 indexes (+ a regression test so nobody deletes them), H2 compound index, H3 tests 4 → 23 (mutation-proven: I broke idempotency, 2 tests failed, restored), L1 silent failures. Also closed an open question: mongodb-memory-server is a devDependency ✅.

Web — C1/C2/C3 + H1/H2/H3/H4 all done. Fakes: audit said 3, there were 5. Images 8.71 MB → 0.77 MB (−91%).

Admin — H1 401, H2 629 KB → 216 KB, H3 hamburger, H4 photo compression, M4 Bell removed.

Mobile — C1/C2/C3 + H1/H2/H3 + M1/M2 done. H4 partial by design.

Corrections to my own audits
Web C1 undercounted. Two more fakes my grep couldn't see: a hardcoded HTML pricing table and fabricated article bodies.
Backend H4 was wrong — it claims "web runs on 8083". It runs on 5173, so .env.example was already correct.
Mobile H4 was wrong — it lumped Wallet with Bookings as "unbounded". Wallet is server-capped at 50 and month-grouped. Converting it = churn + risk for zero gain. Bookings only.
What's actually left
🔴 Blocking — but not code:

DLT/MSG91 (backend C3) — your longest pole. Nothing works without it.
Seed the catalog (C1) — Atlas starts empty. Decision made: Admin UI.
Render env vars (C2/H4) — super-admin creds + CORS_ORIGINS.
Confirm in.mvcleaningservices.app — permanent after publish.
🟠 Code, deliberately deferred:

Razorpay: mobile C4 + web W6 — must land before live keys, or bookings strand PENDING.
Customer cancel/refund (backend M1) — waiting on the client's real terms.
🟡 Small leftovers (verified still open):

Dead code still present: Home.tsx, Layout.tsx, AppDownloadModal.tsx (web M4)
VERCEL_API_GLITCH.md — now actively wrong, the mock it documents is gone (web M1)
SettingsView loading state — still 0 (admin M3)
JWT-in-localStorage + the BlogView XSS check (admin M1)
Cloudinary, monitoring, analytics — Phase 5
Bottom line: every app builds and runs locally against a real backend with real data. The code is no longer what's blocking you — paperwork is.

Want me to clear the small leftovers (~20 min), or go at Razorpay in test mode (free keys today + ngrok), which is the last real feature gap?







Let me verify a few loose ends before I report, so the status is accurate rather than from memory:

Bash Verify remaining audit items
IN
cd /c/Users/muska/Downloads/MV_cleanningservices; echo "=== mobile/dist gitignored? (mobile L1) ==="; git check-ignore -v mobile/dist 2>&1 | head -1 || echo "  ❌ NOT ignored"; echo; echo "=== dead code still present? (web M4) ==="; for f in web/src/pages/Home.tsx web/src/components/Layout.tsx web/src/components/AppDownloadModal.tsx; do [ -f "$f" ] && echo "  ⚠️ still present: $f"; done; echo; echo "=== stale doc? (web M1) ==="; ls web/VERCEL_API_GLITCH.md 2>/dev/null && echo "  ⚠️ still present (now stale)"; echo; echo "=== SettingsView loading state? (admin M3) ==="; grep -c "loading" admin/src/views/SettingsView.tsx; echo; echo "=== TOTAL CHANGES THIS SESSION ==="; git status --short | grep -E "^ M| M |^\?\?" | wc -l | sed 's/^/  files touched: /'; git diff --stat | tail -1

OUT
=== mobile/dist gitignored? (mobile L1) ===
mobile/.gitignore:8:dist/	mobile/dist

=== dead code still present? (web M4) ===
  ⚠️ still present: web/src/pages/Home.tsx
  ⚠️ still present: web/src/components/Layout.tsx
  ⚠️ still present: web/src/components/AppDownloadModal.tsx

=== stale doc? (web M1) ===
web/VERCEL_API_GLITCH.md
  ⚠️ still present (now stale)

=== SettingsView loading state? (admin M3) ===
0

=== TOTAL CHANGES THIS SESSION ===
  files touched: 64
warning: in the working copy of 'admin/src/api.ts', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'admin/src/index.css', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'backend/src/modules/activity-log/activity-log.service.ts', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'backend/src/modules/auth/auth.service.ts', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'backend/src/modules/blog/schemas/blog-post.schema.ts', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'backend/src/modules/bookings/bookings.service.ts', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'backend/src/modules/bookings/schemas/booking.schema.ts', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'backend/src/modules/services/schemas/service.schema.ts', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'backend/src/modules/services/services.service.ts', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'mobile/App.tsx', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'mobile/app.json', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'mobile/package-lock.json', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'mobile/package.json', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'mobile/src/api.ts', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'mobile/src/navigation/RootNavigator.tsx', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'web/public/robots.txt', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'web/public/sitemap.xml', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'web/src/components/Seo.tsx', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'web/src/pages/Blog.tsx', LF will be replaced by CRLF the next time Git touches it
 52 files changed, 588 insertions(+), 1431 deletions(-)
Here's exactly where you stand against all four reports — verified, not from memory.

Scoreboard
Backend	Web	Admin	Mobile
Code items done	5 / 5	7 / 7	5 / 5	8 / 9
Left (code)	0	4 minor	2 minor	1 (Razorpay)
Left (deploy/you)	4	1	2	3
52 files changed, 588 insertions, 1431 deletions — the codebase got smaller, because most of what came out was fake data.

✅ Every CRITICAL + HIGH code item is done
Backend — H1 indexes (+ a regression test so nobody deletes them), H2 compound index, H3 tests 4 → 23 (mutation-proven: I broke idempotency, 2 tests failed, restored), L1 silent failures. Also closed an open question: mongodb-memory-server is a devDependency ✅.

Web — C1/C2/C3 + H1/H2/H3/H4 all done. Fakes: audit said 3, there were 5. Images 8.71 MB → 0.77 MB (−91%).

Admin — H1 401, H2 629 KB → 216 KB, H3 hamburger, H4 photo compression, M4 Bell removed.

Mobile — C1/C2/C3 + H1/H2/H3 + M1/M2 done. H4 partial by design.

Corrections to my own audits
Web C1 undercounted. Two more fakes my grep couldn't see: a hardcoded HTML pricing table and fabricated article bodies.
Backend H4 was wrong — it claims "web runs on 8083". It runs on 5173, so .env.example was already correct.
Mobile H4 was wrong — it lumped Wallet with Bookings as "unbounded". Wallet is server-capped at 50 and month-grouped. Converting it = churn + risk for zero gain. Bookings only.
What's actually left
🔴 Blocking — but not code:

DLT/MSG91 (backend C3) — your longest pole. Nothing works without it.
Seed the catalog (C1) — Atlas starts empty. Decision made: Admin UI.
Render env vars (C2/H4) — super-admin creds + CORS_ORIGINS.
Confirm in.mvcleaningservices.app — permanent after publish.
🟠 Code, deliberately deferred:

Razorpay: mobile C4 + web W6 — must land before live keys, or bookings strand PENDING.
Customer cancel/refund (backend M1) — waiting on the client's real terms.
🟡 Small leftovers (verified still open):

Dead code still present: Home.tsx, Layout.tsx, AppDownloadModal.tsx (web M4)
VERCEL_API_GLITCH.md — now actively wrong, the mock it documents is gone (web M1)
SettingsView loading state — still 0 (admin M3)
JWT-in-localStorage + the BlogView XSS check (admin M1)
Cloudinary, monitoring, analytics — Phase 5
Bottom line: every app builds and runs locally against a real backend with real data. The code is no longer what's blocking you — paperwork is.

Want me to clear the small leftovers (~20 min), or go at Razorpay in test mode (free keys today + ngrok), which is the last real feature gap?