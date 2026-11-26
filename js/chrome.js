/* ==========================================================================
   chrome.js: glass navbar, looping background words, tap-to-glow on touch,
   and keeping photo-layer cards clear of the scene tabs and the step dock.
   Vanilla JS. Works when index.html is double-clicked and on GitHub Pages.
   ========================================================================== */
(function () {
  "use strict";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const root = document.documentElement;

  /* ---------- contact links: one source of truth (the Get in touch button in the page) ---------- */
  const contact = document.querySelector(".cta .button");
  if (contact) document.querySelectorAll("[data-contact]").forEach((a) => { a.href = contact.getAttribute("href"); });

  /* ======================= GLASS NAVBAR ======================= */
  const gnav = document.getElementById("gnav");
  if (gnav) {
    const bar = gnav.querySelector(".gnav__bar");
    const wrap = gnav.querySelector(".gnav__links-wrap");
    const pill = gnav.querySelector(".gnav__pill");
    const links = [...gnav.querySelectorAll(".gnav__link")];
    const plinks = [...gnav.querySelectorAll(".gnav__plink")];
    const toggle = gnav.querySelector(".gnav__toggle");
    const panel = document.getElementById("gnav-panel");
    const targets = links.map((a) => document.getElementById(a.getAttribute("href").slice(1)));

    /* nav height -> CSS, so pinned stages and anchors clear the bar */
    function setSpace() {
      const r = bar.getBoundingClientRect();
      root.style.setProperty("--nav-space", Math.round(r.height + 14 + 10) + "px");
    }
    setSpace();
    window.addEventListener("resize", () => { setSpace(); movePill(); });

    /* one-time entrance */
    if (!reduce.matches) gnav.classList.add("is-entering");
    requestAnimationFrame(() => requestAnimationFrame(() => gnav.classList.add("is-in")));

    /* sliding highlight pill */
    let active = -1, focus = -1;
    function movePill() {
      const i = focus >= 0 ? focus : active;
      if (i < 0 || !links[i] || !wrap.offsetParent) { pill.style.opacity = "0"; return; }
      const a = links[i].getBoundingClientRect(), w = wrap.getBoundingClientRect();
      pill.style.width = a.width + "px";
      pill.style.transform = `translateX(${(a.left - w.left).toFixed(1)}px)`;
      pill.style.opacity = "1";
      pill.classList.toggle("is-preview", focus >= 0 && focus !== active);
    }
    links.forEach((a, i) => {
      a.addEventListener("pointerenter", () => { focus = i; movePill(); });
      a.addEventListener("focus", () => { focus = i; movePill(); });
      a.addEventListener("blur", () => { focus = -1; movePill(); });
    });
    wrap.addEventListener("pointerleave", () => { if (!wrap.contains(document.activeElement)) { focus = -1; movePill(); } });

    /* scroll-spy: the last section whose top has passed under the bar.
       The timeline sits inside Overview; Project details and the closing sections sit under Impact. */
    function spy() {
      const line = parseFloat(getComputedStyle(root).getPropertyValue("--nav-space")) + window.innerHeight * 0.25;
      let cur = -1;
      targets.forEach((t, i) => { if (t && t.getBoundingClientRect().top <= line) cur = i; });
      if (cur !== active) {
        active = cur;
        [links, plinks].forEach((set) => set.forEach((a, i) => {
          if (i === cur) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
        }));
        movePill();
      }
    }
    let tick = false;
    window.addEventListener("scroll", () => { if (!tick) { tick = true; requestAnimationFrame(() => { tick = false; spy(); }); } }, { passive: true });
    spy();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { setSpace(); movePill(); });

    /* mobile menu */
    function setOpen(open, returnFocus) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      gnav.classList.toggle("is-open", open);
      if (open) { panel.hidden = false; requestAnimationFrame(() => panel.classList.add("is-shown")); }
      else {
        panel.classList.remove("is-shown");
        const done = () => { if (!gnav.classList.contains("is-open")) panel.hidden = true; };
        reduce.matches ? done() : setTimeout(done, 220);
        if (returnFocus) toggle.focus();
      }
    }
    toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
    panel.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && gnav.classList.contains("is-open")) setOpen(false, true); });
    document.addEventListener("pointerdown", (e) => { if (gnav.classList.contains("is-open") && !gnav.contains(e.target)) setOpen(false); });
    window.matchMedia("(min-width: 901px)").addEventListener("change", (m) => { if (m.matches) setOpen(false); });
  }

  /* ======================= LOOPING BACKGROUND WORDS ======================= */
  const words = ((window.SITE_DATA || {}).marquee) || {};
  const marquees = [...document.querySelectorAll("[data-marquee]")];
  function buildMarquee(el) {
    const cfg = words[el.dataset.marquee];
    if (!cfg || !cfg.text) { el.hidden = true; return; }
    const unit = cfg.text + (cfg.separator || "  ·  ");
    el.innerHTML = "";
    const track = document.createElement("div");
    track.className = "marquee__track";
    const a = document.createElement("span");
    a.className = "marquee__run";
    a.textContent = unit;
    track.appendChild(a);
    el.appendChild(track);
    // repeat until one run is wider than the screen, then duplicate the run for a seamless loop
    let n = 1;
    while (a.offsetWidth < window.innerWidth * 1.1 && n < 12) { a.textContent += unit; n++; }
    const b = a.cloneNode(true);
    track.appendChild(b);
    track.style.setProperty("--loop", (cfg.secondsPerLoop || 40) * (a.offsetWidth / 1600) + "s");
    track.classList.toggle("is-reverse", cfg.direction === "right");
  }
  function buildAll() { marquees.forEach(buildMarquee); }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(buildAll); else buildAll();
  let rw = window.innerWidth;
  window.addEventListener("resize", () => { if (Math.abs(window.innerWidth - rw) > 40) { rw = window.innerWidth; buildAll(); } });
  // pause loops and drifting shapes while they're off screen
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.target.classList.toggle("is-offscreen", !e.isIntersecting)));
    document.querySelectorAll(".hero, .glance").forEach((s) => io.observe(s));
  }

  /* ======================= TAP-TO-GLOW ON TOUCH ======================= */
  document.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "touch") return;
    const t = e.target.closest(".glowable");
    if (!t) return;
    t.classList.add("glow-on");
    clearTimeout(t._glowT);
    t._glowT = setTimeout(() => t.classList.remove("glow-on"), 1100);
  }, { passive: true });

  /* ======================= PHOTO-LAYER CARDS ======================= */
  /* Cards fade out before they reach the scene tabs (top) or the step dock (bottom), so they never cover them. */
  const viewers = [...document.querySelectorAll(".scrolly")];
  function clearCards() {
    viewers.forEach((v) => {
      const r = v.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      const tabs = v.querySelector(".scrolly__top"), dock = v.querySelector(".scrolly__controls");
      const top = tabs && tabs.offsetParent ? tabs.getBoundingClientRect().bottom + 10 : parseFloat(getComputedStyle(root).getPropertyValue("--nav-space")) || 0;
      const bottom = dock && dock.offsetParent ? dock.getBoundingClientRect().top - 10 : window.innerHeight;
      v.querySelectorAll(".s-card").forEach((c) => {
        const cr = c.getBoundingClientRect();
        const fadeTop = Math.min(1, Math.max(0, (cr.top - top) / 70));
        const fadeBot = Math.min(1, Math.max(0, (bottom - cr.bottom) / 70));
        const o = Math.min(fadeTop, fadeBot);
        c.style.opacity = o.toFixed(3);
        c.style.visibility = o < 0.02 ? "hidden" : "";
      });
    });
  }
  let ct = false;
  window.addEventListener("scroll", () => { if (!ct) { ct = true; requestAnimationFrame(() => { ct = false; clearCards(); }); } }, { passive: true });
  window.addEventListener("resize", clearCards);
  setTimeout(clearCards, 50);

  /* ======================= GLOW TARGETS ======================= */
  const GLOW = ".story__btn, .button, .gnav__link, .gnav__cta, .gnav__toggle, .gnav__plink, .s-btn, .s-tab, .guide__toggle, .skip-chip, .recap__item, .tl__recapitem";
  function mark() { document.querySelectorAll(GLOW).forEach((b) => b.classList.add("glowable")); }
  mark();
  new MutationObserver(() => mark()).observe(document.body, { childList: true, subtree: true });
})();
