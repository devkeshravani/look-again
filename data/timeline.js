/* Timeline: the animated timeline section and the Timeline row in "At a glance".
   Edit the text between the first { and the final }; keep the first line and the closing }; as they are.
   Field guide: data/GUIDE.md. */
window.SITE_DATA = window.SITE_DATA || {};
window.SITE_DATA.timeline = {
  "_help": "One item per phase, in date order. 'when' is the date label, 'what' is the one-line headline, 'details' is 2–3 sentences about the work, 'output' is the small output item: a label, plus an optional image and alt text. 'status' is 'done', 'current' or 'upcoming'.",
  "summary": "Research ran August to October 2026. Prototype testing started at the beginning of November 2026.",
  "items": [
    {
      "when": "August 2026",
      "what": "Framing the question",
      "status": "done",
      "details": "I turned my grandparents' confusion about which medicine is which, plus my own experience of losing names when I cut strips, into a design question about separated units. I wrote the interview guide: introduction, finding the expiry date, identifying the medicine, reading the packaging, language and understanding, information needs, opening and handling, and closing questions.",
      "output": { "label": "Interview guide" },
      "links": [{ "label": "See the interview guide", "href": "#studied" }]
    },
    {
      "when": "September 2026",
      "what": "Interviews",
      "status": "done",
      "details": "I ran 15 semi-structured interviews, 30 to 60 minutes each. The participants were 5 patients and 10 caregivers and helpers, recruited through a hospital in India.",
      "output": { "label": "Interview notes" },
      "links": [{ "label": "See what came up", "href": "#found" }]
    },
    {
      "when": "October 2026",
      "what": "Analysis and concepts",
      "status": "done",
      "details": "I coded the interviews and grouped the codes into themes. Then I built the layered annotation board and six layouts.",
      "output": { "label": "The themes, the annotation board, six layouts", "image": "images/layers/layout-a.svg", "alt": "Layout A, one of the six layouts. Fictional product, not for medical use." },
      "links": [{ "label": "See the analysis story", "href": "#story-expiry" }, { "label": "See the six layouts", "href": "#proposing" }]
    },
    {
      "when": "Start of November 2026",
      "what": "Prototype testing",
      "status": "current",
      "details": "I prepared paper prototypes and a test with 6 participants plus a pilot session, three designs and four tasks. Every name on the prototypes is fictional.",
      "output": { "label": "Moderator manual and participant task sheet" },
      "statusFromTesting": true,
      "links": []
    }
  ]
};
