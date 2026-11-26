/* ==========================================================================
   glassband.js: ribbed (fluted) glass backgrounds for the hero and
   "At a glance".

   Each section has a full-size background: soft palette colours on white,
   seen through broad vertical glass ribs. Big words in a very light honey
   bronze loop sideways behind the glass, each inside its own empty band so
   they never touch the text: "Which one is which?" under the hero text,
   fading out at the hero's bottom edge, and "Name · Strength · Expiry" in a
   band at the bottom of At a glance, fading in at its top edge.

   - Words, speed and direction come from data/marquee.js ("hero", "glance").
   - Scrolling pushes the words along faster (backwards when scrolling up),
     then they ease back to their normal speed.
   - Only the strip with the words is redrawn each frame; the rest of the
     glass is drawn once, so it stays light on phones.
   - Pauses when off screen or when the tab is hidden.
   - Reduced motion: one still frame.
   - Decorative only: aria-hidden, ignores the pointer.
   ========================================================================== */
(function () {
  "use strict";
  const hosts = [...document.querySelectorAll("[data-glass]")];
  if (!hosts.length) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const WORDS = ((window.SITE_DATA || {}).marquee) || {};

  /* palette from the CSS variables, so the glass follows any palette edit */
  const css = getComputedStyle(document.documentElement);
  const hex = (name, fb) => {
    const m = /^#([0-9a-f]{6})$/i.exec(css.getPropertyValue(name).trim());
    const h = m ? m[1] : fb;
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  };
  const C = {
    ink: hex("--ink", "1F2B24"), blue: hex("--blue", "7293FD"), cyan: hex("--cyan", "9CF6F6"),
    honey: hex("--honey", "FFC164"), coral: hex("--coral", "F56960"), lime: hex("--lime", "C2CE40"),
    magenta: hex("--magenta", "A946FF"), tangerine: hex("--tangerine", "FF7C36"),
  };
  const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
  /* resolve a colour variable that may be a color-mix(), e.g. --honey-bronze */
  function resolve(name, fb) {
    const probe = document.createElement("span");
    probe.style.cssText = `position:absolute;visibility:hidden;color:var(${name})`;
    document.body.appendChild(probe);
    const v = getComputedStyle(probe).color; probe.remove();
    let m = /rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/.exec(v);
    if (m) return [+m[1], +m[2], +m[3]].map(Math.round);
    m = /color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)/.exec(v);
    if (m) return [+m[1], +m[2], +m[3]].map((x) => Math.round(x * 255));
    return fb;
  }
  /* honey, slightly darker and warmer: the colour of both loops */
  const BRONZE = resolve("--honey-bronze", [179, 125, 64]);
  const WORD_ALPHA = 0.1;

  /* colour fields per section: [colour, alpha, x, y, radius] in fractions of
     the section (radius as a fraction of its width). Mostly white in the middle. */
  const LOOKS = {
    hero: {
      fields: [[C.coral, 0.42, 0.0, 0.25, 0.55], [C.lime, 0.36, 0.05, 1.0, 0.45], [C.blue, 0.44, 1.02, 0.45, 0.5],
               [C.cyan, 0.5, 0.8, 0.0, 0.35], [C.honey, 0.3, 0.42, 1.05, 0.3]],
      edge: 0.16, wordsSize: (W) => Math.min(W * (W < 600 ? 0.2 : 0.16), 300),
      below: 0.08,      // room under the baseline ("Which one is which?" has no descenders)
      fade: "bottom",   // fade out toward the hero's bottom edge
      seam: "bottom",   // whiten the bottom edge so it meets At a glance softly
    },
    glance: {
      fields: [[C.honey, 0.34, 0.02, 0.0, 0.5], [C.cyan, 0.45, 1.0, 0.12, 0.45], [C.magenta, 0.16, 0.95, 0.75, 0.45],
               [C.lime, 0.28, 0.0, 0.85, 0.45], [C.blue, 0.24, 0.6, 1.02, 0.4]],
      edge: 0.11, wordsSize: (W) => Math.min(W * 0.13, 230),
      below: 0.26,      // room for the descenders in "Strength" and "Expiry"
      fade: "top",      // the band's top edge fades into the background
      seam: "top",
    },
  };

  function Glass(host) {
    const key = host.dataset.glass;
    const look = LOOKS[key] || LOOKS.hero;
    const cfg = WORDS[key] || {};
    const words = String(cfg.text || "").trim();
    const run = words ? words + (cfg.separator || "  ·  ") : "";
    const secs = Math.max(8, Number(cfg.secondsPerLoop) || 40);
    const dir = cfg.direction === "right" ? 1 : -1;
    const section = host.parentElement;
    const anchorSel = host.dataset.wordsAnchor || "top";

    const canvas = host.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    const base = document.createElement("canvas"), bc = base.getContext("2d");
    const scene = document.createElement("canvas"), sc = scene.getContext("2d");
    const soft = document.createElement("canvas"), so = soft.getContext("2d");
    const tile = document.createElement("canvas"), tc = tile.getContext("2d");
    let W = 0, H = 0, dpr = 1, ribPx = 24, fontPx = 100, runW = 1, shade = null;
    let stripTop = 0, stripH = 0, baseline = 0, capTop = 0, fadeEnd = 0; // in canvas pixels
    let offset = 0, boost = 0, lastT = 0, lastY = window.scrollY, raf = 0, visible = true;
    const K = 8; // soft copy is 1/K of the size

    function size() {
      const r = section.getBoundingClientRect();
      W = Math.max(1, Math.round(r.width)); H = Math.max(1, Math.round(r.height));
      /* keep the canvas to about 4 million pixels: it's soft glass, so this is plenty sharp */
      dpr = Math.max(0.75, Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(4e6 / (W * H))));
      const Wp = Math.round(W * dpr), Hp = Math.round(H * dpr);
      for (const c of [canvas, base, scene]) { c.width = Wp; c.height = Hp; }
      soft.width = Math.max(1, Math.ceil(Wp / K)); soft.height = Math.max(1, Math.ceil(Hp / K));
      /* broad ribs: three times the earlier width */
      ribPx = Math.max(30, Math.round(Math.min(90, Math.max(42, W / 16)) * dpr));

      /* the words live inside their own empty band (the anchor), so they never touch the text */
      const a = section.querySelector(anchorSel);
      const ar = a ? a.getBoundingClientRect() : { top: r.bottom - 200, bottom: r.bottom, height: 200 };
      const bandTop = ar.top - r.top, bandBot = ar.bottom - r.top, bandH = Math.max(1, ar.height);
      const CAP = 0.76; // ascender height of DM Sans, as a share of the font size
      fontPx = Math.max(24, Math.min(look.wordsSize(W, H), bandH / (CAP + look.below)));
      const baseCss = bandBot - fontPx * look.below;
      baseline = baseCss * dpr;
      capTop = (baseCss - fontPx * CAP) * dpr;
      fadeEnd = bandBot * dpr;
      stripTop = Math.max(0, Math.floor(Math.min(capTop, bandTop * dpr)) - 2);
      stripH = Math.min(Hp - stripTop, Math.ceil(fadeEnd - stripTop) + 2);
      sc.font = bc.font = `500 ${fontPx * dpr}px "DM Sans", system-ui, sans-serif`;
      runW = run ? Math.max(1, sc.measureText(run).width) : 1;
      buildShade();
      paintBase();
    }

    function buildShade() {
      tile.width = ribPx; tile.height = 1;
      const g = tc.createLinearGradient(0, 0, ribPx, 0);
      g.addColorStop(0, "rgba(255,255,255,0.95)");
      g.addColorStop(0.08, "rgba(255,255,255,0.45)");
      g.addColorStop(0.4, "rgba(255,255,255,0)");
      g.addColorStop(0.6, rgba(C.ink, 0));
      g.addColorStop(0.94, rgba(C.ink, look.edge * 0.55));
      g.addColorStop(1, rgba(C.ink, look.edge));
      tc.clearRect(0, 0, ribPx, 1);
      tc.fillStyle = g; tc.fillRect(0, 0, ribPx, 1);
      shade = ctx.createPattern(tile, "repeat");
    }

    /* the colours behind the glass: drawn once per resize */
    function paintBase() {
      const Wp = base.width, Hp = base.height;
      bc.setTransform(1, 0, 0, 1, 0, 0);
      bc.fillStyle = "#fff"; bc.fillRect(0, 0, Wp, Hp);
      for (const [c, a, x, y, rr] of look.fields) {
        const R = rr * Wp;
        const g = bc.createRadialGradient(x * Wp, y * Hp, 0, x * Wp, y * Hp, R);
        g.addColorStop(0, rgba(c, a)); g.addColorStop(0.55, rgba(c, a * 0.45)); g.addColorStop(1, rgba(c, 0));
        bc.fillStyle = g; bc.fillRect(0, 0, Wp, Hp);
      }
      /* a white haze through the middle, so the centre stays mostly white */
      const g = bc.createLinearGradient(0, 0, Wp, 0);
      g.addColorStop(0.3, "rgba(255,255,255,0)"); g.addColorStop(0.55, "rgba(255,255,255,0.55)"); g.addColorStop(0.8, "rgba(255,255,255,0)");
      bc.fillStyle = g; bc.fillRect(0, 0, Wp, Hp);
      /* whiten the edge where the hero meets At a glance, so there's no hard line */
      const seamH = Math.min(Hp * 0.18, 160 * dpr);
      const sg = look.seam === "bottom" ? bc.createLinearGradient(0, Hp - seamH, 0, Hp) : bc.createLinearGradient(0, seamH, 0, 0);
      sg.addColorStop(0, "rgba(255,255,255,0)"); sg.addColorStop(1, "rgba(255,255,255,0.85)");
      bc.fillStyle = sg;
      if (look.seam === "bottom") bc.fillRect(0, Hp - seamH, Wp, seamH); else bc.fillRect(0, 0, Wp, seamH);
      sc.drawImage(base, 0, 0);
      refract(0, Hp);
    }

    function drawWords() {
      if (!run) return;
      sc.drawImage(base, 0, stripTop, base.width, stripH, 0, stripTop, base.width, stripH);
      sc.save();
      sc.beginPath(); sc.rect(0, stripTop, scene.width, stripH); sc.clip();
      sc.font = `500 ${fontPx * dpr}px "DM Sans", system-ui, sans-serif`;
      sc.textBaseline = "alphabetic";
      /* very light honey bronze, fading softly instead of ending in a hard line */
      const fg = sc.createLinearGradient(0, capTop, 0, fadeEnd);
      if (look.fade === "bottom") {
        fg.addColorStop(0, rgba(BRONZE, WORD_ALPHA)); fg.addColorStop(0.55, rgba(BRONZE, WORD_ALPHA));
        fg.addColorStop(1, rgba(BRONZE, 0));
      } else {
        fg.addColorStop(0, rgba(BRONZE, 0)); fg.addColorStop(0.45, rgba(BRONZE, WORD_ALPHA));
        fg.addColorStop(1, rgba(BRONZE, WORD_ALPHA));
      }
      sc.fillStyle = fg;
      let x = ((offset * dpr % runW) + runW) % runW - runW;
      for (; x < scene.width; x += runW) sc.fillText(run, x, baseline);
      sc.restore();
    }

    /* glass pass for rows y0..y0+h: each rib magnifies the slice behind it and smears toward its right edge */
    function refract(y0, h) {
      const Wp = canvas.width;
      const ky = soft.height / scene.height, kx = soft.width / Wp;
      const sy0 = Math.floor(y0 * ky), sh = Math.max(1, Math.ceil(h * ky) + 1);
      so.imageSmoothingEnabled = true;
      so.drawImage(scene, 0, sy0 / ky, Wp, sh / ky, 0, sy0, soft.width, sh);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.imageSmoothingEnabled = true;
      for (let x0 = 0; x0 < Wp; x0 += ribPx) {
        const w = Math.min(ribPx, Wp - x0);
        const srcW = Math.max(1, w * 0.6), srcX = Math.min(Wp - srcW, x0 + w * 0.14);
        ctx.globalAlpha = 1;
        ctx.drawImage(scene, srcX, y0, srcW, h, x0, y0, w, h);
        for (const [f, a] of [[0.48, 0.25], [0.62, 0.45], [0.76, 0.65], [0.88, 0.85]]) {
          const dx = x0 + w * f, dw = x0 + w - dx;
          if (dw < 1) continue;
          ctx.globalAlpha = a;
          ctx.drawImage(soft, (x0 + w * 0.72) * kx, y0 * ky, Math.max(0.5, w * 0.28 * kx), h * ky, dx, y0, dw, h);
        }
      }
      ctx.globalAlpha = 1;
      ctx.fillStyle = shade; ctx.fillRect(0, y0, Wp, h);
    }

    function paintWords() { if (run) { drawWords(); refract(stripTop, stripH); } }

    function frame(t) {
      raf = 0;
      const dt = lastT ? Math.min(0.05, (t - lastT) / 1000) : 0;
      lastT = t;
      const y = window.scrollY, dy = y - lastY; lastY = y;
      boost += (Math.max(-1400, Math.min(1400, dy * 18)) - boost) * 0.12;
      offset += dir * ((runW / dpr) / secs + boost) * dt;
      paintWords();
      if (visible && !document.hidden && !reduce.matches) raf = requestAnimationFrame(frame);
    }
    function start() {
      if (reduce.matches || !run) return;
      if (!raf && visible && !document.hidden) { lastT = 0; lastY = window.scrollY; raf = requestAnimationFrame(frame); }
    }
    function redraw() { size(); paintWords(); start(); }

    this.init = function () {
      if (!ctx) return;
      offset = dir < 0 ? -W * 0.02 : 0;
      size(); paintWords();
      host.classList.add("is-live");
      if ("IntersectionObserver" in window) {
        new IntersectionObserver((es) => es.forEach((e) => { visible = e.isIntersecting; if (visible) start(); })).observe(host);
      }
      start();
    };
    this.redraw = redraw;
    this.start = start;
    this.still = function () { if (raf) { cancelAnimationFrame(raf); raf = 0; } paintWords(); };
    let lastW = 0, lastH = 0;
    this.maybeResize = function () {
      const r = section.getBoundingClientRect();
      if (Math.abs(r.width - lastW) > 1 || Math.abs(r.height - lastH) > 8) { lastW = r.width; lastH = r.height; redraw(); }
    };
  }

  const items = [];
  function init() {
    if (items.length) return;
    hosts.forEach((h) => { const g = new Glass(h); items.push(g); g.init(); });
    let t = 0;
    const onResize = () => { clearTimeout(t); t = setTimeout(() => items.forEach((g) => g.maybeResize()), 150); };
    window.addEventListener("resize", onResize);
    /* sections change height as images and fonts settle, or when the guide opens */
    if ("ResizeObserver" in window) hosts.forEach((h) => new ResizeObserver(onResize).observe(h.parentElement));
    document.addEventListener("visibilitychange", () => { if (!document.hidden) items.forEach((g) => g.start()); });
    const onPref = () => items.forEach((g) => (reduce.matches ? g.still() : g.start()));
    if (reduce.addEventListener) reduce.addEventListener("change", onPref); else if (reduce.addListener) reduce.addListener(onPref);
  }
  const go = () => init();
  if (document.fonts && document.fonts.load) { document.fonts.load('500 100px "DM Sans"').then(go, go); setTimeout(go, 1500); }
  else go();
})();
