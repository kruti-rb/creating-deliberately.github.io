/*
  ════════════════════════════════════════════════════════════════
  THE OTHER TABS: Career Trails, Pursuits, Bookish Musings,
  Rhythmic Flows, Happenings.   (The book itself lives in entries.js.)
  ════════════════════════════════════════════════════════════════

  Everything below is placeholder text — replace it with your own.

  Longer text fields (intro, body) accept the same formatting as the
  book — see the top of entries.js — including pictures and videos:

      ![caption](media/photo.jpg)
      ![caption](media/clip.mp4)
      ![caption](https://youtu.be/…)
*/

// ─────────────────────────── Career Trails ───────────────────────────
window.PROFILE = {
  name: "Kruti",
  role: "What you do, in one line",
  intro: `
    A short paragraph about the working life: what you work on, what you care about in that work, and what you are looking to do next.

    A second paragraph, if you want one. Keep it plain and specific.
  `,

  // Add, remove or rename these groups freely (Awards, Publications, Talks…).
  sections: [
    {
      heading: "Experience",
      items: [
        { when: "2024 — Present", title: "Your current role", place: "Company or organisation", note: "One or two lines on what you do there and what you are proud of." },
        { when: "2021 — 2024", title: "A previous role", place: "Company or organisation", note: "What you did, and what changed because of it." },
      ],
    },
    {
      heading: "Education",
      items: [
        { when: "2017 — 2021", title: "Your degree", place: "University or institute", note: "" },
      ],
    },
  ],

  skills: ["A skill", "Another skill", "A tool you know well", "A language", "Something unexpected"],

  links: [
    { label: "Email", url: "mailto:you@example.com" },
    { label: "LinkedIn", url: "https://www.linkedin.com/" },
    { label: "GitHub", url: "https://github.com/" },
  ],
};

// ─────────────────────────── Pursuits ───────────────────────────
// Each pursuit has its own page. The card on the Pursuits tab shows the title, the
// one-line summary and (if you give one) the image; clicking it opens the page.
//
// Write the page in body, the same way as a page of the book: paragraphs, headings,
// quotes, and pictures or videos from the media folder —
//     ![caption](media/kathak-recital.jpg)
//     ![caption](media/kathak-practice.mp4)
// Keep adding to it over time; use "## A heading" or "---" to separate one piece from the next.
//
// Optional on any pursuit:   image: "media/photo.jpg",   (shown on the card and atop the page)
//                            status: "Since 2015",        (a small label)
window.PURSUITS_INTRO = "The things I keep returning to, whether or not anyone is asking.";

window.PURSUITS = [
  {
    id: "kathak",
    title: "Kathak",
    summary: "Rhythm, footwork and storytelling.",
    body: `
      *Nothing here yet.* This page is waiting for its first words, pictures or videos.
    `,
  },
  {
    id: "yoga",
    title: "Yoga",
    summary: "Breath, balance and stillness.",
    body: `
      *Nothing here yet.* This page is waiting for its first words, pictures or videos.
    `,
  },
  {
    id: "painting",
    title: "Painting",
    summary: "Colour, canvas and whatever comes out.",
    body: `
      *Nothing here yet.* This page is waiting for its first words, pictures or videos.
    `,
  },
  {
    id: "working-out",
    title: "Working Out",
    summary: "Strength, sweat and showing up.",
    body: `
      *Nothing here yet.* This page is waiting for its first words, pictures or videos.
    `,
  },
  {
    id: "reading",
    title: "Reading",
    summary: "Books, margins and borrowed worlds.",
    body: `
      *Nothing here yet.* This page is waiting for its first words, pictures or videos.
    `,
  },
  {
    id: "aerospace",
    title: "Aerospace",
    summary: "Flight, spacecraft and the way up.",
    body: `
      *Nothing here yet.* This page is waiting for its first words, pictures or videos.
    `,
  },
  {
    id: "outreach",
    title: "Outreach",
    summary: "Sharing what I know, and learning from who I meet.",
    body: `
      *Nothing here yet.* This page is waiting for its first words, pictures or videos.
    `,
  },
];

// ─────────────────────────── Bookish Musings ───────────────────────────
// Newest first. rating is out of 5. verdict is the one-liner shown in the list.
// cover is optional (a photo of the book, say).
window.REVIEWS_INTRO = "Notes on what I have been reading, and what stayed with me afterwards.";

window.REVIEWS = [
  {
    id: "cosmos",
    title: "Cosmos",
    author: "Carl Sagan",
    rating: 5,
    date: "2026-10-02",
    verdict: "A book that makes you feel small and lucky in the same breath.",
    body: `
      This is a placeholder. Replace it with your own.

      Say what the book is about in a sentence or two, then spend the rest on what it did to you: the idea you keep thinking about, the passage you underlined, the part you disagreed with.

      > Copy out a line you loved here.

      End with who you would hand it to.
    `,
  },
  {
    id: "meditations",
    title: "Meditations",
    author: "Marcus Aurelius",
    rating: 4,
    date: "2026-09-10",
    verdict: "A private notebook that was never meant for us, which is why it works.",
    body: `
      This is a placeholder. Replace it with your own.
    `,
  },
  {
    id: "the-little-prince",
    title: "The Little Prince",
    author: "Antoine de Saint-Exupéry",
    rating: 5,
    date: "2026-08-21",
    verdict: "A children's book that gets sadder and truer every time you grow up a little.",
    body: `
      This is a placeholder. Replace it with your own.
    `,
  },
];

// ─────────────────────────── Rhythmic Flows ───────────────────────────
// Newest first. kind is a free label (Poem, Song, Dance, Sketch…).
// cover is optional: with one, the tile shows the picture; without, the opening lines.
window.FLOWS_INTRO = "Things with a pulse: verses, songs, movement.";

window.FLOWS = [
  {
    id: "tidewords",
    title: "Tidewords",
    kind: "Poem",
    date: "2026-10-05",
    body: `
      The sea says the same thing twice
      and means it differently each time.

      I am learning to speak like that:
      to return, and not repeat.
    `,
  },
  {
    id: "a-step-in-the-dark",
    title: "A step in the dark",
    kind: "Dance",
    date: "2026-09-18",
    cover: "media/sample-moon.svg",
    body: `
      A placeholder for a piece with a video. Put the file in the media folder and point to it like this, or paste a YouTube link in the same place:

      **!\[Rehearsal, September\](media/rehearsal.mp4)**

      Then write a few lines about it underneath.
    `,
  },
  {
    id: "evening-raga",
    title: "Evening raga",
    kind: "Song",
    date: "2026-08-30",
    cover: "media/sample-dusk.svg",
    body: `
      A placeholder for a song, a recording, or the words to one.
    `,
  },
];

// ─────────────────────────── Happenings ───────────────────────────
// Short dated notes: news, events, milestones. Any order — they are sorted by date.
// note and media are optional. media is a list of pictures and/or videos.
window.HAPPENINGS_INTRO = "What has been going on lately.";

window.HAPPENINGS = [
  { date: "2026-10-08", title: "This website went up", note: "The first few pages of the book are in. More soon." },
  { date: "2026-09-20", title: "Something that happened", note: "A sentence or two about it, with a couple of pictures.", media: ["media/sample-dusk.svg", "media/sample-orbit.svg"] },
  { date: "2026-07-04", title: "An event you went to" },
  { date: "2025-12-31", title: "A milestone from last year", note: "Older years get their own heading automatically." },
];
