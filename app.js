(function () {
  "use strict";

  // ---------- text ----------
  var T = {
    he: {
      title: "איפה יושבים?",
      placeholder: "שם או מספר שולחן…",
      list: "רשימה", hall: "אולם",
      table: "שולחן",
      free: function (n) { return n + " פנויים"; },
      freeOne: "מקום 1 פנוי",
      full: "מלא",
      over: function (n) { return "חריגה " + n; },
      noList: "אין רשימה",
      seated: "יושבים", freeLbl: "פנויים", capacity: "מקומות",
      noResults: "לא נמצא. נסו חלק מהשם, שם משפחה, או מספר שולחן.",
      noTable: "אין שולחן כזה",
      hint: "הקלידו שם בעברית, ערבית או אנגלית, או מספר שולחן.",
      showOnMap: "הצג באולם", close: "סגור",
      stage: "במה",
      summary: function (t, g, f) { return t + " שולחנות · " + g + " מוזמנים · " + f + " מקומות פנויים"; },
      onlyFree: "רק שולחנות עם מקום פנוי",
      matches: function (n) { return n + " תוצאות"; },
      offline: "✓ עובד אופליין",
      mapHint: "+מספר = מקומות פנויים. לחצו על שולחן.",
      l_free: "יש מקום", l_full: "מלא", l_over: "חריגה", l_none: "אין רשימה",
      round: "עגול", rect: "אביר",
      unclear: "שם לא ברור בגיליון"
    },
    ar: {
      title: "أين يجلس الضيف؟",
      placeholder: "اسم أو رقم طاولة…",
      list: "قائمة", hall: "القاعة",
      table: "طاولة",
      free: function (n) { return n + " مقاعد فارغة"; },
      freeOne: "مقعد واحد فارغ",
      full: "ممتلئة",
      over: function (n) { return "زيادة " + n; },
      noList: "لا توجد قائمة",
      seated: "جالسون", freeLbl: "فارغ", capacity: "مقاعد",
      noResults: "لم يتم العثور. جرّب جزءًا من الاسم أو اسم العائلة أو رقم الطاولة.",
      noTable: "لا توجد طاولة بهذا الرقم",
      hint: "اكتب اسمًا بالعربية أو العبرية أو الإنجليزية، أو رقم طاولة.",
      showOnMap: "عرض في القاعة", close: "إغلاق",
      stage: "المسرح",
      summary: function (t, g, f) { return t + " طاولة · " + g + " مدعو · " + f + " مقاعد فارغة"; },
      onlyFree: "الطاولات التي فيها مقاعد فارغة فقط",
      matches: function (n) { return n + " نتيجة"; },
      offline: "✓ يعمل بدون إنترنت",
      mapHint: "+رقم = مقاعد فارغة. اضغط على طاولة.",
      l_free: "فيها مكان", l_full: "ممتلئة", l_over: "زيادة", l_none: "لا قائمة",
      round: "مستديرة", rect: "طويلة",
      unclear: "الاسم غير واضح في الجدول"
    },
    en: {
      title: "Who sits where?",
      placeholder: "Name or table number…",
      list: "List", hall: "Hall",
      table: "Table",
      free: function (n) { return n + " free"; },
      freeOne: "1 free",
      full: "Full",
      over: function (n) { return "Over by " + n; },
      noList: "No list",
      seated: "Seated", freeLbl: "Free", capacity: "Seats",
      noResults: "Not found. Try part of the name, the family name, or a table number.",
      noTable: "No such table",
      hint: "Type a name in Hebrew, Arabic or English, or a table number.",
      showOnMap: "Show in hall", close: "Close",
      stage: "Stage",
      summary: function (t, g, f) { return t + " tables · " + g + " guests · " + f + " free seats"; },
      onlyFree: "Only tables with free seats",
      matches: function (n) { return n + " results"; },
      offline: "✓ Works offline",
      mapHint: "+N = free seats. Tap a table.",
      l_free: "Has space", l_full: "Full", l_over: "Over", l_none: "No list",
      round: "Round", rect: "Long",
      unclear: "Name unclear in the sheet"
    }
  };

  // ---------- data ----------
  var D = SEATING;
  var index = Search.buildIndex(D.guests);
  var tablesById = {};
  D.tables.forEach(function (t) {
    t.guests = D.guests.filter(function (g) { return g.table === t.id; });
    t.seated = t.guests.reduce(function (a, g) { return a + g.count; }, 0);
    t.free = t.capacity - t.seated;
    tablesById[t.id] = t;
  });

  // ---------- state ----------
  function load(k, d) { try { return localStorage.getItem(k) || d; } catch (e) { return d; } }
  function save(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  var state = {
    lang: load("lang", "he"),
    tab: load("tab", "list"),
    view: null,          // "results" | "list" | "hall"
    q: "",
    focus: null,         // table id highlighted on the map
    zoom: 1,
    onlyFree: false
  };
  if (!T[state.lang]) state.lang = "he";
  state.view = state.tab;

  var $ = function (id) { return document.getElementById(id); };
  var main = $("main"), input = $("q");

  function t() { return T[state.lang]; }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // ---------- helpers ----------
  function status(tb) {
    if (!tb.hasList) return "none";
    if (tb.free > 0) return "free";
    if (tb.free === 0) return "full";
    return "over";
  }
  function freeText(tb) {
    var s = status(tb);
    if (s === "none") return t().noList;
    if (s === "free") return tb.free === 1 ? t().freeOne : t().free(tb.free);
    if (s === "full") return t().full;
    return t().over(-tb.free);
  }
  function chip(tb) {
    return '<span class="chip ' + status(tb) + '">' + esc(freeText(tb)) + "</span>";
  }
  function labelOf(tb) {
    var parts = [];
    if (tb.side) parts.push(D.sides[tb.side][state.lang]);
    if (tb.label) parts.push(tb.label[state.lang]);
    parts.push(t()[tb.shape] + " · " + tb.capacity);
    return parts.join(" · ");
  }
  function numBox(tb) {
    return '<div class="num' + (tb.shape === "round" ? " round" : "") + '"><b>' + tb.id +
      "</b><small>" + esc(t().table) + "</small></div>";
  }
  function guestRow(g, hl) {
    var orig = g.names[0];
    var alt = "";
    if (Search.scriptOf(orig) !== state.lang) {
      for (var i = 1; i < g.names.length; i++) {
        if (Search.scriptOf(g.names[i]) === state.lang) { alt = g.names[i]; break; }
      }
    }
    var unclear = orig.indexOf("(?)") >= 0 ? " · " + t().unclear : "";
    return '<div class="g' + (hl ? " hl" : "") + '"><span class="nm" dir="auto">' + esc(orig) +
      (alt || unclear ? '<span class="alt" dir="auto">' + esc(alt) + esc(unclear) + "</span>" : "") +
      '</span><span class="cnt">×' + g.count + "</span></div>";
  }

  function detailHTML(tb, hlGuests, withActions) {
    var s = status(tb);
    var h = '<div class="detail-head">' + numBox(tb) + '<div><div class="meta">' + esc(labelOf(tb)) +
      "</div>" + chip(tb) + "</div></div>";
    if (tb.hasList) {
      h += '<div class="stats">' +
        '<div class="stat"><b>' + tb.seated + "</b><span>" + esc(t().seated) + "</span></div>" +
        '<div class="stat ' + (s === "over" ? "over" : "free") + '"><b>' + tb.free + "</b><span>" + esc(t().freeLbl) + "</span></div>" +
        '<div class="stat"><b>' + tb.capacity + "</b><span>" + esc(t().capacity) + "</span></div></div>";
      h += '<div class="glist">' + tb.guests.map(function (g) {
        return guestRow(g, hlGuests && hlGuests.indexOf(g) >= 0);
      }).join("") + "</div>";
    } else {
      h += '<p class="hint">' + esc(t().noList) + "</p>";
    }
    if (withActions) {
      h += '<div class="actions"><button class="btn" data-map="' + tb.id + '">' + esc(t().showOnMap) +
        '</button><button class="btn ghost" data-close="1">' + esc(t().close) + "</button></div>";
    }
    return h;
  }

  // ---------- views ----------
  function computeResults() {
    var q = state.q.trim();
    var num = q.match(/^\D{0,12}?(\d{1,2})\s*$/);
    if (num) {
      var tb = tablesById[+num[1]];
      return tb ? { kind: "table", tb: tb, ids: [tb.id] } : { kind: "notable", ids: [] };
    }
    var res = Search.query(index, q);
    if (!res.length) return { kind: q.length < 2 ? "short" : "none", ids: [] };
    var groups = [], seen = {};
    res.forEach(function (r) {
      var id = r.guest.table;
      if (!seen[id]) { seen[id] = { tb: tablesById[id], guests: [] }; groups.push(seen[id]); }
      seen[id].guests.push(r.guest);
    });
    return { kind: "names", groups: groups, count: res.length, ids: groups.map(function (g) { return g.tb.id; }) };
  }

  function renderResults() {
    var r = computeResults();
    state.resultTables = r.ids;
    state.focus = r.ids.length ? r.ids[0] : null;
    if (r.kind === "notable") { main.innerHTML = '<p class="hint">' + esc(t().noTable) + "</p>"; return; }
    if (r.kind === "short" || r.kind === "none") {
      main.innerHTML = '<p class="hint">' + esc(r.kind === "short" ? t().hint : t().noResults) + "</p>";
      return;
    }
    if (r.kind === "table") {
      main.innerHTML = '<div class="card" style="display:block">' + detailHTML(r.tb, null, false) +
        '<div class="actions"><button class="btn" data-map="' + r.tb.id + '">' + esc(t().showOnMap) + "</button></div></div>";
      return;
    }
    var h = '<div class="summary">' + esc(t().matches(r.count)) + "</div>";
    r.groups.forEach(function (gr) {
      h += '<button class="card" data-table="' + gr.tb.id + '" data-hl="' +
        gr.guests.map(function (g) { return D.guests.indexOf(g); }).join(",") + '">' + numBox(gr.tb) +
        '<div class="body"><div class="row"><span class="meta grow">' + esc(labelOf(gr.tb)) + "</span>" + chip(gr.tb) + "</div>" +
        gr.guests.map(function (g) { return guestRow(g, false); }).join("") + "</div></button>";
    });
    main.innerHTML = h;
  }

  function renderList() {
    var list = D.tables.filter(function (tb) { return !state.onlyFree || status(tb) === "free"; });
    var guests = D.guests.reduce(function (a, g) { return a + g.count; }, 0);
    var free = D.tables.reduce(function (a, tb) { return a + (tb.hasList && tb.free > 0 ? tb.free : 0); }, 0);
    var h = '<div class="summary"><span>' + esc(t().summary(D.tables.length, guests, free)) + "</span></div>" +
      '<label class="toggle"><input type="checkbox" id="onlyFree"' + (state.onlyFree ? " checked" : "") + "> " +
      esc(t().onlyFree) + "</label>";
    list.forEach(function (tb) {
      var s = status(tb);
      var pct = Math.min(100, Math.round((tb.seated / tb.capacity) * 100));
      h += '<button class="card" data-table="' + tb.id + '">' + numBox(tb) +
        '<div class="body"><div class="row"><span class="meta grow">' + esc(labelOf(tb)) + "</span>" + chip(tb) + "</div>" +
        (tb.hasList ? '<div class="bar"><i class="' + s + '" style="width:' + pct + '%"></i></div>' +
          '<div class="meta">' + tb.seated + " / " + tb.capacity + " · " + esc(tb.guests[0].names[0]) +
          (tb.guests.length > 1 ? " …" : "") + "</div>" : "") +
        "</div></button>";
    });
    main.innerHTML = h;
  }

  function hallSVG() {
    var H = HALL, out = [];
    var hlSet = {};
    if (state.q.trim() && state.resultTables) state.resultTables.forEach(function (id) { hlSet[id] = 1; });
    if (state.focus) hlSet[state.focus] = 1;
    var anyHl = Object.keys(hlSet).length > 0;

    out.push('<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + H.viewBox + '" role="img" aria-label="' + esc(t().hall) + '">');
    var st = H.stage;
    out.push('<rect class="deco-fill" x="' + st.x + '" y="' + st.y + '" width="' + st.w + '" height="' + st.h + '" rx="4"/>');
    out.push('<text class="deco-text" x="' + (st.x + st.w / 2) + '" y="' + (st.y + st.h / 2 + 8) + '">' + esc(t().stage) + "</text>");
    H.divider.forEach(function (l) {
      out.push('<line class="deco" x1="' + l[0] + '" y1="' + l[1] + '" x2="' + l[2] + '" y2="' + l[3] + '"/>');
    });
    H.extras.forEach(function (e) {
      out.push('<rect class="deco" x="' + e.x + '" y="' + e.y + '" width="' + e.w + '" height="' + e.h + '"/>');
      out.push('<text class="deco-text" style="font-size:13px" x="' + (e.x + e.w / 2) + '" y="' + (e.y + e.h / 2 + 5) + '">' + e.text + "</text>");
    });
    H.ghosts.forEach(function (g) {
      out.push('<circle class="ghost" cx="' + g.x + '" cy="' + g.y + '" r="' + g.r + '"/>');
    });

    D.tables.forEach(function (tb) {
      var p = H.tables[tb.id];
      if (!p) return;
      var s = status(tb);
      var cls = "t " + s + (tb.id === state.focus ? " sel" : "") + (anyHl && !hlSet[tb.id] ? " dim" : "");
      var fr = s === "none" ? "–" : s === "over" ? "−" + (-tb.free) : s === "full" ? "0" : "+" + tb.free;
      out.push('<g class="' + cls + '" data-table="' + tb.id + '">');
      if (p.r) {
        out.push('<circle class="shape" cx="' + p.x + '" cy="' + p.y + '" r="' + p.r + '"/>');
        out.push('<text class="n" x="' + p.x + '" y="' + (p.y + 3) + '">' + tb.id + "</text>");
        out.push('<text class="f" x="' + p.x + '" y="' + (p.y + 17) + '">' + fr + "</text>");
      } else {
        var tr = "translate(" + p.x + " " + p.y + ")" + (p.rot ? " rotate(" + p.rot + ")" : "");
        out.push('<rect class="shape" transform="' + tr + '" x="' + (-p.w / 2) + '" y="' + (-p.h / 2) +
          '" width="' + p.w + '" height="' + p.h + '" rx="5"/>');
        if (p.rot) {
          out.push('<text class="n" x="' + (p.x - 12) + '" y="' + (p.y + 7) + '">' + tb.id + "</text>");
          out.push('<text class="f" x="' + (p.x + 18) + '" y="' + (p.y - 6) + '">' + fr + "</text>");
        } else {
          out.push('<text class="n" x="' + p.x + '" y="' + (p.y - 4) + '">' + tb.id + "</text>");
          out.push('<text class="f" x="' + p.x + '" y="' + (p.y + 16) + '">' + fr + "</text>");
        }
      }
      out.push("</g>");
    });
    out.push("</svg>");
    return out.join("");
  }

  function renderHall() {
    main.innerHTML =
      '<div class="hall-tools"><span class="grow">' + esc(t().mapHint) + "</span>" +
      '<button class="zoom" data-zoom="-1" aria-label="Zoom out">−</button>' +
      '<button class="zoom" data-zoom="1" aria-label="Zoom in">+</button></div>' +
      '<div class="hall-box" id="hallBox">' + hallSVG() + "</div>" +
      '<div class="legend"><span class="l-free">' + esc(t().l_free) + '</span><span class="l-full">' + esc(t().l_full) +
      '</span><span class="l-over">' + esc(t().l_over) + '</span><span class="l-none">' + esc(t().l_none) + "</span></div>";
    applyZoom();
  }

  var ZOOMS = [1, 1.6, 2.3, 3];
  function applyZoom() {
    var box = $("hallBox");
    if (!box) return;
    var svg = box.querySelector("svg");
    svg.style.width = ZOOMS[state.zoom - 1] * 100 + "%";
    if (state.focus && HALL.tables[state.focus]) {
      var vb = HALL.viewBox.split(" ").map(Number);
      var p = HALL.tables[state.focus];
      var rx = (p.x - vb[0]) / vb[2], ry = (p.y - vb[1]) / vb[3];
      requestAnimationFrame(function () {
        box.scrollLeft = rx * svg.clientWidth - box.clientWidth / 2;
        box.scrollTop = ry * svg.clientHeight - box.clientHeight / 2;
        if (state.zoom > 1) {
          var r = box.getBoundingClientRect();
          if (r.top < 0 || r.bottom > window.innerHeight) box.scrollIntoView({ block: "center" });
        }
      });
    }
  }

  function render() {
    var L = t();
    document.documentElement.lang = state.lang;
    document.documentElement.dir = state.lang === "en" ? "ltr" : "rtl";
    $("title").textContent = L.title;
    input.placeholder = L.placeholder;
    $("navList").querySelector("span").textContent = L.list;
    $("navHall").querySelector("span").textContent = L.hall;
    $("offline").textContent = L.offline;
    document.querySelectorAll(".langs button").forEach(function (b) {
      b.setAttribute("aria-pressed", b.dataset.lang === state.lang ? "true" : "false");
    });
    $("navList").setAttribute("aria-current", state.view === "list" ? "true" : "false");
    $("navHall").setAttribute("aria-current", state.view === "hall" ? "true" : "false");
    $("clear").classList.toggle("on", !!state.q);

    if (state.q.trim() && state.view !== "hall") state.view = "results";
    if (state.view === "results") renderResults();
    else if (state.view === "hall") {
      if (state.q.trim()) {
        state.resultTables = computeResults().ids;
        if (!state.focus && state.resultTables.length) state.focus = state.resultTables[0];
      }
      renderHall();
    } else renderList();
  }

  // ---------- sheet ----------
  var sheetWrap = $("sheetWrap"), sheet = $("sheet");
  var sheetOpen = false;
  function openSheet(id, hl) {
    var tb = tablesById[id];
    if (!tb) return;
    state.focus = id;
    sheet.innerHTML = '<div class="grab"></div>' + detailHTML(tb, hl, true);
    sheetWrap.classList.add("on");
    sheet.scrollTop = 0;
    if (!sheetOpen) { try { history.pushState({ sheet: 1 }, ""); } catch (e) {} }
    sheetOpen = true;
    if (state.view === "hall") renderHall();
  }
  function closeSheet(fromPop) {
    if (!sheetOpen) return;
    sheetOpen = false;
    sheetWrap.classList.remove("on");
    if (!fromPop) { try { history.back(); } catch (e) {} }
  }
  window.addEventListener("popstate", function () { closeSheet(true); });
  $("backdrop").addEventListener("click", function () { closeSheet(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeSheet(); });

  function showOnMap(id) {
    closeSheet();
    state.focus = +id;
    state.view = "hall";
    state.tab = "hall";
    save("tab", "hall");
    if (state.zoom < 2) state.zoom = 2;
    render();
    window.scrollTo(0, 0);
  }

  // ---------- events ----------
  input.addEventListener("input", function () {
    state.q = input.value;
    state.view = state.q.trim() ? "results" : state.tab;
    if (!state.q.trim()) { state.focus = null; state.resultTables = null; }
    render();
  });
  input.addEventListener("focus", function () { if (input.value) input.select(); });
  input.addEventListener("keydown", function (e) { if (e.key === "Enter") input.blur(); });
  $("clear").addEventListener("click", function () {
    input.value = "";
    state.q = "";
    state.focus = null;
    state.resultTables = null;
    state.view = state.tab;
    render();
    input.focus();
  });

  document.querySelectorAll(".langs button").forEach(function (b) {
    b.addEventListener("click", function () {
      state.lang = b.dataset.lang;
      save("lang", state.lang);
      render();
    });
  });
  document.querySelectorAll("nav button").forEach(function (b) {
    b.addEventListener("click", function () {
      state.view = state.tab = b.dataset.view;
      save("tab", state.tab);
      if (state.view === "list") state.focus = state.q.trim() ? state.focus : null;
      // leaving results for List clears the search so the full list shows
      if (state.view === "list" && state.q) { input.value = ""; state.q = ""; state.focus = null; state.resultTables = null; }
      render();
      window.scrollTo(0, 0);
    });
  });

  function onClick(e) {
    var el = e.target.closest("[data-map],[data-close],[data-zoom],[data-table]");
    if (!el) return;
    if (el.dataset.map) return showOnMap(el.dataset.map);
    if (el.dataset.close) return closeSheet();
    if (el.dataset.zoom) {
      state.zoom = Math.max(1, Math.min(ZOOMS.length, state.zoom + +el.dataset.zoom));
      return applyZoom();
    }
    if (el.dataset.table) {
      var hl = el.dataset.hl ? el.dataset.hl.split(",").map(function (i) { return D.guests[+i]; }) : null;
      openSheet(+el.dataset.table, hl);
    }
  }
  main.addEventListener("click", onClick);
  sheet.addEventListener("click", onClick);
  main.addEventListener("change", function (e) {
    if (e.target.id === "onlyFree") { state.onlyFree = e.target.checked; render(); }
  });

  // ---------- offline ----------
  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker.register("sw.js").then(function () {
      return navigator.serviceWorker.ready;
    }).then(function () {
      $("offline").classList.add("on");
    }).catch(function () {});
  }

  render();
})();
