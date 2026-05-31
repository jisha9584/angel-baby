-- Angel Baby — Supabase schema
--
-- A memorial web app for Rudraksh Goyal. This file is the single source of
-- truth for the database. It is idempotent: safe to run as many times as you
-- like in the Supabase SQL editor (Dashboard -> SQL Editor -> New query).
--
-- All app reads/writes go through server actions using the SERVICE ROLE key,
-- which bypasses Row Level Security. We therefore ENABLE RLS on every table but
-- add NO policies: this locks out the public anon key entirely (it ships in the
-- browser) while the server keeps full access. Best of both worlds.

create extension if not exists "pgcrypto";

-- ── memories ──────────────────────────────────────────────────────────────
create table if not exists public.memories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  message     text not null,
  image_url   text,
  voice_url   text,
  video_url   text,
  bouquet     jsonb,
  created_at  timestamptz not null default now(),
  deleted_at  timestamptz
);
-- in case the table already existed from an earlier deploy
alter table public.memories add column if not exists bouquet jsonb;
alter table public.memories enable row level security;

-- ── sparks (quick words) ──────────────────────────────────────────────────
create table if not exists public.sparks (
  id          uuid primary key default gen_random_uuid(),
  text        text not null,
  name        text,
  created_at  timestamptz not null default now(),
  deleted_at  timestamptz
);
alter table public.sparks enable row level security;

-- ── letters ───────────────────────────────────────────────────────────────
create table if not exists public.letters (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  message     text not null,
  bouquet     jsonb,
  created_at  timestamptz not null default now(),
  deleted_at  timestamptz
);
-- the column the bouquet picker on /letters writes into
alter table public.letters add column if not exists bouquet jsonb;
alter table public.letters enable row level security;

-- ── songs (shared playlist) ───────────────────────────────────────────────
create table if not exists public.songs (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  artist        text not null,
  note          text,
  submitted_by  text,
  created_at    timestamptz not null default now(),
  deleted_at    timestamptz
);
alter table public.songs enable row level security;

-- ── storage bucket for photos / voice / video ─────────────────────────────
-- prefixed paths used by the app: photos/  voice/  videos/
insert into storage.buckets (id, name, public)
values ('memory-images', 'memory-images', true)
on conflict (id) do update set public = true;

-- allow public read of uploaded media (the app serves files via getPublicUrl)
drop policy if exists "memory-images public read" on storage.objects;
create policy "memory-images public read"
  on storage.objects for select
  using (bucket_id = 'memory-images');
