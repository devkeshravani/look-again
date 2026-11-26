/* Big looping words behind the ribbed glass: "hero" runs in the band under the hero text,
   "glance" in its own band at the bottom of "At a glance".
   Edit the text between the quotes; keep the first two lines and the closing }; as they are.
   - text: the phrase that repeats endlessly
   - separator: what goes between repeats
   - secondsPerLoop: higher is slower
   - direction: "left" or "right" */
window.SITE_DATA = window.SITE_DATA || {};
window.SITE_DATA.marquee = {
  "hero":   { "text": "Which one is which?",       "separator": "  ·  ", "secondsPerLoop": 38, "direction": "left" },
  "glance": { "text": "Name · Strength · Expiry",  "separator": "  ·  ", "secondsPerLoop": 60, "direction": "right" }
};
