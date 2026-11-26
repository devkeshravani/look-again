# The tablets stayed. Their names didn't.

An information-design exploration of how medicine strips stay readable after separation.
It's a single long case-study page (`index.html`), laid out to match the reference page section by section. See `REFERENCE-SPEC.md` for every measurement.
Plain HTML, CSS and vanilla JavaScript: no frameworks, no build step, no CDN. Fonts are embedded.
Some sections read from small data files in `data/` (see **Data files** below). These are plain script files, so they load anywhere. What changed in this version is listed in `CHANGELOG.md`.

## Preview locally

Double-click `index.html`. Everything works from disk, with no server and no terminal: the timeline, the analysis story, the testing section and all data-driven parts. GitHub Pages behaves identically.

## Publish on GitHub Pages

1. Create a new **public** repository on GitHub (e.g. `medicine-strip-case-study`). Don't add a README there.
2. From this folder:

```bash
git init
git add .
git commit -m "Single-page case study"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/medicine-strip-case-study.git
git push -u origin main
```

3. On GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch `main`, folder `/ (root)` → Save.**
4. After a minute or two the site is live at `https://YOUR-USERNAME.github.io/medicine-strip-case-study/`.

Later changes:

```bash
git add .
git commit -m "Describe what changed"
git push
```

If you already published the earlier six-page version to the same repo, those old pages are gone from this folder. `git add .` doesn't record deletions in older Git versions, so run `git add -A` instead.

## Page structure (follows the reference)

1. Header with the title and section links (collapses to a menu under 1024 px; not sticky)
2. Full-height hero: "Which one is which?", title, subtitle, status
3. Metadata column (role, status, timeline, method, participants, scope) + "At a glance" (the question, context, goals, what this isn't)
4. **Animated timeline:**
   - It pins while you scroll. The scroll drives it continuously: the bar grows to the right and the track slides left.
   - Each phase has a heading, a dotted drop line, an explanation and an output item. Earlier phases stay at 40%.
   - At the end, a recap shows the whole project; select a heading to revisit a phase.
5. Blue band, **The challenge**: your story, then the scroll-pinned photos of Cyclopam and Tamodex, then "what already exists"
6. Cream band, **What I found**: "How I studied it" (method, recruitment, limits of the sample, the 17-question interview guide), six interview cards, the interactive analysis story, and scope decisions
7. Blue band, **What I considered**: three ideas, "Set aside, not tested"
8. Cream band, **What I'm proposing**: "Proposed concept", the six layouts, the layout viewer, the requirements table, the FDA note, image placeholders, then "What I made and why"
9. Yellow band, **Testing the prototypes**: study design, designs, tasks, results (from data), limitations
10. Two columns: impact (honest) and next steps / reflections (from data)
11. Blue call-to-action band
12. "In this case study" cards, then back-to-top and the footer

## Colour palette

All colours are CSS variables in **one block** at the top of `css/style.css` (search for `PALETTE: edit these`). Everything else uses those variables or mixes of them.

| Variable | Hex | Used for |
|---|---|---|
| `--white` | `#FFFFFF` | Page and section background |
| `--ink` | `#1F2B24` | All text; dark sections (timeline, photo viewer, hero overlay, footer) |
| `--paper` | `#F7F4EF` | The story's paper note and the quote cards |
| `--red` | `#E0001B` | Strings, outlines and annotation only |
| `--cyan` | `#9CF6F6` | "What I found" band, completed steps, tags |
| `--blue` | `#7293FD` | "What I'm proposing" band, link underlines, progress bars |
| `--honey` | `#FFC164` | "What I considered" band, main buttons, highlights |
| `--tangerine` | `#FF7C36` | Call-to-action card, link arrows |
| `--magenta` | `#A946FF` | Timeline bar, story accents (large text and non-text only) |
| `--lime` | `#C2CE40` | "Testing" band |
| `--coral` | `#F56960` | "The challenge" band |

Text on every colour is `--ink`. White text appears only on `--ink`.

## Where things live

| What | File |
|---|---|
| Site name and headline | `js/main.js` → `SITE_NAME` ("Look Again", shown in the navbar, footer and tab) and `SITE_TITLE` (the hero headline) |
| Layer coordinates and step text | `js/layers.js` |
| Colors, spacing, type scale | `css/style.css` (values at the top under `:root`, marked `(spec)`) |
| Font (DM Sans, SIL OFL) | `css/fonts.css`, license in `fonts/` |
| Timeline, analysis stories, testing results, reflections | `data/*.js` (how to fill them in: `data/GUIDE.md`) |
| Data-driven sections | `js/sections.js` |
| Interactive analysis story | `js/story.js` |
| Animated timeline | `js/timeline.js` |
| Glass navbar, section highlight, mobile menu, button glow on tap, looping words, photo-card fading | `js/chrome.js` |
| Words that loop behind the glass | `data/marquee.js` |
| Ribbed-glass backgrounds (hero, At a glance) | `js/glassband.js` |
| Photos and placeholders | `images/` |
| Layer SVGs and the six layouts | `images/layers/` |

## How the scroll-pinned photo works

The photo pins to the screen while caption cards scroll over it, like the reference. As the cards change:

- **Start:** the full photo.
- **First highlighted layer:** the view zooms out a little, the whole photo dims (`dim-layer.svg`), and one area comes back to full brightness inside a rounded window with its red outline (`outline-N.svg`) and numbered marker (`marker-N.svg`).
- **Later layers:** the view zooms in about 1.3× toward that area.
- **End:** the full photo again.

The red dotted separation line (`separation-line.svg`) stays visible throughout.

Ways to control it:
- **Scroll**, or click the numbered buttons on the photo.
- **Keyboard:** Tab to the buttons, then use the arrow keys, Home and End. The tabs (Cyclopam/Tamodex, Layout A–F) use the arrow keys too.
- **"Show all layers"** turns every placed area on at once.
- **Reduced motion:** with that setting on, zooms and fades are instant.

## Navbar, button glow and looping words

- **Glass navbar** (`js/chrome.js`, styles under "v11" at the end of `css/style.css`). A floating rounded bar with a frosted-glass fill. Browsers without blur get a plain white bar.
  - The highlight pill sits behind the section you're reading, and slides to a link when you hover over it or Tab to it.
  - Below 900px wide, the links fold into a menu button. The menu closes when you pick a link, press Esc or tap outside it.
  - "Get in touch" takes its address from the contact button at the end of the page, so you only change the email in one place.
- **Button glow.** On hover or keyboard focus, an arc of colour runs around the edge of every button. On touch screens it shows when you tap. With reduced motion on, it's a still coloured border instead.
- **Ribbed-glass backgrounds** (`js/glassband.js`). The hero and At a glance sit on soft palette colours, mostly white, seen through broad vertical glass ribs, which are only ever behind the photo and the text. Big words in a very light honey bronze (`--honey-bronze`, about 10% opacity) loop sideways behind the glass, each in its own empty band so they never touch the text. "Which one is which?" runs under the hero text and fades out at the hero's bottom edge. "Name · Strength · Expiry" runs in a band at the very bottom of At a glance and fades in at its top edge. Scrolling pushes the words along faster (backwards when you scroll up). They pause off screen, and with reduced motion on they're a still picture.
- **Looping words.** Edit the words, speed and direction for the hero (`hero`) and At a glance (`glance`) in `data/marquee.js`. They're hidden from screen readers.

## Data files

| File | Drives | Starts as |
|---|---|---|
| `data/timeline.js` | The animated timeline and the Timeline row in At a glance | Four phases, August 2026 to the start of November 2026 |
| `data/themes.js` | The interactive analysis story (one per theme) | Expiry story filled in; the other five themes `null` |
| `data/testing.js` | The Testing band, the Prototypes output status, and the timeline's testing status | Study design filled in; every result empty, so the page shows "Testing in progress" |
| `data/reflections.js` | The Reflections block | Empty, so the block stays hidden |
| `data/marquee.js` | The big looping words behind the hero and At a glance | "Which one is which?" and "Name · Strength · Expiry" |

Edit the fields between the first `{` and the final `};` and leave the first two lines alone. Field-by-field instructions are in `data/GUIDE.md`.

## The timeline

- **How it moves:** it follows the scroll continuously, like the reference. As you scroll, the bar grows to the right, the track slides left, and each phase's heading, dotted line and text appear when the bar's tip reaches them. Earlier phases dim to 40%.
- **The bar's colour:** the gradient is stretched over the visible bar, so the tip always carries the end colour, and it warms from light blue to gold as the project progresses. The colours change as the bar grows rather than sliding past.
- **Controls:**
  - **Forward:** Continue, ArrowRight, Space or Enter. On the last phase the button reads "Summary".
  - **Back:** the Back button or ArrowLeft.
  - **Summary:** Esc or "Skip scrolling" jumps to the recap.
  - **In the recap:** select a phase heading to revisit it, Replay to start over, or "Continue reading" to move on.
- **Recap layout:** on phones, and on tablets where the whole track would be too small to read, the recap is a list.
- **Reduced motion:** the phases appear as a plain vertical list with the same text.

## The analysis story

The story follows one theme through five stages: raw response, initial code, code cluster, emerging theme, design opportunity. Each stage's name stays hidden until the reader reaches it.

- **Moving through it:**
  - **Forward:** scroll, the Continue button, Space, Enter or ArrowRight.
  - **Back:** the Back button or ArrowLeft.
  - **Recap:** Esc or "Skip scrolling" jumps to it. From the recap, any stage can be revisited.
- **At stage 3,** tags can be dragged into the cluster, tapped, or selected with the keyboard (Enter or Space). Continue snaps the rest in.
- **Reduced motion:** the five stages appear as plain sections, one after another, with no movement.

## Adding your strip photos and placing the layers

1. Replace `images/strip-cyclopam.jpg` and `images/strip-tamodex.jpg` with your original photos, unedited, keeping the same names. Any aspect ratio works.
2. In `js/layers.js`, each problem region starts as `"box": null` (not placed). For each region that's **actually visible** in the photo, add a box in percentages of the photo, e.g. `"box": { "x": 62, "y": 10, "w": 30, "h": 14 }` (left, top, width, height).
3. Add the separation line's x-position: `"separations": [58]`.
4. Replace the bracketed step text with 1–2 plain sentences about what's visible, and delete any region that isn't visible.
5. Place region 3 ("Expiry and batch") if it's visible. The analysis story then also outlines it on your photo in the compare slider.
6. A region with `"box": null` is skipped, so visitors never see an unplaced layer.

## Images

| File | Size | Where |
|---|---|---|
| `images/HERO-PHOTO.jpg` | 1920×1080, ~130 KB | Your original hero photo, kept as the source |
| `images/HERO-PHOTO-cutout.webp` | 1920×1080, ~115 KB | Hero: the same photo with only the white background made transparent, so the fragments sit on the glass |
| `images/strip-cyclopam.jpg` | 820×505, cropped to the foil side | The challenge, scene 1; also the analysis story's background and "before" image |
| `images/strip-tamodex.jpg` | 910×425, cropped to the foil side | The challenge, scene 2 |
| `images/WING-SKETCH.jpg`, `LABEL-SKETCH.jpg`, `SCAN-SKETCH.jpg` | 1200×900, ~110–120 KB each | What I considered |

**No other images are needed.** The site has no image slots left to fill: the prototype-photographs sub-section was removed in v12.

## Still to fill in

| What | Where |
|---|---|
| Results, observations, changes, what didn't work | `data/testing.js` |
| Reflections | `data/reflections.js` |
| Stories for the other five themes | `data/themes.js` |
| Contact email on the "Get in touch" buttons (sd1752@g.rit.edu) | `build` source or `index.html` (search `mailto:`) |
| Optional credit line | footer of `index.html`, commented out |

## Maintenance note

`index.html` is hand-editable. It was generated by a script, but you don't need that script to change the page.
