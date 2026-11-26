/* ==========================================================================
   layers.js: everything the layered image viewer needs, in one place.

   HOW TO EDIT
   - Coordinates are PERCENTAGES of the base image: x/y = top-left corner,
     w/h = width/height. {x: 10, y: 20, w: 30, h: 15} means "start 10% from
     the left and 20% from the top, 30% wide, 15% tall".
   - separations: x-positions (%) of the red dotted separation line(s).
   - A region with box: null is not shown. Only add a box after
     you've checked the information is actually visible in the photo.
   - Swap a photo: replace images/strip-cyclopam.jpg (same file name), then
     adjust the boxes below. The viewer reads the photo's real proportions.
   - Each region's layer files live in images/layers/<scene id>/:
     outline-N.svg, marker-N.svg, leader-N.svg, plus dim-layer.svg and
     separation-line.svg. They are positioned using the numbers below.

   ========================================================================== */

window.LAYER_SETS = {
  "problem": [
    {
      "id": "cyclopam",
      "tab": "Cyclopam",
      "tabLong": "Scene 1: Cyclopam",
      "base": "images/strip-cyclopam.jpg",
      "alt": "Photograph of the foil side of the original Cyclopam strip. It shows the medicine names and strengths, the brand name CYCLOPAM in a green box with the name in Hindi script, a manufacturer block, a warning box, a licence number line, and a red caution band towards the right side.",
      "aspect": null,
      "separations": [
        61
      ],
      "separationLabel": "section I packed",
      "separationNote": "separation reconstructed",
      "intro": {
        "title": "The Cyclopam strip",
        "text": "The piece I kept came from the right side of the strip. The red dotted line shows where it was separated."
      },
      "regions": [
        {
          "id": 1,
          "title": "Medicine name and strength",
          "box": {
            "x": 6,
            "y": 12,
            "w": 54,
            "h": 35
          },
          "text": "The medicine names, dicyclomine hydrochloride and paracetamol, are printed large on the left, with their strengths (20 mg and 500 mg) in the block below. None of this text reaches the right-hand side of the strip."
        },
        {
          "id": 2,
          "title": "Brand name",
          "box": {
            "x": 6,
            "y": 25,
            "w": 44,
            "h": 9
          },
          "text": "The brand name CYCLOPAM sits in a green box, with the name in Hindi script beside it. Both appear twice, near the top and at the bottom of the strip."
        },
        {
          "id": 3,
          "title": "Expiry and batch, among other codes",
          "box": {
            "x": 6,
            "y": 61.5,
            "w": 29.5,
            "h": 5
          },
          "text": "No legible expiry date or batch number is visible on the photographed area. The nearest codes are this licence number line and a row of small print along the top edge."
        },
        {
          "id": 4,
          "title": "Manufacturer and licence text",
          "box": {
            "x": 35.5,
            "y": 34,
            "w": 22,
            "h": 21.5
          },
          "text": "A manufacturer block in the middle of the strip gives the maker's name and address under a small logo, with a registered trade mark line below. The licence number line is lower down, outlined in layer 3."
        },
        {
          "id": 5,
          "title": "Foil and glare over text",
          "box": {
            "x": 32,
            "y": 56,
            "w": 28,
            "h": 32
          },
          "text": "The foil is shiny, with a diamond-pattern texture, and light catches the round areas. The printing sits directly on this surface."
        },
        {
          "id": 6,
          "title": "The section I packed",
          "box": {
            "x": 61,
            "y": 6,
            "w": 32.5,
            "h": 82
          },
          "text": "This is roughly the section I cut off and packed, from the right side of the strip. Nothing printed in it names the medicine; the red caution band runs down its left edge."
        }
      ]
    },
    {
      "id": "tamodex",
      "tab": "Tamodex",
      "tabLong": "Scene 2: Tamodex",
      "base": "images/strip-tamodex.jpg",
      "alt": "Photograph of the foil side of the original Tamodex strip. It shows Tamoxifen Tablets IP 10 mg in large type, the brand name Tamodex 10 in a green box with the name in Hindi script, red caution boxes, storage text, a manufacturer block, and small codes near the right edge.",
      "aspect": null,
      "separations": [
        68
      ],
      "separationLabel": "section I packed",
      "separationNote": "separation reconstructed",
      "intro": {
        "title": "The Tamodex strip",
        "text": "The piece I kept came from the right side of the strip. The red dotted line shows where it was separated."
      },
      "regions": [
        {
          "id": 1,
          "title": "Medicine name and strength",
          "box": {
            "x": 7,
            "y": 44.5,
            "w": 46,
            "h": 10
          },
          "text": "“Tamoxifen Tablets IP 10 mg” is printed in large type across the middle-left of the strip. Nothing that names the medicine reaches the right-hand side."
        },
        {
          "id": 2,
          "title": "Brand name",
          "box": {
            "x": 7,
            "y": 54.5,
            "w": 32.5,
            "h": 10
          },
          "text": "The brand name Tamodex 10 sits in a green box, with the name in Hindi script beside it."
        },
        {
          "id": 3,
          "title": "Expiry and batch, among other codes",
          "box": {
            "x": 93,
            "y": 45,
            "w": 4.5,
            "h": 18
          },
          "text": "No legible expiry date or batch number is visible on the photographed area. There are small codes near the right edge, but none of them reads as a date."
        },
        {
          "id": 4,
          "title": "Manufacturer and licence text",
          "box": {
            "x": 47,
            "y": 8.5,
            "w": 19.5,
            "h": 34
          },
          "text": "A manufacturer block lists who made and marketed the tablets, and where. A second block, under the licence number line, repeats it lower down."
        },
        {
          "id": 5,
          "title": "Foil and glare over text",
          "box": {
            "x": 47,
            "y": 55,
            "w": 25,
            "h": 36
          },
          "text": "The foil is shiny, with a diamond-pattern texture, and light catches the round areas. The printing sits directly on this surface."
        },
        {
          "id": 6,
          "title": "The section I packed",
          "box": {
            "x": 68,
            "y": 8,
            "w": 27.5,
            "h": 83
          },
          "text": "This is roughly the section I cut off and packed, from the right side of the strip. Nothing printed in it names the medicine."
        }
      ]
    }
  ],
  "proposal": [
    {
      "id": "layout-a",
      "tab": "A",
      "tabLong": "A · Stacked identity",
      "base": "images/layers/layout-a.svg",
      "alt": "Layout A, Stacked identity: Three separated units. Each shows ZORVEX, Examplecetam and 250 mg stacked at the top, a tablet cavity in the middle, and EXP 08/2028 with BATCH ZX1042 at the bottom. Fictional product, not for medical use.",
      "aspect": [
        960,
        470
      ],
      "separations": [
        33.59,
        66.41
      ],
      "separationLabel": "proposed separation",
      "separationNote": "",
      "intro": {
        "title": "Layout A: Stacked identity",
        "text": "Three units of a fictional strip, already separated. Step through the layers to see where each piece of information sits."
      },
      "regions": [
        {
          "id": 1,
          "title": "Name and strength",
          "box": {
            "x": 38.02,
            "y": 12.34,
            "w": 23.96,
            "h": 22.98
          },
          "text": "Brand, medicine name and strength stack at the top of every unit, with the strength set largest."
        },
        {
          "id": 2,
          "title": "Expiry",
          "box": {
            "x": 40.1,
            "y": 69.15,
            "w": 19.79,
            "h": 12.34
          },
          "text": "Expiry sits at the bottom with an explicit EXP label. The batch number goes on its own smaller line below it."
        },
        {
          "id": 3,
          "title": "Cavity",
          "box": {
            "x": 42.71,
            "y": 36.6,
            "w": 14.58,
            "h": 28.94
          },
          "text": "The tablet sits in the middle, so the printed text above and below it stays on flat foil."
        },
        {
          "id": 4,
          "title": "Separation lines",
          "box": {
            "x": 31.3,
            "y": 6.38,
            "w": 4.58,
            "h": 81.28
          },
          "text": "Each unit repeats its own information inside the dotted lines. The idea is that cutting along any line still leaves a complete unit."
        }
      ]
    },
    {
      "id": "layout-b",
      "tab": "B",
      "tabLong": "B · Cavity-first, split expiry and batch",
      "base": "images/layers/layout-b.svg",
      "alt": "Layout B, Cavity-first, split expiry and batch: Three separated units. The tablet cavity is at the top. Below it, ZORVEX and Examplecetam 250 mg are left-aligned, then a rule, then two labeled columns: EXP 08/2028 on the left and BATCH ZX1042 on the right. Fictional product, not for medical use.",
      "aspect": [
        960,
        470
      ],
      "separations": [
        33.59,
        66.41
      ],
      "separationLabel": "proposed separation",
      "separationNote": "",
      "intro": {
        "title": "Layout B: Cavity-first, split expiry and batch",
        "text": "Three units of a fictional strip, already separated. Step through the layers to see where each piece of information sits."
      },
      "regions": [
        {
          "id": 1,
          "title": "Name and strength",
          "box": {
            "x": 37.19,
            "y": 45.11,
            "w": 25.62,
            "h": 13.19
          },
          "text": "Name and strength sit below the cavity, left-aligned, with the strength on the same line as the medicine name."
        },
        {
          "id": 2,
          "title": "Expiry, split from batch",
          "box": {
            "x": 37.19,
            "y": 63.4,
            "w": 12.5,
            "h": 12.34
          },
          "text": "Expiry and batch sit in two labeled columns, so the date isn't part of the same run of numbers as the batch code."
        },
        {
          "id": 3,
          "title": "Cavity",
          "box": {
            "x": 42.71,
            "y": 13.19,
            "w": 14.58,
            "h": 28.94
          },
          "text": "The cavity comes first, at the top, which leaves one continuous print area underneath it."
        },
        {
          "id": 4,
          "title": "Separation lines",
          "box": {
            "x": 31.3,
            "y": 6.38,
            "w": 4.58,
            "h": 81.28
          },
          "text": "Each unit repeats its own information inside the dotted lines. The idea is that cutting along any line still leaves a complete unit."
        }
      ]
    },
    {
      "id": "layout-c",
      "tab": "C",
      "tabLong": "C · Dark expiry band",
      "base": "images/layers/layout-c.svg",
      "alt": "Layout C, Dark expiry band: Three separated units. ZORVEX and Examplecetam 250 mg at the top, the cavity in the middle, BATCH ZX1042 below it, and a dark band across the bottom with EXP 08/2028 in white. Fictional product, not for medical use.",
      "aspect": [
        960,
        470
      ],
      "separations": [
        33.59,
        66.41
      ],
      "separationLabel": "proposed separation",
      "separationNote": "",
      "intro": {
        "title": "Layout C: Dark expiry band",
        "text": "Three units of a fictional strip, already separated. Step through the layers to see where each piece of information sits."
      },
      "regions": [
        {
          "id": 1,
          "title": "Name and strength",
          "box": {
            "x": 38.02,
            "y": 12.34,
            "w": 23.96,
            "h": 13.19
          },
          "text": "The brand is on top, with the medicine name and strength together on one line under it."
        },
        {
          "id": 2,
          "title": "Expiry band",
          "box": {
            "x": 35.83,
            "y": 67.66,
            "w": 28.33,
            "h": 17.87
          },
          "text": "Expiry gets a dark band across the bottom of each unit, printed as light text on dark."
        },
        {
          "id": 3,
          "title": "Cavity",
          "box": {
            "x": 42.71,
            "y": 28.09,
            "w": 14.58,
            "h": 28.94
          },
          "text": "The cavity sits between the name and the batch line."
        },
        {
          "id": 4,
          "title": "Separation lines",
          "box": {
            "x": 31.3,
            "y": 6.38,
            "w": 4.58,
            "h": 81.28
          },
          "text": "Each unit repeats its own information inside the dotted lines. The idea is that cutting along any line still leaves a complete unit."
        }
      ]
    },
    {
      "id": "layout-d",
      "tab": "D",
      "tabLong": "D · Bilingual split, boxed strength",
      "base": "images/layers/layout-d.svg",
      "alt": "Layout D, Bilingual split, boxed strength: Three separated units. ZORVEX and Examplecetam at the top, a placeholder local-language name line, 250 mg inside a box, a smaller cavity, then EXP 08/2028 and ZX1042. Fictional product, not for medical use.",
      "aspect": [
        960,
        470
      ],
      "separations": [
        33.59,
        66.41
      ],
      "separationLabel": "proposed separation",
      "separationNote": "",
      "intro": {
        "title": "Layout D: Bilingual split, boxed strength",
        "text": "Three units of a fictional strip, already separated. Step through the layers to see where each piece of information sits."
      },
      "regions": [
        {
          "id": 1,
          "title": "Name, second language, strength",
          "box": {
            "x": 38.02,
            "y": 11.91,
            "w": 23.96,
            "h": 31.06
          },
          "text": "The name appears in English and on a second-language line, and the strength gets its own box. The second-language line is a placeholder and hasn't been reviewed."
        },
        {
          "id": 2,
          "title": "Expiry",
          "box": {
            "x": 41.15,
            "y": 70.21,
            "w": 17.71,
            "h": 11.06
          },
          "text": "Expiry is at the bottom, with a shorter batch code in smaller type below it."
        },
        {
          "id": 3,
          "title": "Cavity",
          "box": {
            "x": 43.54,
            "y": 42.98,
            "w": 12.92,
            "h": 25.53
          },
          "text": "The cavity is drawn a little smaller here to leave room for the second language."
        },
        {
          "id": 4,
          "title": "Separation lines",
          "box": {
            "x": 31.3,
            "y": 6.38,
            "w": 4.58,
            "h": 81.28
          },
          "text": "Each unit repeats its own information inside the dotted lines. The idea is that cutting along any line still leaves a complete unit."
        }
      ]
    },
    {
      "id": "layout-e",
      "tab": "E",
      "tabLong": "E · Mirrored identity",
      "base": "images/layers/layout-e.svg",
      "alt": "Layout E, Mirrored identity: Three separated units. ZORVEX 250 mg and Examplecetam print at the top and again upside down at the bottom. EXP 08/2028 runs vertically along the left edge and BATCH ZX1042 along the right edge. Fictional product, not for medical use.",
      "aspect": [
        960,
        470
      ],
      "separations": [
        33.59,
        66.41
      ],
      "separationLabel": "proposed separation",
      "separationNote": "",
      "intro": {
        "title": "Layout E: Mirrored identity",
        "text": "Three units of a fictional strip, already separated. Step through the layers to see where each piece of information sits."
      },
      "regions": [
        {
          "id": 1,
          "title": "Mirrored name and strength",
          "box": {
            "x": 39.06,
            "y": 11.91,
            "w": 21.88,
            "h": 11.06
          },
          "text": "Name and strength print at the top and again upside down at the bottom, so the unit reads the same from either end."
        },
        {
          "id": 2,
          "title": "Expiry on the edge",
          "box": {
            "x": 36.77,
            "y": 31.91,
            "w": 3.75,
            "h": 29.79
          },
          "text": "Expiry runs vertically along one edge, with the batch code along the other edge."
        },
        {
          "id": 3,
          "title": "Cavity",
          "box": {
            "x": 43.54,
            "y": 33.19,
            "w": 12.92,
            "h": 27.23
          },
          "text": "The cavity sits in the center, between the two copies of the name."
        },
        {
          "id": 4,
          "title": "Separation lines",
          "box": {
            "x": 31.3,
            "y": 6.38,
            "w": 4.58,
            "h": 81.28
          },
          "text": "Each unit repeats its own information inside the dotted lines. The idea is that cutting along any line still leaves a complete unit."
        }
      ]
    },
    {
      "id": "layout-f",
      "tab": "F",
      "tabLong": "F · Strength-first dark header",
      "base": "images/layers/layout-f.svg",
      "alt": "Layout F, Strength-first dark header: Three separated units. A dark header shows 250 mg in large white type with ZORVEX beside it. Examplecetam is below the header, then the cavity, then EXP 08/2028 and BATCH ZX1042. Fictional product, not for medical use.",
      "aspect": [
        960,
        470
      ],
      "separations": [
        33.59,
        66.41
      ],
      "separationLabel": "proposed separation",
      "separationNote": "",
      "intro": {
        "title": "Layout F: Strength-first dark header",
        "text": "Three units of a fictional strip, already separated. Step through the layers to see where each piece of information sits."
      },
      "regions": [
        {
          "id": 1,
          "title": "Strength first",
          "box": {
            "x": 35.83,
            "y": 8.09,
            "w": 28.33,
            "h": 25.53
          },
          "text": "The strength is the biggest thing on the unit, in a dark header with the brand beside it. The medicine name sits just below."
        },
        {
          "id": 2,
          "title": "Expiry",
          "box": {
            "x": 40.1,
            "y": 69.15,
            "w": 19.79,
            "h": 12.34
          },
          "text": "Expiry sits at the bottom with an explicit EXP label and the batch number underneath."
        },
        {
          "id": 3,
          "title": "Cavity",
          "box": {
            "x": 42.71,
            "y": 35.53,
            "w": 14.58,
            "h": 28.94
          },
          "text": "The cavity sits in the middle of the unit, below the name."
        },
        {
          "id": 4,
          "title": "Separation lines",
          "box": {
            "x": 31.3,
            "y": 6.38,
            "w": 4.58,
            "h": 81.28
          },
          "text": "Each unit repeats its own information inside the dotted lines. The idea is that cutting along any line still leaves a complete unit."
        }
      ]
    }
  ]
};
