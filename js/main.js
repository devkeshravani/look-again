/* ==========================================================================
   main.js: site title, menu, and the scroll-pinned annotated photo.
   Vanilla JS, no dependencies. Works when index.html is opened from disk.
   ========================================================================== */

/* ---- Edit these. SITE_NAME is the short name in the header, footer and browser tab
        (other options: "Take Note", "In Plain Sight"). SITE_TITLE is the hero headline. ---- */
const SITE_NAME = "Look Again";
const SITE_TITLE = "The tablets stayed. Their names didn't.";

(function () {
  "use strict";
  document.documentElement.classList.replace("no-js", "js");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const scrollBehavior = () => (reduceMotion.matches ? "auto" : "smooth");

  /* ---------- title ---------- */
  document.querySelectorAll("[data-site-title]").forEach((n) => { n.textContent = SITE_TITLE; });
  document.querySelectorAll("[data-site-name]").forEach((n) => { n.textContent = SITE_NAME; });
  document.title = SITE_NAME + " · " + SITE_TITLE;

  /* The navbar, section highlight and mobile menu live in js/chrome.js. */

  /* ==========================================================================
     SCROLL-PINNED ANNOTATED PHOTO
     Per scene, separate files stack over the base image (never swapped mid-scene):
       dim-layer.svg      whole-image dimming
       outline-N.svg      thin red outline around region N
       marker-N.svg       numbered red marker
       separation-line.svg  red dotted line (always visible when placed)
     Region N is brought back to full brightness by a rounded "window" that shows
     the same base file, aligned exactly, above the dim layer.
     ========================================================================== */

  function el(tag, attrs, kids) {
    const n = document.createElement(tag);
    for (const k in attrs || {}) {
      const v = attrs[k];
      if (v === null || v === undefined) continue;
      if (k === "class") n.className = v;
      else if (k === "text") n.textContent = v;
      else if (k === "style") n.style.cssText = v;
      else n.setAttribute(k, v);
    }
    (kids || []).forEach((c) => c && n.appendChild(c));
    return n;
  }
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  function initScrolly(root, index) {
    const scenes = (window.LAYER_SETS || {})[root.dataset.layerSet];
    if (!scenes || !scenes.length) return;
    const uid = root.id || "scrolly" + index;
    const caption = root.dataset.caption || "";
    const closing = root.dataset.closing || "";
    root.querySelectorAll("noscript").forEach((n) => n.remove());

    const st = { scene: 0, step: 0, showAll: false, steps: [], parts: {}, ar: 4 / 3, lock: 0 };

    /* ---- static shell ---- */
    const chrome = el("div", { class: "scrolly__chrome" });
    const stage = el("div", { class: "scrolly__stage" });
    const blur = el("div", { class: "scrolly__blur", "aria-hidden": "true" });
    const frame = el("div", { class: "scrolly__frame" });
    stage.append(blur, frame);

    let tabs = [];
    if (scenes.length > 1) {
      const tl = el("div", { class: "scrolly__top", role: "tablist", "aria-label": root.dataset.tabsLabel || "Scenes" });
      tabs = scenes.map((s, i) => {
        const t = el("button", { type: "button", class: "s-tab", role: "tab", id: `${uid}-tab-${i}`, "aria-controls": `${uid}-steps`,
          "aria-selected": String(i === 0), tabindex: i === 0 ? "0" : "-1", title: s.tabLong || s.tab,
          text: scenes.length > 3 ? null : (s.tabLong || s.tab) });
        if (scenes.length > 3) { t.append(el("span", { class: "s-tab__long", text: "Layout " }), document.createTextNode(s.tab)); }
        else if ((s.tabLong || "").includes(": ")) { const [pre, name] = s.tabLong.split(": "); t.textContent = ""; t.append(el("span", { class: "s-tab__long", text: pre + ": " }), document.createTextNode(name)); }
        t.addEventListener("click", () => selectScene(i));
        t.addEventListener("keydown", (e) => {
          const m = { ArrowRight: (i + 1) % scenes.length, ArrowLeft: (i - 1 + scenes.length) % scenes.length, Home: 0, End: scenes.length - 1 };
          if (e.key in m) { e.preventDefault(); selectScene(m[e.key]); tabs[m[e.key]].focus(); }
        });
        tl.appendChild(t);
        return t;
      });
      chrome.appendChild(tl);
    }

    const stepList = el("ul", { class: "s-steps", role: "group", "aria-label": "Steps" });
    const toggleAll = el("button", { type: "button", class: "s-toggle", "aria-pressed": "false" },
      [el("span", { class: "s-toggle__box", "aria-hidden": "true" }), el("span", { text: "Show all layers" })]);
    toggleAll.addEventListener("click", () => {
      st.showAll = !st.showAll;
      toggleAll.setAttribute("aria-pressed", String(st.showAll));
      apply();
    });
    const dockNow = el("p", { class: "dock__now" }, [el("span", { class: "dock__k" }), el("span", { class: "dock__t" })]);
    const dock = el("div", { class: "scrolly__controls dock" }, [
      el("div", { class: "dock__top" }, [dockNow, toggleAll]),
      stepList,
      caption ? el("p", { class: "dock__cap", text: caption }) : null,
    ]);
    chrome.appendChild(dock);

    const live = el("p", { class: "visually-hidden", "aria-live": "polite" });
    stage.appendChild(live);

    const stepsWrap = el("div", { class: "scrolly__steps", id: `${uid}-steps`, role: scenes.length > 1 ? "tabpanel" : null,
      "aria-labelledby": scenes.length > 1 ? `${uid}-tab-0` : null });
    root.append(chrome, stage, stepsWrap);

    let fig = null;
    let cards = [];
    let btns = [];

    function stepsFor(scene) {
      const out = [{ kind: "intro", title: scene.intro.title, text: scene.intro.text }];
      scene.regions.forEach((r) => { if (r.box) out.push({ kind: "region", region: r, title: r.title, text: r.text }); });
      if (closing) out.push({ kind: "outro", title: "", text: closing });
      return out;
    }

    function buildFigure(scene) {
      const dir = "images/layers/" + scene.id + "/";
      const f = el("figure", { class: "scrolly__fig" });
      const base = el("img", { class: "scrolly__base", src: scene.base, alt: scene.alt });
      f.appendChild(base);
      f.appendChild(el("img", { class: "L L-dim", src: dir + "dim-layer.svg", alt: "", "aria-hidden": "true" }));
      const parts = {};
      scene.regions.forEach((r) => {
        if (!r.box) return;
        const b = r.box;
        const win = el("div", { class: "L-win", "aria-hidden": "true",
          style: `left:${b.x}%;top:${b.y}%;width:${b.w}%;height:${b.h}%;` +
            `background-image:url("${scene.base}");` +
            `background-size:${(10000 / b.w).toFixed(3)}% ${(10000 / b.h).toFixed(3)}%;` +
            `background-position:${b.w >= 100 ? 0 : ((b.x / (100 - b.w)) * 100).toFixed(3)}% ${b.h >= 100 ? 0 : ((b.y / (100 - b.h)) * 100).toFixed(3)}%` },
          [el("img", { class: "L L-outline", src: dir + "outline-" + r.id + ".svg", alt: "" })]);
        const marker = el("img", { class: "L L-marker", src: dir + "marker-" + r.id + ".svg", alt: "", "aria-hidden": "true",
          style: `left:${Math.min(b.x + b.w, 97.5)}%;top:${Math.max(b.y, 2.5)}%` });
        f.append(win, marker);
        parts[r.id] = { win, marker, box: b };
      });
      (scene.separations || []).forEach((x, i) => {
        f.appendChild(el("img", { class: "L L-sep", src: dir + "separation-line.svg", alt: "", "aria-hidden": "true", style: `left:${x}%` }));
        if (i === 0 && scene.separationNote) {
          const flip = x > 55;
          f.appendChild(el("span", { class: "sep-label" + (flip ? " sep-label--flip" : ""), style: `left:${x}%` },
            [document.createTextNode(scene.separationLabel + (flip ? " →" : " ←")), el("small", { text: scene.separationNote })]));
        }
      });
      const note = el("p", { class: "stage-note", hidden: "" });
      f.appendChild(note);
      base.addEventListener("load", () => {
        if (base.naturalWidth) { st.ar = base.naturalWidth / base.naturalHeight; layout(); }
      });
      st.ar = scene.aspect ? scene.aspect[0] / scene.aspect[1] : st.ar;
      blur.style.backgroundImage = `url("${scene.base}")`;
      return { f, parts, note };
    }

    /* contain-fit the figure in the stage */
    function fitSize() {
      const W = stage.clientWidth, H = stage.clientHeight;
      let fw = W, fh = W / st.ar;
      if (fh > H) { fh = H; fw = H * st.ar; }
      return { W, H, fw, fh };
    }
    function layout() {
      if (!fig) return;
      const { fw, fh } = fitSize();
      fig.f.style.width = fw + "px";
      fig.f.style.height = fh + "px";
      fig.f.querySelector(".scrolly__base").style.cssText = `width:${fw}px;height:${fh}px`;
      apply(true);
    }

    function transformFor(step) {
      const { W, H, fw, fh } = fitSize();
      const desktop = W >= 1024;
      if (st.showAll) return "scale(.92)";
      if (!step || step.kind !== "region" || !step.region.box) {
        // spec: full photo; fills the viewport at desktop, fits the width at tablet/mobile
        const cover = Math.max(W / fw, H / fh);
        // spec: fill the viewport like the reference, but only when that crops little (photo ratio near the screen's)
        return desktop && cover <= 1.25 ? `scale(${cover.toFixed(4)})` : "scale(1)";
      }
      // spec: the first highlight zooms OUT (whole photo dimmed, one window bright);
      // later highlights zoom IN (~1.3x) and pan toward their area.
      const firstRegion = st.steps.findIndex((x) => x.kind === "region" && x.region.box);
      if (st.steps.indexOf(step) === firstRegion) return "scale(.92)";
      const b = step.region.box;
      const bw = (b.w / 100) * fw, bh = (b.h / 100) * fh;
      const s = clamp(Math.min((0.5 * W) / bw, (0.5 * H) / bh), 0.92, 1.3);
      if (s <= 1) return `scale(${s.toFixed(3)})`;          // spec step 2: zoom out, centered
      const cx = (b.x + b.w / 2) / 100 - 0.5, cy = (b.y + b.h / 2) / 100 - 0.5;
      const limX = Math.max(0, (fw * s - W) / 2), limY = Math.max(0, (fh * s - H) / 2);
      const tx = clamp(-cx * fw * s, -limX, limX), ty = clamp(-cy * fh * s, -limY, limY);
      return `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) scale(${s.toFixed(3)})`;   // spec step 3: zoom in + pan
    }

    function apply(noAnnounce) {
      if (!fig) return;
      const step = st.steps[st.step];
      const activeId = step && step.kind === "region" && step.region.box ? step.region.id : null;
      Object.keys(fig.parts).forEach((id) => {
        const on = st.showAll || String(id) === String(activeId);
        fig.parts[id].win.classList.toggle("on", on);
        fig.parts[id].marker.classList.toggle("on", on);
      });
      const anyOn = st.showAll ? Object.keys(fig.parts).length > 0 : !!activeId;
      fig.f.querySelector(".L-dim").classList.toggle("on", anyOn);
      stage.classList.toggle("is-dim", anyOn);
      fig.f.style.transform = transformFor(step);

      const scene = scenes[st.scene];
      fig.note.hidden = true;

      btns.forEach((b, i) => {
        if (i === st.step) b.setAttribute("aria-current", "step"); else b.removeAttribute("aria-current");
        b.parentElement.classList.toggle("is-done", !st.showAll && i < st.step);
        b.parentElement.classList.toggle("is-all", st.showAll && step && i > 0 && st.steps[i].kind === "region");
      });
      stepList.style.setProperty("--prog", st.steps.length > 1 ? (st.showAll ? 1 : st.step / (st.steps.length - 1)) : 0);
      dockNow.firstChild.textContent = st.showAll ? "All layers" : step.kind === "intro" ? "Start" : step.kind === "outro" ? "End" : `Layer ${step.region.id}`;
      dockNow.lastChild.textContent = st.showAll ? "Every placed area at once" : (step.title || "Summary");
      if (!noAnnounce) live.textContent = st.showAll ? "All layers shown" : `Step ${st.step + 1} of ${st.steps.length}: ${step.title || "Summary"}`;
    }

    function goTo(i, scroll) {
      st.step = i;
      if (st.showAll) { st.showAll = false; toggleAll.setAttribute("aria-pressed", "false"); }
      apply();
      if (scroll && cards[i]) {
        st.lock = Date.now() + 1200;
        setTimeout(sync, 1250);
        const r = cards[i].getBoundingClientRect();
        const target = window.scrollY + r.top + r.height / 2 - window.innerHeight / 2;
        window.scrollTo({ top: Math.max(0, target), behavior: scrollBehavior() });
      }
    }

    function render() {
      const scene = scenes[st.scene];
      st.steps = stepsFor(scene);
      if (fig) fig.f.remove();
      fig = buildFigure(scene);
      frame.appendChild(fig.f);

      /* step buttons */
      stepList.innerHTML = "";
      btns = st.steps.map((s, i) => {
        const label = s.kind === "intro" ? "Start" : s.kind === "outro" ? "End" : String(s.region.id);
        const b = el("button", { type: "button", class: "s-btn" + (s.kind !== "region" ? " s-btn--wide" : "") + (s.kind === "region" && !s.region.box ? " s-btn--unplaced" : ""),
          "aria-label": `Step ${i + 1} of ${st.steps.length}: ${s.title || "Summary"}${s.kind === "region" && !s.region.box ? " (not placed yet)" : ""}`, text: label });
        b.addEventListener("click", () => goTo(i, true));
        b.addEventListener("keydown", (e) => {
          const m = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: st.steps.length - 1 };
          if (e.key in m) { e.preventDefault(); const n = clamp(m[e.key], 0, st.steps.length - 1); goTo(n, true); btns[n].focus(); }
        });
        stepList.appendChild(el("li", null, [b]));
        return b;
      });

      /* cards */
      stepsWrap.innerHTML = "";
      cards = st.steps.map((s, i) => {
        const kids = [];
        if (s.kind === "region") kids.push(el("span", { class: "s-card__eyebrow", text: `Layer ${s.region.id}` }));
        else if (s.kind === "intro") kids.push(el("span", { class: "s-card__eyebrow", text: scene.tabLong || scene.tab }));
        if (s.title && s.kind !== "outro") kids.push(el("h3", { text: s.title }));
        kids.push(el("p", { text: s.text }));
        const card = el("div", { class: "s-card" }, kids);
        stepsWrap.appendChild(el("div", { class: "s-step", "data-i": String(i) }, [card]));
        return card;
      });

      st.step = 0;
      sync();
      layout();
    }

    /* scroll activation: the card nearest the middle of the screen sets the step */
    function sync() {
      if (Date.now() < st.lock || !cards.length) return;
      const r0 = root.getBoundingClientRect();
      if (r0.bottom < 0 || r0.top > window.innerHeight) return;
      const mid = window.innerHeight / 2;
      let best = -1, bestD = Infinity;
      cards.forEach((c, i) => {
        const r = c.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        const d = Math.abs(r.top + r.height / 2 - mid);
        if (d < bestD) { bestD = d; best = i; }
      });
      if (best < 0) best = r0.top > 0 ? 0 : cards.length - 1;
      if (best !== st.step) {
        st.step = best;
        if (st.showAll) { st.showAll = false; toggleAll.setAttribute("aria-pressed", "false"); }
        apply();
      }
    }
    let ticking = false;
    window.addEventListener("scroll", () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { ticking = false; sync(); });
    }, { passive: true });

    function selectScene(i) {
      if (i === st.scene) return;
      st.scene = i; st.showAll = false; toggleAll.setAttribute("aria-pressed", "false");
      tabs.forEach((t, j) => { t.setAttribute("aria-selected", String(j === i)); t.tabIndex = j === i ? 0 : -1; });
      stepsWrap.setAttribute("aria-labelledby", `${uid}-tab-${i}`);
      const top = root.getBoundingClientRect().top + window.scrollY;
      render();
      if (window.scrollY > top) window.scrollTo({ top, behavior: "auto" });
    }

    window.addEventListener("resize", layout);
    render();
  }

  document.querySelectorAll(".scrolly[data-layer-set]").forEach(initScrolly);
})();
