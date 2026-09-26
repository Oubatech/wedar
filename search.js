/*
 * Multilingual fuzzy name search (Arabic / Hebrew / English).
 *
 * Two layers:
 *  1. Same-script matching on normalized words (exact > prefix > typo-tolerant).
 *     Every guest carries spellings in all three scripts, so this covers most searches.
 *  2. A shared "consonant skeleton" (Latin letters) computed from any script,
 *     so a spelling that differs from the stored transliteration still matches.
 */
var Search = (function () {
  var AR_MARKS = /[ؐ-ًؚ-ٰٟۖ-ۭـ]/g;
  var HE_MARKS = /[֑-ֽֿ-ׂׄ-ׇ]/g;

  function scriptOf(s) {
    if (/[؀-ۿﭐ-﷿ﹰ-﻿]/.test(s)) return "ar";
    if (/[֐-׿]/.test(s)) return "he";
    return "en";
  }

  function normAr(s) {
    return s
      .normalize("NFKC")
      .replace(AR_MARKS, "")
      .replace(/[أإآٱ]/g, "ا")
      .replace(/ؤ/g, "و")
      .replace(/ئ/g, "ي")
      .replace(/ء/g, "")
      .replace(/ة/g, "ه")
      .replace(/[ىی]/g, "ي")
      .replace(/[کگ]/g, "ك")
      .replace(/ھ/g, "ه");
  }

  function normHe(s) {
    return s
      .replace(HE_MARKS, "")
      .replace(/[׳’`´]/g, "'")
      .replace(/״/g, '"')
      .replace(/ך/g, "כ")
      .replace(/ם/g, "מ")
      .replace(/ן/g, "נ")
      .replace(/ף/g, "פ")
      .replace(/ץ/g, "צ");
  }

  function normEn(s) {
    return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  }

  function normalize(s) {
    return normEn(normHe(normAr(String(s))));
  }

  // Split into words. Keeps Hebrew geresh (') attached to its letter.
  function words(s) {
    var n = normalize(s);
    var raw = n.split(/[^a-z֐-׿؀-ۿ']+/);
    var out = [];
    raw.forEach(function (w) {
      w = w.replace(/^'+/, "");
      if (scriptOf(w) !== "he") w = w.replace(/'/g, "");
      if (w) out.push(w);
    });
    return out;
  }

  // Extra forms of a stored word: without "and"/"the" prefixes.
  function variants(w) {
    var v = [w];
    var sc = scriptOf(w);
    if (sc === "ar") {
      if (w.length >= 4 && w[0] === "و") v.push(w.slice(1));
      if (w.length >= 5 && w.indexOf("ال") === 0) v.push(w.slice(2));
    } else if (sc === "he") {
      if (w.length >= 4 && w[0] === "ו") v.push(w.slice(1));
      if (w.length >= 5 && w.indexOf("אל") === 0) v.push(w.slice(2));
    }
    return v;
  }

  // ---------- consonant skeleton ----------
  var AR_MAP = {
    "ب": "B", "ف": "B", "ت": "T", "ط": "T", "ث": "T", "د": "D", "ض": "D", "ذ": "D",
    "ج": "G", "غ": "G", "ك": "K", "ق": "K", "خ": "K", "س": "S", "ص": "S", "ش": "X",
    "ز": "Z", "ظ": "Z", "ل": "L", "م": "M", "ن": "N", "ر": "R"
  };
  var HE_MAP = {
    "ב": "B", "פ": "B", "ת": "T", "ט": "T", "ד": "D", "ג": "G", "כ": "K", "ק": "K",
    "ס": "S", "צ": "S", "ז": "Z", "ל": "L", "מ": "M", "נ": "N", "ר": "R"
  };
  var HE_GERESH = { "ג": "G", "ז": "G", "צ": "X", "ח": "K", "ע": "G", "ת": "T", "ד": "D", "כ": "K" };
  var EN_MAP = {
    b: "B", p: "B", f: "B", v: "B", t: "T", d: "D", g: "G", j: "G", k: "K", q: "K",
    s: "S", z: "Z", l: "L", m: "M", n: "N", r: "R"
  };

  function collapse(s) {
    return s.replace(/(.)\1+/g, "$1");
  }

  // Returns an array of possible skeletons (Hebrew letters can be ambiguous).
  function skeletons(w) {
    var sc = scriptOf(w);
    var outs = [""];
    function push(opts) {
      var next = [];
      outs.forEach(function (o) {
        opts.forEach(function (c) {
          if (next.length < 8) next.push(o + c);
        });
      });
      outs = next;
    }
    var i, c;
    if (sc === "ar") {
      for (i = 0; i < w.length; i++) push([AR_MAP[w[i]] || ""]);
    } else if (sc === "he") {
      for (i = 0; i < w.length; i++) {
        c = w[i];
        if (w[i + 1] === "'" && HE_GERESH[c]) { push([HE_GERESH[c]]); i++; continue; }
        if (c === "'") continue;
        if (c === "ח") push(["", "K"]);
        else if (c === "ש") push(["X", "S"]);
        else if (c === "ו" && i === 0) push(["", "B"]);
        else push([HE_MAP[c] || ""]);
      }
    } else {
      for (i = 0; i < w.length; i++) {
        c = w[i];
        var d = w.substr(i, 2);
        if (d === "kh" || d === "ck") { push(["K"]); i++; continue; }
        if (d === "gh") { push(["G"]); i++; continue; }
        if (d === "sh" || d === "ch") { push(["X"]); i++; continue; }
        if (d === "th") { push(["T"]); i++; continue; }
        if (d === "dh") { push(["D"]); i++; continue; }
        if (d === "ph") { push(["B"]); i++; continue; }
        if (d === "ts" || d === "tz") { push(["S"]); i++; continue; }
        if (c === "c") { push([/[eiy]/.test(w[i + 1] || "") ? "S" : "K"]); continue; }
        if (c === "x") { push(["KS"]); continue; }
        push([EN_MAP[c] || ""]);
      }
    }
    var uniq = {};
    outs.forEach(function (o) { uniq[collapse(o)] = 1; });
    return Object.keys(uniq);
  }

  // ---------- distance ----------
  function distance(a, b, max) {
    if (Math.abs(a.length - b.length) > max) return max + 1;
    var prev2 = null, prev = [], cur, i, j;
    for (j = 0; j <= b.length; j++) prev[j] = j;
    for (i = 1; i <= a.length; i++) {
      cur = [i];
      var rowMin = i;
      for (j = 1; j <= b.length; j++) {
        var cost = a[i - 1] === b[j - 1] ? 0 : 1;
        var v = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
        if (prev2 && i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
          v = Math.min(v, prev2[j - 2] + 1);
        }
        cur[j] = v;
        if (v < rowMin) rowMin = v;
      }
      if (rowMin > max) return max + 1;
      prev2 = prev;
      prev = cur;
    }
    return prev[b.length];
  }

  function typoLimit(len) {
    if (len <= 2) return 0;
    if (len <= 5) return 1;
    return 2;
  }

  // ---------- index ----------
  function buildIndex(guests) {
    return guests.map(function (g) {
      var toks = [];
      g.names.forEach(function (name) {
        words(name).forEach(function (w) {
          variants(w).forEach(function (v) {
            toks.push({ w: v, sc: scriptOf(v), sk: skeletons(v) });
          });
        });
      });
      return { guest: g, toks: toks };
    });
  }

  // Score one query word against one stored word.
  function wordScore(q, t, isLast) {
    var best = 0;
    if (q.sc === t.sc) {
      if (q.w === t.w) return 100;
      if (isLast && q.w.length >= 2 && t.w.indexOf(q.w) === 0) best = 85;
      var lim = typoLimit(Math.min(q.w.length, t.w.length));
      if (lim) {
        var d = distance(q.w, t.w, lim);
        if (d <= lim) best = Math.max(best, 75 - 10 * d);
      }
      if (isLast && q.w.length >= 5 && t.w.length > q.w.length) {
        var dp = distance(q.w, t.w.slice(0, q.w.length), 1);
        if (dp <= 1) best = Math.max(best, 60);
      }
    }
    // cross-script / spelling-variant layer
    for (var i = 0; i < q.sk.length; i++) {
      var a = q.sk[i];
      if (!a) continue;
      for (var j = 0; j < t.sk.length; j++) {
        var b = t.sk[j];
        if (!b) continue;
        if (a === b) best = Math.max(best, a.length >= 2 ? 65 : 50);
        else if (isLast && a.length >= 2 && b.indexOf(a) === 0) best = Math.max(best, 45);
        else if (a.length >= 3 && b.length >= 3 && distance(a, b, 1) <= 1) best = Math.max(best, 40);
      }
    }
    return best;
  }

  function query(index, text) {
    var qw = words(text);
    if (!qw.length) return [];
    if (qw.join("").length < 2) return [];
    var q = qw.map(function (w) { return { w: w, sc: scriptOf(w), sk: skeletons(w) }; });
    var results = [];
    index.forEach(function (entry) {
      var total = 0;
      for (var i = 0; i < q.length; i++) {
        var best = 0;
        for (var j = 0; j < entry.toks.length; j++) {
          var s = wordScore(q[i], entry.toks[j], i === q.length - 1);
          if (s > best) best = s;
          if (best === 100) break;
        }
        if (!best) return;
        total += best;
      }
      results.push({ guest: entry.guest, score: total / q.length });
    });
    results.sort(function (a, b) { return b.score - a.score; });
    if (results.length) {
      var top = results[0].score;
      var floor = top >= 95 ? 80 : top >= 85 ? 60 : top * 0.75;
      results = results.filter(function (r) { return r.score >= floor; });
    }
    return results;
  }

  return {
    buildIndex: buildIndex,
    query: query,
    normalize: normalize,
    words: words,
    skeletons: skeletons,
    scriptOf: scriptOf
  };
})();

if (typeof module !== "undefined") module.exports = Search;
