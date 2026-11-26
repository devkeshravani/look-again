/* ==========================================================================
   sections.js: reads data/*.js (plain script files) and renders the data-driven sections:
   the Timeline row in At a glance, prototype testing, outputs status, reflections.
   Works the same when index.html is double-clicked and on GitHub Pages.
   ========================================================================== */
(function () {
  "use strict";

  /* Data comes from plain script files in data/ (loaded before this file),
     so the page works when index.html is double-clicked and on GitHub Pages alike. */
  const DATA = window.SITE_DATA || {};

  const esc = (v) => String(v == null ? "" : v).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const filled = (v) => v !== null && v !== undefined && String(v).trim() !== "";

  /* interview guide: one question per area by default, "Show all 17" reveals the rest */
  (function () {
    const list = document.getElementById("guide-list"), btn = document.getElementById("guide-toggle");
    if (!list || !btn) return;
    const total = list.querySelectorAll(".guide__qs > li").length;
    list.classList.add("is-collapsed");
    btn.hidden = false;
    btn.addEventListener("click", () => {
      const open = list.classList.toggle("is-collapsed") === false;
      btn.setAttribute("aria-expanded", String(open));
      btn.textContent = open ? "Show fewer questions" : `Show all ${total} questions`;
    });
  })();

  if (DATA.timeline) renderTimeline(DATA.timeline);
  if (DATA.testing) renderTesting(DATA.testing);
  renderReflections(DATA.reflections || {});

  /* shared with the timeline: does testing.js contain any results yet? */
  window.testingHasData = function (t) {
    t = t || DATA.testing || {};
    const any = (a, f) => (a || []).some(f);
    return any(t.results, (r) => filled(r.completed)) ||
      any(t.observations, (o) => filled(o.participant) || filled(o.did) || filled(o.hesitated) || filled(o.errors)) ||
      any(t.changes, (c) => filled(c.observation) || filled(c.change)) || any(t.didntWork, filled);
  };

  /* ---------- timeline ---------- */
  function renderTimeline(t) {
    const items = (t.items || []).filter((i) => filled(i.when) || filled(i.what));
    const meta = document.getElementById("meta-timeline");
    if (meta && items.length) meta.innerHTML = items.map((i) => `<li>${esc(i.when)}<span>– ${esc(i.what)}</span></li>`).join("");
  }

  /* ---------- testing ---------- */
  function renderTesting(t) {
    const n = Number(t.participants) || 6;
    document.querySelectorAll('[data-t="participants"]').forEach((e) => { e.textContent = n; });
    document.querySelectorAll('[data-t="pilot"]').forEach((e) => { e.textContent = Number(t.pilotSessions) === 1 ? "one" : String(t.pilotSessions || "one"); });

    const results = (t.results || []).filter((r) => filled(r.completed));
    const obs = (t.observations || []).filter((o) => filled(o.participant) || filled(o.did) || filled(o.hesitated) || filled(o.errors));
    const changes = (t.changes || []).filter((c) => filled(c.observation) || filled(c.change));
    const didnt = (t.didntWork || []).filter(filled);
    const hasAny = results.length || obs.length || changes.length || didnt.length;
    const complete = String(t.status || "").toLowerCase() === "complete";

    /* status */
    const label = document.getElementById("t-status");
    const text = document.getElementById("t-status-text");
    if (hasAny) {
      label.textContent = complete ? "Testing complete" : "Testing in progress";
      text.textContent = complete
        ? `Results from ${n} participants. The pilot session isn't counted. Counts are raw: "N of ${n}" means N participants completed the task.`
        : `Results recorded so far are below. Cells marked "—" aren't recorded yet. Counts are raw: "N of ${n}" means N participants completed the task.`;
    }
    const out = document.getElementById("out-proto-status");
    if (out) out.textContent = hasAny ? (complete ? "Tested" : "Results coming in") : "In progress";

    const designs = t.designs || [];   /* names only, used as results-table columns */
    /* tasks */
    const tasks = t.tasks || [];
    const tl = document.getElementById("t-tasks");
    if (tl && tasks.length) tl.innerHTML = tasks.map((k) => `<li>${esc(k.text)}</li>`).join("");

    /* glare limitation */
    const g = document.getElementById("t-glare");
    if (g && t.materials && t.materials.metallicStandIn) {
      g.textContent = "Paper prototypes can't reproduce foil reflection. I used a metallic stand-in paper" +
        (filled(t.materials.describe) ? ` (${t.materials.describe})` : "") +
        ". It only approximates real foil, so I make no claims about glare on real strips.";
    }

    /* results */
    const box = document.getElementById("t-results");
    if (!box) return;
    let html = "";
    if (results.length) {
      const find = (task, role) => (t.results || []).find((r) => r.task === task && r.design === role);
      html += `<div class="table-wrap"><table class="req req--results"><caption>Raw counts per task and design (N of ${n} participants)</caption><thead><tr><th scope="col">Task</th>` +
        designs.map((d) => `<th scope="col">${esc(d.role)}</th>`).join("") + `</tr></thead><tbody>` +
        tasks.map((k) => `<tr><th scope="row">${esc(k.id)}. ${esc(k.text)}</th>` + designs.map((d) => {
          const r = find(k.id, d.role);
          if (!r || !filled(r.completed)) return `<td class="muted">—</td>`;
          const c = Number(r.completed);
          const bad = !Number.isInteger(c) || c < 0 || c > n;
          const times = (r.timesSeconds || []).filter(filled);
          return `<td><strong>${esc(r.completed)} of ${n}</strong>` +
            (times.length ? `<span class="times">Times: ${times.map((x) => esc(x) + " s").join(", ")}</span>` : "") + `</td>`;
        }).join("") + `</tr>`).join("") + `</tbody></table></div>`;
    }
    if (obs.length) {
      html += `<h4 class="sub-h">Observations by participant</h4><ul class="obs">` + obs.map((o) =>
        `<li class="obs__card"><h5>${esc(o.participant || "ID missing")}</h5><dl>` +
        (filled(o.did) ? `<dt>What they did</dt><dd>${esc(o.did)}</dd>` : "") +
        (filled(o.hesitated) ? `<dt>Where they hesitated</dt><dd>${esc(o.hesitated)}</dd>` : "") +
        (filled(o.errors) ? `<dt>Errors</dt><dd>${esc(o.errors)}</dd>` : "") + `</dl></li>`).join("") + `</ul>`;
    }
    if (changes.length) {
      html += `<h4 class="sub-h">What changed and why</h4>`;
      html += `<ol class="changes">` + changes.map((c) => `<li class="change">
          <div class="change__before"><span class="change__k">Observation</span><p>${esc(c.observation)}</p><span class="change__k">Evidence</span><p>${esc(c.evidence)}</p></div>
          <div class="change__after"><span class="change__k">Change</span><p>${esc(c.change)}</p><span class="change__k">Reason</span><p>${esc(c.reason)}</p></div>
        </li>`).join("") + `</ol>`;
    }
    if (didnt.length) {
      html += `<h4 class="sub-h">What didn’t work</h4><ul class="didnt">${didnt.map((d) => `<li>${esc(d)}</li>`).join("")}</ul>`;
    }
    box.innerHTML = html;
  }

  /* ---------- reflections ---------- */
  function renderReflections(r) {
    const aside = document.getElementById("reflections");
    const list = document.getElementById("reflect-list");
    if (!aside || !list) return;
    const prompts = [["wentWell", "What went well"], ["didntGoWell", "What didn’t"], ["wouldChange", "What I’d change"]];
    const any = prompts.some(([k]) => filled(r[k]));
    if (!any) { aside.hidden = true; return; }
    list.innerHTML = prompts.map(([k, label]) => filled(r[k]) ? `<dt>${label}</dt><dd>${esc(r[k])}</dd>` : "").join("");
    aside.hidden = false;
  }
})();
