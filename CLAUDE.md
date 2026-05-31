# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server at localhost:3000
npm run build    # production build (also validates types)
npm run lint     # ESLint
```

## Environment

Copy `.env.local.example` to `.env.local` and fill in three Supabase values:

- `NEXT_PUBLIC_SUPABASE_URL` — project URL (used by both client and server)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — client-side reads (`lib/supabase.ts`)
- `SUPABASE_SERVICE_ROLE_KEY` — server-only, used by server actions; never exposed to the browser

The app runs without these set: `serverSupabase()` returns `null`, so pages render their empty states (this is also what happens locally when Supabase is unreachable, e.g. `/letters` and `/music`).

## Always do first
- **Invoke the 'frontend-design' skill** before writing any frontend code, every session, no exceptions. 

## What this is

A memorial web app for **Rudraksh Goyal** (July 22, 2007 – February 13, 2026, age 18). Built by his sister Jisha. The tone of everything — copy, animations, design — should be warm, personal, and gentle. Not somber. Purple was his color.

## Architecture

**Framework:** Next.js App Router (server components by default). No pages directory.

**Database:** Supabase (PostgreSQL). All DB access goes through server actions in `app/actions.ts` using the service role key (bypasses RLS). The anon key in `lib/supabase.ts` is for future client-side reads if needed. The `serverSupabase()` helper returns `null` when env vars are unset, so every read returns `[]` and every mutation returns a friendly `{ success: false }` instead of throwing — pages render their empty states cleanly with no database configured (and locally when Supabase is unreachable).

**Soft deletes:** The `memories`, `sparks`, `letters`, and `songs` tables each have a `deleted_at TIMESTAMPTZ` column. All queries must filter `.is('deleted_at', null)`. Never use hard deletes. Each table follows the same `get<Thing>()` / `create<Thing>(formData)` server-action pair, where the create action validates, inserts, and calls `revalidatePath()` for the relevant route.

**Storage:** Supabase bucket `memory-images` with prefixed paths: `photos/`, `voice/`, `videos/`.

## Key files

| File | Purpose |
|---|---|
| `config/memorial.ts` | Single source of truth for Rudraksh's name, dates, milestones, hero image, `spotifyEmbedUrl` (`/music`) |
| `types/index.ts` | Row types: `Memory`, `Spark`, `Letter`, `Song`, plus `ActionResult` |
| `app/actions.ts` | All Supabase mutations and reads (server actions) |
| `lib/theme.ts` | Returns `'birthday'` (July 22), `'thirteenth'` (every 13th), or `'default'` |
| `app/globals.css` | `.hero-sky` / `.hero-sky-quiet` / `.story-gradient` utility classes (theme-aware via `html[data-theme]`); `.paper-grain` adds subtle SVG noise to cream pages |
| `tailwind.config.ts` | Custom colors, fonts, keyframes |

## Theme system

`ThemeBanner` (client component) detects the current date on mount, sets `document.documentElement.dataset.theme`, and renders a top banner on special days. This drives CSS selectors in `globals.css`:

- `html[data-theme="birthday"] .hero-sky` — warmer/brighter purple sky on July 22
- `html[data-theme="thirteenth"] .hero-sky` — deeper, more solemn sky on the 13th

## Page structure

The home page (`app/page.tsx`) has three sections in sequence:
1. **Night sky hero** — dark `#0B0A1A` full-screen, stars (`StarField` server component), his photo as the moon with purple glow, fading into the warm garden below
2. **Garden portal** — feature cards and CTAs to `/memories`, sitting on the layout's warm gradient + ambient particles
3. **A letter from his sister** — the closing footer love letter, home page only

Other routes (all linked from the `LINKS` array in `components/Navigation.tsx`):

- **`/memories`** + **`/add-memory`** — the garden: memories and quick "sparks", warm cream palette.
- **`/letters`** — write a letter to Rudraksh (`letters` table), optionally with a bouquet. Cream palette with a giant faint "Dear Rudraksh," watermark behind the prose.
- **`/whisper`** — release a private message into the night sky; nothing is stored. Stays full night sky.
- **`/music`** — a shared playlist (`songs` table + optional Spotify embed). Quieter night-sky hero into a cream tracklist.

The home page and `/whisper` are the only full night-sky pages; `/music` opens on a quieter dark hero that transitions into cream. Everything else stays cream and lets the layout's warm body gradient + `AmbientBackground` particles show through (no opaque page background). Navigation auto-switches between dark and light styling based on route and scroll position.

## Design tokens

- **Fonts:** `font-handwriting` (Caveat) for headings/names, `font-body` (Nunito) for readable text, `font-display` (Martian Mono) for labels/metadata/CTAs
- **Night sky:** `#0B0A1A` base, purple nebula radial gradients, `rgba(147,51,234,...)` glow
- **Garden:** cream `#FEF7ED`, warm amber `#F9E4B7`, warm brown `#7C5C3F`

## Layout layers (z-index)

```
0   AmbientBackground (fixed canvas, warm particle system)
10  Page content (main)
40  Navigation (sticky)
55  ThemeBanner (special day top bar)
50  TributeMode (day-49 full-screen overlay, now dormant)
```

## Adding a new page

1. Create `app/<route>/page.tsx`
2. Add the route to the `LINKS` array in `components/Navigation.tsx`
3. Default to the warm cream palette (`#FDFAF4`) with `.paper-grain`; reserve the night sky for hero moments only (`.hero-sky-quiet` if you want a dark hero that flows into cream)
4. If the page reads/writes data, add a `get<Thing>()` / `create<Thing>()` pair to `app/actions.ts` and a row type to `types/index.ts`, mirroring the existing tables (remember the `deleted_at` filter)
