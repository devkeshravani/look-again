/* ==========================================================================
   story.js: the interactive analysis story ("zoom out, condense, build").
   One component, reused for every theme in data/themes.js that has a "story".
   States: 0 Raw response · 1 Initial code · 2 Code cluster · 3 Emerging theme ·
           4 Design opportunity · 5 Recap (full chain).
   Advance: scroll (sticky stage), Continue button, Space / Enter / ArrowRight.
   Back: Back button, ArrowLeft. Esc or "Skip to summary": recap.
   prefers-reduced-motion: plain sequential sections, no movement.
   ========================================================================== */
(function () {
  "use strict";
  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mount = document.getElementById("theme-stories");
  if (!mount) return;

  const esc = (v) => String(v == null ? "" : v).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  function el(tag, attrs, kids) {
    const n = document.createElement(tag);
    for (const k in attrs || {}) {
      const v = attrs[k];
      if (v === null || v === undefined || v === false) continue;
      if (k === "class") n.className = v;
      else if (k === "text") n.textContent = v;
      else if (k === "html") n.innerHTML = v;
      else n.setAttribute(k, v === true ? "" : v);
    }
    (kids || []).forEach((c) => c && n.appendChild(c));
    return n;
  }

  /* "Skip scrolling" chip: icon + label + Esc key hint */
  function skipChip(href, extra) {
    const a = el("a", { class: "skip-chip" + (extra ? " " + extra : ""), href: href, "aria-keyshortcuts": "Escape" });
    a.append(el("span", { class: "skip-chip__icon", "aria-hidden": "true" }), el("span", { text: "Skip scrolling" }), el("kbd", { text: "Esc", "aria-hidden": "true" }));
    return a;
  }

  /* split the quote into words, marking which highlight phrase each belongs to */
  function tokenize(quote, highlights) {
    const words = quote.split(/\s+/);
    const lower = words.map((w) => w.toLowerCase().replace(/[^\w']/g, ""));
    const owner = new Array(words.length).fill(-1);
    (highlights || []).forEach((h, hi) => {
      const pw = h.phrase.toLowerCase().split(/\s+/).map((w) => w.replace(/[^\w']/g, ""));
      for (let i = 0; i + pw.length <= lower.length; i++) {
        if (pw.every((w, j) => lower[i + j] === w)) { for (let j = 0; j < pw.length; j++) owner[i + j] = hi; break; }
      }
    });
    return words.map((w, i) => ({ text: w, owner: owner[i] }));
  }

  /* expiry box from layers.js for an image path (used to outline the expiry zone) */
  function expiryBoxFor(src) {
    const sets = window.LAYER_SETS || {};
    for (const key in sets) {
      for (const scene of sets[key]) {
        const sameBase = scene.base === src || src.indexOf("/" + scene.id + ".svg") !== -1;
        if (!sameBase) continue;
        const r = scene.regions.find((x) => /expiry/i.test(x.title) && x.box);
        return r ? r.box : null;
      }
    }
    return null;
  }

  (function (themes) {
    const fb = document.getElementById("story-fallback");
    if (!themes) return; // fallback message stays
    if (fb) fb.remove();
    (themes.themes || []).forEach((t, i) => {
      if (!t.story) return; // theme without data: its interview card is enough
      const root = el("section", { class: "story", id: "story-" + t.id, "aria-labelledby": "story-h-" + t.id });
      mount.appendChild(root);
      (REDUCED ? buildStatic : buildInteractive)(root, t, themes, i);
    });
  })((window.SITE_DATA || {}).themes);

  /* ------------------------------------------------------------------------
     Shared header (title, intro, reviewer note, skip link)
     ------------------------------------------------------------------------ */
  function header(root, t, themes) {
    const s = t.story;
    const head = el("div", { class: "story__head" }, [
      el("p", { class: "story__kicker", text: "Analysis · " + t.card }),
      el("h3", { id: "story-h-" + t.id, text: s.title || t.card }),
      el("p", { text: s.intro || "" }),
      el("p", { class: "story__reviewer", text: themes.reviewerNote || "" }),
    ]);
    const skip = skipChip("#story-recap-" + t.id);
    head.appendChild(skip);
    root.appendChild(head);
    return skip;
  }

  function recapList(t, names, onPick) {
    const s = t.story;
    const lines = [s.raw.recap, s.code.recap, s.cluster.recap, s.theme.recap, s.opportunity.recap];
    return el("ol", { class: "recap__list" }, names.map((nm, i) => {
      const inner = [el("span", { class: "recap__n", text: String(i + 1) }), el("span", { class: "recap__name", text: nm }), el("span", { class: "recap__line", text: lines[i] || "" })];
      return el("li", null, [onPick
        ? (() => { const b = el("button", { type: "button", class: "recap__item", "aria-label": `Revisit stage ${i + 1}: ${nm}` }, inner); b.addEventListener("click", () => onPick(i)); return b; })()
        : el("div", { class: "recap__item" }, inner)]);
    }));
  }

  function compareBlock(cmp) {
    const wrap = el("figure", { class: "cmp" });
    const frame = el("div", { class: "cmp__frame" });
    const before = el("img", { class: "cmp__before", src: cmp.before, alt: cmp.beforeAlt || "" });
    const afterWrap = el("div", { class: "cmp__after" });
    const after = el("img", { src: cmp.after, alt: cmp.afterAlt || "" });
    afterWrap.appendChild(after);
    const bBox = null, aBox = expiryBoxFor(cmp.after);   // the strip photos show no legible expiry, so only the concept is outlined
    const aOut = aBox ? el("span", { class: "cmp__outline", style: `left:${aBox.x}%;top:${aBox.y}%;width:${aBox.w}%;height:${aBox.h}%` }) : null;
    if (aOut) afterWrap.appendChild(aOut);
    const bOut = bBox ? el("span", { class: "cmp__outline cmp__outline--before" }) : null;
    const handle = el("span", { class: "cmp__handle", "aria-hidden": "true" });
    frame.append(before, ...(bOut ? [bOut] : []), afterWrap, handle,
      el("span", { class: "cmp__label cmp__label--l", text: cmp.beforeLabel || "Before" }),
      el("span", { class: "cmp__label cmp__label--r", text: cmp.afterLabel || "After" }));
    const range = el("input", { type: "range", min: "0", max: "100", value: "50", class: "cmp__range", "aria-label": "Compare: slide to reveal more of the original strip or the concept layout" });
    function set(v) {
      frame.style.setProperty("--cut", v + "%");
    }
    range.addEventListener("input", () => set(range.value));
    // drag directly on the picture too
    let dragging = false;
    frame.addEventListener("pointerdown", (e) => { dragging = true; frame.setPointerCapture(e.pointerId); move(e); });
    frame.addEventListener("pointermove", (e) => { if (dragging) move(e); });
    frame.addEventListener("pointerup", () => { dragging = false; });
    function move(e) { const r = frame.getBoundingClientRect(); range.value = clamp(((e.clientX - r.left) / r.width) * 100, 0, 100); set(range.value); }
    set(50);
    // aspect from the concept image; outline on the original photo uses contain-fit maths
    function fit() {
      if (after.naturalWidth) frame.style.aspectRatio = after.naturalWidth + " / " + after.naturalHeight;
      if (bOut && before.naturalWidth) {
        const W = frame.clientWidth, H = frame.clientHeight, s = Math.min(W / before.naturalWidth, H / before.naturalHeight);
        const w = before.naturalWidth * s, h = before.naturalHeight * s, ox = (W - w) / 2, oy = (H - h) / 2;
        Object.assign(bOut.style, { left: ox + (bBox.x / 100) * w + "px", top: oy + (bBox.y / 100) * h + "px", width: (bBox.w / 100) * w + "px", height: (bBox.h / 100) * h + "px" });
      }
    }
    after.addEventListener("load", fit); before.addEventListener("load", fit); window.addEventListener("resize", fit);
    wrap.append(frame, range);
    wrap.appendChild(el("figcaption", null, [
      el("span", { text: "Red outline: the expiry zone on the concept. Drag the picture or the slider to compare. " }),
      el("span", { class: "warn", text: "Concept is a fictional product, NOT FOR MEDICAL USE." }),
    ]));
    return wrap;
  }

  /* ------------------------------------------------------------------------
     Reduced motion: plain sequential sections, no movement
     ------------------------------------------------------------------------ */
  function buildStatic(root, t, themes) {
    const s = t.story, names = themes.stageNames;
    header(root, t, themes);
    root.classList.add("story--static");
    const ol = el("ol", { class: "sstatic" });
    const toks = tokenize(s.raw.quote, s.code.highlights);
    const q = el("blockquote", { class: "paper" });
    const p = el("p");
    toks.forEach((w, i) => {
      const prevOwn = i > 0 ? toks[i - 1].owner : -1;
      if (i) p.appendChild(document.createTextNode(" "));
      const node = w.owner >= 0 ? el("mark", { text: w.text }) : document.createTextNode(w.text);
      p.appendChild(node);
      const nextOwn = i + 1 < toks.length ? toks[i + 1].owner : -1;
      if (w.owner >= 0 && nextOwn !== w.owner) p.appendChild(el("sup", { text: String(w.owner + 1) }));
      void prevOwn;
    });
    q.append(el("p", { class: "paper__id", text: s.raw.participant }), p);
    const beats = [
      [s.raw.lead, [q]],
      [s.code.lead, [el("ul", { class: "tape-list" }, s.code.highlights.map((h, i) => el("li", null, [el("span", { class: "tape", text: (i + 1) + " · " + h.tag })]))), el("p", { text: s.code.reveal })]],
      [s.cluster.lead, [el("ul", { class: "tape-list" }, s.cluster.tags.map((g) => el("li", null, [el("span", { class: "tape", text: g.label }), el("span", { class: "pid", text: g.participant })]))),
        el("p", null, [el("span", { class: "tape tape--loose", text: s.cluster.outlier.label }), document.createTextNode(" " + s.cluster.outlier.note)])]],
      [s.theme.lead, [el("p", { class: "theme-big", text: s.theme.statement }), el("p", { text: s.theme.count }), el("p", { class: "theme-constraint", text: s.theme.constraint })]],
      [s.opportunity.lead, [el("ul", { class: "moves" }, s.opportunity.moves.map((m) => el("li", { text: m }))), compareBlock(s.opportunity.compare), el("p", { text: s.opportunity.closing }),
        el("p", null, (s.opportunity.links || []).map((l) => el("a", { class: "link-arrow", href: l.href, text: l.label })))]],
    ];
    beats.forEach(([lead, kids], i) => ol.appendChild(el("li", { class: "sstatic__beat" }, [
      el("p", { class: "story__eyebrow", text: `Stage ${i + 1} · ${names[i]}` }), el("h4", { text: lead }), ...kids])));
    root.appendChild(ol);
    const rec = el("div", { class: "recap recap--static", id: "story-recap-" + t.id, tabindex: "-1" }, [el("h4", { text: "Summary: the full chain" }), recapList(t, names, null)]);
    root.appendChild(rec);
  }

  /* ------------------------------------------------------------------------
     Interactive version
     ------------------------------------------------------------------------ */
  function buildInteractive(root, t, themes) {
    const s = t.story, names = themes.stageNames, N = 5;
    const skip = header(root, t, themes);
    const st = { i: 0, max: -1, lock: 0, snapped: new Set(), reader: new Set() };

    const track = el("div", { class: "story__track" });
    const stage = el("div", { class: "story__stage", tabindex: "0", role: "region", "aria-roledescription": "interactive story",
      "aria-label": (s.title || t.card) + ". Use Continue, or the arrow keys, to move through the stages." });
    track.appendChild(stage);
    root.appendChild(track);

    /* gauge */
    const gauge = el("ol", { class: "gauge", "aria-label": "Stages reached" });
    const gaugeItems = names.map((nm, i) => {
      const b = el("button", { type: "button", class: "gauge__dot", "aria-label": `Stage ${i + 1}: ${nm}` }, [el("span", { class: "gauge__pip", "aria-hidden": "true" }), el("span", { class: "gauge__label", text: nm })]);
      b.addEventListener("click", () => go(i, true));
      const li = el("li", { hidden: true }, [b]);
      gauge.appendChild(li);
      return { li, b };
    });

    /* canvas + layers */
    const canvas = el("div", { class: "canvas", "data-beat": "0" });
    const bg = el("div", { class: "canvas__photo", style: `background-image:url("${s.background}")`, "aria-hidden": "true" });
    const board = el("div", { class: "canvas__board", "aria-hidden": "true" });
    const grid = el("div", { class: "canvas__grid", "aria-hidden": "true" });
    const lead = el("div", { class: "canvas__lead" }, [el("p", { class: "story__eyebrow" }), el("p", { class: "canvas__leadtext" })]);
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "strings"); svg.setAttribute("aria-hidden", "true");

    /* the note (raw response) */
    const toks = tokenize(s.raw.quote, s.code.highlights);
    const words = el("p", { class: "paper__quote", role: "group", "aria-label": "Quote. Optional: select words that matter to you." });
    const wordBtns = toks.map((w, i) => {
      const b = el("button", { type: "button", class: "word" + (w.owner >= 0 ? " word--h" + w.owner : ""), "aria-pressed": "false", tabindex: i === 0 ? "0" : "-1", text: w.text });
      b.addEventListener("click", () => {
        const on = b.getAttribute("aria-pressed") !== "true";
        b.setAttribute("aria-pressed", String(on));
        on ? st.reader.add(i) : st.reader.delete(i);
      });
      b.addEventListener("keydown", (e) => {
        const m = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: toks.length - 1 };
        if (e.key in m) { e.preventDefault(); e.stopPropagation(); const n = clamp(m[e.key], 0, toks.length - 1); wordBtns.forEach((x, j) => (x.tabIndex = j === n ? 0 : -1)); wordBtns[n].focus(); }
      });
      words.appendChild(b);
      if (i < toks.length - 1) words.appendChild(document.createTextNode(" "));
      return b;
    });
    const note = el("figure", { class: "paper note" }, [
      el("p", { class: "paper__id", text: s.raw.participant }), el("blockquote", null, [words]),
      el("figcaption", { class: "paper__try", text: s.raw.tryIt || "" }),
      el("p", { class: "paper__yours", text: "Your marks are underlined. Mine are highlighted.", hidden: true }),
    ]);

    /* tags: 2 codes (from highlights), 5 cluster tags, 1 outlier */
    const tags = [];
    s.code.highlights.forEach((h, i) => tags.push({ kind: "code", label: h.tag, id: s.raw.participant, hi: i }));
    s.cluster.tags.forEach((g) => tags.push({ kind: "cluster", label: g.label, id: g.participant }));
    tags.forEach((tg, k) => {
      tg.k = k;
      tg.node = el("button", { type: "button", class: "tape tag tag--" + tg.kind, "aria-label": `${tg.label}, ${tg.id}. ${tg.kind === "cluster" ? "Press to move it into the cluster." : ""}` },
        [el("span", { class: "tag__t", text: tg.label }), el("span", { class: "pid", text: tg.id })]);
    });
    const outlier = el("div", { class: "tape tag tag--outlier" }, [
      el("span", { class: "tag__t", text: s.cluster.outlier.label }),
      el("span", { class: "tag__note", text: s.cluster.outlier.note }),
      el("span", { class: "tag__constraint", text: s.theme.constraint }),
    ]);
    const dragHint = el("p", { class: "canvas__hint", text: s.cluster.dragHint || "" });
    const reveal = el("p", { class: "canvas__reveal", text: s.code.reveal });

    /* theme statement */
    const themeBox = el("div", { class: "themebox" }, [el("p", { class: "themebox__s", text: s.theme.statement }), el("p", { class: "themebox__c", text: s.theme.count })]);

    /* design opportunity */
    const opp = el("div", { class: "opp" }, [
      el("p", { class: "opp__theme", text: s.theme.statement }),
      el("ol", { class: "moves" }, s.opportunity.moves.map((m, i) => el("li", null, [el("span", { class: "moves__n", text: String(i + 1) }), document.createTextNode(m)]))),
      compareBlock(s.opportunity.compare),
      el("p", { class: "opp__closing", text: s.opportunity.closing }),
      el("p", { class: "opp__links" }, [
        ...(s.opportunity.links || []).map((l) => el("a", { class: "link-arrow", href: l.href, text: l.label })),
      ]),
    ]);

    /* recap */
    const recap = el("div", { class: "recap", id: "story-recap-" + t.id, tabindex: "-1" }, [
      el("h4", { text: "The full chain" }),
      el("p", { class: "recap__hint", text: "Select a stage to revisit it." }),
      recapList(t, names, (i) => go(i, true, true)),
    ]);
    const replay = el("button", { type: "button", class: "story__btn story__btn--ghost", "data-icon": "replay", "aria-label": "Replay", text: "Replay" });
    replay.addEventListener("click", () => { reset(); go(0, true, true); });
    recap.appendChild(replay);
    const replay2 = el("button", { type: "button", class: "link-arrow link-arrow--replay", text: "Replay" });
    replay2.addEventListener("click", () => { reset(); go(0, true, true); });
    opp.querySelector(".opp__links").appendChild(replay2);

    canvas.append(bg, board, grid, svg, note, ...tags.map((x) => x.node), outlier, dragHint, reveal, themeBox, opp, recap, lead);

    /* controls (sticky bottom on mobile because the whole stage is sticky) */
    const back = el("button", { type: "button", class: "story__btn story__btn--ghost", "data-icon": "back", "aria-label": "Back", text: "Back" });
    const next = el("button", { type: "button", class: "story__btn", "data-icon": "next", text: "Continue" });
    const count = el("span", { class: "story__count" });
    const live = el("p", { class: "visually-hidden", "aria-live": "polite" });
    const controls = el("div", { class: "story__controls" }, [back, count, next]);
    stage.append(gauge, canvas, controls, live);
    back.addEventListener("click", () => go(st.i - 1, true));
    next.addEventListener("click", () => {
      if (st.i === 2 && st.snapped.size < tagsCluster().length) { snapAll(); live.textContent = "All tags moved into the cluster."; return; }
      go(st.i + 1, true);
    });
    skip.addEventListener("click", (e) => { e.preventDefault(); go(5, true, true); });

    /* keyboard on the stage */
    stage.addEventListener("keydown", (e) => {
      const tgt = e.target;
      const onStage = tgt === stage;
      const onCtl = tgt === next || tgt === back;
      if (e.key === "Escape") { e.preventDefault(); go(5, true, true); return; }
      if (!(onStage || onCtl)) return;
      if (e.key === "ArrowRight" || (onStage && (e.key === " " || e.key === "Enter"))) { e.preventDefault(); next.click(); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); go(st.i - 1, true); }
    });

    /* ---- drag / tap tags into the cluster ---- */
    function tagsCluster() { return tags.filter((x) => x.kind === "cluster"); }
    function snap(tg) { st.snapped.add(tg.k); tg.node.classList.add("is-snapped"); tg.node.setAttribute("aria-label", `${tg.label}, ${tg.id}. In the cluster.`); layout(); }
    function snapAll() { tagsCluster().forEach((x) => st.snapped.add(x.k)); tagsCluster().forEach((x) => x.node.classList.add("is-snapped")); layout(); }
    function reset() {
      st.snapped.clear(); st.reader.clear();
      tags.forEach((x) => x.node.classList.remove("is-snapped"));
      wordBtns.forEach((b) => b.setAttribute("aria-pressed", "false"));
    }
    tagsCluster().forEach((tg) => {
      let start = null, moved = false, ignoreClick = false;
      tg.node.addEventListener("pointerdown", (e) => {
        if (st.i !== 2 || st.snapped.has(tg.k)) return;
        start = { x: e.clientX, y: e.clientY }; moved = false;
        tg.node.setPointerCapture(e.pointerId); tg.node.classList.add("is-dragging");
      });
      tg.node.addEventListener("pointermove", (e) => {
        if (!start) return;
        const dx = e.clientX - start.x, dy = e.clientY - start.y;
        if (Math.abs(dx) + Math.abs(dy) > 6) moved = true;
        tg.node.style.translate = `${dx}px ${dy}px`;
      });
      tg.node.addEventListener("pointerup", (e) => {
        if (!start) return;
        tg.node.classList.remove("is-dragging");
        const dx = e.clientX - start.x, dy = e.clientY - start.y;
        tg.node.style.translate = "";
        start = null;
        if (!moved) return; // a tap: the click handler snaps it
        ignoreClick = true;
        const c = center(), r = tg.node.getBoundingClientRect(), cr = canvas.getBoundingClientRect();
        const tx = r.left - cr.left + r.width / 2, ty = r.top - cr.top + r.height / 2;
        const before = Math.hypot(tx - dx - c.x, ty - dy - c.y), after = Math.hypot(tx - c.x, ty - c.y);
        if (after < before * 0.75) snap(tg);
      });
      tg.node.addEventListener("click", () => {
        if (ignoreClick) { ignoreClick = false; return; }
        if (st.i === 2 && !st.snapped.has(tg.k)) { snap(tg); live.textContent = `${tg.label} moved into the cluster.`; }
      });
    });

    /* ---- layout: positions per beat, in px of the canvas ---- */
    function center() {
      const W = canvas.clientWidth, H = canvas.clientHeight;
      return W < 640 ? { x: W * 0.5, y: H * 0.5 } : { x: W * 0.57, y: H * 0.52 };
    }
    function place(node, x, y, extra) { node.style.left = x + "px"; node.style.top = y + "px"; node.style.transform = "translate(-50%,-50%) " + (extra || ""); }

    function layout() {
      const W = canvas.clientWidth, H = canvas.clientHeight, b = st.i, narrow = W < 640;
      canvas.dataset.beat = String(b);
      // note
      if (b <= 1) place(note, W / 2, H * (narrow ? 0.4 : 0.42));
      else place(note, narrow ? W * 0.76 : W * 0.86, H * (narrow ? 0.2 : 0.2), `scale(${narrow ? 0.38 : 0.5})`);
      // slots around the cluster centre
      const c = center();
      const slots = tags.map((_, k) => {
        if (narrow) { const row = Math.floor(k / 2), col = k % 2; return { x: W * (col ? 0.74 : 0.26), y: H * (0.3 + row * 0.13) + (col ? H * 0.04 : 0) }; }
        const a = -Math.PI / 2 + (k * 2 * Math.PI) / tags.length;
        return { x: c.x + Math.cos(a) * W * 0.27, y: c.y + Math.sin(a) * H * 0.3 };
      });
      const noteR = note.getBoundingClientRect(), cr = canvas.getBoundingClientRect();
      tags.forEach((tg, k) => {
        const n = tg.node, sl = slots[k];
        if (tg.kind === "code") {
          // beat 0: hidden at its phrase; beat 1: lifted just below the note
          const w0 = wordBtns[toks.findIndex((x) => x.owner === tg.hi)];
          const wr = w0 ? w0.getBoundingClientRect() : noteR;
          if (b <= 1) {
            const below = b === 1 ? noteR.bottom - cr.top + 34 + tg.hi * (narrow ? 46 : 0) : wr.top - cr.top + wr.height / 2;
            const x = b === 1 && !narrow ? W / 2 + (tg.hi ? 1 : -1) * Math.min(170, W * 0.18) : (b === 1 ? W / 2 : wr.left - cr.left + wr.width / 2);
            place(n, x, below, b === 1 ? "rotate(" + (tg.hi ? 2 : -2) + "deg)" : "scale(.6)");
          } else if (b === 2) place(n, sl.x, sl.y);
          else place(n, c.x, c.y, "scale(.3)");
        } else {
          if (b < 2) place(n, sl.x + (sl.x - c.x) * 0.9, sl.y + (sl.y - c.y) * 0.9, "scale(.8)");
          else if (b === 2) {
            if (st.snapped.has(tg.k)) place(n, sl.x, sl.y);
            else {
              const hw = n.offsetWidth / 2 + 12, hh = n.offsetHeight / 2 + 12;
              const lx = clamp(sl.x + (sl.x - c.x) * (narrow ? 0.22 : 0.42), hw, W - hw), ly = clamp(sl.y + (sl.y - c.y) * (narrow ? 0.1 : 0.32), 90 + hh, H - 40 - hh);
              place(n, lx, ly, `rotate(${k % 2 ? 4 : -5}deg)`);
            }
          } else place(n, c.x, c.y, "scale(.3)");
        }
      });
      // outlier
      if (b < 2) place(outlier, W * 0.9, H * 1.1);
      else if (b === 2) place(outlier, narrow ? W * 0.5 : W * 0.14 + 40, H * (narrow ? 0.85 : 0.84), "rotate(-3deg)");
      else place(outlier, W / 2, H * (narrow ? 0.7 : 0.68));
      // reveal line, hint
      place(reveal, W / 2, Math.min(H - 30, noteR.bottom - cr.top + (narrow ? 140 : 100)));
      place(dragHint, W / 2, H * 0.97 - 10);
      drawStrings();
      // UI
      next.textContent = b >= 4 ? "Summary" : "Continue";
      next.dataset.icon = b >= 4 ? "summary" : "next";
      next.hidden = b >= 5;
      back.disabled = b <= 0;
      count.innerHTML = b < 5 ? `<span class="count__lbl">Stage</span> <b>${b + 1}</b><span class="count__of">of ${N}</span>` : `<b>Summary</b>`;
      count.style.setProperty("--prog", Math.min(1, (b + 1) / N));
      const ey = lead.querySelector(".story__eyebrow"), lt = lead.querySelector(".canvas__leadtext");
      const leads = [s.raw.lead, s.code.lead, s.cluster.lead, s.theme.lead, s.opportunity.lead, ""];
      ey.textContent = b < 5 ? `Stage ${b + 1} · ${names[b]}` : "Summary";
      lt.textContent = leads[b];
      note.querySelector(".paper__yours").hidden = !(b === 1 && st.reader.size);
      gaugeItems.forEach((g, i) => { g.li.hidden = i > st.max; g.b.toggleAttribute("aria-current", i === b); if (i === b) g.b.setAttribute("aria-current", "step"); });
      // keep hidden content out of the tab order
      [[note, b <= 1], [opp, b === 4], [recap, b === 5]].forEach(([n, on]) => n.toggleAttribute("inert", !on));
      tags.forEach((tg) => tg.node.toggleAttribute("inert", !(b === 2 && tg.kind === "cluster" && !st.snapped.has(tg.k))));
      wordBtns.forEach((w) => w.toggleAttribute("inert", b !== 0));
    }

    function drawStrings() {
      const c = center();
      const cr = canvas.getBoundingClientRect();
      let out = "";
      if (st.i === 2) {
        out += `<circle cx="${c.x}" cy="${c.y}" r="6"/>`;
        tags.forEach((tg) => {
          if (tg.kind === "cluster" && !st.snapped.has(tg.k)) return;
          const r = tg.node.getBoundingClientRect();
          out += `<line x1="${c.x}" y1="${c.y}" x2="${r.left - cr.left + r.width / 2}" y2="${r.top - cr.top + r.height / 2}" stroke-width="1.5"/>`;
        });
      }
      svg.setAttribute("viewBox", `0 0 ${canvas.clientWidth} ${canvas.clientHeight}`);
      svg.innerHTML = out;
    }
    // strings follow tags while they transition
    let rafUntil = 0;
    function animateStrings() { rafUntil = performance.now() + 1000; requestAnimationFrame(function f(now) { drawStrings(); if (now < rafUntil) requestAnimationFrame(f); }); }

    /* ---- state changes ---- */
    function segment() { return Math.max(360, stage.clientHeight * 0.85); }
    function go(i, scroll, focusTarget) {
      i = clamp(i, 0, 5);
      if (st.i === 2 && i > 2) snapAll();           // moving on snaps any loose tags
      st.i = i;
      st.max = Math.max(st.max, i === 5 ? 4 : i);
      layout(); animateStrings();
      live.textContent = i < 5 ? `Stage ${i + 1} of ${N}: ${names[i]}. ${[s.raw.lead, s.code.lead, s.cluster.lead, s.theme.lead, s.opportunity.lead][i]}` : "Summary: the full chain of five stages.";
      if (scroll) {
        st.lock = Date.now() + 900;
        const top = track.getBoundingClientRect().top + window.scrollY + (i === 5 ? 5.35 : i) * segment() + 2;
        window.scrollTo({ top, behavior: "auto" });
      }
      if (focusTarget) (i === 5 ? recap : stage).focus({ preventScroll: true });
    }

    function sync() {
      if (Date.now() < st.lock) return;
      const r = track.getBoundingClientRect();
      if (r.top > 2) { if (st.max >= 0 || r.top > window.innerHeight) return; }
      if (r.bottom < 0) return;
      if (st.max < 0 && r.top <= 2) st.max = 0;
      const i = clamp(Math.floor((-r.top + 4) / segment()), 0, 5);
      if (i !== st.i || st.max < 0) go(i, false);
      else layout();
    }
    function sizeTrack() { track.style.height = stage.clientHeight + 5.9 * segment() + "px"; layout(); }

    let tick = false;
    window.addEventListener("scroll", () => { if (tick) return; tick = true; requestAnimationFrame(() => { tick = false; sync(); }); }, { passive: true });
    window.addEventListener("resize", () => { sizeTrack(); });
    sizeTrack();
    layout();
    // gauge starts empty until the story is reached
    gaugeItems.forEach((g) => (g.li.hidden = true));
  }
})();
