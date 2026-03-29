export const memorialConfig = {
  firstName:   'Rudraksh',
  fullName:    'Rudraksh Goyal',
  age:          18,

  // February 13, 2026 — Vijaya Ekadashi, a sacred day in the Hindu calendar.
  // The Ekadashi tithi began at 12:22 PM on Feb 12 and ended at 2:25 PM on Feb 13.
  // This context is kept here for the family; it is not surfaced on the public site.
  dateOfPassing: new Date('2026-02-13'),

  // Shown beneath his name on the hero — warm, universal, no religious references
  tributeLine: 'eighteen years of love, still here in every memory.',

  // Shown on the landing page
  description:
    'Rudraksh Goyal grew up in Dubai and made Canberra his home. ' +
    'Eighteen years of big laughs, loud music, and a warmth that made everyone feel seen. ' +
    'Every memory you share here keeps him close.',

  siteTitle: 'In Loving Memory',

  // Replace with a Supabase public URL once you upload a portrait, or /filename.jpg for public folder
  heroImage: '/rudraksh.jpg',

  milestones: [
    {
      year: 'July 22, 2007',
      title: 'hello, Dubai',
      description:
        'Rudraksh was born in Dubai and brought the kind of energy that makes rooms feel fuller. ' +
        'From day one, that smile was impossible to ignore.',
    },
    {
      year: '2018',
      title: 'Dubai to Canberra',
      description:
        'The family moved to Australia and he landed in Canberra. ' +
        'New city, new school — and within weeks, somehow already the person everyone wanted to be around.',
    },
    {
      year: '2019',
      title: 'the Bali trip',
      description:
        'A family trip with the whole extended family. ' +
        'He was the loudest one laughing, the one who made strangers feel welcome, ' +
        'the last one to want to leave.',
    },
    {
      year: '2025',
      title: 'building something',
      description:
        'He graduated high school and was ready for what came next. ' +
        'University on the horizon and a clothing brand taking shape with his closest friends. ' +
        'Eighteen and already dreaming bigger than most.',
    },
    {
      year: 'December 2024',
      title: 'back in Dubai, one last time',
      description:
        'New Year with the family in Dubai. Pani puri at midnight, everyone together, ' +
        'Rudraksh at the centre of it like he always was. ' +
        'Full of life, big smile. That is the image that stays.',
    },
    {
      year: 'Feb 13, 2026',
      title: 'back to the universe',
      description:
        'On a quiet Friday in February, Rudraksh left us. ' +
        'Eighteen years old, just getting started. ' +
        'Gone too soon, loved without end.',
    },
  ],
}

export function getDaysSincePassing(): number {
  const diff = Date.now() - memorialConfig.dateOfPassing.getTime()
  return Math.floor(diff / 86_400_000)
}

export function isFortyNinthDay(): boolean {
  return getDaysSincePassing() === 49
}
