# Banco Aurora — Premium Digital Banking Platform

A **demo** Portuguese digital banking platform, built with Next.js 15 (App
Router), React 19, TypeScript, Tailwind CSS, and a real Postgres database
via Prisma. "Banco Aurora" is a fictional bank — this is not affiliated
with, and does not represent, any real financial institution.

## Tech stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS** with a custom design token system (`tailwind.config.ts`)
- **Prisma + PostgreSQL** (Supabase-hosted) — real persisted data, no mock arrays
- **Framer Motion**, **React Hook Form + Zod**, **TanStack Query**, **Zustand**, **Recharts**
- **PWA**: manifest, generated icons, service worker, offline page, custom install prompt
- **Built-in EN/PT translator** (no external API, just a dictionary + toggle)

## Getting started

```bash
npm install                # also runs `prisma generate` via postinstall
npx prisma db push         # creates tables in your Postgres database
npx prisma db seed         # populates demo data (Mariana Costa, accounts, etc.)
npm run dev
```

Open http://localhost:3000. Dark mode is on by default. Log in with the
seeded demo user shown below to reach `/dashboard`; visit `/admin` directly
for the admin console.

### Demo credentials / shortcuts

- **Login:** the seeded user (mariana.costa@example.com) or any account you
  register yourself — passwords are now real (bcrypt-hashed, checked
  against Postgres). The seeded user's password is `Demo1234!`.
- **OTP / 2FA code:** real, randomly generated, stored in Postgres. There's
  no email/SMS provider wired up, so look codes up at `/admin/verification-codes`.
- **Transfer PIN:** `1234` (same default for the seeded user and any new signup)

### How registration + verification actually works now

1. `/register` → `POST /api/auth/register` hashes the password with bcrypt,
   creates a real `User` row + a starter account, and issues a 6-digit email
   verification code (stored in the `VerificationCode` table).
2. `/verify-email` → `/otp?purpose=email` checks that code against Postgres,
   then issues a phone verification code.
3. `/verify-phone` → `/otp?purpose=phone` checks that code, marks the user
   verified, and logs them in (session set from the real DB row).
4. `/two-factor` is an optional, skippable demo QR screen.
5. Logging back in later: `/login` → `POST /api/auth/login` checks the
   bcrypt hash, then issues a login OTP → `/otp?purpose=login` → real session.

Since there's no real email/SMS sending, **admins can see every outstanding
code at `/admin/verification-codes`** — exactly the "customer says they
never got the code, look it up and read it to them over chat" flow from the
brief. The phone verification code is issued automatically the moment email
verification succeeds, so it's ready in Postgres by the time the user
reaches `/verify-phone`.

### Deposits (crypto + gift card)

`/dashboard/deposit` lets a customer fund their account two ways:

- **Gift card** — pick a provider and value, enter a code (any 10+
  character string is accepted in this demo), and the account is credited
  instantly (`POST /api/deposits`, `method: "giftcard"`).
- **Crypto** — pick a currency and amount, get a generated deposit address,
  and the deposit sits as a real **pending** transaction until it's
  confirmed. Since there's no real blockchain integration, confirmation
  happens either by the customer tapping "simulate confirmation" or by an
  admin approving it from `/admin/transactions` — both call the same
  `POST /api/transactions/[id]/resolve` endpoint, which actually increments
  the account balance in Postgres.

### Admin pages now backed by real data

Every admin page fetches from Postgres: Dashboard overview, Customers,
Accounts, Transactions (with working approve/reject that moves real money),
KYC Verification (queries real users with an unverified/pending
`kycStatus`), Cards, Loans, Verification Codes, and Security (a real
`LoginAttempt` row is written on every login, success or failure). CMS and
Reports remain illustrative demo content — there's no backing content model
for those in this app's schema.


## Database

`DATABASE_URL` is already set in `.env` (gitignored) to the Supabase Postgres
instance you provided.

**⚠️ Rotate that database password.** It was shared in plaintext in chat, so
treat it as compromised — change it in your Supabase dashboard, then update
`.env` with the new value.

Schema: `prisma/schema.prisma` — models for User, Account, Transaction,
Beneficiary, Card, Notification, LoanProduct, LoanApplication, SavingsGoal,
InvestmentHolding, AdminCustomerView, and analytics tables.

Seed data: `prisma/seed.ts` — same content as the old mock data, just written
into real Postgres rows instead of in-memory arrays.

Useful scripts:
```bash
npm run db:push      # push schema to the database (no migration history)
npm run db:migrate   # create a tracked migration (recommended for real use)
npm run db:seed      # (re)populate demo data
npm run db:studio    # open Prisma Studio to browse data visually
```

## Project structure

```
prisma/
  schema.prisma        # full data model
  seed.ts              # demo data seeding script
src/
  app/
    (marketing)/       # Public site: landing + 19 product/info pages
    (auth)/             # Login, register, password reset, OTP, 2FA
    dashboard/          # Customer app (mobile-first, bottom nav shell)
    admin/              # Admin console (sidebar shell)
    api/                # Route handlers — the real backend (Prisma-backed)
  components/
    ui/                 # Design-system primitives + InstallPrompt, LanguageToggle
    nav/                # BottomNav, TopNav, AdminSidebar
    dashboard/          # TransferAuthorisationModal, etc.
    marketing/          # Navbar, Footer, MarketingPageTemplate
    providers/          # TanStack Query + next-themes + sonner + i18n wiring
  lib/
    types.ts            # Domain types (Account, Transaction, Card, etc.)
    mock-data.ts         # Only used now for: session display name/avatar
                          # fallback, and illustrative platform-wide admin
                          # vanity stats (see "Known limitations")
    prisma.ts            # Prisma client singleton
    current-user.server.ts  # resolves the demo user (stands in for real auth)
    serializers.server.ts   # Prisma model → frontend type conversion
    services/api.ts     # Client-side fetch wrappers around /api/* routes
    i18n/                # dictionaries.ts + context.tsx (EN/PT translator)
scripts/
  generate-marketing-pages.mjs   # Content scaffolding utility for the 19
                                  # static marketing sub-pages
```

## How data flows now (no more mock data)

Every screen calls a function in `src/lib/services/api.ts`, which calls a
real Next.js API route under `src/app/api/**`, which uses Prisma
(`src/lib/prisma.ts`) to read/write Postgres. There is no more in-memory
mock store — a page refresh does **not** reset your data anymore; only a
database reset (re-running the seed script) does.

## PWA & the "install app" option

- `public/manifest.json`, `public/sw.js`, `public/offline.html`, and
  generated icons in `public/icons/` are all in place.
- `src/components/ui/install-prompt.tsx` now shows a visible **"Instalar o
  Banco Aurora"** banner instead of relying on the easy-to-miss browser
  address-bar icon. On Chrome/Edge/Android it triggers the real native
  install dialog; on iOS Safari (which never fires the install event) it
  shows manual "Share → Add to Home Screen" instructions instead.

**If you still don't see an install option, check these in order:**
1. **HTTPS or localhost only.** Service workers (required for install)
   refuse to register over plain HTTP on a real domain. `localhost` is
   exempt, so `npm run dev` works, but a deployed site needs HTTPS.
2. **iOS Safari never shows an automatic prompt** — Apple doesn't support
   `beforeinstallprompt`. Users must tap Share → "Add to Home Screen"
   manually; our banner tells them this.
3. **Already installed?** The banner and native prompt both hide themselves
   once the app is running in standalone/installed mode.
4. **Hard refresh after first deploying.** If an old service worker from a
   previous version is cached, unregister it in DevTools → Application →
   Service Workers, then reload.
5. **Chrome install engagement heuristics.** Chrome sometimes waits for a
   little bit of user engagement (a few seconds on-page, or a prior visit)
   before firing `beforeinstallprompt` on brand-new domains. This is a
   browser-side heuristic, not something the app controls.

## Design system

- **Palette:** deep navy `ink`, `emerald`/`mint` (trust + growth), `gold`
  (premium accents), `coral` (alerts/destructive).
- **Type:** Space Grotesk (display), Inter (UI text), IBM Plex Mono
  (balances & account numbers — tabular figures so digits never jitter).
- **Signature component:** `VaultCard` — the gradient foil card reused for
  the landing hero, the dashboard balance card, and every card view.
- **Locale:** Portuguese (Europe) by default — EUR currency, IBAN/NIB
  account numbers, pt-PT date/number formatting.

## Language toggle (free built-in translator)

`src/lib/i18n/` implements a lightweight EN/PT dictionary + React context —
no external translation API, no cost. The selected language is persisted to
`localStorage` and applied via `useLayoutEffect` (not `useEffect`) so it's
restored before first paint — no flash back to the default language when
navigating or reloading. Fully translated: navigation (bottom nav +
marketing navbar), every dashboard page's top-bar title, the Settings page,
the full login/register/OTP flow, the landing page hero, and the language
switcher itself. Seeded data content (transaction descriptions, merchant
names, notification text) intentionally stays in Portuguese regardless of
the toggle — the same way a real bank statement shows merchant names as
recorded, not machine-translated. Extend `dictionaries.ts` and swap
hardcoded strings for `t.xxx.yyy` the same way to widen UI-chrome coverage
further.

## Known limitations of this demo

- **Auth is real but simplified.** Passwords are bcrypt-hashed and checked
  against Postgres, and OTP codes are real/DB-backed. There's no real
  session cookie/JWT though — the client holds the verified user in a
  zustand store (`src/lib/store.ts`) and sends their user id as an
  `x-user-id` header on every API request (see `current-user.server.ts`).
  This does make actions like "create a savings goal," "transfer money,"
  or "apply for a loan" affect the actual logged-in user's own data — but
  a client-sent header is trivially spoofable and is **not** a substitute
  for real signed sessions (NextAuth/Lucia/Clerk or similar) before this
  goes anywhere near production.
- **Transfer PIN is stored and compared in plain text** in the demo
  (`1234` for every account, including new signups). Hash it before this
  goes anywhere near production.
- **No real email/SMS provider.** Verification codes are real and
  DB-backed, but nothing actually emails or texts them — that's why
  `/admin/verification-codes` exists, so support staff can look one up and
  relay it to a customer over chat.
- **Admin "platform-wide" stats** (48,213 total customers, revenue, etc. on
  the admin overview page) are illustrative constants in `mock-data.ts`,
  not computed from real rows — there's only a handful of seeded rows, so a
  real count would be tiny. The customer list, accounts, transactions,
  cards, loans, and verification-codes tables are all real Postgres data.
- **QR codes** are stylised placeholder patterns, not scannable real QR codes.
- **Face ID / fingerprint** prompts are UI placeholders only.
- I could not run `prisma generate` / `db push` / `db seed` against your
  Supabase instance from this sandboxed build environment — outbound
  network access here is restricted to package registries. Run those
  commands yourself locally where you have normal internet access.
