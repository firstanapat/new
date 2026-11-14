/* ==========================================================================
   Project story walkthroughs (screens + beats). Engine: js/walkthrough.js.
   All figures are sample data. Each story's steps line up with the
   <li> items in its <ol class="project-steps">.
   ========================================================================== */
(function () {
  "use strict";
  if (!window.Walkthrough) return;

  /* ---------------------------------------------------------------------
     01 CarbonMate TH
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
    chkScope: { th: "ขอบเขต 2 · ไฟฟ้าที่ซื้อ", en: "Scope 2 · purchased electricity" },
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
    return '<div class="cm-head"><b class="cm-brand">CarbonMate <span>TH</span></b><ol class="cm-steps">' +
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

  window.Walkthrough.register("carbonmate-th", {
    url: "localhost:8501 · CarbonMate TH",
    label: {
      th: "ภาพจำลองหน้าจอ CarbonMate TH ด้วยข้อมูลสมมติ: กรอกการใช้ไฟฟ้าโรงงาน 12,000 kWh เลือกค่า ELEC-001 0.475 kgCO₂e/kWh ได้ผล 5.70 tCO₂e และส่วน AI ที่กำลังพัฒนา",
      en: "CarbonMate TH screen mockup with sample data: 12,000 kWh of factory electricity, factor ELEC-001 at 0.475 kgCO₂e/kWh, a result of 5.70 tCO₂e, and the AI part still in development"
    },
    start: "input",
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
})();
