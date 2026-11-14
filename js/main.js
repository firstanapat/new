/* ==========================================================================
   Portfolio interactions: nav, section progress rail, case tabs, charts
   ========================================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  /* ---------- Language ---------- */
  function lang() { return (window.I18N && window.I18N.lang) || "th"; }
  var L = {
    th: { units: ["โรงงาน A", "โรงงาน B", "สำนักงานใหญ่"], scopes: ["ขอบเขต 1", "ขอบเขต 2", "ขอบเขต 3"],
      cfoHead: ["หน่วยงาน", "ขอบเขต 1", "ขอบเขต 2", "ขอบเขต 3", "รวม 2568", "ปีฐาน 2567", "เปลี่ยนแปลง"],
      efHead: ["ช่วง EF (kgCO₂e/kg)", "จำนวนแปลง"], srcHead: ["แหล่งปล่อย", "สัดส่วน"], plots: " แปลง",
      src: ["ปุ๋ยเคมี", "ไฟฟ้า (ปั๊มน้ำ)", "น้ำมันเชื้อเพลิง", "สารเคมีเกษตร", "ปุ๋ยคอก"],
      sroi: ["รายได้เกษตรกรเพิ่มขึ้น", "สุขภาพจากการลดสารเคมี", "ค่าเดินทางผู้บริโภคที่ลดลง", "ความสัมพันธ์ในชุมชน", "ลด CO₂ จากการขนส่ง"],
      sroiHead: ["ผลลัพธ์", "มูลค่า (ล้านบาท)"], total: "รวม", mTHB: " ล้านบาท", locale: "th-TH" },
    en: { units: ["Plant A", "Plant B", "Head office"], scopes: ["Scope 1", "Scope 2", "Scope 3"],
      cfoHead: ["Site", "Scope 1", "Scope 2", "Scope 3", "Total 2025", "Base year 2024", "Change"],
      efHead: ["EF range (kgCO₂e/kg)", "Plots"], srcHead: ["Source", "Share"], plots: " plots",
      src: ["Chemical fertiliser", "Electricity (pumps)", "Fuel", "Agrochemicals", "Manure"],
      sroi: ["Higher farmer income", "Health from fewer chemicals", "Lower travel costs for shoppers", "Community relationships", "Less CO₂ from transport"],
      sroiHead: ["Outcome", "Value (THB million)"], total: "Total", mTHB: " THB million", locale: "en-US" }
  };
  function T() { return L[lang()] || L.th; }
  var yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile nav ---------- */
  var toggle = $(".nav-toggle"), links = $("#navLinks");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    links.addEventListener("click", function (e) {
      if (e.target.closest("a")) { links.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); }
    });
  }

  /* ---------- Section progress rail ---------- */
  var railLinks = $$(".rail a");
  var railNow = $("#railNow");
  var railSections = $$("[data-rail]");
  if (railLinks.length && railSections.length && "IntersectionObserver" in window) {
    var visible = {};
    var railIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { visible[en.target.id] = en.intersectionRatio; });
      var best = 0, bestRatio = -1;
      railSections.forEach(function (s, i) { var r = visible[s.id] || 0; if (r > bestRatio) { bestRatio = r; best = i; } });
      railLinks.forEach(function (a, i) { a.setAttribute("aria-current", String(i === best)); });
      if (railNow) railNow.textContent = String(best + 1).padStart(2, "0");
      var id = railSections[best].id;
      var group = id === "work" ? "work" : id === "about" ? "about" : "";
      $$("[data-nav]").forEach(function (a) {
        if (a.getAttribute("data-nav") === group) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
      });
    }, { threshold: [0, 0.15, 0.3, 0.5, 0.7, 1] });
    railSections.forEach(function (s) { railIO.observe(s); });
  }

  /* ---------- Case study tabs ---------- */
  var demos = $("#caseDemos");
  var tabs = $$('.case-tabs [role="tab"]');
  function selectTab(tab) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      var panel = document.getElementById(t.getAttribute("aria-controls"));
      panel.hidden = !on;
      panel.classList.toggle("active", on);
    });
    drawChartsFor(tab.getAttribute("aria-controls"));
  }
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () { selectTab(t); });
    t.addEventListener("keydown", function (e) {
      var n = null;
      if (e.key === "ArrowRight") n = tabs[(i + 1) % tabs.length];
      if (e.key === "ArrowLeft") n = tabs[(i - 1 + tabs.length) % tabs.length];
      if (n) { e.preventDefault(); n.focus(); selectTab(n); }
    });
  });
  /* ---------- Charts (Showcase Data — fictional) ---------- */
  var css = getComputedStyle(document.documentElement);
  var C = {
    s1: css.getPropertyValue("--series-1").trim() || "#2a78d6",
    s2: css.getPropertyValue("--series-2").trim() || "#eb6834",
    s3: css.getPropertyValue("--series-3").trim() || "#1baf7a",
    grid: "#e8e8e6", tick: "#5f6368", ink: "#3c4043", surface: "#f7f7f5"
  };
  function nf(v) { return new Intl.NumberFormat(T().locale).format(v); }

  // Numbers only — labels come from T() so they follow the chosen language.
  var DATA = {
    cfo: { s1: [1980, 1050, 35], s2: [2760, 1640, 410], s3: [6420, 3890, 280], base: [11920, 7010, 756] },
    efHist: { bins: ["0.1–0.2", "0.2–0.3", "0.3–0.4", "0.4–0.5", "0.5–0.6", "0.6–0.7", "0.7–0.8"], count: [3, 8, 12, 10, 7, 3, 2] },
    efSource: { pct: [48, 21, 17, 9, 5] },
    sroi: { value: [1.42, 0.68, 0.31, 0.29, 0.19] }
  };
  function th(cells) { return "<thead><tr>" + cells.map(function (c) { return "<th>" + c + "</th>"; }).join("") + "</tr></thead>"; }

  function fillTables() {
    var d = DATA.cfo, t = T(), rows = "";
    t.units.forEach(function (u, i) {
      var tot = d.s1[i] + d.s2[i] + d.s3[i];
      var ch = (tot - d.base[i]) / d.base[i] * 100;
      rows += "<tr><td>" + u + "</td><td>" + nf(d.s1[i]) + "</td><td>" + nf(d.s2[i]) + "</td><td>" + nf(d.s3[i]) +
        "</td><td>" + nf(tot) + "</td><td>" + nf(d.base[i]) + "</td><td>" + ch.toFixed(1) + "%</td></tr>";
    });
    var tc = $("#tableCfo");
    if (tc) tc.innerHTML = th(t.cfoHead) + "<tbody>" + rows + "</tbody>";
    var te = $("#tableEf");
    if (te) te.innerHTML = th(t.efHead) + "<tbody>" +
      DATA.efHist.bins.map(function (b, i) { return "<tr><td>" + b + "</td><td>" + DATA.efHist.count[i] + "</td></tr>"; }).join("") +
      "</tbody>" + th(t.srcHead) + "<tbody>" +
      t.src.map(function (l, i) { return "<tr><td>" + l + "</td><td>" + DATA.efSource.pct[i] + "%</td></tr>"; }).join("") + "</tbody>";
    var ts = $("#tableSroi");
    if (ts) ts.innerHTML = th(t.sroiHead) + "<tbody>" +
      t.sroi.map(function (l, i) { return "<tr><td>" + l + "</td><td>" + DATA.sroi.value[i].toFixed(2) + "</td></tr>"; }).join("") +
      "<tr><td><strong>" + t.total + "</strong></td><td><strong>2.89</strong></td></tr></tbody>";
  }
  fillTables();

  var drawn = {};
  function tooltip(extra) {
    return Object.assign({
      backgroundColor: "#1f2124", titleColor: "#fff", bodyColor: "#e8e8e6", padding: 10, cornerRadius: 10,
      titleFont: { weight: "700" }, displayColors: true, boxPadding: 4
    }, extra || {});
  }
  function base(extra) {
    return Object.assign({
      responsive: true, maintainAspectRatio: false,
      animation: reduceMotion ? false : { duration: 500 },
      plugins: { legend: { display: false }, tooltip: tooltip() },
      interaction: { mode: "nearest", intersect: true }
    }, extra);
  }
  function axis(opts) {
    return Object.assign({ grid: { color: C.grid, drawTicks: false }, border: { display: false }, ticks: { color: C.tick, padding: 8, font: { size: 12 } } }, opts || {});
  }
  function hbar(id, labels, data, fmt, tickFmt, max) {
    new Chart($(id), {
      type: "bar",
      data: { labels: labels, datasets: [{ data: data, backgroundColor: C.s1, maxBarThickness: 24, borderRadius: { topRight: 4, bottomRight: 4 }, borderSkipped: false }] },
      options: base({
        indexAxis: "y", interaction: { mode: "nearest", intersect: true, axis: "y" },
        plugins: { legend: { display: false }, tooltip: tooltip({ displayColors: false, callbacks: { label: function (c) { return fmt(c.raw); } } }) },
        scales: {
          x: axis({ beginAtZero: true, max: max, ticks: { color: C.tick, callback: tickFmt } }),
          y: axis({ grid: { display: false }, ticks: { color: C.ink, font: { size: 13, weight: "500" } } })
        }
      })
    });
  }

  function drawChartsFor(panelId) {
    if (!demos.open || typeof Chart === "undefined" || drawn[panelId]) return;
    Chart.defaults.font.family = '"Anuphan", "Noto Sans Thai", system-ui, sans-serif';
    Chart.defaults.color = C.tick;
    drawn[panelId] = true;

    var t = T();
    if (panelId === "case-cfo") {
      var d = DATA.cfo;
      var seg = function (label, data, color, last) {
        return { label: label, data: data, backgroundColor: color, maxBarThickness: 24, borderColor: C.surface,
          borderWidth: { right: last ? 0 : 2 }, borderSkipped: false, borderRadius: last ? { topRight: 4, bottomRight: 4 } : 0 };
      };
      new Chart($("#chartCfo"), {
        type: "bar",
        data: { labels: t.units, datasets: [seg(t.scopes[0], d.s1, C.s1), seg(t.scopes[1], d.s2, C.s2), seg(t.scopes[2], d.s3, C.s3, true)] },
        options: base({
          indexAxis: "y", interaction: { mode: "nearest", intersect: true, axis: "y" },
          plugins: { legend: { display: false }, tooltip: tooltip({ callbacks: { label: function (c) { return " " + c.dataset.label + ": " + nf(c.raw) + " tCO₂e"; } } }) },
          scales: {
            x: axis({ stacked: true, ticks: { color: C.tick, callback: function (v) { return nf(v); } } }),
            y: axis({ stacked: true, grid: { display: false }, ticks: { color: C.ink, font: { size: 13, weight: "500" } } })
          }
        })
      });
    }
    if (panelId === "case-ef") {
      new Chart($("#chartEfHist"), {
        type: "bar",
        data: { labels: DATA.efHist.bins, datasets: [{ data: DATA.efHist.count, backgroundColor: C.s1, maxBarThickness: 24, borderRadius: { topLeft: 4, topRight: 4 }, borderSkipped: false }] },
        options: base({
          plugins: { legend: { display: false }, tooltip: tooltip({ displayColors: false, callbacks: { title: function (c) { return "EF " + c[0].label + " kgCO₂e/kg"; }, label: function (c) { return c.raw + t.plots; } } }) },
          scales: { x: axis({ grid: { display: false } }), y: axis({ beginAtZero: true, ticks: { color: C.tick, stepSize: 4 } }) }
        })
      });
      hbar("#chartEfSource", t.src, DATA.efSource.pct,
        function (v) { return v + "% (" + (0.412 * v / 100).toFixed(3) + " kgCO₂e/kg)"; },
        function (v) { return v + "%"; }, 60);
    }
    if (panelId === "case-sroi") {
      hbar("#chartSroi", t.sroi, DATA.sroi.value,
        function (v) { return v.toFixed(2) + t.mTHB; },
        function (v) { return v.toFixed(1); });
    }
  }

  function drawSelectedCase() {
    var selected = $('.case-tabs [aria-selected="true"]');
    drawChartsFor(selected.getAttribute("aria-controls"));
  }

  // Draw the selected chart only after its disclosure is visible.
  demos.addEventListener("toggle", function () {
    if (demos.open) drawSelectedCase();
  });
  drawSelectedCase();

  // Refresh translated chart labels and table headings.
  document.addEventListener("langchange", function () {
    fillTables();
    if (typeof Chart === "undefined") return;
    ["#chartCfo", "#chartEfHist", "#chartEfSource", "#chartSroi"].forEach(function (id) {
      var el = $(id), ch = el && Chart.getChart(el);
      if (ch) ch.destroy();
    });
    drawn = {};
    drawSelectedCase();
  });

})();
