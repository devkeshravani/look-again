# Reference spec

Reference page: the pedestrian-safety case study linked in the brief (inspected 22 Nov 2026).
This file records the layout I measured and rebuilt. It names no organization and reuses none of their text or images.

## How this was measured (read first)

- **Source:** the live page, loaded in a cloud Chrome browser at 1440×900, 1440×992, 768×992 and 500×900. Every frame was saved and measured in code (pixel rows and columns, dominant-color sampling). The frames, and side-by-side comparisons with my build, are delivered separately (`comparison-screenshots.zip`) and are deliberately not inside the site folder, so screenshots of the reference never get published.
- **Not computed styles.** The browser available to me has no DevTools or script access, and the workspace shell is blocked from the site (HTTP 403). Sizes below are therefore converted from screenshot pixels to CSS px (screenshots were 0.92–0.96× CSS size). Expect ±1–2 px on sizes and ±1 step on font weight.
- **Colors** are exact sRGB reads of flat areas (bands, buttons, footer). Colors over photos (cards, dimming) are estimated from the blended result.
- **390 px** could not be loaded: this browser's minimum width is 500 px. Mobile values come from 500 px.
- **Font family** could not be read. Visually it's a geometric sans (double-storey *a*, single-storey *g*, light body weight), most likely a commercial face. I used **DM Sans** (SIL OFL), the closest open-licensed match I can self-host. See "Could not verify" at the end.

## 1. Page structure, top to bottom (1440 wide)

| # | Section | Purpose | Height (CSS px) | Background |
|---|---|---|---|---|
| 1 | Header | logo + two-row nav | ~119 | `#FFFFFF` |
| 2 | Hero | full-bleed photo, tinted, title bottom-left | ≥ 100vh (title sits at the fold, subtitle crosses it) | photo + green tint (`~#1B5542` at ~60%) + translucent angular shapes |
| 3 | Metadata + "At a glance" | two columns: icon list (sector, services, office) / summary | ~620 | `#FFFFFF` |
| 4 | Band: "The challenge" | section title only | ~328 | `#97D9E3` |
| 5 | Body | 3 paragraphs, linked stats | ~480 | `#FFFFFF` |
| 6 | Band: "What we did" | section title only | ~328 | `#F7EFDE` |
| 7 | Body | 3 paragraphs | ~480 | `#FFFFFF` |
| 8 | Annotated photo (scroll-pinned) | one photo, 4 image states, 6 caption cards | ~7–8 viewports | `#1D1D1D` around the image |
| 9 | Band: "The impact" | section title only | ~328 | `#FDB633` |
| 10 | Body + embedded chart | result text, chart ~760 wide | ~1100 | `#FFFFFF` |
| 11 | Two-column: text / illustration + caption | text left ~55%, figure right ~35% | ~540 | `#FFFFFF` |
| 12 | Call to action | h3, one paragraph, solid button | ~420 | `#97D9E3` |
| 13 | "Other case studies" | h2 + 3 cards (image, linked title, summary) | ~620 | `#FFFFFF` |
| 14 | Back to top | centered "TOP" chevron, small credit at right, 1 px top rule `#E5E5E5` | ~160 | `#FFFFFF` |
| 15 | Site footer | logo + blurb, 2 link columns, newsletter, social, copyright | ~415 | `#000000` |

## 2. Header, nav, footer

- **Header:** white, ~119 px at 1440 and ~100 px at ≤1023. **Not sticky** (it scrolls away). The logo sits left at x≈49. On the right are two rows:
  - utility links, uppercase, ~14 px, letter-spacing ~0.06em
  - main nav, ~19 px, medium weight, gaps ~30 px, then a search icon
- **Below ~1024 px:** the nav collapses to a hamburger button at the right.
- **Progress indicator:** none.
- **Footer:**
  - black (`#000`); logo left, white blurb (~18 px) right
  - a 1 px white rule
  - link columns (18 px, medium, white) and a newsletter field with a light-blue button
  - social icons
  - copyright, 14 px

## 3. Grid and spacing

| Element | 1440 | 768 | 500 |
|---|---|---|---|
| Hero title left edge | ~187 px | ~93 px | ~25 px |
| Metadata/glance grid | icons at x≈85, glance column 526–1344 (~820 wide) | stacked, x≈93 | stacked, x≈24 |
| Band heading left edge | ~64 px | ~93 px | ~24 px |
| Body column | 300–1123 → **max ~840 px, centered** | 93–675 (582 wide) | full width − 48 |
| Band → first paragraph | ~88 px | ~86 px | ~60 px |
| Last paragraph → next band | ~104 px | ~104 px | ~70 px |
| Paragraph spacing | ~22 px | ~22 px | ~20 px |
| Caption card (annotated photo) | x 320–903 (~584 wide), left of center | x 78–675 (~597), centered | x 12–473, nearly full width |

Breakpoints where the layout changes: **~1024** (nav → hamburger, glance grid → one column, two-column section stacks) and **~600** (hero title drops to ~34 px, side padding drops to ~24 px).

## 4. Typography (measured, CSS px)

| Role | 1440 | 768 | 500 | Weight | Line height |
|---|---|---|---|---|---|
| Hero h1 (white) | ~80 | ~64 | ~34 | regular/medium (≈500) | ~0.96–1.05 |
| Hero subtitle (white) | ~26 | ~24 | ~17 | regular | ~1.2 |
| Band h2 | ~88 | ~68 | ~48 | regular (≈400) | ~1.0 |
| "At a glance" h2 | ~40 | ~36 | ~30 | medium | ~1.1 |
| Glance lede | ~28 | ~24 | ~21 | regular | ~1.2 |
| Body | ~20 | ~18 | ~16 | light (≈300) | ~1.7 |
| Caption-card text | ~18 | ~18 | ~16 | light | ~1.7 |
| Metadata label | ~16 | ~16 | ~15 | regular | 1.4 |
| Metadata link / sub-label | ~15 | ~15 | ~14 | light | 1.6 |
| Figure caption | ~14 | ~14 | ~13 | light | 1.5 |
| CTA h3 | ~36 | ~32 | ~28 | medium | 1.15 |
| "Other case studies" h2 | ~56 | ~52 | ~40 | regular | 1.05 |
| Card title (link) | ~26 | ~26 | ~22 | regular | 1.2 |
| Footer link | ~18 | ~18 | ~17 | medium | 1.4 |

Text color is `#000000`. No letter-spacing except the uppercase utility nav and the "TOP" label.

## 5. Colors (hex)

| Use | Hex |
|---|---|
| Page background | `#FFFFFF` |
| Text | `#000000` |
| Secondary text (metadata sub-labels) | ~`#444444` |
| Links | `#1155CC`, underlined (dotted underline under small links) |
| Band 1 / CTA | `#97D9E3` |
| Band 2 | `#F7EFDE` |
| Band 3 | `#FDB633` |
| Button | `#0000FF`, white text, square corners |
| Icons in metadata column | `#0000FF` (solid glyphs) |
| Annotated-photo surround | `#1D1D1D` (flat), with a blurred copy of the photo at tablet sizes |
| Dimming over photo | black at ~0.6 opacity (gray `#4B4B4B` road reads ~`#1E1E1E` when dimmed) |
| Caption card | `#F7EFDE` at ~0.9 opacity, radius ~10 px, soft shadow |
| Footer | `#000000` |
| Hairline rules | `#E5E5E5` |
| Hero tint | ~`#1B5542` translucent, with lighter green angular planes |

The highlight green inside their photo is part of their image file; it isn't a page color. In my build, **your red `#E0001B` stays the annotation and separation color**, as you asked.

## 6. "At a glance" block, captions, quotes, stats

- **Metadata column:** three groups (sector, services, office). Each group has a solid blue ~26 px icon, a 16 px label beside it, and indented 15 px blue underlined links with light gray dash sub-labels under them.
- **Glance column:**
  - h2 "At a glance"
  - one large lede sentence (28 px), with an inline link styled the same size
  - two light 20 px paragraphs
- **Pull quotes and stat blocks:** the page has none. Stats appear as inline links inside sentences.
- **Captions:** 14 px light, below the figure, left-aligned, ~15 px gap.

## 7. Annotated-photo section (the scroll-pinned photo)

- **Pinning:** the photo stage is `position: sticky; top: 0; height: 100vh`. At 1440 the photo fills the viewport (cover). At ≤1023 it fits the width (contain), with a blurred, darkened copy of the same photo filling the space above and below.
- **Cards:** caption cards scroll up over the pinned photo. Each card sits in its own ~100vh scroll step, so one card is on screen at a time and it moves with the page rather than fading.
- **Steps:** 4 image states across 6 cards.
  1. Full photo, normal brightness (card 1).
  2. **Zoom out** to ~92% of the frame, dark surround showing. The **whole photo dims** (black ~0.6) and the highlighted areas **come back at full brightness inside rounded windows** (radius ~10 px). Card 2.
  3. **Zoom in** (~1.3×) and pan toward the crosswalk. The whole photo stays dimmed with one rounded window at full brightness. Card 3.
  4. Back to the full photo, undimmed (cards 4–6, the methods text).
- **Triggers:** scroll position only. There are no buttons, dots or keyboard controls.
- **Transitions:** zoom/pan and dim crossfade between states. I couldn't time these from still frames; they read as roughly 0.6–1 s ease-in-out.
- **Caption change:** captions don't swap in place. Each new card scrolls in from below while the previous one scrolls off the top.

## 8. Hover, focus, scroll behaviors

- **Hover:** on a text link I saw no visible change in a screenshot (cursor only). I didn't capture the button's hover state.
- **Focus:** not captured, because the browser can't send Tab reliably to the page.
- **Scroll:** the header scrolls away, the annotated photo pins, and there's no scroll progress bar.
- **Pause button:** a round dark button (~44 px) sits bottom-right of the hero video. A cookie-preferences corner badge (bottom-left) is a site-wide widget, not part of the layout.

## 9. Tablet (768) and mobile (500)

- **Header:** ~100 px with a hamburger.
- **Hero:** full height; title ~64 px at 768 and ~34 px at 500, left padding ~93 / ~25 px.
- **Metadata and glance:** stack, metadata first.
- **Bands:** heading ~68 px at 768, padding-left ~93 px.
- **Body column:** 582 px at 768; full width minus 48 px at 500.
- **Annotated photo:** still pinned. The photo fits the width with a blurred surround, and cards are ~597 px at 768 and nearly full width at 500.
- **Two-column and "other case studies" sections:** stack to one column.

## 10. My mapping onto this structure

| Reference section | My content |
|---|---|
| Hero | Title (`SITE_TITLE`), subtitle, status line |
| Metadata column | Role, Status, Method, Scope (recreated solid blue icons, drawn by me) |
| At a glance | Lede = the research question; summary; "What this project is not" |
| Band 1 "The challenge" | My story |
| Annotated photo | Cyclopam / Tamodex layered viewer (tabs), then "what already exists" |
| Band 2 | "What I found": six interview cards, scope decisions |
| Band 3 (added; same style) | "What I considered": three ideas, set aside |
| Band 4 (added; same style) | "What I'm proposing": six layouts, layered layout viewer, table, FDA note |
| Band "The impact" (yellow) | "Where it goes next": planned comparisons and limits. Nothing tested. |
| Two-column text/figure | Limits text / before-after placeholder |
| CTA band | Feedback request (placeholder email) |
| "Other case studies" | "In this case study": 3 cards linking to sections |
| Back to top + footer | Same structure; my disclaimer; optional credit line commented out for you to confirm |

Additions beyond the reference, which you asked for, are kept inside the same visual system: numbered step buttons, a "show all layers" toggle, keyboard control, tabs between scenes, and reduced-motion support.

### v3 mapping update (23 Nov 2026)

- **The "impact" position** (yellow band) now holds **Testing the prototypes**.
- **The two-column text/figure section** now holds **Impact, honestly** and next steps on the left, and reflections on the right.
- **The research band** gained "How I studied it" and the interactive analysis story. The story uses this spec's palette and type: cream and white surfaces, DM Sans for headings, and red only for strings, outlines and annotation.

## Could not verify

- Exact font family and weights (no computed styles). The substitute is DM Sans.
- Exact transition timing and easing in the annotated section.
- Hover and focus styles beyond one link hover.
- The 390 px layout (500 px was the minimum).
- The contents of the hamburger menu when it's open.
