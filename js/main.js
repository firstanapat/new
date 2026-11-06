/* ==========================================================================
   Portfolio interactions: nav, coverflow carousel, product modal,
   section progress rail, case tabs, charts
   ========================================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

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
    }, { threshold: [0, 0.15, 0.3, 0.5, 0.7, 1] });
    railSections.forEach(function (s) { railIO.observe(s); });
  }

  /* ---------- Placeholder screenshots (until a real image is set) ---------- */
  function mockSvg(p) {
    var a = p.accent || "#12a05c", t = p.tint || "#f7f7f5";
    var line = "#e8e8e6", soft = "#f7f7f5", ink = "#3c4043";
    var head =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' +
      '<rect width="320" height="200" fill="' + t + '"/>' +
      '<rect x="16" y="16" width="288" height="184" rx="8" fill="#fff" stroke="' + line + '"/>' +
      '<circle cx="30" cy="29" r="3" fill="#e03131" opacity=".6"/><circle cx="40" cy="29" r="3" fill="#f5d75e"/><circle cx="50" cy="29" r="3" fill="#1aae39" opacity=".6"/>' +
      '<rect x="64" y="25" width="120" height="8" rx="4" fill="' + soft + '"/>' +
      '<line x1="16" y1="42" x2="304" y2="42" stroke="' + line + '"/>';
    var body = "";
    switch (p.layout) {
      case "upload":
        body =
          '<rect x="32" y="56" width="90" height="8" rx="4" fill="' + ink + '" opacity=".8"/>' +
          '<rect x="32" y="72" width="140" height="6" rx="3" fill="' + line + '"/>' +
          '<rect x="32" y="90" width="256" height="58" rx="8" fill="' + t + '" stroke="' + a + '" stroke-dasharray="5 4"/>' +
          '<path d="M160 104v18m0-18-7 7m7-7 7 7" stroke="' + a + '" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
          '<rect x="128" y="130" width="64" height="6" rx="3" fill="' + a + '" opacity=".5"/>' +
          '<rect x="32" y="160" width="120" height="10" rx="5" fill="' + soft + '"/><rect x="32" y="160" width="84" height="10" rx="5" fill="' + a + '"/>' +
          '<rect x="232" y="158" width="56" height="16" rx="4" fill="' + a + '"/>';
        break;
      case "form":
        body =
          '<rect x="32" y="56" width="110" height="8" rx="4" fill="' + ink + '" opacity=".8"/>' +
          [74, 106, 138].map(function (y) {
            return '<rect x="32" y="' + y + '" width="60" height="5" rx="2.5" fill="#9aa0a6"/>' +
              '<rect x="32" y="' + (y + 9) + '" width="160" height="14" rx="4" fill="#fff" stroke="' + line + '"/>';
          }).join("") +
          '<rect x="210" y="74" width="78" height="78" rx="8" fill="' + t + '"/>' +
          '<text x="249" y="112" text-anchor="middle" font-family="Anuphan,sans-serif" font-size="16" font-weight="700" fill="' + a + '">0.41</text>' +
          '<rect x="226" y="122" width="46" height="5" rx="2.5" fill="' + a + '" opacity=".5"/>' +
          '<rect x="32" y="170" width="70" height="16" rx="4" fill="' + a + '"/>';
        break;
      case "table":
        body = '<rect x="32" y="56" width="100" height="8" rx="4" fill="' + ink + '" opacity=".8"/>' +
          '<rect x="232" y="53" width="56" height="14" rx="4" fill="' + a + '"/>' +
          '<rect x="32" y="76" width="256" height="14" rx="3" fill="' + soft + '"/>';
        for (var r = 0; r < 5; r++) {
          var y = 96 + r * 18;
          body += '<rect x="40" y="' + (y + 4) + '" width="' + (60 + (r * 17) % 40) + '" height="6" rx="3" fill="' + line + '"/>' +
            '<rect x="150" y="' + (y + 4) + '" width="40" height="6" rx="3" fill="' + line + '"/>' +
            '<rect x="230" y="' + (y + 2) + '" width="' + (20 + (r * 23) % 36) + '" height="10" rx="3" fill="' + a + '" opacity="' + (0.35 + r * 0.12) + '"/>' +
            '<line x1="32" y1="' + (y + 16) + '" x2="288" y2="' + (y + 16) + '" stroke="' + soft + '"/>';
        }
        break;
      case "site":
        body =
          '<rect x="17" y="43" width="286" height="156" fill="#fff"/>' +
          '<rect x="96" y="54" width="128" height="14" rx="7" fill="#fff" stroke="' + line + '"/>' +
          '<rect x="104" y="80" width="112" height="10" rx="4" fill="' + ink + '"/>' +
          '<circle cx="219" cy="88" r="2.5" fill="' + a + '"/>' +
          '<rect x="124" y="96" width="72" height="5" rx="2.5" fill="#9aa0a6"/>' +
          '<g transform="translate(160 150)">' +
          '<rect x="-112" y="-32" width="60" height="44" rx="6" fill="' + soft + '" transform="rotate(-6)"/>' +
          '<rect x="52" y="-32" width="60" height="44" rx="6" fill="' + soft + '" transform="rotate(6)"/>' +
          '<rect x="-44" y="-40" width="88" height="58" rx="7" fill="#fff" stroke="' + line + '"/>' +
          '<rect x="-38" y="-34" width="76" height="34" rx="4" fill="' + t + '"/></g>';
        break;
      default: // dashboard
        body =
          '<rect x="17" y="43" width="56" height="156" fill="' + soft + '"/>' +
          [56, 72, 88, 104].map(function (y, i) { return '<rect x="26" y="' + y + '" width="' + (i === 0 ? 38 : 30) + '" height="6" rx="3" fill="' + (i === 0 ? a : line) + '"/>'; }).join("") +
          [0, 1, 2].map(function (i) {
            var x = 86 + i * 72;
            return '<rect x="' + x + '" y="56" width="62" height="38" rx="6" fill="#fff" stroke="' + line + '"/>' +
              '<rect x="' + (x + 8) + '" y="64" width="26" height="5" rx="2.5" fill="#9aa0a6"/>' +
              '<rect x="' + (x + 8) + '" y="76" width="36" height="9" rx="3" fill="' + ink + '" opacity=".85"/>';
          }).join("") +
          '<rect x="86" y="104" width="206" height="84" rx="6" fill="#fff" stroke="' + line + '"/>' +
          [32, 48, 40, 58, 50, 64, 56, 70].map(function (h, i) {
            return '<rect x="' + (100 + i * 23) + '" y="' + (180 - h) + '" width="12" height="' + h + '" rx="3" fill="' + a + '" opacity="' + (0.45 + i * 0.07) + '"/>';
          }).join("");
    }
    return head + body + "</svg>";
  }
  function mediaHtml(p) {
    if (p.image) return '<img src="' + esc(p.image) + '" alt="ภาพหน้าจอ ' + esc(p.title) + '" loading="lazy" draggable="false" />';
    return mockSvg(p);
  }

  /* ---------- Coverflow carousel ---------- */
  var products = window.PRODUCTS || [];
  var stage = $("#flowStage");
  var dotsEl = $("#flowDots");
  var caption = $("#flowCaption");
  var playBtn = $("#flowPlay");
  var modal = $("#productModal");

  function openModal(p) {
    if (!modal || !p) return;
    $("#modalMedia").innerHTML = mediaHtml(p);
    $("#modalTitle").textContent = p.title;
    $("#modalDesc").textContent = p.desc;
    $("#modalTags").innerHTML =
      (p.sample ? '<span class="chip chip-sample">ตัวอย่าง</span>' : "") +
      p.tags.map(function (t) { return '<span class="chip">' + esc(t) + "</span>"; }).join("");
    $("#modalFeatures").innerHTML = (p.features || []).map(function (f) { return "<li>" + esc(f) + "</li>"; }).join("");
    $("#modalActions").innerHTML =
      (p.url ? '<a class="btn btn-dark" href="' + esc(p.url) + '" target="_blank" rel="noopener">เปิดเว็บ <svg><use href="#i-up-right"/></svg></a>' : "") +
      '<button class="btn btn-outline" type="button" data-close>ปิด</button>';
    flow && flow.pause(true);
    if (typeof modal.showModal === "function") modal.showModal(); else modal.setAttribute("open", "");
  }
  if (modal) {
    modal.addEventListener("close", function () { flow && flow.pause(false); });
    modal.addEventListener("click", function (e) {
      if (e.target === modal || e.target.closest("[data-close]") || e.target.closest("#modalClose")) modal.close();
    });
  }

  var flow = null;
  if (stage && products.length) {
    flow = (function () {
      var N = products.length, active = 0, cards = [], dots = [];
      var autoplay = !reduceMotion, held = false, hovering = false, inView = true, timer = null;
      var INTERVAL = 4500;

      products.forEach(function (p, i) {
        var card = document.createElement("button");
        card.type = "button";
        card.className = "flow-card";
        card.setAttribute("aria-label", p.title + (p.sample ? " (ตัวอย่าง)" : ""));
        card.innerHTML =
          '<div class="flow-media">' + mediaHtml(p) +
          (p.sample ? '<span class="chip chip-sample">ตัวอย่าง</span>' : "") +
          '<span class="flow-open">ดูรายละเอียด <svg><use href="#i-expand"/></svg></span></div>' +
          '<div class="flow-body"><div class="kicker">' + esc(p.kicker || p.tags.slice(0, 2).join(" / ")) + "</div>" +
          "<h3>" + esc(p.title) + "</h3></div>";
        card.addEventListener("click", function (e) {
          if (stage.dataset.moved === "1") { e.preventDefault(); return; }
          if (i === active) openModal(p); else go(i);
        });
        stage.appendChild(card);
        cards.push(card);

        var dot = document.createElement("button");
        dot.type = "button";
        dot.setAttribute("role", "tab");
        dot.setAttribute("aria-label", p.title);
        dot.addEventListener("click", function () { go(i); });
        dotsEl.appendChild(dot);
        dots.push(dot);
      });

      function offset(i) {
        var d = i - active;
        if (d > N / 2) d -= N;
        if (d < -N / 2) d += N;
        return d;
      }

      function render() {
        var w = cards[0].offsetWidth;
        var narrow = window.innerWidth < 700;
        var gap = narrow ? w * 0.62 : w * 0.7;
        cards.forEach(function (c, i) {
          var d = offset(i), ad = Math.abs(d);
          var x = d * gap - Math.sign(d) * (ad > 1 ? (ad - 1) * gap * 0.35 : 0);
          var tf = "translateX(" + x + "px) translateZ(" + (-ad * 220) + "px) rotateY(" + (-d * 32) + "deg)";
          c.style.transform = tf;
          c.style.opacity = ad > 2 ? "0" : ad === 2 ? (narrow ? "0" : ".55") : "1";
          c.style.zIndex = String(10 - ad);
          c.style.pointerEvents = ad > 1 ? "none" : "auto";
          c.classList.toggle("is-center", d === 0);
          c.tabIndex = -1;
          c.setAttribute("aria-hidden", ad > 1 ? "true" : "false");
        });
        dots.forEach(function (dt, i) { if (i === active) dt.setAttribute("aria-current", "true"); else dt.removeAttribute("aria-current"); });
        caption.textContent = String(active + 1).padStart(2, "0") + " / " + String(N).padStart(2, "0") + " · " + products[active].title;
      }

      function go(i) { active = ((i % N) + N) % N; render(); restart(); }
      function next() { go(active + 1); }
      function prev() { go(active - 1); }

      function running() { return autoplay && !held && !hovering && inView && !document.hidden; }
      function restart() {
        clearInterval(timer);
        if (running()) timer = setInterval(next, INTERVAL);
      }
      function setPlay(on) {
        autoplay = on;
        playBtn.innerHTML = '<svg><use href="#' + (on ? "i-pause" : "i-play") + '"/></svg>' + (on ? "หยุดเลื่อนอัตโนมัติ" : "เลื่อนอัตโนมัติ");
        restart();
      }
      playBtn.addEventListener("click", function () { setPlay(!autoplay); });

      /* drag / swipe */
      var startX = 0, dragging = false;
      stage.addEventListener("pointerdown", function (e) {
        if (e.button !== 0) return;
        dragging = true; startX = e.clientX; stage.dataset.moved = "0";
      });
      window.addEventListener("pointermove", function (e) {
        if (!dragging) return;
        if (Math.abs(e.clientX - startX) > 8 && stage.dataset.moved !== "1") { stage.dataset.moved = "1"; stage.classList.add("dragging"); }
      });
      function endDrag(e) {
        if (!dragging) return;
        dragging = false; stage.classList.remove("dragging");
        var dx = (e.clientX || startX) - startX;
        if (stage.dataset.moved === "1") {
          if (dx < -40) next(); else if (dx > 40) prev();
          setTimeout(function () { stage.dataset.moved = "0"; }, 0);
        }
      }
      window.addEventListener("pointerup", endDrag);
      window.addEventListener("pointercancel", function () { dragging = false; stage.classList.remove("dragging"); });

      stage.addEventListener("pointerenter", function (e) { if (e.pointerType === "mouse") { hovering = true; restart(); } });
      stage.addEventListener("pointerleave", function () { if (hovering) { hovering = false; restart(); } });
      stage.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight") { e.preventDefault(); next(); }
        else if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
        else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openModal(products[active]); }
      });
      stage.addEventListener("focus", function () { held = true; restart(); });
      stage.addEventListener("blur", function () { held = false; restart(); });
      document.addEventListener("visibilitychange", restart);
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (en) { inView = en[0].isIntersecting; restart(); }).observe(stage);
      }
      var rt;
      window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(render, 100); });

      render();
      setPlay(autoplay);
      return { pause: function (on) { held = on; restart(); } };
    })();
  }

  /* ---------- Case study tabs ---------- */
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
  $$("[data-case]").forEach(function (a) {
    a.addEventListener("click", function () {
      var t = tabs.filter(function (x) { return x.getAttribute("aria-controls") === a.dataset.case; })[0];
      if (t) selectTab(t);
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
  var nf = new Intl.NumberFormat("th-TH");

  var DATA = {
    cfo: { units: ["โรงงาน A", "โรงงาน B", "สำนักงานใหญ่"], s1: [1980, 1050, 35], s2: [2760, 1640, 410], s3: [6420, 3890, 280], base: [11920, 7010, 756] },
    efHist: { bins: ["0.1–0.2", "0.2–0.3", "0.3–0.4", "0.4–0.5", "0.5–0.6", "0.6–0.7", "0.7–0.8"], count: [3, 8, 12, 10, 7, 3, 2] },
    efSource: { labels: ["ปุ๋ยเคมี", "ไฟฟ้า (ปั๊มน้ำ)", "น้ำมันเชื้อเพลิง", "สารเคมีเกษตร", "ปุ๋ยคอก"], pct: [48, 21, 17, 9, 5] },
    sroi: { labels: ["รายได้เกษตรกรเพิ่มขึ้น", "สุขภาพจากการลดสารเคมี", "ค่าเดินทางผู้บริโภคที่ลดลง", "ความสัมพันธ์ในชุมชน", "ลด CO₂ จากการขนส่ง"], value: [1.42, 0.68, 0.31, 0.29, 0.19] }
  };

  (function fillTables() {
    var d = DATA.cfo, rows = "";
    d.units.forEach(function (u, i) {
      var tot = d.s1[i] + d.s2[i] + d.s3[i];
      var ch = (tot - d.base[i]) / d.base[i] * 100;
      rows += "<tr><td>" + u + "</td><td>" + nf.format(d.s1[i]) + "</td><td>" + nf.format(d.s2[i]) + "</td><td>" + nf.format(d.s3[i]) +
        "</td><td>" + nf.format(tot) + "</td><td>" + nf.format(d.base[i]) + "</td><td>" + ch.toFixed(1) + "%</td></tr>";
    });
    var t = $("#tableCfo");
    if (t) t.innerHTML = "<thead><tr><th>หน่วยงาน</th><th>ขอบเขต 1</th><th>ขอบเขต 2</th><th>ขอบเขต 3</th><th>รวม 2568</th><th>ปีฐาน 2567</th><th>เปลี่ยนแปลง</th></tr></thead><tbody>" + rows + "</tbody>";
    var te = $("#tableEf");
    if (te) te.innerHTML = "<thead><tr><th>ช่วง EF (kgCO₂e/kg)</th><th>จำนวนแปลง</th></tr></thead><tbody>" +
      DATA.efHist.bins.map(function (b, i) { return "<tr><td>" + b + "</td><td>" + DATA.efHist.count[i] + "</td></tr>"; }).join("") +
      "</tbody><thead><tr><th>แหล่งปล่อย</th><th>สัดส่วน</th></tr></thead><tbody>" +
      DATA.efSource.labels.map(function (l, i) { return "<tr><td>" + l + "</td><td>" + DATA.efSource.pct[i] + "%</td></tr>"; }).join("") + "</tbody>";
    var ts = $("#tableSroi");
    if (ts) ts.innerHTML = "<thead><tr><th>ผลลัพธ์</th><th>มูลค่า (ล้านบาท)</th></tr></thead><tbody>" +
      DATA.sroi.labels.map(function (l, i) { return "<tr><td>" + l + "</td><td>" + DATA.sroi.value[i].toFixed(2) + "</td></tr>"; }).join("") +
      "<tr><td><strong>รวม</strong></td><td><strong>2.89</strong></td></tr></tbody>";
  })();

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
    if (typeof Chart === "undefined" || drawn[panelId]) return;
    Chart.defaults.font.family = '"Anuphan", "Noto Sans Thai", system-ui, sans-serif';
    Chart.defaults.color = C.tick;
    drawn[panelId] = true;

    if (panelId === "case-cfo") {
      var d = DATA.cfo;
      var seg = function (label, data, color, last) {
        return { label: label, data: data, backgroundColor: color, maxBarThickness: 24, borderColor: C.surface,
          borderWidth: { right: last ? 0 : 2 }, borderSkipped: false, borderRadius: last ? { topRight: 4, bottomRight: 4 } : 0 };
      };
      new Chart($("#chartCfo"), {
        type: "bar",
        data: { labels: d.units, datasets: [seg("ขอบเขต 1", d.s1, C.s1), seg("ขอบเขต 2", d.s2, C.s2), seg("ขอบเขต 3", d.s3, C.s3, true)] },
        options: base({
          indexAxis: "y", interaction: { mode: "nearest", intersect: true, axis: "y" },
          plugins: { legend: { display: false }, tooltip: tooltip({ callbacks: { label: function (c) { return " " + c.dataset.label + ": " + nf.format(c.raw) + " tCO₂e"; } } }) },
          scales: {
            x: axis({ stacked: true, ticks: { color: C.tick, callback: function (v) { return nf.format(v); } } }),
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
          plugins: { legend: { display: false }, tooltip: tooltip({ displayColors: false, callbacks: { title: function (c) { return "EF " + c[0].label + " kgCO₂e/kg"; }, label: function (c) { return c.raw + " แปลง"; } } }) },
          scales: { x: axis({ grid: { display: false } }), y: axis({ beginAtZero: true, ticks: { color: C.tick, stepSize: 4 } }) }
        })
      });
      hbar("#chartEfSource", DATA.efSource.labels, DATA.efSource.pct,
        function (v) { return v + "% (" + (0.412 * v / 100).toFixed(3) + " kgCO₂e/kg)"; },
        function (v) { return v + "%"; }, 60);
    }
    if (panelId === "case-sroi") {
      hbar("#chartSroi", DATA.sroi.labels, DATA.sroi.value,
        function (v) { return v.toFixed(2) + " ล้านบาท"; },
        function (v) { return v.toFixed(1); });
    }
  }

  var casesSection = $("#cases");
  if (casesSection && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { drawChartsFor("case-cfo"); io.disconnect(); }
    }, { rootMargin: "300px" });
    io.observe(casesSection);
  } else {
    drawChartsFor("case-cfo");
  }
})();
