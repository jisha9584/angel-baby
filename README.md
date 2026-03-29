# Angel Baby — In Loving Memory of Rudraksh Goyal

A living memorial website for Rudraksh Goyal (July 22, 2007 — February 13, 2026).

Built with love by his sister.

---

## What this is

A warm, garden-themed memory space where friends and family can come together to share stories, photos, voice messages, and flowers for Rudraksh. Not a static memorial — a living scrapbook that grows with every person who loved him.

---

## Features

- **Memory wall** — polaroid-style cards with photos, voice messages, and videos
- **Bouquet builder** — pick up to 5 flowers to send alongside a memory (15 hand-drawn SVG flowers, purples dominant — his favourite colour)
- **Quick sparks** — leave three words, a feeling, or a small truth about who he was
- **Timeline** — key moments from his life
- **Day counter** — tracks the days since February 13, 2026
- **49-day tribute** — a special overlay on day 49

---

## Tech stack

- [Next.js 14](https://nextjs.org) (App Router)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com) with custom palette
- [Framer Motion](https://www.framer.com/motion) for animations
- [Supabase](https://supabase.com) for database and file storage
- [shadcn/ui](https://ui.shadcn.com) for base components
- Fonts: Martian Mono, Caveat, Nunito

---

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The site runs without Supabase — memories just won't persist. Follow `SETUP.md` to connect a real database.

---

## Personalisation

All personal details live in one file:

```
config/memorial.ts
```

Hero photo goes in the `public/` folder.

---

## Deployment

Deployed on [Vercel](https://vercel.com). See `SETUP.md` for the full setup guide including Supabase configuration.

---

*For Rudraksh. Eighteen years of love, still here in every memory.*
