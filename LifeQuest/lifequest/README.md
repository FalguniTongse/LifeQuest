# LifeQuest — Level Up Your Real Life

A full-stack gamified productivity platform. Real-world goals become quests; completing
them earns XP, Gold and character attribute growth through a backend-authoritative RPG
engine. Built with React (Vite), Node.js/Express, and PostgreSQL.

This implementation follows the accompanying software documentation: layered backend
(routes → controllers → services → database), a non-linear XP curve, server-side reward
calculation, atomic transactions for quest completion and shop purchases, streak logic,
an achievement engine, and JWT authentication with per-resource ownership checks.

One deliberate deviation from the doc's suggested stack: the frontend uses a small
hand-written CSS design system instead of Tailwind, so the UI could have a distinct,
non-templated "adventurer's ledger" look (ink/parchment palette, serif display type,
ledger-style quest rows) rather than a default utility-class aesthetic. Everything else
follows the spec.

## Project structure

```
lifequest/
├── backend/     Express API, PostgreSQL access, RPG business logic
└── frontend/    React (Vite) client
```

## Prerequisites

- Node.js 18+
- A PostgreSQL database (local install, or a free hosted instance like Neon/Supabase)
- npm

## 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and set:
- `DATABASE_URL` — your PostgreSQL connection string
- `JWT_SECRET` — any long random string
- `FRONTEND_URL` — leave as `http://localhost:5173` for local dev

Create the database schema (tables + seed data for the shop and achievements):

```bash
npm run db:init
```

Start the API:

```bash
npm run dev
```

The API runs on `http://localhost:5000` by default. Check `http://localhost:5000/api/health`
to confirm it's up.

## 2. Frontend setup

In a second terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The app runs on `http://localhost:5173`. `VITE_API_URL` in `.env` should point at your
backend's `/api` path (already set correctly for local dev by default).

## 3. Using the app

1. Open `http://localhost:5173` and register an account (this also creates your character
   row server-side).
2. Create a quest from the Dashboard or Quests page.
3. Complete it — the backend calculates XP, Gold and the relevant attribute, updates your
   streak, and checks for newly-unlocked achievements, all inside one transaction.
4. Spend Gold in the Shop; purchases persist to your Inventory.
5. Refresh or log out and back in — all progress is read straight from PostgreSQL.

## Notes on the RPG engine

- **Leveling**: XP required for level `n → n+1` is `round(100 × n^1.5)`, matching the
  non-linear curve described in the documentation.
- **Rewards**: fixed per difficulty (Easy 50XP/20g, Medium 100XP/40g, Hard 175XP/70g,
  Epic 300XP/120g), calculated and stored server-side when a quest is created, and only
  ever applied server-side when it's completed. The client never sends reward values.
- **Streaks**: same-day completions don't inflate the streak; a gap of more than one day
  resets it to 1.
- **Idempotency**: quest completion and shop purchases run inside SQL transactions with
  row locks (`FOR UPDATE`), and quest completion checks `status = 'PENDING'` before
  applying any reward, so repeated requests can't double-pay.

## What's implemented vs. out of scope

Implemented: auth (register/login/JWT), quest CRUD + completion, XP/leveling, attributes,
streaks, Gold economy, shop + inventory, achievements, responsive layout, accessible
forms and controls, skeleton loading states, toasts and a level-up moment.

Out of scope for this build (as specified as future/MVP-optional in the docs): real-money
payments, social features/guilds, live multiplayer, native mobile apps, AI-generated
quests, and competitive leaderboards.

## Deploying

- Frontend → Vercel (or any static host that serves a Vite build: `npm run build` outputs
  to `frontend/dist`)
- Backend → Render/Railway (or any Node host); set the same environment variables as
  your local `.env`
- Database → Neon/Supabase (or any managed PostgreSQL)

Set `FRONTEND_URL` on the backend and `VITE_API_URL` on the frontend to your deployed
URLs, and make sure both use HTTPS in production.
