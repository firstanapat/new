/* ==========================================================================
   Project story walkthroughs (screens + beats). Engine: js/walkthrough.js.
   All figures are sample data. Each story's steps line up with the
   <li> items in its <ol class="project-steps">.
   ========================================================================== */
(function () {
  "use strict";
  if (!window.Walkthrough) return;

  /* ---------------------------------------------------------------------
     01 Carbon Calculator
     Beats 1–3 show what is built (the calculator, tested on sample data).
     Beat 4 shows the AI matching as "in development", with no working
     suggestion on screen. The activity text stays Thai in both languages
     because the tool takes Thai descriptions.
     12,000 kWh × 0.475 kgCO₂e/kWh (ELEC-001) = 5,700 kgCO₂e = 5.70 tCO₂e
     --------------------------------------------------------------------- */
  var CM = {
    steps: [{ th: "กิจกรรม", en: "Activity" }, { th: "ค่าอ้างอิง", en: "Factor" }, { th: "ตรวจ · คำนวณ", en: "Check" }, { th: "AI", en: "AI" }],
    addTitle: { th: "เพิ่มกิจกรรม", en: "Add an activity" },
    site: { th: "โรงงาน A · ม.ค.", en: "Plant A · Jan" },
    activity: { th: "กิจกรรม", en: "Activity" },
    amount: { th: "ปริมาณ", en: "Quantity" },
    unit: { th: "หน่วย", en: "Unit" },
    litre: { th: "ลิตร", en: "litre" },
    find: { th: "หาค่าอ้างอิง", en: "Find a factor" },
    efTitle: { th: "เลือกค่าอ้างอิง", en: "Choose a factor" },
    efSource: { th: "ตารางค่าการปล่อยของ อบก.", en: "TGO emission factor table" },
    searching: { th: "กำลังค้นหาในตาราง…", en: "Searching the table…" },
    grid: { th: "ไฟฟ้าจากระบบสายส่ง", en: "Grid electricity" },
    diesel: { th: "น้ำมันดีเซล", en: "Diesel" },
    lpg: { th: "ก๊าซหุงต้ม (LPG)", en: "LPG" },
    unitOff: { th: "หน่วยไม่ตรง", en: "Unit doesn't match" },
    calc: { th: "ตรวจและคำนวณ", en: "Check & calculate" },
    resTitle: { th: "ผลการตรวจ", en: "Checks" },
    chkUnit: { th: "หน่วยตรงกัน · kWh", en: "Units match · kWh" },
    chkScope: { th: "ขอบเขต 2 · ไฟฟ้าที่ซื้อมาใช้", en: "Scope 2 · purchased electricity" },
    chkId: { th: "รหัส ELEC-001 อยู่ในตาราง", en: "ELEC-001 is in the table" },
    emissions: { th: "การปล่อยก๊าซเรือนกระจก", en: "Greenhouse gas emissions" },
    source: { th: "อบก. ฉบับ ก.พ. 2569", en: "TGO, Feb 2026 edition" },
    aiTitle: { th: "ให้ AI เสนอค่าอ้างอิง", en: "AI suggests the factor" },
    dev: { th: "กำลังพัฒนา", en: "In development" },
    aiNote: { th: "AI จะเสนอค่าจากตาราง อบก. ให้ผู้ใช้ยืนยันก่อนคำนวณ", en: "It will suggest a factor from the TGO table for the user to confirm before calculating." },
    aiAsk: { th: "ถ้าข้อมูลไม่พอ จะถามเพิ่มหรือแจ้งว่าไม่พบค่า", en: "If the details aren't enough, it asks or says no factor was found." },
    sample: { th: "ข้อมูลสมมติ", en: "Sample data" }
  };

  function cmHead(stage, h) {
    return '<div class="cm-head"><b class="cm-brand">Carbon <span>Calculator</span></b><ol class="cm-steps">' +
      CM.steps.map(function (s, i) {
        var n = i + 1;
        var cls = (n < stage ? "done" : n === stage ? "on" : "") + (n === 4 ? " dev" : "");
        return '<li class="' + cls + '"><span>' + (n < stage ? "✓" : n) + "</span>" + h.tx(s) + "</li>";
      }).join("") + "</ol></div>";
  }

  var cmScreens = {
    input: {
      render: function (s, h) {
        var units = [["kwh", "kWh"], ["mj", "MJ"], ["l", h.tx(CM.litre)]].map(function (u) {
          return '<span class="cm-chip' + (s.unit === u[0] ? " on" : "") + '" id="cm-u-' + u[0] + '" data-act="unit" data-unit="' + u[0] + '">' + u[1] + "</span>";
        }).join("");
        return '<div class="cm">' + cmHead(1, h) + '<div class="cm-body">' +
          '<div class="cm-title">' + h.tx(CM.addTitle) + "<small>" + h.tx(CM.site) + " · " + h.tx(CM.sample) + "</small></div>" +
          '<div class="cm-field"><span>' + h.tx(CM.activity) + '</span><b class="cm-input" id="cm-act">' + h.esc(s.activity) + "</b></div>" +
          '<div class="cm-row">' +
            '<div class="cm-field"><span>' + h.tx(CM.amount) + '</span><b class="cm-input cm-num" id="cm-amt">' + h.esc(s.amount) + "</b></div>" +
            '<div class="cm-field"><span>' + h.tx(CM.unit) + '</span><div class="cm-chips">' + units + "</div></div>" +
          "</div>" +
          '<div class="cm-actions"><span class="cm-btn" id="cm-find" data-act="find">' + h.tx(CM.find) + " →</span></div>" +
        "</div></div>";
      },
      actions: {
        unit: function (ctx, el) { return ctx.set({ unit: el.getAttribute("data-unit") }); },
        find: function (ctx) { return ctx.go("ef", "push"); }
      }
    },

    ef: {
      render: function (s, h) {
        var rows = !s.efRows ? '<p class="cm-wait">' + h.tx(CM.searching) + "</p>" :
          '<div class="cm-ef' + (s.picked ? " on" : "") + '" id="cm-ef-1" data-act="pick"><code>ELEC-001</code><span>' + h.tx(CM.grid) + "</span><b>0.475 <small>kgCO₂e/kWh</small></b><i>" + (s.picked ? "✓" : "") + "</i></div>" +
          '<div class="cm-ef off"><code>DSL-001</code><span>' + h.tx(CM.diesel) + "</span><b><small>" + h.tx(CM.unitOff) + " · " + h.tx(CM.litre) + "</small></b><i></i></div>" +
          '<div class="cm-ef off"><code>LPG-001</code><span>' + h.tx(CM.lpg) + "</span><b><small>" + h.tx(CM.unitOff) + " · kg</small></b><i></i></div>";
        return '<div class="cm">' + cmHead(2, h) + '<div class="cm-body">' +
          '<div class="cm-title">' + h.tx(CM.efTitle) + "<small>" + h.tx(CM.efSource) + "</small></div>" +
          '<div class="cm-query">' + h.esc(s.activity) + " · " + h.esc(s.amount) + " kWh</div>" +
          '<div class="cm-table">' + rows + "</div>" +
          '<div class="cm-actions"><span class="cm-btn' + (s.picked ? "" : " is-off") + '" id="cm-calc" data-act="calc">' + h.tx(CM.calc) + " →</span></div>" +
        "</div></div>";
      },
      actions: {
        pick: function (ctx) { return ctx.set({ picked: true }); },
        calc: function (ctx) { return ctx.state.picked ? ctx.go("result", "push") : null; }
      }
    },

    result: {
      render: function (s, h) {
        var checks = !s.checked ? "" : [CM.chkUnit, CM.chkScope, CM.chkId].map(function (c) {
          return '<li class="cm-chk"><i>✓</i>' + h.tx(c) + "</li>";
        }).join("");
        return '<div class="cm">' + cmHead(3, h) + '<div class="cm-body cm-split">' +
          '<div><div class="cm-title">' + h.tx(CM.resTitle) + '</div><ul class="cm-checks">' + checks + "</ul></div>" +
          '<div class="cm-total"><span>' + h.tx(CM.emissions) + '</span><b><em id="cm-t">' + Number(s.t || 0).toFixed(2) + "</em> tCO₂e</b>" +
            '<p class="cm-formula">12,000 kWh × 0.475 = 5,700 kgCO₂e</p>' +
            '<p class="cm-src" id="cm-src">ELEC-001 · ' + h.tx(CM.source) + "</p></div>" +
        "</div></div>";
      }
    },

    ai: {
      render: function (s, h) {
        return '<div class="cm">' + cmHead(4, h) + '<div class="cm-body">' +
          '<div class="cm-title">' + h.tx(CM.aiTitle) + ' <span class="cm-dev" id="cm-dev">' + h.tx(CM.dev) + "</span></div>" +
          '<div class="cm-field"><span>' + h.tx(CM.activity) + '</span><b class="cm-input" id="cm-ai-in">' + h.esc(s.ai) + "</b></div>" +
          (s.aiShown ? '<div class="cm-ai"><div class="cm-skel"><i></i><i></i><i></i></div><p>' + h.tx(CM.aiNote) + "</p><p>" + h.tx(CM.aiAsk) + "</p></div>" : "") +
        "</div></div>";
      }
    }
  };

  window.Walkthrough.register("carbon-calculator", {
    url: "localhost:8501 · Carbon Calculator",
    label: {
      th: "ภาพจำลองหน้าจอ Carbon Calculator ด้วยข้อมูลสมมติ: กรอกการใช้ไฟฟ้าโรงงาน 12,000 kWh เลือกค่า ELEC-001 0.475 kgCO₂e/kWh ได้ผล 5.70 tCO₂e และส่วน AI ที่กำลังพัฒนา",
      en: "Carbon Calculator screen mockup with sample data: 12,000 kWh of factory electricity, factor ELEC-001 at 0.475 kgCO₂e/kWh, a result of 5.70 tCO₂e, and the AI part still in development"
    },
    start: "input",
    cover: 3,          // card image = the result after beat 3 (assets/img/card-carbon-calculator*.webp)
    state: { activity: "", amount: "", unit: "", efRows: false, picked: false, checked: false, t: 0, ai: "", aiShown: false },
    screens: cmScreens,
    steps: [
      { run: function (c) {
        return c.type("#cm-act", "activity", "ไฟฟ้าโรงงาน")
          .then(function () { return c.type("#cm-amt", "amount", "12,000", 12); })
          .then(function () { return c.tap("#cm-u-kwh"); })
          .then(function () { return c.mark("#cm-find"); });
      } },
      { run: function (c) {
        return c.tap("#cm-find")
          .then(function () { return c.wait(250); })
          .then(function () { return c.set({ efRows: true }, false); })
          .then(function () { return c.arrive(".cm-ef"); })
          .then(function () { return c.mark("#cm-ef-1"); })
          .then(function () { return c.wait(300); })
          .then(function () { return c.tap("#cm-ef-1"); });
      } },
      { run: function (c) {
        return c.mark(null)
          .then(function () { return c.tap("#cm-calc"); })
          .then(function () { return c.set({ checked: true }, false); })
          .then(function () { return c.arrive(".cm-chk"); })
          .then(function () { return c.count("#cm-t", "t", 5.7, { fmt: function (v) { return v.toFixed(2); } }); })
          .then(function () { return c.mark("#cm-src"); });
      } },
      { run: function (c) {
        return c.go("ai", "fade")
          .then(function () { return c.type("#cm-ai-in", "ai", "ค่าไฟสำนักงานสาขา"); })
          .then(function () { return c.set({ aiShown: true }, false); })
          .then(function () { return c.arrive(".cm-ai"); })
          .then(function () { return c.mark("#cm-dev"); });
      } }
    ]
  });

  /* ---------------------------------------------------------------------
     Shared pieces for the workspace-style screens (02–04)
     --------------------------------------------------------------------- */
  var SAMPLE = { th: "ข้อมูลสมมติ", en: "Sample data" };
  function wsHead(h, title, sub, tabs) {
    return '<div class="ws-head"><b>' + h.tx(title) + "</b>" + (sub ? '<span class="ws-sub">' + h.tx(sub) + "</span>" : "") +
      (tabs || "") + '<span class="ws-tag">' + h.tx(SAMPLE) + "</span></div>";
  }
  var nf = function (v, d) {
    var lang = window.I18N && window.I18N.lang === "en" ? "en-US" : "th-TH";
    return Number(v).toLocaleString(lang, { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 });
  };
  /* split an integer total over weights so the parts add up exactly */
  function allocate(total, weights) {
    var sum = weights.reduce(function (s, w) { return s + w; }, 0);
    var raw = weights.map(function (w) { return total * w / sum; });
    var out = raw.map(Math.floor);
    var left = total - out.reduce(function (s, v) { return s + v; }, 0);
    raw.map(function (v, i) { return [v - Math.floor(v), i]; })
      .sort(function (a, b) { return b[0] - a[0]; })
      .slice(0, left).forEach(function (r) { out[r[1]]++; });
    return out;
  }

  /* ---------------------------------------------------------------------
     02 CFO Dashboard — sample data, same set as the old analysis demo:
     three sites, Scope 1/2/3 for 2025 (2568) against the 2024 (2567) base.
     Total 18,465 tCO₂e, 6.2% below the base year (19,686).
     --------------------------------------------------------------------- */
  var SITES = [{ th: "โรงงาน A", en: "Plant A" }, { th: "โรงงาน B", en: "Plant B" }, { th: "สำนักงานใหญ่", en: "Head office" }];
  var CFO = { s1: [1980, 1050, 35], s2: [2760, 1640, 410], s3: [6420, 3890, 280], base: [11920, 7010, 756] };
  var siteTotal = function (i) { return CFO.s1[i] + CFO.s2[i] + CFO.s3[i]; };
  var ALL_TOTAL = [0, 1, 2].reduce(function (s, i) { return s + siteTotal(i); }, 0);           // 18,465
  var ALL_BASE = CFO.base.reduce(function (s, v) { return s + v; }, 0);                        // 19,686
  var MONTH_W = [8.0, 7.4, 8.3, 8.4, 8.9, 8.6, 8.3, 8.1, 8.2, 8.6, 8.7, 8.5];
  var SCOPE_TOT = ["s1", "s2", "s3"].map(function (k) { return CFO[k].reduce(function (s, v) { return s + v; }, 0); });
  var MONTHLY = SCOPE_TOT.map(function (t) { return allocate(t, MONTH_W); });                  // [scope][month]
  var MONTHS = {
    th: ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."],
    en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  };
  var SRC = {
    raw: { th: "วัตถุดิบเกษตร", en: "Agricultural inputs", s: 3 }, elec: { th: "ไฟฟ้า", en: "Electricity", s: 2 },
    boiler: { th: "เชื้อเพลิงหม้อไอน้ำ", en: "Boiler fuel", s: 1 }, pack: { th: "บรรจุภัณฑ์", en: "Packaging", s: 3 },
    trans: { th: "ขนส่งขาเข้า", en: "Inbound transport", s: 3 }, travel: { th: "เดินทางเพื่อธุรกิจ", en: "Business travel", s: 3 },
    commute: { th: "การเดินทางของพนักงาน", en: "Employee commuting", s: 3 }, cars: { th: "รถของบริษัท", en: "Company cars", s: 1 },
    waste: { th: "ของเสีย", en: "Waste", s: 3 }
  };
  /* top 5 of each site's 10 sources; scope sums match CFO above */
  var TOP = [
    [["raw", 4350], ["elec", 2760], ["boiler", 1420], ["pack", 1280], ["trans", 790]],
    [["raw", 2640], ["elec", 1640], ["pack", 780], ["boiler", 720], ["trans", 470]],
    [["elec", 410], ["travel", 160], ["commute", 90], ["cars", 35], ["waste", 30]]
  ];
  var CF = {
    importTitle: { th: "นำเข้าไฟล์ตามแบบฟอร์ม อบก.", en: "Import TGO workbooks" },
    importSub: { th: "Google Sheets · Apps Script", en: "Google Sheets · Apps Script" },
    importBtn: { th: "นำเข้าทั้งหมด", en: "Import all" },
    master: { th: "ชีตรวม", en: "Master sheet" },
    empty: { th: "ยังไม่มีข้อมูล", en: "No data yet" },
    dash: { th: "CFO Dashboard", en: "CFO Dashboard" },
    year: { th: "ปี 2568", en: "2025" },
    all: { th: "ทุกหน่วยงาน", en: "All sites" },
    total: { th: "การปล่อยรวม", en: "Total emissions" },
    matches: { th: "✓ ยอดทุกเดือนรวมกันตรงกับ Fr‑04.1", en: "✓ Monthly figures add up to Fr‑04.1" },
    down: { th: "ลดลง {p}% จากปีฐาน 2567", en: "Down {p}% from the 2024 base year" },
    scope: { th: "ขอบเขต", en: "Scope" },
    top: { th: "ปล่อยมากที่สุด 5 อันดับแรก (จาก 10)", en: "Top 5 of 10 sources" },
    byMonth: { th: "รายเดือนแยกตามขอบเขต", en: "By month and scope" }
  };

  var cfoScreens = {
    files: {
      render: function (s, h) {
        var files = SITES.map(function (site, i) {
          return '<div class="ws-file" id="cfo-f' + i + '"><i>XLSX</i><span>' + h.tx(site) + '</span><small><em>Fr-04.1</em><em>Fr-05</em></small></div>';
        }).join("");
        var rows = "";
        for (var i = 0; i < s.imported; i++) rows += '<li class="ws-logrow" data-row="' + i + '"><i>✓</i>' + h.tx(SITES[i]) + "<small>Fr-04.1 · Fr-05</small></li>";
        return '<div class="ws">' + wsHead(h, CF.importTitle, CF.importSub) + '<div class="ws-body ws-split">' +
          '<div class="ws-col">' + files + '<span class="ws-btn" id="cfo-import" data-act="import">▸ ' + h.tx(CF.importBtn) + "</span></div>" +
          '<div class="ws-panel" id="cfo-log"><b>' + h.tx(CF.master) + "</b>" + (rows ? '<ul class="ws-log">' + rows + "</ul>" : '<p class="ws-empty">' + h.tx(CF.empty) + "</p>") + "</div>" +
        "</div></div>";
      }
    },
    dash: {
      render: function (s, h) {
        var chips = '<span class="ws-chip on">' + h.tx(CF.year) + "</span>" +
          '<span class="ws-chip' + (s.site < 0 ? " on" : "") + '" id="cfo-s-all" data-act="site" data-site="-1">' + h.tx(CF.all) + "</span>" +
          SITES.map(function (site, i) { return '<span class="ws-chip' + (s.site === i ? " on" : "") + '" id="cfo-s-' + i + '" data-act="site" data-site="' + i + '">' + h.tx(site) + "</span>"; }).join("");
        var base = s.site < 0 ? ALL_BASE : CFO.base[s.site];
        var tot = s.site < 0 ? ALL_TOTAL : siteTotal(s.site);
        var pct = ((base - tot) / base * 100).toFixed(1);
        var sub = s.site < 0 ? '<p class="ws-ok" id="cfo-check">' + h.tx(CF.matches) + "</p>" : "";
        var delta = '<p class="ws-delta" id="cfo-delta">↓ ' + h.tx(CF.down).replace("{p}", pct) + "</p>";
        var legend = '<ul class="ws-legend">' + [1, 2, 3].map(function (k) { return '<li><i style="background:var(--series-' + k + ')"></i>' + h.tx(CF.scope) + " " + k + "</li>"; }).join("") + "</ul>";
        var chart = s.site < 0
          ? '<p class="ws-cap">' + h.tx(CF.byMonth) + "</p>" + Charts.columns(MONTHS.en.map(function (m, i) {
              return { label: MONTHS[h.lang][i], parts: [MONTHLY[0][i], MONTHLY[1][i], MONTHLY[2][i]] };
            }), { w: 330, h: 196, fmt: function (v) { return nf(v); } })
          : '<p class="ws-cap">' + h.tx(CF.top) + "</p>" + Charts.hbars(TOP[s.site].map(function (r) {
              return { label: h.tx(SRC[r[0]]), sub: h.tx(CF.scope) + " " + SRC[r[0]].s, value: r[1], color: "var(--series-" + SRC[r[0]].s + ")" };
            }), { fmt: function (v) { return nf(v); } });
        return '<div class="ws">' + wsHead(h, CF.dash, null) + '<div class="ws-body">' +
          '<div class="ws-chips">' + chips + "</div>" +
          '<div class="ws-dash">' +
            '<div class="ws-kpi"><span>' + h.tx(CF.total) + '</span><b><em id="cfo-total">' + nf(s.total) + "</em> tCO₂e</b>" + sub + delta + legend + "</div>" +
            '<div class="ws-chart">' + chart + "</div>" +
          "</div></div></div>";
      },
      actions: {
        site: function (ctx, el) {
          var i = +el.getAttribute("data-site");
          return ctx.set({ site: i, total: i < 0 ? ALL_TOTAL : siteTotal(i) });
        }
      }
    }
  };

  window.Walkthrough.register("cfo-dashboard", {
    url: "Google Sheets · CFO Dashboard",
    label: {
      th: "ภาพจำลองหน้าจอ CFO Dashboard ด้วยข้อมูลสมมติ: นำเข้าไฟล์ 3 หน่วยงาน รวมเป็นรายเดือนแยกตามขอบเขตได้ 18,465 tCO₂e แล้วเลือกโรงงาน A ได้ 11,160 tCO₂e ลดลง 6.4% จากปีฐาน",
      en: "CFO Dashboard screen mockup with sample data: three site workbooks imported, 18,465 tCO₂e by month and scope, then Plant A at 11,160 tCO₂e, down 6.4% from the base year"
    },
    start: "files",
    cover: 2,          // card image = the monthly dashboard after beat 2
    state: { imported: 0, site: -1, total: 0 },
    screens: cfoScreens,
    steps: [
      { run: function (c) {
        /* the three workbooks fly in overlapping, 220 ms apart, and each
           lands as a ticked row in the master sheet */
        return c.arrive(".ws-file")
          .then(function () { return c.tap("#cfo-import"); })
          .then(function () {
            return Promise.all([0, 1, 2].map(function (i) {
              return c.wait(i * 220)
                .then(function () { return c.fly("#cfo-f" + i, "#cfo-log", "Fr-04.1"); })
                .then(function () { return c.set({ imported: Math.max(c.state.imported, i + 1) }, false); })
                .then(function () { return c.arrive(".ws-logrow[data-row='" + i + "']"); });
            }));
          });
      } },
      { run: function (c) {
        return c.go("dash", "push")
          .then(function () { return c.count("#cfo-total", "total", ALL_TOTAL, { fmt: function (v) { return nf(Math.round(v)); } }); })
          .then(function () { return c.mark("#cfo-check"); });
      } },
      { run: function (c) {
        return c.mark(null)
          .then(function () { return c.tap("#cfo-s-0"); })
          .then(function () { return c.mark("#cfo-delta"); });
      } }
    ]
  });

  /* ---------------------------------------------------------------------
     03 Farm EF Workbook — sample data. Survey answers stay in Thai (they
     are Thai field forms). The histogram is the old demo's shape scaled to
     60 plots; mean 0.412 kgCO₂e/kg, 95% CI 0.361–0.463.
     --------------------------------------------------------------------- */
  var FE_ROWS = [
    { id: "01", fert: ["ยูเรีย 2 กระสอบ", "ยูเรีย 100 กก."], fuel: ["ดีเซล 15 ลิตร", "ดีเซล 15 L"], yld: ["3,200 กก.", "3,200 กก."], bad: ["fert"] },
    { id: "02", fert: ["46-0-0 50 kg", "46-0-0 50 กก."], fuel: ["ดีเซล 12 L", "ดีเซล 12 L"], yld: ["2,850 กก.", "2,850 กก."], bad: [] },
    { id: "03", fert: ["15-15-15 3 กระสอบ", "15-15-15 150 กก."], fuel: ["เบนซิน 8 ลิตร", "เบนซิน 8 L"], yld: ["3.1 ตัน", "3,100 กก."], bad: ["fert", "yld"] },
    { id: "04", fert: ["ยูเรีย 40 กก.", "ยูเรีย 40 กก."], fuel: ["ดีเซล 20 ลิตร", "ดีเซล 20 L"], yld: ["2,900 กก.", "2,900 กก."], bad: [] },
    { id: "05", fert: ["15-15-15 2 กระสอบ", "15-15-15 100 กก."], fuel: ["—", "—"], yld: ["3,050 กก.", "3,050 กก."], bad: ["fert"] }
  ];
  var FE_HIST = [4, 11, 16, 13, 9, 4, 3];   // plots per 0.1 band from 0.1 to 0.8
  var FE = {
    title: { th: "Farm EF Workbook", en: "Farm EF Workbook" },
    tabs: { raw: "Raw", clean: "Clean", ef: "EF" },
    form: { th: "แบบสอบถาม · แปลง", en: "Survey · plot" },
    more: { th: "อีก 57 ราย", en: "57 more" },
    head: [{ th: "แปลง", en: "Plot" }, { th: "ปุ๋ย", en: "Fertiliser" }, { th: "เชื้อเพลิง", en: "Fuel" }, { th: "ผลผลิตสด", en: "Fresh yield" }],
    rows: { th: "แถว", en: "rows" },
    unitFix: { th: "แปลงหน่วยเป็นกิโลกรัมแล้ว 3 แถว", en: "3 rows converted to kg" },
    unitBad: { th: "หน่วยไม่ตรง 3 แถว", en: "3 rows with mixed units" },
    formula: { th: "EF ของแปลง = Σ (กิจกรรม × EF) ÷ ผลผลิตสด", en: "Plot EF = Σ (activity × EF) ÷ fresh yield" },
    mean: { th: "ค่าเฉลี่ย EF ของ 60 แปลง", en: "Mean EF of 60 plots" },
    plots: { th: "จำนวนแปลงตามช่วง EF", en: "Plots by EF band" }
  };

  var feScreens = {
    wb: {
      render: function (s, h) {
        var tabs = '<span class="ws-tabs">' + ["raw", "clean", "ef"].map(function (t) {
          return '<span class="ws-tab' + (s.tab === t ? " on" : "") + '" id="fe-tab-' + t + '" data-act="tab" data-tab="' + t + '">' + FE.tabs[t] + "</span>";
        }).join("") + "</span>";
        var body;
        if (s.tab === "ef") {
          body = '<div class="ws-dash">' +
            '<div class="ws-kpi"><p class="fe-formula">' + h.tx(FE.formula) + "</p><span>" + h.tx(FE.mean) + '</span><b><em id="fe-mean">' + Number(s.mean).toFixed(3) + "</em> kgCO₂e/kg</b>" +
              '<p class="ws-delta" id="fe-ci">95% CI 0.361–0.463<br>n = 60</p></div>' +
            '<div class="ws-chart"><p class="ws-cap">' + h.tx(FE.plots) + "</p>" + Charts.columns(FE_HIST.map(function (n, i) {
              return { label: (0.1 * (i + 1)).toFixed(1), value: n, hi: i === 3 };
            }), { w: 330, h: 196, fmt: function (v) { return String(Math.round(v)); }, alt: h.tx(FE.plots) }) + "</div></div>";
        } else {
          var clean = s.tab === "clean";
          var cell = function (r, k) {
            var cls = clean && r.bad.indexOf(k) >= 0 ? (s.fixed ? " ok" : " bad") : "";
            return '<td class="' + cls + '">' + h.esc(r[k][clean && s.fixed ? 1 : 0]) + "</td>";
          };
          var rows = !s.rows ? "" : FE_ROWS.map(function (r) {
            return '<tr class="fe-tr" id="fe-r' + r.id + '"><td>' + r.id + "</td>" + cell(r, "fert") + cell(r, "fuel") + cell(r, "yld") + "</tr>";
          }).join("");
          var note = clean ? '<p class="' + (s.fixed ? "ws-ok" : "ws-warn") + '" id="fe-note">' + (s.fixed ? "✓ " + h.tx(FE.unitFix) : "! " + h.tx(FE.unitBad)) + "</p>" : "";
          var forms = clean ? "" : '<div class="fe-forms" id="fe-forms">' + [1, 2, 3].map(function (n) {
            return '<div class="fe-form"><b>' + h.tx(FE.form) + " 0" + n + '</b><i></i><i></i><i></i></div>';
          }).join("") + "<small>+ " + h.tx(FE.more) + "</small></div>";
          body = '<div class="fe-grid' + (clean ? " is-clean" : "") + '">' + forms +
            '<div class="fe-sheet" id="fe-table"><table class="ws-table"><thead><tr>' + FE.head.map(function (c) { return "<th>" + h.tx(c) + "</th>"; }).join("") + "</tr></thead><tbody>" + rows + "</tbody></table>" +
            '<p class="ws-count"><b id="fe-count">' + Math.round(s.n) + "</b> / 60 " + h.tx(FE.rows) + "</p>" + note + "</div></div>";
        }
        return '<div class="ws">' + wsHead(h, FE.title, null, tabs) + '<div class="ws-body">' + body + "</div></div>";
      },
      actions: {
        tab: function (ctx, el) { return ctx.set({ tab: el.getAttribute("data-tab") }); }
      }
    }
  };

  window.Walkthrough.register("farm-ef-workbook", {
    url: "Farm EF Workbook.xlsx",
    label: {
      th: "ภาพจำลองหน้าจอ workbook ด้วยข้อมูลสมมติ: นำเข้าแบบสอบถาม 60 ราย แปลงหน่วยที่ไม่ตรงเป็นกิโลกรัม แล้วได้ EF เฉลี่ย 0.412 kgCO₂e/kg ช่วงความเชื่อมั่น 95% 0.361–0.463",
      en: "Workbook screen mockup with sample data: 60 survey responses imported, mixed units converted to kilograms, and a mean EF of 0.412 kgCO₂e/kg with a 95% CI of 0.361–0.463"
    },
    start: "wb",
    state: { tab: "raw", rows: false, n: 0, fixed: false, mean: 0 },
    screens: feScreens,
    steps: [
      { run: function (c) {
        return c.arrive(".fe-form")
          .then(function () { return c.fly("#fe-forms", "#fe-table", { th: "60 ราย", en: "60 farmers" }); })
          .then(function () { return c.set({ rows: true }, false); })
          .then(function () { return c.arrive(".fe-tr"); })
          .then(function () { return c.count("#fe-count", "n", 60, { ms: 800 }); });
      } },
      { run: function (c) {
        return c.tap("#fe-tab-clean")
          .then(function () { return c.wait(900); })
          .then(function () { return c.set({ fixed: true }); })
          .then(function () { return c.mark("#fe-r03"); });
      } },
      { run: function (c) {
        return c.mark(null)
          .then(function () { return c.tap("#fe-tab-ef"); })
          .then(function () { return c.count("#fe-mean", "mean", 0.412, { fmt: function (v) { return v.toFixed(3); } }); })
          .then(function () { return c.mark("#fe-ci"); });
      } }
    ]
  });

  /* ---------------------------------------------------------------------
     04 SROI — sample entries that show the method: scope → outcomes and
     indicators → a summary in three dimensions. No monetary values or
     ratio, because the story's result is a framework, not a valuation.
     --------------------------------------------------------------------- */
  var DIM = {
    eco: { th: "เศรษฐกิจ", en: "Economic", c: 1 },
    soc: { th: "สังคม", en: "Social", c: 2 },
    env: { th: "สิ่งแวดล้อม", en: "Environmental", c: 3 }
  };
  var SR_ROWS = [
    { d: "eco", out: { th: "รายได้ของเกษตรกร", en: "Farmer income" }, ind: { th: "รายได้ต่อรอบการผลิต", en: "Income per crop cycle" }, ev: { th: "บันทึกการรับซื้อ", en: "Purchase records" } },
    { d: "soc", out: { th: "ความสัมพันธ์ในชุมชน", en: "Community relationships" }, ind: { th: "การเข้าร่วมกิจกรรม", en: "Activity participation" }, ev: { th: "แบบสอบถาม", en: "Questionnaire" } },
    { d: "env", out: { th: "การใช้สารเคมีในแปลง", en: "Chemical use on plots" }, ind: { th: "ปริมาณสารเคมีต่อไร่", en: "Chemicals per rai" }, ev: { th: "แบบสำรวจแปลง", en: "Plot survey" } }
  ];
  var SR = {
    scopeTitle: { th: "กำหนดสิ่งที่จะประเมิน", en: "What to assess" },
    acts: [
      { name: { th: "การรับซื้อมะเขือเทศ", en: "Tomato procurement" }, groups: [{ th: "เกษตรกรผู้ขาย", en: "Selling farmers" }, { th: "ครอบครัวเกษตรกร", en: "Farm families" }] },
      { name: { th: "กิจกรรมชุมชนสัมพันธ์", en: "Community engagement" }, groups: [{ th: "ชุมชนรอบพื้นที่", en: "Nearby community" }, { th: "พนักงานบริษัท", en: "Company staff" }] }
    ],
    activity: { th: "กิจกรรม", en: "Activity" },
    who: { th: "กลุ่มที่ได้รับผล", en: "Who is affected" },
    indTitle: { th: "ผลลัพธ์และตัวชี้วัด", en: "Outcomes and indicators" },
    cols: [{ th: "มิติ", en: "Dimension" }, { th: "ผลลัพธ์", en: "Outcome" }, { th: "ตัวชี้วัด", en: "Indicator" }, { th: "หลักฐานที่ต้องเก็บ", en: "Evidence to collect" }],
    sumTitle: { th: "สรุปตามกรอบ SROI", en: "Summary in the SROI framework" },
    sumSub: { th: "ผลลัพธ์ 3 มิติ", en: "Outcomes in three dimensions" },
    evidence: { th: "หลักฐาน", en: "Evidence" }
  };

  var srScreens = {
    scope: {
      render: function (s, h) {
        return '<div class="ws">' + wsHead(h, SR.scopeTitle, null) + '<div class="ws-body"><div class="sr-acts">' +
          SR.acts.map(function (a, i) {
            return '<div class="sr-act" id="sr-a' + i + '"><span>' + h.tx(SR.activity) + " " + (i + 1) + "</span><b>" + h.tx(a.name) + "</b>" +
              (s.groups ? '<p class="sr-who">' + h.tx(SR.who) + '</p><div class="sr-grps">' + a.groups.map(function (g) { return '<span class="sr-grp">' + h.tx(g) + "</span>"; }).join("") + "</div>" : "") +
            "</div>";
          }).join("") + "</div></div></div>";
      }
    },
    ind: {
      render: function (s, h) {
        return '<div class="ws">' + wsHead(h, SR.indTitle, null) + '<div class="ws-body"><table class="ws-table sr-table"><thead><tr>' +
          SR.cols.map(function (c, i) { return "<th" + (i === 3 ? ' id="sr-ev"' : "") + ">" + h.tx(c) + "</th>"; }).join("") + "</tr></thead><tbody>" +
          SR_ROWS.map(function (r) {
            return '<tr class="sr-row"><td><span class="sr-dim" style="--c:var(--series-' + DIM[r.d].c + ')">' + h.tx(DIM[r.d]) + "</span></td><td><b>" + h.tx(r.out) + "</b></td><td>" + h.tx(r.ind) + "</td><td>" + h.tx(r.ev) + "</td></tr>";
          }).join("") + "</tbody></table></div></div>";
      }
    },
    sum: {
      render: function (s, h) {
        return '<div class="ws">' + wsHead(h, SR.sumTitle, SR.sumSub) + '<div class="ws-body"><div class="sr-cols" id="sr-sum">' +
          SR_ROWS.map(function (r) {
            return '<div class="sr-col" style="--c:var(--series-' + DIM[r.d].c + ')"><span class="sr-dim">' + h.tx(DIM[r.d]) + "</span>" +
              "<dl><dt>" + h.tx(SR.cols[1]) + "</dt><dd><b>" + h.tx(r.out) + "</b></dd>" +
              "<dt>" + h.tx(SR.cols[2]) + "</dt><dd>" + h.tx(r.ind) + "</dd>" +
              "<dt>" + h.tx(SR.evidence) + '</dt><dd class="sr-ev"><i>✓</i>' + h.tx(r.ev) + "</dd></dl></div>";
          }).join("") + "</div></div></div>";
      }
    }
  };

  window.Walkthrough.register("sroi-assessment", {
    url: "SROI · framework",
    label: {
      th: "ภาพจำลองกรอบ SROI ด้วยตัวอย่างสมมติ: กิจกรรมรับซื้อมะเขือเทศและกิจกรรมชุมชน กลุ่มที่ได้รับผล ผลลัพธ์ ตัวชี้วัด หลักฐาน และสรุปสามมิติ",
      en: "SROI framework mockup with sample entries: tomato procurement and community engagement, who is affected, outcomes, indicators, evidence and a three-dimension summary"
    },
    start: "scope",
    state: { groups: false },
    screens: srScreens,
    steps: [
      { run: function (c) {
        return c.arrive(".sr-act")
          .then(function () { return c.set({ groups: true }, false); })
          .then(function () { return c.arrive(".sr-grp"); });
      } },
      { run: function (c) {
        return c.go("ind", "push")
          .then(function () { return c.arrive(".sr-row"); })
          .then(function () { return c.mark("#sr-ev"); });
      } },
      { run: function (c) {
        return c.go("sum", "fade")
          .then(function () { return c.arrive(".sr-col"); })
          .then(function () { return c.mark("#sr-sum"); });
      } }
    ]
  });
})();
