/* ==========================================================================
   timeline.js: the animated, scroll-pinned project timeline.
   Content: data/timeline.js (window.SITE_DATA.timeline).
   - Vertical scroll drives horizontal progress. A thick rounded bar grows to
     the right and the track slides left so the current phase stays in view.
   - Current phase bright, earlier phases at 40%, future phases hidden.
   - After the last phase, a recap shows the whole timeline; click a heading to revisit.
   - Continue / Back, ArrowRight / ArrowLeft, Space / Enter, Esc and "Skip to summary".
   - Only transform and opacity animate (300–500 ms).
   - prefers-reduced-motion: a plain vertical list with the same text.
   ========================================================================== */
(function () {
  "use strict";
  const root = document.getElementById("timeline");
  const data = (window.SITE_DATA || {}).timeline;
  if (!root || !data) return;
  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const items = (data.items || []).filter((i) => i && (i.when || i.what));
  if (!items.length) return;
  const N = items.length;

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  function el(tag, attrs, kids) {
    const n = document.createElement(tag);
    for (const k in attrs || {}) {
      const v = attrs[k];
      if (v === null || v === undefined || v === false) continue;
      if (k === "class") n.className = v;
      else if (k === "text") n.textContent = v;
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

  const summary = document.getElementById("tl-summary");
  if (summary) { summary.textContent = data.summary || ""; summary.hidden = !data.summary; }

  const hasTesting = typeof window.testingHasData === "function" ? window.testingHasData() : false;

  /* the content of one phase, shared by the animated and the static versions */
  function phaseBody(it) {
    const kids = [el("p", { class: "tl__details", text: it.details || "" })];
    if (it.statusFromTesting) {
      kids.push(hasTesting
        ? el("p", { class: "tl__status" }, [el("span", { class: "tl__statuskey", text: "Status: " }), document.createTextNode("Results recorded. "), el("a", { class: "link-arrow", href: "#testing", text: "See the results" })])
        : el("p", { class: "tl__status" }, [el("span", { class: "tl__statuskey", text: "Status: " }), document.createTextNode("In progress")]));
    }
    if (it.links && it.links.length) kids.push(el("p", { class: "tl__links" }, it.links.map((l) => el("a", { class: "link-arrow", href: l.href, text: l.label }))));
    const text = el("div", { class: "tl__text" }, kids);
    const out = it.output && (it.output.label || it.output.image)
      ? el("figure", { class: "tl__output" }, [
          it.output.image ? el("img", { src: it.output.image, alt: it.output.alt || "", loading: "lazy" }) : null,
          el("figcaption", null, [el("span", { class: "tl__outkey", text: "Output" }), document.createTextNode(it.output.label || "")]),
        ])
      : null;
    return [text, out];
  }

  /* ---------------- reduced motion: plain vertical list ---------------- */
  if (REDUCED) {
    root.classList.add("tl--static");
    const ol = el("ol", { class: "tl__list" }, items.map((it) => el("li", { class: "tl__item" }, [
      el("p", { class: "tl__date", text: it.when }), el("h3", { class: "tl__headline", text: it.what }),
      el("div", { class: "tl__below-static" }, phaseBody(it)),
    ])));
    root.appendChild(ol);
    return;
  }

  /* ---------------- animated version (scroll-scrubbed, like the reference) ----------------
     Progress p runs continuously with the scroll: 0 … N-1 are the phases, N-1 … N blends
     into the recap, then the recap holds for a while before the page moves on.
     Everything moves with transform and opacity only:
       - the bar's length: a rounded fill slides out of a clipped rounded track;
       - the bar's colour: its gradient is stretched over the visible bar (scaleX), so the tip
         always carries the end colour, and a cool gradient cross-fades into a warm one as the
         project progresses. The colours change; they don't slide past. */
  const head = root.querySelector(".tl__head");
  const skip = skipChip("#timeline", "tl__skip");

  const track = el("div", { class: "tl__track" });
  const stage = el("div", { class: "tl__stage", tabindex: "0", role: "region", "aria-roledescription": "timeline",
    "aria-label": "Project timeline. Scroll, or use Continue and the arrow keys, to move through the phases." });
  const view = el("div", { class: "tl__view" });
  const rail = el("div", { class: "tl__rail" });
  const gradA = el("span", { class: "tl__grad tl__grad--a" });
  const gradB = el("span", { class: "tl__grad tl__grad--b" });
  const fill = el("div", { class: "tl__fill" }, [gradA, gradB]);
  const barWrap = el("div", { class: "tl__barwrap", "aria-hidden": "true" }, [fill]);
  /* faint dotted track with a stop for every phase, so the road ahead is visible but empty */
  const ghost = el("div", { class: "tl__ghost", "aria-hidden": "true" });
  const ghostStops = items.map(() => { const d = el("span", { class: "tl__stop" }); ghost.appendChild(d); return d; });
  rail.append(ghost, barWrap);

  const phases = items.map((it, i) => {
    const btn = el("button", { type: "button", class: "tl__heading", "aria-label": `Phase ${i + 1} of ${N}: ${it.when}, ${it.what}` }, [
      el("span", { class: "tl__date", text: it.when }), el("span", { class: "tl__headline", text: it.what })]);
    btn.addEventListener("click", () => go(i));
    const above = el("div", { class: "tl__above" }, [btn]);
    const drop = el("span", { class: "tl__drop", "aria-hidden": "true" });
    const below = el("div", { class: "tl__below" }, phaseBody(it));
    const node = el("div", { class: "tl__phase" }, [above, drop, below]);
    rail.appendChild(node);
    return { node, above, drop, below, btn };
  });

  /* list recap for narrow screens */
  const recapList = el("div", { class: "tl__recap" }, [
    el("h3", { text: "The whole project" }),
    el("p", { class: "recap__hint", text: "Select a phase to revisit it." }),
    el("ol", null, items.map((it, i) => {
      const b = el("button", { type: "button", class: "tl__recapitem" }, [el("span", { class: "tl__date", text: it.when }), el("span", { class: "tl__headline", text: it.what })]);
      b.addEventListener("click", () => go(i));
      return el("li", null, [b]);
    })),
  ]);
  const recapHint = el("p", { class: "tl__recaphint", text: "The whole project. Select a phase heading to revisit it." });
  head.classList.add("tl__head--stage");
  view.append(rail, recapList, recapHint, head, skip);

  const back = el("button", { type: "button", class: "story__btn story__btn--ghost", "data-icon": "back", "aria-label": "Back", text: "Back" });
  const next = el("button", { type: "button", class: "story__btn", "data-icon": "next", text: "Continue" });
  const replay = el("button", { type: "button", class: "story__btn story__btn--ghost", "data-icon": "replay", "aria-label": "Replay", text: "Replay", hidden: true });
  const onward = el("button", { type: "button", class: "story__btn", "data-icon": "down", text: "Continue reading", hidden: true });
  const count = el("span", { class: "story__count tl__count" });
  const live = el("p", { class: "visually-hidden", "aria-live": "polite" });
  stage.append(view, el("div", { class: "story__controls tl__controls" }, [back, count, replay, next, onward]), live);
  track.appendChild(stage);
  root.appendChild(track);

  const st = { p: 0, cur: -1, geo: null };
  const HOLD = 0.9; // extra scroll (in segments) during which the recap stays on screen

  back.addEventListener("click", () => go(st.cur >= N ? N - 1 : st.cur - 1));
  next.addEventListener("click", () => go(st.cur + 1));
  replay.addEventListener("click", () => go(0));
  onward.addEventListener("click", () => {
    const after = track.getBoundingClientRect().bottom + window.scrollY;
    window.scrollTo({ top: after, behavior: behavior() });
    const nextSection = root.nextElementSibling;
    if (nextSection) { nextSection.setAttribute("tabindex", "-1"); nextSection.focus({ preventScroll: true }); }
  });
  skip.addEventListener("click", (e) => { e.preventDefault(); go(N); stage.focus({ preventScroll: true }); });
  stage.addEventListener("keydown", (e) => {
    const t = e.target, onStage = t === stage, onCtl = t === next || t === back;
    if (e.key === "Escape") { e.preventDefault(); go(N); return; }
    if (!(onStage || onCtl)) return;
    if (e.key === "ArrowRight" || (onStage && (e.key === " " || e.key === "Enter"))) { e.preventDefault(); if (st.cur < N) go(st.cur + 1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); go(st.cur >= N ? N - 1 : st.cur - 1); }
  });

  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = (t) => t * t * (3 - 2 * t);
  const behavior = () => (window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth");

  function geometry() {
    const W = view.clientWidth, H = view.clientHeight;
    const narrow = W < 760;
    const phaseW = narrow ? W - 40 : W < 1100 ? W * 0.62 : Math.min(640, W * 0.44);
    const gap = narrow ? 24 : 64;
    const step = phaseW + gap;
    const barH = narrow ? 26 : 44;
    const headBottom = head.offsetTop + head.offsetHeight;
    const barY = Math.round(Math.max(headBottom + (narrow ? 110 : 140), H * (narrow ? 0.3 : 0.44)));
    const belowTop = barY + barH + (narrow ? 34 : 60);
    const anchor = narrow ? 20 : Math.max(48, Math.min(W * 0.14, (W - 1180) / 2 + 24));
    const xs = items.map((_, i) => i * step);
    const last = xs[N - 1];
    const reach0 = narrow ? 90 : 170;                                  // short pill at the start
    const reach1 = narrow ? phaseW * 0.72 : Math.min(phaseW * 0.85, 540); // how far ahead of the current phase the tip runs at the end
    const Lmax = last + phaseW + 40;
    const recapScale = Math.min(1, (W - 96) / (last + phaseW));
    const useList = narrow || recapScale < 0.42;
    return { W, H, narrow, phaseW, gap, step, barH, barY, belowTop, anchor, xs, last, reach0, reach1, Lmax, recapScale, useList };
  }

  function layout() {
    // header sits inside the pinned stage, aligned with the timeline
    const W0 = view.clientWidth, n0 = W0 < 760;
    head.style.left = (n0 ? 20 : Math.max(48, Math.min(W0 * 0.14, (W0 - 1180) / 2 + 24))) + "px";
    const g = (st.geo = geometry());
    Object.assign(ghost.style, { top: g.barY + g.barH / 2 - 1 + "px", width: g.Lmax + "px" });
    ghostStops.forEach((d, i) => { d.style.left = g.xs[i] + "px"; });
    recapList.style.top = head.offsetTop + head.offsetHeight + 20 + "px";
    root.classList.toggle("use-list", g.useList);
    Object.assign(barWrap.style, { left: "0px", top: g.barY + "px", width: g.Lmax + "px", height: g.barH + "px", borderRadius: g.barH / 2 + "px" });
    fill.style.borderRadius = g.barH / 2 + "px";
    [gradA, gradB].forEach((gr) => { gr.style.width = g.Lmax + "px"; });
    rail.style.transformOrigin = `0 ${g.barY + g.barH / 2}px`;
    phases.forEach((ph, i) => {
      Object.assign(ph.node.style, { left: g.xs[i] + "px", width: g.phaseW + "px" });
      ph.above.style.bottom = `calc(100% - ${g.barY - 14}px)`;
      Object.assign(ph.drop.style, { top: g.barY + g.barH / 2 + "px", height: g.belowTop - g.barY - g.barH / 2 - 8 + "px" });
      ph.below.style.top = g.belowTop + "px";
    });
    render();
  }

  /* draw the frame for progress st.p */
  function render() {
    const g = st.geo, p = st.p;
    const pp = Math.min(p, N - 1);                  // phase progress
    const frac = N > 1 ? pp / (N - 1) : 1;
    const t = ease(clamp(p - (N - 1), 0, 1));       // 0 = phases, 1 = recap

    // bar length (rail coordinates) and track position
    const Lphase = lerp(g.reach0, g.reach1, frac) + pp * g.step;
    const Lrecap = g.last + g.phaseW * 0.85;
    const L = lerp(Lphase, Lrecap, t);
    const tx = lerp(g.anchor - pp * g.step, g.useList ? g.anchor - pp * g.step : 48, t);
    const sc = g.useList ? 1 : lerp(1, g.recapScale, t);
    rail.style.transform = `translateX(${tx.toFixed(1)}px) scale(${sc.toFixed(4)})`;
    rail.style.opacity = g.useList ? (1 - clamp(t * 2, 0, 1)).toFixed(3) : "1";

    // length: the rounded fill slides out of the clipped track; colour: gradient stretched over 0…L
    fill.style.transform = `translateX(${(L - g.Lmax).toFixed(1)}px)`;
    const k = Math.max(0.001, L / g.Lmax);
    const gt = `translateX(${(g.Lmax - L).toFixed(1)}px) scaleX(${k.toFixed(5)})`;
    gradA.style.transform = gt; gradB.style.transform = gt;
    gradB.style.opacity = Math.max(frac, t).toFixed(3);

    // phases: appear when the bar's tip reaches them; earlier ones dim to 40%
    let cur = 0;
    phases.forEach((ph, i) => {
      const a = i === 0 ? 1 : clamp((Lphase - g.xs[i] + 10) / 140, 0, 1);
      if (a > 0.5) cur = i;
      const dim = clamp((pp - i - 0.35) / 0.3, 0, 1);
      let op = a * (1 - 0.6 * dim);
      op = lerp(op, 1, t);
      ph.node.style.opacity = op.toFixed(3);
      ph.node.style.transform = `translateY(${((1 - a) * 14).toFixed(1)}px)`;
      ph.below.style.opacity = (1 - t).toFixed(3);
      ph.btn.style.transform = `scale(${lerp(1, g.useList ? 1 : 1.45, t).toFixed(3)})`;
      ph.node.toggleAttribute("inert", a < 0.5 || (t > 0.5 && g.useList));
      ph.below.toggleAttribute("inert", t > 0.5);
    });
    recapList.style.opacity = g.useList ? clamp(t * 2 - 1, 0, 1).toFixed(3) : "0";
    recapHint.style.opacity = g.useList ? "0" : t.toFixed(3);
    const recap = t > 0.5;
    recapList.toggleAttribute("inert", !(recap && g.useList));
    root.classList.toggle("is-recap", recap);
    if (recap) cur = N;

    if (cur !== st.cur) {
      const first = st.cur === -1;
      st.cur = cur;
      back.disabled = cur <= 0;
      next.hidden = cur >= N; replay.hidden = cur < N; onward.hidden = cur < N;
      next.textContent = cur === N - 1 ? "Summary" : "Continue";
      next.dataset.icon = cur === N - 1 ? "summary" : "next";
      count.innerHTML = cur >= N ? "<b>Summary</b>" : `<span class="count__lbl">Phase</span> <b>${cur + 1}</b><span class="count__of">of ${N}</span>`;
      count.style.setProperty("--prog", Math.min(1, (cur + 1) / N));
      if (!first) live.textContent = cur < N ? `Phase ${cur + 1} of ${N}: ${items[cur].when}, ${items[cur].what}.` : "Summary: the whole timeline. Select a phase heading to revisit it.";
    }
  }

  function segment() { return Math.max(360, stage.clientHeight * 0.9); }
  function trackTop() { return track.getBoundingClientRect().top + window.scrollY; }
  /* scroll position for a phase (i = N is the recap, landing inside the hold so it never overshoots) */
  function go(i) {
    i = clamp(i, 0, N);
    const target = trackTop() + (i < N ? i : N + HOLD * 0.4) * segment() + 1;
    window.scrollTo({ top: target, behavior: behavior() });
    stage.focus({ preventScroll: true });
  }
  function sync() {
    const r = track.getBoundingClientRect();
    if (r.bottom < -50 || r.top > window.innerHeight + 50) return;
    const p = clamp(-r.top / segment(), 0, N);
    if (Math.abs(p - st.p) < 0.0005 && st.cur !== -1) return;
    st.p = p;
    render();
  }
  function sizeTrack() { track.style.height = stage.clientHeight + (N + HOLD) * segment() + "px"; layout(); sync(); }

  let tick = false;
  window.addEventListener("scroll", () => { if (tick) return; tick = true; requestAnimationFrame(() => { tick = false; sync(); }); }, { passive: true });
  window.addEventListener("resize", sizeTrack);
  sizeTrack();
  render();
})();
