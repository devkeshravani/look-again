# Filling in the data files

Five files in this folder drive parts of the page:

| File | Drives |
|---|---|
| `timeline.js` | The animated timeline and the Timeline row in "At a glance" |
| `themes.js` | The interactive analysis story |
| `testing.js` | The Testing band and the Prototypes output status |
| `reflections.js` | The Reflections block |
| `marquee.js` | The words that loop behind the glass in the hero and "At a glance" |

**To see your changes**, save the file and reload `index.html` in your browser. Double-clicking it works; no server or terminal needed. GitHub Pages behaves the same way.

## How the files are laid out

Each file is a small script:

```js
window.SITE_DATA = window.SITE_DATA || {};
window.SITE_DATA.testing = {
  ...the fields you edit...
};
```

- **Leave the first two lines and the final `};` as they are.** Edit only the fields in between.
- **Text goes in double quotes,** and items are separated by commas.
- **Use `null` or `""`** for something that isn't filled in yet.
- **If a section stops showing,** a comma or quote has usually gone missing. Copy everything between the first `{` and the final `}` into any JSON validator (search "JSON validator") to find the typo.

Fields starting with `_help` are notes for you. The page ignores them.

---

## timeline.js

| Field | What to put |
|---|---|
| `summary` | One sentence shown under the timeline's title. Leave `""` to hide it. |
| `items[].when` | The date label, e.g. `"September 2026"` |
| `items[].what` | The one-line headline (shown above the bar, and in At a glance) |
| `items[].status` | `"done"`, `"current"` or `"upcoming"` |
| `items[].details` | 2–3 sentences about the work done in that phase |
| `items[].output` | `{ "label": "..." }`: the small output item beside the text. Optionally add `"image": "images/..."` and `"alt": "..."` to show a picture. |
| `items[].links` | Optional list of `{ "label": "...", "href": "#section-id" }` |
| `items[].statusFromTesting` | `true` on the testing phase. It shows "Status: In progress" until `testing.js` has data, then links to the Testing section. |

**Adding or removing a phase:** copy or delete a whole `{ ... }` item, and keep the commas between items. The bar, track and recap adjust themselves.

---

## themes.js

- `reviewerNote` is shown above every story. It currently says you were the only reviewer.
- `stageNames` are the five stage names, revealed one at a time.
- Each entry in `themes` has:
  - `card`: must match the interview card's title exactly.
  - `story`: `null` means no story; that theme's interview card still shows.

**To build a story for another theme**, copy the whole `"story": { ... }` block from `expiry` into that theme and replace the text. Every story needs these parts:

| Part | Fields |
|---|---|
| `raw` | `lead`, `participant` (ID only), `quote`, `tryIt`, `recap` |
| `code` | `lead`, `highlights` (each `{ "phrase": exact words from the quote, "tag": the code }`), `reveal`, `recap` |
| `cluster` | `lead`, `tags` (each `{ "label", "participant" }`, ID only, **no quote text**), `outlier` (`{ "label", "note" }`), `dragHint`, `recap` |
| `theme` | `lead`, `statement`, `count` (write it as "N of the participants quoted raised this."), `constraint`, `recap` |
| `opportunity` | `lead`, `moves` (list), `compare` (`before`/`after` image paths, alt text, labels), `closing`, `links` |

Rules the page can't enforce for you:
- **Quotes.** A story's `quote` must appear nowhere else on the site, including the interview cards. `recap` lines must not repeat the quote's words.
- **No percentages.** Use counts only.
- **IDs only** for participants.

**The red expiry outline in the compare slider** comes from `js/layers.js`:
- **Concept side:** the outline uses that layout's region whose title contains "Expiry". Change `compare.after` to another `images/layers/layout-x.svg` and the outline follows.
- **Photo side:** the outline appears once you place the "Expiry and batch" region (region 3) on that photo.

---

## testing.js

| Field | What to put |
|---|---|
| `status` | `"in progress"` or `"complete"` |
| `participants`, `pilotSessions` | 6 and 1 (only change if the study changed) |
| `designs[].role` | Keep `"Original"`, `"Redesign 1"`, `"Redesign 2"` |
| `tasks` | Already filled in from your study design |
| `results[].completed` | **Whole number** of participants who completed that task on that design, e.g. `4` shows "4 of 6". `null` means not recorded yet. |
| `results[].timesSeconds` | Optional individual times, e.g. `[12, 15, 9]` |
| `observations[]` | `participant` (ID only, never a name), `did`, `hesitated`, `errors` |
| `changes[]` | One entry per change: `observation`, `evidence`, `change`, `reason` |
| `didntWork[]` | One string per thing that didn't work. Include negative and contradictory results. |
| `materials.metallicStandIn` | `true` only if you used a metallic stand-in paper; then describe it in `materials.describe` |

**What the page shows:**
- While every result is `null` and the lists are empty, it shows "Testing planned" and the study design only. The timeline's testing phase shows "Status: In progress".
- As soon as you add anything, it shows what you've entered and marks missing cells with "—". The timeline links to the Testing section.
- The page never computes percentages or averages.

---

## reflections.js

| Field | Prompt |
|---|---|
| `wentWell` | What went well |
| `didntGoWell` | What didn't |
| `wouldChange` | What I'd change |

The Reflections block stays hidden on the published page until at least one is filled in.

---

## marquee.js

Two entries: `hero` runs in the empty band under the hero text, fading out at the hero's bottom edge; `glance` runs in its own band at the very bottom of "At a glance", below all the text. Both sit behind the ribbed glass, in a very light honey bronze.

```js
"hero":   { "text": "Which one is which?",      "separator": "  ·  ", "secondsPerLoop": 38, "direction": "left" },
"glance": { "text": "Name · Strength · Expiry", "separator": "  ·  ", "secondsPerLoop": 60, "direction": "right" }
```

- **`text`**: the words that repeat. Keep them short; they're shown very large.
- **`separator`**: what goes between repeats.
- **`secondsPerLoop`**: how long one pass takes on a wide screen. Bigger means slower. Narrower screens scale it so the speed looks the same.
- **`direction`**: `"left"` or `"right"`.
- **To hide a band**, set its `text` to `""`.
