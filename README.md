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

- **Login:** any valid-looking email + password of 8+ characters (auth is
  a stub — see "Known limitations")
- **OTP / 2FA code:** any 6 digits
- **Transfer PIN:** `1234`
- **Seeded user:** mariana.costa@example.com

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
no external translation API, no cost. Fully translated: navigation, the
landing page hero, and the language switcher itself. The rest of the app's
copy is currently Portuguese-only; extend `dictionaries.ts` and swap hardcoded
strings for `t.xxx.yyy` the same way in any page you want bilingual.

## Known limitations of this demo

- **No real authentication.** Login/OTP/2FA are functional-looking stubs
  (`/api/auth/login`, `/api/auth/verify-otp`) that don't verify real
  passwords or issue real sessions. Every API route resolves to the single
  seeded demo user via `current-user.server.ts`. Wiring up NextAuth/Lucia/
  Clerk (or similar) plus password hashing is the next step before this
  could handle real users.
- **Transfer PIN is stored and compared in plain text** in the demo
  (`1234`). Hash it before this goes anywhere near production.
- **Admin "platform-wide" stats** (48,213 total customers, revenue, etc. on
  the admin overview page) are illustrative constants in `mock-data.ts`,
  not computed from real rows — there's only one seeded demo user, so a
  real count would just say "1." The customer list, accounts, transactions,
  cards, and loans tables are all real Postgres data.
- **QR codes** are stylised placeholder patterns, not scannable real QR codes.
- **Face ID / fingerprint** prompts are UI placeholders only.
- I could not run `prisma generate` / `db push` / `db seed` against your
  Supabase instance from this sandboxed build environment — outbound
  network access here is restricted to package registries. Run those
  commands yourself locally where you have normal internet access.
