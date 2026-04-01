# Agent instructions

Context for AI coding assistants working on this repository.

## What this is

**radio-znb** (`radio-znb` in `package.json`) is a Next.js site for an internet radio: live stream, library of recordings, PWA/offline behavior, and a persistent audio player.

## Stack

| Area | Choice |
|------|--------|
| Runtime / package manager | [Bun](https://bun.sh) |
| Framework | Next.js 16 (App Router), React 19 |
| Styling | Tailwind CSS 4, PostCSS |
| Data | Drizzle ORM, Turso (`libsql`), schema in `db/schema.ts` |
| Client data | TanStack React Query (`components/QueryProvider.tsx`) |
| PWA | Serwist (`next.config.ts` wraps config with `withSerwist`; service worker under `app/sw.ts`, registration via `components/SerwistProvider.tsx`) |

## Commands

From the repo root:

- `bun run dev` — development server
- `bun run build` — production build
- `bun run start` — serve production build
- `bun run lint` — ESLint (Next)

Use **Bun** for scripts and installs; do not assume npm/yarn unless the user says otherwise.

## Repository layout

- **`app/`** — App Router routes, layouts, API routes (`app/api/`), global styles (`app/globals.css`), PWA/manifest (`app/manifest.ts`).
- **`components/`** — Shared UI: player bar, tape UI, providers, hooks. Prefer colocating feature-specific pieces under `app/` when they are page-only.
- **`db/`** — Drizzle schema, relations, client (`db/index.ts`), generated types.
- **`lib/`** — Shared non-UI logic (e.g. actions, station config).
- **`helpers/`** — Small shared helpers.
- **`public/`** — Static assets and icons.

Path alias: **`@/`** maps to the project root (see `tsconfig.json`).

## Conventions

- **Language / locale**: Root layout uses `lang="ru"`; copy and metadata may be Russian or mixed—follow existing pages.
- **Imports**: Use `@/...` for app-root imports; keep import style consistent with the file you edit.
- **UI**: Match existing Tailwind patterns and spacing; the site uses a bottom player bar and theme provider—avoid breaking global layout assumptions.
- **Player / audio**: Playback and queue behavior live around `PlayerContext`, `components/PlayerBar/`, and related hooks; extend those rather than duplicating audio logic.
- **Database**: Schema changes belong in `db/schema.ts` (and migrations via Drizzle as the project already does); Turso credentials come from env (`DATABASE_URL`, `DATABASE_AUTH_TOKEN` per `drizzle.config.ts`).

## What not to do

- Do not add unsolicited README sections or docs unless the user asks.
- Avoid drive-by refactors unrelated to the task; keep diffs focused.
- Do not strip or ignore PWA/offline/player integration when touching navigation or layout.

## Cursor-specific

Project rules may live in **`.cursor/rules/`** as `.mdc` files with frontmatter. This file is the high-level map; use rules for file-scoped or always-on policies.
