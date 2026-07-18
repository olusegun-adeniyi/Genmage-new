# Genmage

A style-locked watercolor illustration generator. Type a subject, get an illustration in a single curated style. Made for friends.

## Start here

1. `PRD.md` — what we're building and why
2. `CLAUDE.md` — rules for AI assistants working on this repo
3. `UI-REVIEW.md` — checklist every screen must pass before it ships

## Stack

Next.js 15 · TypeScript · Tailwind v4 · Fraunces + Geist · Supabase · Google GenAI (Nano Banana) · Vercel

## Local setup

```bash
pnpm install
cp .env.example .env       # fill in keys
pnpm db:generate           # generate Drizzle migrations
pnpm db:migrate            # apply migrations to Supabase
pnpm dev                   # http://localhost:3000
```

Style reference images live in `public/style-refs/`. Add 3–5 of your best example illustrations here before first generation — the app selects one at random to guide each request.

## Scripts

```
pnpm dev          # next dev
pnpm build        # next build
pnpm typecheck    # tsc --noEmit
pnpm lint         # next lint
pnpm db:generate  # drizzle-kit generate
pnpm db:migrate   # drizzle-kit migrate
pnpm db:studio    # drizzle-kit studio
```

## Environment variables

```
DATABASE_URL=                       # Supabase Postgres connection
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GEMINI_API_KEY=                     # Google AI Studio
APP_SECRET=                         # for IP hashing
DAILY_COST_CAP_USD=10
IP_DAILY_LIMIT=20
NEXT_PUBLIC_APP_URL=
```

## Deploy

Vercel. Connect Supabase via the integration. Set env vars above. That's it.

## License

Personal. Not open source.
