/* ==========================================================================
   Thai document guide: the three-step walkthrough (engine in walkthrough.js)
   01 OCR reads the scan line by line; the misread heading is fixed
   02 AI suggests wording; one edit is accepted, one is rejected
   03 Reviewed fields go to thai-docx; the command produces the Word draft
   Document text comes from assets/thai-document-guide/ocr-output.json and
   reviewed-memo.json, so the screens match the files the reader can download.
   The memo text stays in Thai in both languages; only the labels change.
   ========================================================================== */
(function () {
  "use strict";
  if (!window.Walkthrough) return;

  var A = "assets/thai-document-guide/";
  var SAMPLE = { th: "ข้อมูลสมมติ", en: "Sample data" };
  function head(h, title, sub) {
    return '<div class="ws-head"><b>' + h.tx(title) + "</b>" + (sub ? '<span class="ws-sub">' + h.tx(sub) + "</span>" : "") +
      '<span class="ws-tag">' + h.tx(SAMPLE) + "</span></div>";
  }

  /* first six blocks of ocr-output.json: category, text, top-left of bbox */
  var LINES = [
    { cat: "header", text: "เอกสารสมมติสำหรับสาธิต", xy: "688,60" },
    { cat: "title", text: "บันทึกช้อความ", xy: "368,107" },
    { cat: "text", text: "ส่วนราชการ งานอาคารและสถานที่ ศูนย์การเรียนรู้ตัวอย่าง", xy: "97,175" },
    { cat: "text", text: "ที่ ตย ๐๐๗/๒๕๖๙ วันที่ ๑๐ พฤศจิกายน ๒๕๖๙", xy: "97,212" },
    { cat: "text", text: "เรื่อง ขอข้อมูลการใช้ไฟฟ้ารายเดือน", xy: "97,247" },
    { cat: "text", text: "เรียน หัวหน้าฝ่ายอาคารทุกอาคาร", xy: "97,284" }
  ];
  var T = {
    ocrSub: { th: "scanned-memo.pdf · หน้า 1", en: "scanned-memo.pdf · page 1" },
    waiting: { th: "กำลังอ่านภาพ…", en: "Reading the page…" },
    checked: { th: "ตรวจกับภาพแล้ว", en: "Checked against the scan" },
    revTitle: { th: "ตรวจคำแนะนำของ AI", en: "Review AI suggestions" },
    revSub: { th: "2 ข้อเสนอ", en: "2 suggestions" },
    before: { th: "เดิม", en: "Original" },
    after: { th: "AI เสนอ", en: "AI suggests" },
    why: { th: "เหตุผลของ AI", en: "AI's reason" },
    accept: { th: "ใช้", en: "Accept" },
    reject: { th: "ไม่ใช้", en: "Reject" },
    accepted: { th: "✓ ใช้ข้อความนี้", en: "✓ Accepted" },
    rejected: { th: "✕ ไม่ใช้ · อาจได้ยอดเงินบาทแทน kWh", en: "✕ Rejected · could bring back baht instead of kWh" },
    dateNote: { th: "ค.ศ. → แสดงเป็น พ.ศ. ใน Word", en: "Gregorian → shown as BE in Word" },
    noFile: { th: "ยังไม่มีไฟล์", en: "No file yet" },
    page: { th: "Word · 1 หน้า", en: "Word · 1 page" }
  };
  var SUGS = [
    { id: "a", before: "ขอให้แต่ละอาคารส่งข้อมูลการใช้ไฟฟ้ารายเดือน (kWh)",
      after: "ขอความอนุเคราะห์แต่ละอาคารจัดส่งข้อมูลปริมาณการใช้ไฟฟ้า (kWh) แยกเป็นรายเดือน",
      why: { th: "ใช้สำนวนหนังสือราชการ และระบุว่าเป็นปริมาณ kWh", en: "Formal memo wording, and it says kWh consumption" } },
    { id: "b", before: "ส่งข้อมูลการใช้ไฟฟ้า (kWh)",
      after: "ส่งยอดค่าไฟรายเดือน",
      why: { th: "กระชับกว่า", en: "Shorter" } }
  ];
  /* reviewed-memo.json */
  var FIELDS = [
    ["sender_org", "งานอาคารและสถานที่ ศูนย์การเรียนรู้ตัวอย่าง"],
    ["doc_number", "ตย ๐๐๗/๒๕๖๙"],
    ["date", "2026-11-10"],
    ["subject", "ขอข้อมูลการใช้ไฟฟ้ารายเดือน"],
    ["to", "หัวหน้าฝ่ายอาคารทุกอาคาร"]
  ];
  var CMD = "python generate_docx.py --type internal --data reviewed-memo.json --out reviewed-memo.docx";

  var screens = {
    ocr: {
      render: function (s, h) {
        var lines = s.read ? LINES.map(function (l, i) {
          var text = h.esc(l.text);
          if (i === 1) text = s.fixed ? 'บันทึก<del>ช้</del><ins>ข้</ins>อความ<em class="dg-ok">' + h.tx(T.checked) + "</em>" : "บันทึก<mark>ช้</mark>อความ";
          return '<li class="dg-line" id="dg-l' + i + '"><span class="dg-cat">' + l.cat + "</span><code>" + l.xy + '</code><span class="dg-text" lang="th">' + text + "</span></li>";
        }).join("") : '<li class="ws-empty">' + h.tx(T.waiting) + "</li>";
        return '<div class="ws">' + head(h, "Typhoon OCR V2", T.ocrSub) + '<div class="ws-body dg-ocr">' +
          '<div class="dg-page' + (s.read ? " is-read" : "") + '"><img src="' + A + 'scanned-memo.webp" alt=""><i class="dg-scan"></i></div>' +
          '<ol class="dg-lines">' + lines + "</ol></div></div>";
      }
    },
    review: {
      render: function (s, h) {
        return '<div class="ws">' + head(h, T.revTitle, T.revSub) + '<div class="ws-body dg-rev">' +
          SUGS.map(function (g) {
            var v = s[g.id];
            var foot = v === "ok" ? '<b class="dg-verdict ok">' + h.tx(T.accepted) + "</b>" :
              v === "no" ? '<b class="dg-verdict no">' + h.tx(T.rejected) + "</b>" :
              '<span class="dg-btns"><span class="dg-btn ok" id="dg-' + g.id + '-ok">' + h.tx(T.accept) + '</span><span class="dg-btn no" id="dg-' + g.id + '-no">' + h.tx(T.reject) + "</span></span>";
            return '<div class="dg-sug' + (v ? " is-" + v : "") + '" id="dg-' + g.id + '">' +
              '<p class="dg-row"><span class="dg-k">' + h.tx(T.before) + '</span><span class="dg-old" lang="th">' + g.before + "</span></p>" +
              '<p class="dg-row"><span class="dg-k">' + h.tx(T.after) + '</span><span class="dg-new" lang="th">' + g.after + "</span></p>" +
              '<div class="dg-foot"><span class="dg-why">' + h.tx(T.why) + ": " + h.tx(g.why) + "</span>" + foot + "</div></div>";
          }).join("") + "</div></div>";
      }
    },
    export: {
      render: function (s, h) {
        return '<div class="ws">' + head(h, "thai-docx", "reviewed-memo.json") + '<div class="ws-body dg-exp">' +
          '<div class="dg-json">' + FIELDS.map(function (f) {
            return '<div class="dg-field" id="dg-f-' + f[0] + '"><code>' + f[0] + '</code><span lang="th">' + f[1] + "</span>" +
              (f[0] === "date" ? '<em>' + h.tx(T.dateNote) + "</em>" : "") + "</div>";
          }).join("") + "</div>" +
          '<div class="dg-out" id="dg-doc">' + (s.doc ?
            '<img src="' + A + 'reviewed-memo.webp" alt=""><b>reviewed-memo.docx</b><small>' + h.tx(T.page) + "</small>" :
            '<span class="ws-empty">' + h.tx(T.noFile) + "</span>") + "</div>" +
          '<div class="dg-term"><span aria-hidden="true">$</span><code id="dg-cmd">' + h.esc(s.cmd) + "</code></div>" +
          "</div></div>";
      }
    }
  };

  window.Walkthrough.register("flow", {
    url: "localhost · Typhoon OCR V2 → thai-docx",
    label: {
      th: "ภาพจำลองหน้าจอด้วยเอกสารสมมติ: OCR อ่านบันทึกข้อความทีละบรรทัดพร้อมพิกัด แก้คำว่า บันทึกช้อความ เป็น บันทึกข้อความ, ตรวจคำแนะนำของ AI โดยใช้หนึ่งข้อและไม่ใช้ข้อที่เปลี่ยนเป็นยอดค่าไฟ, แล้วสร้างร่าง Word จาก JSON ด้วย thai-docx",
      en: "Screen mockup with a fictional memo: OCR reads the memo line by line with coordinates and the misread heading is corrected, one AI wording suggestion is accepted and one that asks for the electricity bill is rejected, then thai-docx builds the Word draft from JSON"
    },
    start: "ocr",
    state: { read: false, fixed: false, a: null, b: null, doc: false, cmd: "" },
    screens: screens,
    steps: [
      { run: function (c) {
        return c.set({ read: true }, false)
          .then(function () { return c.arrive(".dg-line"); })
          .then(function () { return c.mark("#dg-l1"); })
          .then(function () { return c.wait(500); })
          .then(function () { return c.set({ fixed: true }, false); })
          .then(function () { return c.mark("#dg-l1"); });
      } },
      { run: function (c) {
        return c.go("review", "push")
          .then(function () { return c.arrive(".dg-sug"); })
          .then(function () { return c.tap("#dg-a-ok"); })
          .then(function () { return c.set({ a: "ok" }, false); })
          .then(function () { return c.tap("#dg-b-no"); })
          .then(function () { return c.set({ b: "no" }, false); })
          .then(function () { return c.mark("#dg-b"); });
      } },
      { run: function (c) {
        return c.go("export", "push")
          .then(function () { return c.arrive(".dg-field"); })
          .then(function () { return c.mark("#dg-f-date"); })
          .then(function () { return c.type("#dg-cmd", "cmd", CMD, 70); })
          .then(function () { return c.fly("#dg-cmd", "#dg-doc", "reviewed-memo.docx"); })
          .then(function () { return c.set({ doc: true }, false); })
          .then(function () { return c.arrive("#dg-doc img"); })
          .then(function () { return c.mark("#dg-doc"); });
      } }
    ]
  });
})();
