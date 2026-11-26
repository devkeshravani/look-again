/* Interview themes and the interactive analysis story. Edit the text between the first { and the final }; keep the first line and the closing }; as they are. Field guide: data/GUIDE.md. */
window.SITE_DATA = window.SITE_DATA || {};
window.SITE_DATA.themes = {
  "_help": "One entry per interview theme. 'card' is the theme name on the interview cards (must match exactly). A theme with \"story\": null shows only its interview card. Copy the expiry story's structure to build another one. See data/GUIDE.md.",
  "stageNames": [
    "Raw response",
    "Initial code",
    "Code cluster",
    "Emerging theme",
    "Design opportunity"
  ],
  "reviewerNote": "I was the only reviewer. I coded the interviews on my own, so these codes and themes are one person's reading of the data.",
  "themes": [
    {
      "id": "expiry",
      "card": "Expiry visibility",
      "story": {
        "title": "How one theme became a design decision",
        "intro": "This follows one theme, expiry visibility, from a single participant's words to a design change. Scroll, press Continue, or use the arrow keys.",
        "background": "images/strip-cyclopam.jpg",
        "raw": {
          "lead": "Here's what a participant said.",
          "participant": "P1",
          "quote": "I usually look for the expiry date first, but sometimes I have to turn the strip around to find it.",
          "tryIt": "Optional: tap the words you think matter, then continue. If you skip, you'll see what I marked.",
          "recap": "P1 checks the expiry date first, but sometimes has to search the strip for it."
        },
        "code": {
          "lead": "Here's what I noticed.",
          "highlights": [
            {
              "phrase": "look for the expiry date first",
              "tag": "Expiry is a priority check"
            },
            {
              "phrase": "turn the strip around to find it",
              "tag": "Expiry placement"
            }
          ],
          "reveal": "This person values expiry, but the packaging makes them work for it.",
          "recap": "Two codes: \"Expiry is a priority check\" and \"Expiry placement\"."
        },
        "cluster": {
          "lead": "These observations started forming a pattern.",
          "tags": [
            {
              "label": "Crowded information",
              "participant": "P2"
            },
            {
              "label": "Dates hard to distinguish",
              "participant": "P3"
            },
            {
              "label": "Small text",
              "participant": "P5"
            },
            {
              "label": "Hard to identify expiry",
              "participant": "P4"
            },
            {
              "label": "Not noticed immediately",
              "participant": "P15"
            }
          ],
          "outlier": {
            "label": "Name first, expiry second",
            "note": "didn't fit yet"
          },
          "dragHint": "Drag each tag into the cluster, or tap it. Continue snaps the rest in.",
          "recap": "Five more codes from P2, P3, P4, P5 and P15 clustered around expiry. One code didn't fit yet."
        },
        "theme": {
          "lead": "This led me to identify a theme.",
          "statement": "Finding the expiry date shouldn't require searching.",
          "count": "6 of the participants quoted raised this.",
          "constraint": "...but it shouldn't outshout the name.",
          "recap": "Finding the expiry date shouldn't require searching, but it shouldn't outshout the name."
        },
        "opportunity": {
          "lead": "Here's how it shaped the design.",
          "moves": [
            "Consistent location",
            "Explicit EXP label",
            "Separated from batch information"
          ],
          "compare": {
            "before": "images/strip-cyclopam.jpg",
            "beforeAlt": "Photograph of the foil side of my original Cyclopam strip.",
            "beforeLabel": "My original strip",
            "after": "images/layers/layout-c.svg",
            "afterAlt": "Concept layout with a dark expiry band at the bottom of each unit. Fictional product, not for medical use.",
            "afterLabel": "Concept layout (fictional, NOT FOR MEDICAL USE)"
          },
          "closing": "I test this with Task 2 of my usability test: can people find the expiry date and tell if it's still in date?",
          "links": [
            {
              "label": "See the six layouts",
              "href": "#proposing"
            },
            {
              "label": "See the testing",
              "href": "#testing"
            }
          ],
          "recap": "Three design moves: consistent location, an explicit EXP label, and separation from batch information."
        }
      }
    },
    {
      "id": "identification",
      "card": "Identifying the medicine",
      "story": null
    },
    {
      "id": "readability",
      "card": "Readability",
      "story": null
    },
    {
      "id": "language",
      "card": "Language",
      "story": null
    },
    {
      "id": "information",
      "card": "Additional information",
      "story": null
    },
    {
      "id": "handling",
      "card": "Opening and handling",
      "story": null
    }
  ]
};
