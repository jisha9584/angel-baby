# Angel Baby. In Loving Memory of Rudraksh Goyal.

A living memorial website for Rudraksh Goyal (July 22, 2007 to February 13, 2026).

Built by his sister, with love.

---

## What this is

I built this for my brother Rudraksh. A place where everyone who loved him can come together, share a memory, leave a photo, or just say something small. It is not meant to feel like a memorial page. It is meant to feel like him. Warm, full of people, alive.

---

## What you can do here

- **Memory wall.** Polaroid-style cards where people can share photos, voice messages, and videos
- **Bouquet builder.** Pick up to 5 flowers to send alongside your memory. His favourite colour was purple.
- **Quick words.** Three words, one feeling, anything that was him
- **Timeline.** Key moments from his life
- **Day counter.** Tracks every day since February 13, 2026

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

The site runs without Supabase but nothing will save. Follow `SETUP.md` to connect a database.

---

## Personalisation

All personal details are in one file:

```
config/memorial.ts
```

Hero photo goes in the `public/` folder.

---

## Deployment

Deployed on [Vercel](https://vercel.com). See `SETUP.md` for the full setup guide including Supabase.

---

*For Rudraksh. Eighteen years of love, still here in every memory.*
