// Run: node tests/run.js
var SEATING = require("../data.js");
var Search = require("../search.js");

var fails = 0;
function check(cond, msg) {
  if (!cond) { fails++; console.log("FAIL  " + msg); }
  else console.log("ok    " + msg);
}

// 1. Data matches the two source files exactly (independent re-parse of the CSVs)
var fs = require("fs"), path = require("path");
function parseCSV(file) {
  return fs.readFileSync(path.join(__dirname, "..", "source", file), "utf8").split(/\r?\n/).map(function (l) { return l.split(","); });
}
function key(s) {
  return s.trim().replace(/[׳'`’"]/g, "").replace(/[()\/\-.]/g, " ").replace(/\s+/g, " ").trim().toLowerCase();
}
var inv = {};
parseCSV("invitees.csv").slice(1).forEach(function (r) { if (r[0] && r[0].trim()) inv[key(r[0])] = r[4]; });
var expected = {}, table = null, seatedKeys = {};
parseCSV("seating.csv").slice(2).forEach(function (r) {
  if (/^\d+$/.test((r[0] || "").trim())) { table = +r[0]; expected[table] = expected[table] || 0; return; }
  if (!r[2] || !r[2].trim()) return;
  var k = key(r[2]);
  check(k in inv, "seated guest has a confirmation row: " + r[2].trim());
  seatedKeys[k] = table;
  expected[table] += +(inv[k] || 0);
});
var byKey = {};
SEATING.guests.forEach(function (g) { byKey[key(g.names[0])] = g; });
Object.keys(seatedKeys).forEach(function (k) {
  var g = byKey[k];
  if (!g || g.table !== seatedKeys[k] || g.count !== +(inv[k] || 0))
    check(false, "guest matches files: " + k + " -> " + JSON.stringify(g && [g.table, g.count]));
});
check(Object.keys(seatedKeys).length === SEATING.guests.filter(function (g) { return g.table; }).length, "same number of seated guests as seating file");
Object.keys(expected).forEach(function (t) {
  var sum = SEATING.guests.filter(function (g) { return g.table === +t; }).reduce(function (a, g) { return a + g.count; }, 0);
  check(sum === expected[t], "table " + t + " confirmed total " + sum + " == files " + expected[t]);
});

// 2. Search cases
var idx = Search.buildIndex(SEATING.guests);
function tablesFor(q) {
  var set = {};
  Search.query(idx, q).forEach(function (r) { set[r.guest.table] = 1; });
  return Object.keys(set).map(Number).sort(function (a, b) { return a - b; });
}
function firstName(q) {
  var r = Search.query(idx, q);
  return r.length ? r[0].guest.names[0] + " (t" + r[0].guest.table + ")" : "-";
}
function expectIncludes(q, tables) {
  var got = tablesFor(q);
  var ok = tables.every(function (t) { return got.indexOf(t) >= 0; });
  check(ok, JSON.stringify(q) + " -> tables " + got.join(",") + " includes " + tables.join(","));
}
function expectTop(q, table) {
  var r = Search.query(idx, q);
  check(r.length && r[0].guest.table === table, JSON.stringify(q) + " top = " + firstName(q) + ", want t" + table);
}

var issaTables = [2, 3, 4, 9, 11, 17, 19, 24, 28, 6];
["issa", "עיסא", "عيسى", "عيسا", "עיסה", "eissa"].forEach(function (q) { expectIncludes(q, issaTables); });

["srouh", "sarou", "סרוע", "سروع"].forEach(function (q) { expectIncludes(q, [2]); });
["kheirala", "kheiralla", "خيرالله", "חיראללה"].forEach(function (q) { expectIncludes(q, [27]); });
["nahas", "nahhas", "نحاس", "נחאס"].forEach(function (q) { expectIncludes(q, [8]); });
["dabbagh", "דבאק", "دباغ", "dabbag"].forEach(function (q) { expectIncludes(q, [8]); });
["maghzal", "מגזל", "مغزل", "magzal"].forEach(function (q) { expectIncludes(q, [22]); });
["yacoub", "יעקוב", "يعقوب", "yaqoub"].forEach(function (q) { expectIncludes(q, [3, 26]); });

expectTop("anis issa", 9);
expectTop("אניס עיסא", 9);
expectTop("انيس", 9);
expectTop("sandra", 12);
expectTop("סנדרה", 12);
expectTop("roxan", 12);
expectTop("peter kardo", 14);
expectTop("פיטר קרדו", 14);
expectTop("rozeen", 7);
expectTop("kanboura", 7);
expectTop("האלא", null);
expectTop("روزين", 7);
expectTop("khoury jan", 28);
expectTop("ג'אן חורי", 28);
expectTop("michel ibrahim", 11);
expectTop("ميشال ابراهيم", 11);
expectTop("mishel ibrahim", 11);
expectTop("or danon", 20);
expectTop("اور دانون", 20);
expectTop("hourani", 25);
expectIncludes("zaknoun", [4, 8]);
expectTop("fadi marroushi", 10);

console.log("\nSample result counts:");
["issa", "abu", "rami", "jeries", "ali", "khoury", "barakat"].forEach(function (q) {
  console.log("  " + q + ": " + Search.query(idx, q).length + " guests, tables " + tablesFor(q).join(","));
});

console.log(fails ? "\n" + fails + " FAILED" : "\nALL PASSED");
process.exit(fails ? 1 : 0);
