/*
 * Hall layout, traced from the hand drawing.
 * Coordinates are in SVG units. rect: centre (x,y), size (w,h), rotation (deg).
 * round: centre (x,y), radius r.
 */
var HALL = {
  viewBox: "-30 20 640 670",
  stage: { x: 172, y: 40, w: 228, h: 72 },
  // double line separating the round-table area on the right
  divider: [[450, 150, 450, 660], [430, 660, 610, 660]],
  // small "R" boxes at the bottom of the drawing
  extras: [
    { x: 22, y: 632, w: 30, h: 30, text: "R" },
    { x: 84, y: 632, w: 30, h: 30, text: "R" },
    { x: 150, y: 632, w: 30, h: 30, text: "R" }
  ],
  // unnumbered grey circle on the drawing (left of table 25)
  ghosts: [{ x: 421, y: 222, r: 24 }],
  tables: {
    7: { x: 50, y: 212, w: 120, h: 44, rot: -30 },
    6: { x: 58, y: 278, w: 120, h: 44, rot: -30 },
    5: { x: 60, y: 344, w: 120, h: 44, rot: -30 },
    4: { x: 60, y: 412, w: 120, h: 44, rot: -30 },
    3: { x: 62, y: 480, w: 120, h: 44, rot: -30 },
    2: { x: 66, y: 548, w: 120, h: 44, rot: -30 },
    1: { x: 92, y: 604, w: 78, h: 34, rot: -30 },
    10: { x: 156, y: 263, w: 40, h: 110 },
    9: { x: 158, y: 401, w: 40, h: 108 },
    8: { x: 162, y: 537, w: 40, h: 108 },
    11: { x: 221, y: 439, w: 38, h: 102 },
    12: { x: 362, y: 439, w: 38, h: 102 },
    14: { x: 222, y: 335, r: 25 },
    13: { x: 358, y: 333, r: 25 },
    15: { x: 421, y: 292, r: 25 },
    16: { x: 421, y: 364, r: 25 },
    17: { x: 421, y: 434, r: 25 },
    18: { x: 421, y: 500, r: 25 },
    19: { x: 421, y: 564, r: 25 },
    25: { x: 490, y: 222, r: 25 },
    24: { x: 490, y: 292, r: 25 },
    23: { x: 490, y: 362, r: 25 },
    22: { x: 490, y: 432, r: 25 },
    21: { x: 490, y: 500, r: 25 },
    20: { x: 490, y: 566, r: 25 },
    26: { x: 562, y: 222, r: 25 },
    27: { x: 562, y: 292, r: 25 },
    28: { x: 562, y: 362, r: 25 },
    29: { x: 562, y: 432, r: 25 },
    30: { x: 562, y: 500, r: 25 },
    31: { x: 562, y: 566, r: 25 }
  }
};
