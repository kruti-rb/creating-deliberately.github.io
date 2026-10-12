/*
  ════════════════════════════════════════════════════════════════
  THIS IS THE BOOK. Everything you write lives in this one file.
  ════════════════════════════════════════════════════════════════

  TO ADD A NEW PAGE
  Copy the block below, paste it at the TOP of the ENTRIES list,
  and fill it in. Save. That's it.

      {
        id: "a-short-name-with-dashes",     // used in the link; must be unique
        title: "The title of the page",
        date: "2026-10-08",                 // YYYY-MM-DD
        body: `
          Write here. Leave a blank line between paragraphs.
        `,
      },

  WRITING INSIDE body
    blank line          new paragraph
    single line break   kept as a line break (good for poems)
    *like this*         italic
    **like this**       emphasis
    > like this         a pulled-out quote
    ## like this        a small heading
    ---                 a starry divider
    [words](https://…)  a link

  PICTURES AND VIDEOS
  Put the files in the "media" folder, then write one of these on a
  line of its own (the words in [ ] become the caption; they can be empty):

    ![A caption](media/photo.jpg)        a picture
    ![A caption](media/clip.mp4)         a video
    ![A caption](https://youtu.be/…)     a YouTube or Vimeo video

  Several of these on consecutive lines (no blank line between) become a
  gallery. A page can also have   cover: "media/photo.jpg",   which is
  shown above the text.
*/

window.BOOK = {
  title: "Untitled",                         // ← the name, once you have one
  eyebrow: "A life, a page at a time",
  tagline: "Thoughts, pictures, moving images and half-finished wonderings from Kruti's days.",
  colophon: "Written slowly · Updated often",
};

// Newest first. The four pages below are placeholders — replace them with your own.
window.ENTRIES = [
  {
    id: "the-patience-of-light",
    title: "The patience of light",
    date: "2026-10-08",
    body: `
      The light from some stars left before anyone was here to look up. It crossed all that dark without knowing whether it would land on anything at all, and then one night it landed in an eye.

      I think about that when I write something nobody has asked for.

      > Send it anyway. Arrival is not the sender's business.

      Most of what we make travels a long way before it matters to someone, if it ever does. The travelling is still worth it. The dark between is not empty; it is just the part of the story where nothing has answered yet.
    `,
  },
  {
    id: "small-orbits",
    title: "Small orbits",
    date: "2026-09-27",
    body: `
      Every day I circle the same few things: the kettle, the desk, the window, the same three worries. For a long time I took this as proof that I was going nowhere.

      But a planet goes nowhere too, by that measure. It only returns. And in the returning there are seasons.

      ![A placeholder picture. Swap in one of your own.](media/sample-orbit.svg)

      ---

      ## A note to myself

      Repetition is not the opposite of progress. *Sometimes it is the shape progress takes* when the thing you are moving around is worth staying near.
    `,
  },
  {
    id: "a-list-of-unfinished-things",
    title: "A list of unfinished things",
    date: "2026-09-14",
    body: `
      The letter I started in March.
      A song with only a second verse.
      The argument I keep winning in the shower.
      A garden, in theory.
      This sentence, almost.

      ![](media/sample-dusk.svg)
      ![](media/sample-moon.svg)
      ![](media/sample-orbit.svg)

      I used to think an unfinished thing was a failed thing. Now I suspect it is only a thing that is **still alive**.
    `,
  },
  {
    id: "first-page",
    title: "First page",
    date: "2026-09-01",
    body: `
      A book usually waits until it is finished before it lets anyone in. This one won't. It will grow in public, a page at a time, the way a thought actually arrives: late, incomplete, and often contradicting the one before it.

      If you are reading this, you are early. Come back. There will be more.
    `,
  },
];
