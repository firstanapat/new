/* ==========================================================================
   Portfolio interactions: nav, 3D carousel, product modal, case tabs, charts
   ========================================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (sel, root) { return (root || document).querySelector(sel); };

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---------- Year ---------- */
  var yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile nav ---------- */
  var toggle = $(".nav-toggle");
  var links = $("#navLinks");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    links.addEventListener("click", function (e) {
      if (e.target.closest("a")) { links.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); }
    });
  }

  /* ---------- Placeholder screenshots (used until a real image is set) ---------- */
  function mockSvg(p) {
    var a = p.accent || "#5645d4", t = p.tint || "#f6f5f4";
    var line = "#e5e3df", soft = "#f6f5f4", ink = "#37352f";
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
            return '<rect x="32" y="' + y + '" width="60" height="5" rx="2.5" fill="#a4a097"/>' +
              '<rect x="32" y="' + (y + 9) + '" width="160" height="14" rx="4" fill="#fff" stroke="' + line + '"/>';
          }).join("") +
          '<rect x="210" y="74" width="78" height="78" rx="8" fill="' + t + '"/>' +
          '<text x="249" y="112" text-anchor="middle" font-family="Inter,sans-serif" font-size="16" font-weight="600" fill="' + a + '">0.41</text>' +
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
          '<rect x="17" y="43" width="286" height="70" fill="#0a1530"/>' +
          '<rect x="32" y="60" width="120" height="12" rx="4" fill="#fff"/>' +
          '<rect x="32" y="80" width="90" height="6" rx="3" fill="#a4a097"/>' +
          '<rect x="32" y="94" width="44" height="10" rx="3" fill="#5645d4"/>' +
          '<circle cx="250" cy="64" r="4" fill="#f9e79f"/><circle cx="276" cy="92" r="3" fill="#ff64c8"/>' +
          [0, 1, 2].map(function (i) {
            var x = 32 + i * 88;
            return '<g transform="translate(' + x + ' 124)"><rect width="78" height="58" rx="6" fill="#fff" stroke="' + line + '" transform="rotate(' + (i - 1) * 4 + ' 39 29)"/>' +
              '<rect x="8" y="8" width="62" height="26" rx="3" fill="' + ["#e6e0f5", "#d9f3e1", "#ffe8d4"][i] + '" transform="rotate(' + (i - 1) * 4 + ' 39 29)"/></g>';
          }).join("");
        break;
      default: // dashboard
        body =
          '<rect x="17" y="43" width="56" height="156" fill="' + soft + '"/>' +
          [56, 72, 88, 104].map(function (y, i) { return '<rect x="26" y="' + y + '" width="' + (i === 0 ? 38 : 30) + '" height="6" rx="3" fill="' + (i === 0 ? a : line) + '"/>'; }).join("") +
          [0, 1, 2].map(function (i) {
            var x = 86 + i * 72;
            return '<rect x="' + x + '" y="56" width="62" height="38" rx="6" fill="#fff" stroke="' + line + '"/>' +
              '<rect x="' + (x + 8) + '" y="64" width="26" height="5" rx="2.5" fill="#a4a097"/>' +
              '<rect x="' + (x + 8) + '" y="76" width="36" height="9" rx="3" fill="' + ink + '" opacity=".85"/>';
          }).join("") +
          '<rect x="86" y="104" width="206" height="84" rx="6" fill="#fff" stroke="' + line + '"/>' +
          [32, 48, 40, 58, 50, 64, 56, 70].map(function (h, i) {
            return '<rect x="' + (100 + i * 23) + '" y="' + (180 - h) + '" width="12" height="' + h + '" rx="3" fill="' + a + '" opacity="' + (0.45 + i * 0.07) + '"/>';
          }).join("");
    }
    return head + body + "</svg>";
  }

  function thumbHtml(p) {
    if (p.image) return '<img src="' + esc(p.image) + '" alt="ภาพหน้าจอ ' + esc(p.title) + '" loading="lazy" draggable="false" />';
    return mockSvg(p);
  }

  /* ---------- 3D Carousel ---------- */
  var products = window.PRODUCTS || [];
  var stage = $("#carouselStage");
  var ring = $("#carouselRing");
  var dotsEl = $("#carouselDots");
  var caption = $("#carouselCaption");
  var playBtn = $("#playBtn");

  if (stage && ring && products.length) {
    var N = products.length;
    var step = 360 / N;
    var radius = 0;
    var angle = 0;            // current ring rotation (deg)
    var target = null;        // tween target (deg) or null
    var autoplay = !reduceMotion;
    var hovering = false, focused = false, dragging = false, modalOpen = false, inView = true;
    var cards = [], dots = [];
    var frontIdx = -1;
    var SPEED = 360 / 60000;  // one full turn per minute

    products.forEach(function (p, i) {
      var card = document.createElement("button");
      card.type = "button";
      card.className = "p-card";
      card.setAttribute("aria-label", p.title + (p.sample ? " (ตัวอย่าง)" : ""));
      card.tabIndex = -1;
      card.innerHTML =
        '<div class="p-thumb">' + thumbHtml(p) +
        (p.sample ? '<span class="badge badge-sample">ตัวอย่าง</span>' : "") + "</div>" +
        '<div class="p-body"><h3>' + esc(p.title) + "</h3><p>" + esc(p.desc) + "</p>" +
        '<div class="p-tags">' + p.tags.slice(0, 3).map(function (t) { return '<span class="badge">' + esc(t) + "</span>"; }).join("") + "</div></div>";
      card.addEventListener("click", function (e) {
        if (stage.dataset.moved === "1") { e.preventDefault(); return; }
        if (i === frontIdx) openModal(p);
        else goTo(i);
      });
      ring.appendChild(card);
      cards.push(card);

      var dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", p.title);
      dot.addEventListener("click", function () { goTo(i); });
      dotsEl.appendChild(dot);
      dots.push(dot);
    });

    function layout() {
      var w = cards[0].offsetWidth || 300;
      radius = Math.round((w / 2) / Math.tan(Math.PI / N)) + 48;
      cards.forEach(function (c, i) {
        c.style.transform = "rotateY(" + (i * step) + "deg) translateZ(" + radius + "px)";
      });
      render();
    }

    function norm(d) { d = ((d % 360) + 540) % 360 - 180; return d; } // -> [-180,180)

    function render() {
      ring.style.transform = "translateZ(" + (-radius) + "px) rotateY(" + angle + "deg)";
      var idx = ((Math.round(-angle / step) % N) + N) % N;
      cards.forEach(function (c, i) {
        var rel = Math.abs(norm(i * step + angle));
        c.style.opacity = String(Math.max(0, 1 - rel / 140));
        c.style.pointerEvents = rel > 100 ? "none" : "auto";
        c.setAttribute("aria-hidden", rel > 100 ? "true" : "false");
      });
      if (idx !== frontIdx) {
        if (frontIdx >= 0) { cards[frontIdx].classList.remove("is-front"); dots[frontIdx].removeAttribute("aria-current"); }
        frontIdx = idx;
        cards[idx].classList.add("is-front");
        dots[idx].setAttribute("aria-current", "true");
        caption.textContent = (idx + 1) + " / " + N + " · " + products[idx].title;
      }
    }

    function goTo(i) {
      var desired = -i * step;
      target = angle + norm(desired - angle);
      if (reduceMotion) { angle = target; target = null; render(); }
    }

    function snap() { goTo(((Math.round(-angle / step) % N) + N) % N); }

    var last = performance.now();
    function tick(now) {
      var dt = Math.min(64, now - last);
      last = now;
      if (!dragging) {
        if (target !== null) {
          var diff = target - angle;
          angle += diff * Math.min(1, dt / 120);
          if (Math.abs(diff) < 0.05) { angle = target; target = null; }
          render();
        } else if (autoplay && !hovering && !focused && !modalOpen && inView && !document.hidden) {
          angle -= SPEED * dt;
          render();
        }
      }
      requestAnimationFrame(tick);
    }

    /* drag / swipe */
    var startX = 0, startAngle = 0, lastX = 0, lastT = 0, vel = 0;
    stage.addEventListener("pointerdown", function (e) {
      if (e.button !== 0) return;
      dragging = true; target = null;
      stage.dataset.moved = "0";
      startX = lastX = e.clientX; startAngle = angle; lastT = performance.now(); vel = 0;
    });
    window.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > 6 && stage.dataset.moved !== "1") {
        stage.dataset.moved = "1";
        stage.classList.add("dragging");
        try { stage.setPointerCapture(e.pointerId); } catch (_) {}
      }
      if (stage.dataset.moved === "1") {
        var now = performance.now();
        vel = (e.clientX - lastX) / Math.max(1, now - lastT);
        lastX = e.clientX; lastT = now;
        angle = startAngle + dx * 0.25;
        render();
      }
    });
    function endDrag() {
      if (!dragging) return;
      dragging = false;
      stage.classList.remove("dragging");
      if (stage.dataset.moved === "1") {
        angle += vel * 60;   // a little momentum
        snap();
        setTimeout(function () { stage.dataset.moved = "0"; }, 0);
      }
    }
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);

    stage.addEventListener("pointerenter", function (e) { if (e.pointerType === "mouse") hovering = true; });
    stage.addEventListener("pointerleave", function () { if (hovering) { hovering = false; } });
    stage.addEventListener("focus", function () { focused = true; snap(); });
    stage.addEventListener("blur", function () { focused = false; });
    stage.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); goTo((frontIdx + 1) % N); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); goTo((frontIdx - 1 + N) % N); }
      else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openModal(products[frontIdx]); }
    });

    $("#nextBtn").addEventListener("click", function () { goTo((frontIdx + 1) % N); });
    $("#prevBtn").addEventListener("click", function () { goTo((frontIdx - 1 + N) % N); });

    function setPlay(on) {
      autoplay = on;
      playBtn.innerHTML = '<svg><use href="#' + (on ? "i-pause" : "i-play") + '"/></svg>';
      playBtn.setAttribute("aria-label", on ? "หยุดการหมุนอัตโนมัติ" : "เล่นการหมุนอัตโนมัติ");
      if (!on) snap();
    }
    playBtn.addEventListener("click", function () { setPlay(!autoplay); });
    setPlay(autoplay);

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) { inView = entries[0].isIntersecting; }).observe(stage);
    }

    var rt;
    window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(layout, 120); });
    layout();
    requestAnimationFrame(tick);

    /* ---------- Product modal ---------- */
    var modal = $("#productModal");
    function openModal(p) {
      if (!modal || !p) return;
      $("#modalThumb").innerHTML = thumbHtml(p);
      $("#modalTitle").textContent = p.title;
      $("#modalDesc").textContent = p.desc;
      $("#modalTags").innerHTML =
        (p.sample ? '<span class="badge badge-sample badge-dot">ตัวอย่าง</span>' : "") +
        p.tags.map(function (t) { return '<span class="badge">' + esc(t) + "</span>"; }).join("");
      $("#modalFeatures").innerHTML = (p.features || []).map(function (f) { return "<li>" + esc(f) + "</li>"; }).join("");
      $("#modalActions").innerHTML =
        (p.url ? '<a class="btn btn-primary" href="' + esc(p.url) + '" target="_blank" rel="noopener"><svg><use href="#i-external"/></svg> เปิดเว็บ</a>' : "") +
        '<button class="btn btn-secondary" type="button" data-close>ปิด</button>';
      modalOpen = true;
      if (typeof modal.showModal === "function") modal.showModal(); else modal.setAttribute("open", "");
    }
    if (modal) {
      modal.addEventListener("close", function () { modalOpen = false; stage.focus({ preventScroll: true }); });
      modal.addEventListener("click", function (e) {
        if (e.target === modal || e.target.closest("[data-close]") || e.target.closest("#modalClose")) modal.close();
      });
    }
  }

  /* ---------- Case study tabs ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tabs [role="tab"]'));
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
    grid: "#ede9e4", tick: "#787671", ink: "#37352f", surface: "#ffffff"
  };
  var nf = new Intl.NumberFormat("th-TH");

  var DATA = {
    cfo: {
      units: ["โรงงาน A", "โรงงาน B", "สำนักงานใหญ่"],
      s1: [1980, 1050, 35],
      s2: [2760, 1640, 410],
      s3: [6420, 3890, 280],
      base: [11920, 7010, 756]
    },
    efHist: {
      bins: ["0.1–0.2", "0.2–0.3", "0.3–0.4", "0.4–0.5", "0.5–0.6", "0.6–0.7", "0.7–0.8"],
      count: [3, 8, 12, 10, 7, 3, 2]
    },
    efSource: {
      labels: ["ปุ๋ยเคมี", "ไฟฟ้า (ปั๊มน้ำ)", "น้ำมันเชื้อเพลิง", "สารเคมีเกษตร", "ปุ๋ยคอก"],
      pct: [48, 21, 17, 9, 5]
    },
    sroi: {
      labels: ["รายได้เกษตรกรเพิ่มขึ้น", "สุขภาพจากการลดสารเคมี", "ค่าเดินทางผู้บริโภคที่ลดลง", "ความสัมพันธ์ในชุมชน", "ลด CO₂ จากการขนส่ง"],
      value: [1.42, 0.68, 0.31, 0.29, 0.19]
    }
  };

  function fillTables() {
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
  }
  fillTables();

  var drawn = {};
  function baseOptions(extra) {
    var o = {
      responsive: true, maintainAspectRatio: false,
      animation: reduceMotion ? false : { duration: 500 },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#1a1a1a", titleColor: "#fff", bodyColor: "#ede9e4", padding: 10, cornerRadius: 8,
          titleFont: { weight: "600" }, displayColors: true, boxPadding: 4
        }
      },
      interaction: { mode: "nearest", intersect: true }
    };
    return Object.assign(o, extra);
  }
  function axis(opts) {
    return Object.assign({
      grid: { color: C.grid, drawTicks: false }, border: { display: false },
      ticks: { color: C.tick, padding: 8, font: { size: 12 } }
    }, opts || {});
  }

  function drawChartsFor(panelId) {
    if (typeof Chart === "undefined" || drawn[panelId]) return;
    Chart.defaults.font.family = '"Inter", "Noto Sans Thai", system-ui, sans-serif';
    Chart.defaults.color = C.tick;
    drawn[panelId] = true;

    if (panelId === "case-cfo") {
      var d = DATA.cfo;
      var seg = function (label, data, color, last) {
        return {
          label: label, data: data, backgroundColor: color, maxBarThickness: 24,
          borderColor: C.surface, borderWidth: { right: last ? 0 : 2 }, borderSkipped: false,
          borderRadius: last ? { topRight: 4, bottomRight: 4 } : 0
        };
      };
      new Chart($("#chartCfo"), {
        type: "bar",
        data: { labels: d.units, datasets: [seg("ขอบเขต 1", d.s1, C.s1), seg("ขอบเขต 2", d.s2, C.s2), seg("ขอบเขต 3", d.s3, C.s3, true)] },
        options: baseOptions({
          indexAxis: "y",
          interaction: { mode: "nearest", intersect: true, axis: "y" },
          plugins: {
            legend: { display: false },
            tooltip: Object.assign(baseOptions().plugins.tooltip, {
              callbacks: { label: function (c) { return " " + c.dataset.label + ": " + nf.format(c.raw) + " tCO₂e"; } }
            })
          },
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
        data: { labels: DATA.efHist.bins, datasets: [{ label: "จำนวนแปลง", data: DATA.efHist.count, backgroundColor: C.s1, maxBarThickness: 24, borderRadius: { topLeft: 4, topRight: 4 }, borderSkipped: false }] },
        options: baseOptions({
          plugins: { legend: { display: false }, tooltip: Object.assign(baseOptions().plugins.tooltip, { displayColors: false, callbacks: { title: function (c) { return "EF " + c[0].label + " kgCO₂e/kg"; }, label: function (c) { return c.raw + " แปลง"; } } }) },
          scales: {
            x: axis({ grid: { display: false }, title: { display: true, text: "kgCO₂e/kg", color: C.tick, font: { size: 12 } } }),
            y: axis({ beginAtZero: true, ticks: { color: C.tick, stepSize: 4 } })
          }
        })
      });
      new Chart($("#chartEfSource"), {
        type: "bar",
        data: { labels: DATA.efSource.labels, datasets: [{ label: "สัดส่วน", data: DATA.efSource.pct, backgroundColor: C.s1, maxBarThickness: 24, borderRadius: { topRight: 4, bottomRight: 4 }, borderSkipped: false }] },
        options: baseOptions({
          indexAxis: "y",
          interaction: { mode: "nearest", intersect: true, axis: "y" },
          plugins: { legend: { display: false }, tooltip: Object.assign(baseOptions().plugins.tooltip, { displayColors: false, callbacks: { label: function (c) { return c.raw + "% (" + (0.412 * c.raw / 100).toFixed(3) + " kgCO₂e/kg)"; } } }) },
          scales: {
            x: axis({ beginAtZero: true, max: 60, ticks: { color: C.tick, callback: function (v) { return v + "%"; } } }),
            y: axis({ grid: { display: false }, ticks: { color: C.ink, font: { size: 13, weight: "500" } } })
          }
        })
      });
    }

    if (panelId === "case-sroi") {
      new Chart($("#chartSroi"), {
        type: "bar",
        data: { labels: DATA.sroi.labels, datasets: [{ label: "มูลค่า", data: DATA.sroi.value, backgroundColor: C.s1, maxBarThickness: 24, borderRadius: { topRight: 4, bottomRight: 4 }, borderSkipped: false }] },
        options: baseOptions({
          indexAxis: "y",
          interaction: { mode: "nearest", intersect: true, axis: "y" },
          plugins: { legend: { display: false }, tooltip: Object.assign(baseOptions().plugins.tooltip, { displayColors: false, callbacks: { label: function (c) { return c.raw.toFixed(2) + " ล้านบาท"; } } }) },
          scales: {
            x: axis({ beginAtZero: true, ticks: { color: C.tick, callback: function (v) { return v.toFixed(1); } } }),
            y: axis({ grid: { display: false }, ticks: { color: C.ink, font: { size: 13, weight: "500" } } })
          }
        })
      });
    }
  }

  // Draw the first visible case when the section scrolls near the viewport.
  var casesSection = $("#cases");
  if (casesSection && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { drawChartsFor("case-cfo"); io.disconnect(); }
    }, { rootMargin: "200px" });
    io.observe(casesSection);
  } else {
    drawChartsFor("case-cfo");
  }
})();
