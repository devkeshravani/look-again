# Changelog

## v14 (24 Nov 2026): broader glass, honey-bronze loops in their own bands

### Changed
- **Broader glass ribs:** three times wider than before (about 90px on a wide screen, 42px on a phone), with the same soft highlight and edge shading. The pastel gradient behind them is unchanged. The ribs are only ever behind the photo and the text, never on top of them.
- **Loop colour:** both loops use `--honey-bronze`, a new derived variable that is your honey, mixed with a little tangerine and darkened (about #B37D40). It's a solid fill at 10% opacity, with no grey or lavender.
- **Hero loop:** "Which one is which?" stays in the empty band under the headline and subtitle, sized so its letters fit inside the band and never collide with the text. It fades out toward the hero's bottom edge instead of being cut off. The hero's bottom edge also fades to white, so it meets At a glance without a hard line.
- **At a glance loop:** "Name · Strength · Expiry" moved into its own new band at the very bottom of the section, below all the text, with room for the descenders in "Strength" and "Expiry". It fades in at its top edge. The section's bottom padding became that band, so nothing else moved.
- **At a glance text:** the heading, lede, paragraphs and list items are dark ink at regular weight (400). The heading was 500 and the body text 300 before.
- The words are still edited in `data/marquee.js`. Both loops are `aria-hidden`, ignore the pointer, and cause no layout shift or sideways scroll.

### Interpretation
- "Keep it looping behind the headline" and "keep it from colliding with the headline and subtitle" pulled in different directions. I kept the loop in the hero's background, directly under the headline block, but never overlapping it.

### Contrast (measured from rendered pixels at 1440, 768 and 390)
- At a glance: the lowest is 10.1:1 (a list item). The heading and lede are above 10:1.
- Hero: the lowest is 7.6:1.
- Nothing is under 4.5:1.

### Motion
- With reduced motion on, both loops are a single still frame. There are no drifting shapes left on the page.
- Smooth in testing: 60 fps on desktop, and on a phone-sized window with the processor slowed 4×.

## v13 (24 Nov 2026): ribbed glass behind the hero and At a glance, contact email

### Changed
- **The ribbed glass is now the whole background** of the hero and At a glance, like your reference image: soft palette colours (mostly white) seen through vertical glass ribs. The ribs sit only behind the photo and the text.
  - Hero: coral on the left, lime at the bottom left, white through the middle, cyan and blue on the right.
  - At a glance: honey, cyan, a little magenta, lime and blue, with a white centre and lighter rib shadows, because the section has long body text.
- **"Which one is which?"** keeps the same movement, including the scroll push, but in a light blue behind the glass, along the bottom of the hero below the photo and the text.
- **"Name · Strength · Expiry"** now loops behind the same ribbed glass along the top of At a glance, moving the other way and slower. It replaces the old flat words and drifting shapes there.
- **Hero photo:** a copy of your photo with only the white background made transparent (`images/HERO-PHOTO-cutout.webp`), so the ribs show around the fragments but not across them. The fragments themselves are untouched, and the original JPG is kept.
- **Contact email:** every "Get in touch" button now opens an email to sd1752@g.rit.edu.
- **Lighter on phones:** only the strip with the moving words is redrawn each frame. In testing it ran at 60 fps on desktop, and on a phone-sized window with the processor slowed 4×.

### Removed
- The separate glass panel from v12, and the drifting shapes behind the hero and At a glance. The colour now lives behind the glass.

### Contrast
- Text over the glass, measured from rendered pixels at 1440, 768 and 390: the lowest is 8.2:1, so nothing is under 4.5:1.

## v12 (24 Nov 2026): glass band under the hero, author mode removed, no image slots

### Added
- **Glass band under the hero** (`js/glassband.js`), recreating the reference video's ribbed-glass loop on white:
  - "Which one is which?" loops sideways in large dark letters, cropped at the bottom edge. Behind it is a diagonal blue band with soft cyan, honey and coral light, on white.
  - Over everything is a panel of vertical glass ribs. Each rib magnifies the slice behind it and smears toward its right edge, with a light edge and a shadow edge, so the words look sliced and streaked like the reference.
  - Scroll animation: scrolling down pushes the words along faster, and scrolling up pulls them back, before they ease back to their normal speed. The blue band slides with the scroll position.
  - Placed **below the photo and the text**, in the empty space at the bottom of the first screen, never on top of them. On tablets and phones it follows the text.
  - The words, speed and direction still come from `data/marquee.js` (`hero`).
  - Decorative only: `aria-hidden`, ignores the pointer, causes no layout shift or sideways scroll. It pauses off screen and when the tab is hidden. With reduced motion it's a single still frame.
  - If the canvas can't draw, a CSS gradient with rib lines shows instead.
  - Smooth in testing: 60 fps on desktop, and on a phone-sized window with the processor slowed 4×.

### Removed
- **Author mode, completely.**
  - The `AUTHOR_MODE` switch is gone, along with every author-only note: the layer notes on the strip photos, the analysis story's "verify" list and tag, the timeline's "[needs my input]" notes, the next-steps note and the "[Add after testing]" prompts.
  - Removed the `note`, `verify` and `needsInput` fields from the data files, and the author-mode styles.
  - Nothing can show on the site even if someone sets the old switch again.
- **The prototype-photographs sub-section in Testing**, its `photos` field in `data/testing.js` and the code behind it. The site has no image slots left to fill.
- **The old outline "Which one is which?" words** that ran across the hero photo. The glass band replaces them.

### Changed
- **Hero layout:** the photo and text share the top of the first screen, and the glass band sits below them.

## v11 (24 Nov 2026): glass navbar, button glow, looping words, livelier hero

### Added
- **Glass navbar** (replaces the old header):
  - A floating, centred, rounded bar, at most 1100px wide, with a frosted-glass fill, a thin ink border and a soft shadow. Browsers without backdrop blur get a solid white bar.
  - On load it slides down once with a springy ease. Reduced motion skips this.
  - On the left, "Look Again" (still `data-site-name`) next to a small rotating palette-gradient square. Both go back to the top.
  - Seven link pills. A honey-tinted pill slides behind the section you're reading and moves to a link on hover or keyboard focus (cyan tint while previewing).
  - A "Get in touch" button on the right. It copies its address from the contact button at the end of the page.
  - Below 900px, a menu button that turns into an X and opens a glass panel. The panel closes when you pick a link, press Esc (focus goes back to the button) or tap outside.
  - Accessibility: a real `<nav>` with `aria-label`, `aria-current="page"` on the active link, and `aria-expanded`/`aria-controls` on the menu button.
  - Every `id` gets `scroll-margin-top`, so jumping to a section lands below the bar. The hero, pinned timeline, analysis story and photo viewer all start below the bar.
- **Border glow on every button**: Get in touch (both), Continue, Back, Summary, Replay, Continue reading, nav links, the menu button and links, photo-viewer buttons and tabs, Skip scrolling, the interview-guide toggle and the timeline recap items.
  - On hover (mouse only) and keyboard focus, a comet-like arc runs around the edge over a faint full ring. Both fade in, and the button lifts; pressing pushes it down.
  - Colours: band colours only (coral, cyan, honey, blue, lime, magenta, tangerine). Text stays ink on a light fill.
  - On touch screens it shows for about a second when you tap.
  - Reduced motion: a still band-colour border on hover and focus, no movement.
- **Soft drifting shapes** behind the hero (coral, honey, cyan, blue) and At a glance (magenta, lime, cyan, tangerine). They are large and blurred, drift slowly and sit behind the text. They stay still with reduced motion.
- **Looping big words** (`data/marquee.js`):
  - Hero: "Which one is which?" in a coral outline, about 16vw, moving left.
  - At a glance: "Name · Strength · Expiry" in a pale blue fill, moving right and slower.
  - Both are `aria-hidden`, ignore the pointer, take no layout space and cause no sideways scroll. They pause off screen and stay still with reduced motion.
- **New files:** `js/chrome.js` and `data/marquee.js`.

### Changed
- **Layer 5 on both scenes** now outlines printed text sitting on shiny foil:
  - Cyclopam: the lower-middle area, where the repeated medicine name is printed over the diamond-pattern foil.
  - Tamodex: the lower-middle manufacturer block printed over the foil.
  - The text is your sentence exactly.
- **Layer check, all six layers on both scenes** (the other layers were checked and left as they were):
  - Cyclopam layer 4 text now says the licence number line sits lower down and is outlined in layer 3, so the outline and the text agree.
  - Tamodex layer 4 text now mentions both manufacturer blocks, matching the outline.
- **Layer cards no longer cover the Scene tabs.** The tabs stay at the top, below the navbar. A card fades out as it nears the tabs or the dock, then back in.
- **"Skip to content"** now moves keyboard focus into the page, not only the scroll position.

### Interpretation choices
- **Background:** white, not light yellow, because of the earlier pure-white rule. The looping words and shapes use palette colours at low strength.
- **Comet colours:** the reference video's arc has a white head. On a white page that would vanish, so the head is blue and the tail runs through the other band colours.
- **Video 2:** the reference's words are cropped at the bottom of the frame. On desktop the hero words run across the middle, behind the headline, so they're visible. On phones they sit at the very bottom of the hero, below the status line, partly cropped like the reference.
- **Shapes at 62% strength:** at full strength, three or four shape centres overlapping could drop secondary text under 4.5:1. At 62%, even all four stacked stay above it.
- **Navbar reference:** used for the look only (glass pill, sliding highlight, gradient mark, lifting call to action). Nothing was copied from its code, and no outside assets are used.
- **Section highlight:**
  - The hero has no highlighted link.
  - At a glance and the timeline count as Overview.
  - "In this case study", Project details and the closing call to action count as Impact.
- **Glow on links in text:** only buttons and button-like links glow. The arrow links in the body keep their existing style.

### Contrast check (text over backgrounds)
- **Readable text:** nothing under 4.5:1. Measured from rendered pixels at 1440, 768 and 390, the lowest is the hero headline at 7.5:1. Ink on every button face is at least 5.7:1 (ink on tangerine, the darkest end of the gradient).
- **Decorative, exempt:** the looping words are under 4.5:1 on purpose (the At a glance fill is about 2.9:1). They're hidden from screen readers and repeat text that's on the page in full.

## v10 (24 Nov 2026): your photos and sketches, annotated strips

### Added
- **Your images**, with nothing in them edited:
  - `HERO-PHOTO.jpg`, 1920×1080 at about 130 KB. The fragments sit on the right, so the headline has white space on the left. On tablets and phones, the photo stacks above the text.
  - `strip-cyclopam.jpg` and `strip-tamodex.jpg`, cropped the same way to the foil side only.
  - `WING-SKETCH.jpg`, `LABEL-SKETCH.jpg` and `SCAN-SKETCH.jpg`, cropped to the page, 1200×900 at about 110–120 KB each.
- **All six layers placed on both strip photos** (`js/layers.js`), each with one or two sentences about what's visible. The red dotted separation line is placed on both.
  - Layer 3 says that no legible expiry or batch is visible, with an author-mode note to check the physical strips.
  - Layer 5 describes the shiny foil without claiming it stops anyone reading.
  - Layers 1 and 6 describe the right-hand piece that carries no name.
- **Author-mode notes on photo regions** (a new `note` field per region). They're hidden when `AUTHOR_MODE` is false.

### Changed
- **What I considered:** the three ideas use your sketches and your exact alt text, captions, descriptions and reasons.
- **Testing:**
  - Labelled "Testing planned", with the study design in the future tense.
  - "Three designs" is now a bullet in the study design instead of a block of thumbnails.
  - The "Prototype photographs" sub-section renders only the photos listed in `data/testing.js`, and stays hidden while that list is empty.
- **Analysis story comparison slider:** it outlines the expiry zone on the concept layout only, because the strip photos show no legible expiry.

### Removed
- **Placeholder images:** all five prototype photo placeholders, and the five proposal views (`FULL-STRIP-PROPOSAL`, `SEPARATED-UNIT-ACTUAL-SIZE`, `UNIT-ANNOTATED`, `FOIL-CONTRAST-COMPARISON`, `OPENING-FORM-SKETCHES`). The image files themselves are deleted.
- **The "More views (to be added)" section.**
- **The "Three designs" thumbnail block**, its `layout`/`about` fields and the code behind it.
- **Visible text that named a data file or a placeholder file.** Placeholders now show only in author mode.

## v9 (23 Nov 2026): colourful palette, cleaner header, details at the end

### Changed
- **Header:**
  - A short site name, **Look Again** (`SITE_NAME` in `js/main.js`; alternatives: "Take Note", "In Plain Sight"). The hero headline is unchanged.
  - Removed the "Case study" and "Status: proposal" line.
- **Nav labels:** shorter (Overview, Challenge, Findings, Ideas, Proposal, Testing, Impact).
- **Nav pills:** the links are pill buttons with an outline, a hover fill and a pressed state. The section you're reading is highlighted in ink.
- **Project details** (Role, Status, Timeline, Method, Participants, Scope):
  - moved out of the overview into their own section near the end, before the call to action
  - shown as six cards, each topped with a different colour
  - their icons are gone, including the clock that looked like a "G"
- **Overview:** one centred reading column.
- **Palette:** the seven colours you supplied (Soft Cyan, Cornflower Blue, Honey Bronze, Atomic Tangerine, Hyper Magenta, Lemon Lime, Vibrant Coral) replace the green palette. Ink, white, paper and annotation red stay.
- **Section bands:** each has its own colour (challenge coral, findings cyan, ideas honey, proposal blue, testing lime), with ink headings.
- **Large headings:** back to ink, so colour comes from the bands, cards and accents instead of the text.
- **Main buttons:** Honey Bronze keys with ink text (9.1:1).
- **Cards:**
  - interview cards, output cards and project-detail cards each carry a different colour along the top
  - the "In this case study" tiles and the call-to-action card use light tints
- **Timeline bar:** shifts from blue through magenta, coral and tangerine to honey as the project progresses.
- **Analysis story:** cyan label tape with honey ends, honey highlights, magenta for the current stage and the theme underline.

### Contrast
- Every text pair on the page is 4.5:1 or higher, except one: the testing-task numbers, ink on magenta at **3.5:1**. They're 19 px bold, so they count as large text and pass AA.
- Magenta is never used for small text.

## v8 (23 Nov 2026): new palette, all colours in one place

### Changed
- **Palette:** `--white` #FFFFFF, `--ink` #1F2B24, `--accent` #5E826A, `--sage` #CFDFD7, `--warm` #A9885B, `--paper` #F7F4EF, plus `--red` (annotation only). It replaces every earlier colour. Layout, content and behaviour are unchanged.
- **One place for colours:** every colour is a CSS variable in a single block at the top of `css/style.css`. The stylesheet has no hex or rgb values outside that block, and neither do the scripts or `index.html`. The story's red strings and the hero shapes now read the variables too.
- **Backgrounds:** the page and every section are pure white. No ivory or tinted section backgrounds remain.
- **Dark sections:** the timeline, photo viewer surround, hero overlay and footer are `--ink`.
- **Section bands:**
  - The challenge, What I considered and Testing are `--accent`; Testing adds a `--warm` rule along its bottom edge.
  - What I found and What I'm proposing are `--ink`.
  - All have white headings, 48 px and up.
- **Call to action:** now a `--sage` card on a white section.
- **Cards:** interview cards, observation cards, reflections and "In this case study" images use `--sage`. Quote cards and the story's paper note use `--paper`.
- **Buttons:** `--accent` 3D keys with `--ink` text at 19 px bold. Secondary keys are white with a sage side.
- **Links:** `--ink` text with an `--accent` underline that fills with `--sage` on hover. Text links have an `--accent` arrow.
- **Timeline bar:** goes from deep green to `--accent`, then lightens to `--sage` as the project progresses.
- **Analysis story:**
  - stage background white, board and grid in `--sage`
  - label tape `--sage` with `--warm` torn ends and `--ink` text
  - highlights in a `--warm` wash
  - strings and the cluster centre in `--red`
- **Red is now limited to strings, outlines and annotation:**
  - "NOT FOR MEDICAL USE" is `--ink` text with a red underline.
  - "Proposed concept" is `--ink` text in a red outline.
  - The story's stage labels moved from red to secondary ink.

### Contrast (checked automatically across the whole page)
- Nothing fails WCAG AA.
- Body text is `--ink` on white (14.7:1), sage (10.6:1) or paper (13.4:1).
- Pairs under 4.5:1, all large text that passes AA's 3:1:
  - `--accent` large headings on white: **4.31:1**
  - white headings on `--accent` bands, 48 px and up: **4.31:1**
  - `--ink` button labels on `--accent`, 19 px bold: **3.41:1**

## v7 (23 Nov 2026): new colour palette

### Changed
- **The whole site** now uses Ash Grey, Deep Teal, Charcoal Brown, Pearl Beige and Camel:
  - **Pearl Beige:** the background everywhere, with a lighter tint for cards, quotes and panels.
  - **Charcoal Brown:** all text, the timeline, the photo viewer surround, the hero tint and the footer. White or Pearl Beige text sits on it.
  - **Deep Teal:** large headings (24 px and up) and the timeline bar. The bar warms from Deep Teal through Ash Grey to Camel as the project progresses.
  - **Bands:** The challenge and What I considered are Ash Grey, What I found and What I'm proposing are Deep Teal with white headings, and Testing is Camel. The call to action is Ash Grey.
  - **Camel:** dividers (card tops, quote rules, output rules), the nav underline, link underlines on dark sections, the progress bars and the current-step ring in the photo dock.
  - **Buttons:** primary keys are Charcoal Brown with Pearl Beige text. On dark sections they turn Pearl Beige with Charcoal Brown text. Secondary keys are light Pearl Beige.
  - **Links:** Charcoal Brown text with a Deep Teal underline, filling with Ash Grey on hover.
- **Contrast:** every text pairing passes WCAG AA (4.5:1, or 3:1 for large text), checked automatically across the whole page:
  - Secondary text uses a darker Charcoal Brown shade (`#5E604F`, 5.1:1).
  - Completed steps in the photo dock use a darker Deep Teal so their white numbers pass (5.2:1).
  - The story's first two stages add a Charcoal Brown scrim, so white text stays readable over any photo.

### Fixed
- **The "Get in touch" button** had lost its 3D face because the link styling stripped it. That's fixed.

### Unchanged
- Red stays only on the separation lines and photo annotations, as in the original brief.
- The layout mock-ups keep their foil grey, because they depict packaging.

## v6 (23 Nov 2026): buttons, links and controls redesigned

### Added: a small button system, one style per role
- **Primary, a 3D key** (Continue, Summary, Continue reading, Get in touch):
  - **At rest:** a raised blue face with a light top edge, a darker side and a soft shadow.
  - **Hover:** it lifts and glows. **Press:** it sinks.
  - **Icons:** each has one (→, a list for Summary, ↓), and the icon moves on hover.
- **Secondary, a lighter key** (Back, Replay, "Show all 17 questions"). On the dark timeline and photo stages it becomes a charcoal keycap modelled on the "Just Button" reference.
- **Text button with an arrow** for low-priority actions ("See the six layouts", "See the analysis story", the output links). An underline draws in and the arrow slides on hover.
- **Inline links:** ink text with a teal underline (gold on dark sections) that fills with a soft highlight on hover. Blue underlined links are gone.
- **Navigation links:** an underline slides in on hover.
- **"In this case study" cards:** they lift slightly on hover.

### Changed
- **"Skip to summary" is now "Skip scrolling"**, a chip with a fast-forward icon and an Esc key hint. It sits top-right of the timeline stage and under the story's heading.
- **Photo-viewer controls** (Start, 1–6, End, Show all layers) moved from the corner to a centred, frosted dock at the bottom of the photo:
  - **Top row:** the current layer and its name ("Layer 2 · Brand name"), plus the Show all layers switch.
  - **Middle:** a connected step track whose line fills as you progress. Steps are keycaps: past steps are filled, the current one is raised and ringed in red, and unplaced ones are dashed.
  - **Bottom:** the photo caption.
- **Photo-viewer tabs** became a segmented control. On phones they show the strip names only.
- **Step counters** read "Phase 2 of 4" / "Stage 2 of 5", with a small progress bar.
- **Timeline header:** it now sits inside the pinned stage, aligned with the bar, instead of floating above an empty dark area. A faint dotted track with a stop for each phase shows the road ahead.
- **Phones:** Back and Replay become icon-only keys (they keep their accessible names), so the controls fit at 390 px.

## v5 (23 Nov 2026): exact interview guide, timeline fixes

### Changed
- **Interview guide:** your exact 17 questions in 8 areas, numbered 1–17.
  - One question per area shows by default; "Show all 17 questions" reveals the rest. Without JavaScript, all 17 show.
  - Added the line "Follow-up questions varied by participant."
  - Removed my draft questions and their "draft wording" author-mode flag.
- **Timeline motion:** it now follows the scroll continuously, like the reference, instead of jumping between steps.
  - The bar's gradient is stretched over the visible bar, so the tip always carries the end colour, and it warms from light blue to gold as you progress. It changes rather than sliding past.
  - Phases appear when the bar's tip reaches them.
  - Only transform and opacity change.
- **Timeline outputs:** shown as text labels; the October output keeps the Layout A drawing.

### Fixed
- **"Summary" button and "Skip scrolling"** in both the timeline and the analysis story. The scroll track ended exactly at the summary, so a small overshoot scrolled past the pinned section into the next band. Both tracks now hold the summary on screen for an extra stretch of scrolling, and the buttons land inside it.
- **Timeline summary controls:** besides Back, it now offers Replay and "Continue reading", so it's no longer a dead end.

### Removed
- The three timeline photo placeholders (`TIMELINE-INTERVIEW-GUIDE.jpg`, `TIMELINE-INTERVIEW-NOTES.jpg`, `TIMELINE-TEST-MATERIALS.jpg`) and their "[needs my input]" notes.

## v4 (23 Nov 2026): works from disk, animated timeline

### Changed
- **The data files are now plain scripts** (`data/timeline.js`, `themes.js`, `testing.js`, `reflections.js`), loaded with ordinary script tags before the page scripts.
  - The fields are the same as before.
  - No local files are fetched any more, so the site works the same whether you double-click `index.html` or host it on GitHub Pages.
- **`js/sections.js` and `js/story.js`** read the data directly instead of fetching it.
- **README and `data/GUIDE.md`:** no longer mention a local server; they use the new file names.

### Removed
- The author-mode banner about data files failing to load, and the README steps for running a local server.
- The static timeline bar inside "At a glance". The compact Timeline row in the metadata column stays.

### Added
- **Animated timeline** (`js/timeline.js`), a new section right after "At a glance", on the dark stage color from the reference spec:
  - It pins while you scroll; vertical scroll moves it phase by phase.
  - A thick rounded bar, light blue to gold (the site's palette), grows to the right as the track slides left. The gradient stays fixed to the timeline.
  - Each phase has a date and bold headline above the bar, a dotted drop line, two or three sentences, links and an output item.
  - The current phase is bright, earlier phases sit at 40%, and future phases stay hidden. Only transform and opacity animate (400–500 ms).
  - **Recap after the last phase:** the whole timeline, scaled to fit, on desktop; a list on tablets and phones. Headings are buttons that revisit their phase.
  - **Controls:** Continue/Back (pinned to the bottom of the screen, including on mobile), ArrowRight/ArrowLeft, Space/Enter, Esc and "Skip scrolling". Phase changes are announced to screen readers.
  - **Reduced motion:** a plain vertical list with the same text.
- **Timeline content:** four phases, written only from the facts you supplied. The testing phase shows "Status: In progress" until `testing.js` has data, then links to the Testing section.
- **`[needs my input]` notes** (author mode only) on the three timeline output photos.
- **New placeholders:** `TIMELINE-INTERVIEW-GUIDE.jpg`, `TIMELINE-INTERVIEW-NOTES.jpg`, `TIMELINE-TEST-MATERIALS.jpg`. The October output uses the existing `layout-a.svg`.

## v3 (23 Nov 2026): content update on the existing one-page layout

The structure, bands, layered photo viewer, six layout SVGs, fonts and colors are unchanged. Everything below was added or edited.

### Added
- **Data files** (`data/`): `timeline.json`, `themes.json`, `testing.json`, `reflections.json`, plus `data/GUIDE.md`. (Converted to `.js` in v4.)
- **Scripts:**
  - `js/sections.js` renders the timeline, testing, outputs status and reflections from the data files.
  - `js/story.js` is the interactive analysis story component.
- **Hero:**
  - an overlay line, "Which one is which?"
  - new alt text describing two nameless strip fragments
  - a compressed placeholder (`HERO-PHOTO.jpg`, 1920×1080, ~57 KB) with `fetchpriority="high"`
  - the green tint now only darkens the bottom, so the fragments stay visible
- **At a glance:**
  - the context line about your grandparents
  - three goals drawn from the interview themes
  - new meta rows: Timeline and Participants
  - a timeline bar driven by `data/timeline.json`
- **The challenge:** an opening that starts with your grandparents, then your travel story, which stays the main personal story.
- **What I found:**
  - "How I studied it": why this method, method, participants and recruitment (the hospital isn't named), limits of the sample, and a collapsible interview guide.
  - The interactive analysis story for expiry visibility. It shows five stages, revealed one at a time, with a depth gauge, a recap and stage revisiting. A note says you were the only reviewer. Other themes get a story automatically once their entry in `themes.json` is filled in.
- **What I made and why:** three outputs. The Prototypes item shows "In progress" until `testing.json` has data.
- **Testing the prototypes** (yellow band, in the reference's "impact" position):
  - study design, three designs with layout thumbnails, four tasks
  - a raw-count results table ("N of 6", with optional times)
  - per-participant observation cards
  - "What changed and why" and "What didn't work"
  - five photo slots
  - the limitations
- **Impact, honestly:** says plainly that nothing has been adopted or tested in real use.
- **Next steps:** three items.
- **Reflections:** hidden until filled in via `data/reflections.json`.
- **Author mode** (still controlled by `AUTHOR_MODE` in `js/layers.js`) now also shows:
  - a banner if the data files can't load
  - draft-wording notes on the interview guide
  - a "verify" list for the analysis story
  - a "verify" badge on the "Name first, expiry second" tag
  - placeholders for empty testing fields and captions

### Changed
- **Header nav:** "Where it goes next" became "Testing" and "Impact".
- **Role:** "solo project" with your role description (replaces the placeholder).
- **Method row:** 30–60 minute interviews, one reviewer, and prototype testing (no longer "not run yet").
- **Wording:**
  - The "Read this first" note under the layouts now points to the prototype testing instead of "planned comparisons".
  - The call to action asks for feedback on the prototype testing.
  - The third "In this case study" card now links to Testing.
- **Placeholder removed:** "[Interview method and recruitment details: add real context here]" was replaced by the new method section.

### Removed
- The old yellow "Where it goes next" band (planned comparisons and tasks), now superseded by the actual study design.
- The old "Limits" two-column section and its empty before/after boxes, superseded by Testing's limitations and the "What changed and why" block.

### Unchanged rules
- Seven quotes on the whole site, each exactly once: P2, P8, P5, P4, P10 and P11 on the cards; P1 only in the analysis story.
- Counts only, never percentages or averages.
- No hospital name and no participant names.
- Cyclopam and Tamodex appear only on the layered problem scenes; the layouts stay fictional (ZORVEX).
