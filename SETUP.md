# Memorial Site — Setup Guide

A step-by-step guide to get the site running locally and deployed.

---

## 1. Install dependencies

```bash
cd memorial-site
npm install
```

---

## 2. Personalise the memorial

Open `config/memorial.ts` and fill in the real details:

| Field | What to change |
|---|---|
| `firstName` | His first name |
| `fullName` | His full name |
| `age` | Age at passing |
| `dateOfPassing` | `new Date("YYYY-MM-DD")` — used for the 49-day tribute |
| `tributeLine` | Short hero subtitle |
| `description` | Paragraph shown on the landing page |
| `heroImage` | Supabase public URL of a portrait photo (or leave `""`) |
| `milestones` | Array of life milestones for the Timeline page |

---

## 3. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → **New project**
2. Give it a name (e.g. `memorial-site`) and choose a region close to your users
3. Save the **database password** somewhere safe

---

## 4. Create the `memories` table

In the Supabase dashboard → **SQL Editor**, run:

```sql
-- Create the memories table
CREATE TABLE memories (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT NOT NULL,
  message    TEXT NOT NULL CHECK (char_length(message) <= 2000),
  image_url  TEXT,
  voice_url  TEXT,
  video_url  TEXT,
  bouquet    JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Allow anyone to read memories (public wall)
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read" ON memories
  FOR SELECT USING (true);

-- Inserts are done via server action with the service-role key,
-- so the anon key does NOT need insert permission.
-- (If you ever want direct client-side inserts, add a policy here.)

-- Create the sparks table (quick words / three-word tributes)
CREATE TABLE sparks (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  text       TEXT NOT NULL CHECK (char_length(text) <= 120),
  name       TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE sparks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read" ON sparks
  FOR SELECT USING (true);
```

---

## 5. Create the image storage bucket

In the Supabase dashboard → **Storage** → **New bucket**:

| Setting | Value |
|---|---|
| Bucket name | `memory-images` |
| Public bucket | ✅ Yes (so image URLs work in `<img>` tags) |
| Max upload size | 5 MB |
| Allowed MIME types | `image/jpeg, image/png, image/webp, image/gif` |

Then add a **storage policy** so the server action can upload:

```sql
-- Allow uploads via the service-role key (used in server actions)
-- Public read is already granted because the bucket is public.
```

> The service-role key used in `app/actions.ts` bypasses RLS, so no extra
> storage policy is needed for server-side uploads.

---

## 6. Configure environment variables

Copy the example file and fill it in:

```bash
cp .env.local.example .env.local
```

Then open `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

Find these in: **Supabase Dashboard → Settings → API**

> ⚠️  Never commit `.env.local` to git. It is already in `.gitignore`.

---

## 7. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you should see the landing page.

---

## 8. Deploy to Vercel (recommended)

```bash
npm install -g vercel
vercel
```

When prompted, add the three environment variables from `.env.local`.

Or use the Vercel dashboard:
1. Import the GitHub repo
2. Add env vars under **Project Settings → Environment Variables**
3. Deploy

---

## Project structure

```
memorial-site/
├── app/
│   ├── page.tsx              ← Landing page (hero + intro)
│   ├── memories/page.tsx     ← Memory Wall (masonry grid)
│   ├── add-memory/page.tsx   ← Submission form
│   ├── timeline/page.tsx     ← Life milestones
│   ├── actions.ts            ← Server actions (Supabase writes)
│   ├── layout.tsx            ← Root layout + nav + footer
│   └── globals.css           ← Tailwind base + custom utilities
│
├── components/
│   ├── FloatingElements.tsx  ← Animated hero background
│   ├── MemoryCard.tsx        ← Polaroid-style memory card
│   ├── MemoryWall.tsx        ← Masonry grid of cards
│   ├── MemoryForm.tsx        ← Multi-step add-memory form
│   ├── Navigation.tsx        ← Responsive top nav
│   ├── Timeline.tsx          ← Life milestones timeline
│   ├── TributeMode.tsx       ← 49-day tribute overlay
│   └── ui/                   ← shadcn/ui primitives
│
├── config/
│   └── memorial.ts           ← ✏️ All personal details live here
│
├── lib/
│   ├── supabase.ts           ← Browser Supabase client
│   └── utils.ts              ← cn(), stableRotation(), relativeDate()
│
└── types/
    ├── index.ts              ← Memory, ActionResult types
    └── database.ts           ← Supabase generated types
```

---

## Common questions

**How do I change the name / dates?**
Edit `config/memorial.ts` — that file is the single source of truth.

**How do I test the 49-day tribute?**
Temporarily set `dateOfPassing` to 49 days ago in `config/memorial.ts`, then reload the page. Revert when done.

**Can I add moderation?**
Add a `moderated BOOLEAN DEFAULT false` column to the `memories` table and update the `getMemories` query in `app/actions.ts` to filter `WHERE moderated = true`. A simple Supabase dashboard view lets you approve entries.

**Can I restrict who can submit memories?**
The form is intentionally open (no login) to keep the barrier low during grief. If you want to add a simple passphrase, add a `secret` field to the form and validate it in `createMemory()` in `app/actions.ts`.
