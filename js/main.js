/* ==========================================================================
   Portfolio interactions: footer year, mobile nav, section progress rail.
   Project walkthroughs live in js/walkthrough.js + js/stories.js,
   hero motion in js/motion.js.
   ========================================================================== */
(function () {
  "use strict";

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

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

  /* ---------- Section progress rail ----------
     The current section is the innermost [data-rail] element that holds a
     line 40% down the viewport, so a project story wins over the #work
     section around it. Rail links match sections by href. The % is how far
     down the page the reader is. */
  var railLinks = $$(".rail a");
  var railPct = $("#railPct");
  var railSections = $$("[data-rail]");
  var work = $("#work");
  var nav = $(".nav");
  if (railLinks.length && railSections.length) {
    var lastId = null, ticking = false;
    var updateRail = function () {
      ticking = false;
      var line = innerHeight * 0.4, id = railSections[0].id;
      railSections.forEach(function (s) {
        var r = s.getBoundingClientRect();
        if (r.top <= line && r.bottom > line) id = s.id;   // later in DOM order = nested deeper
      });
      var max = document.documentElement.scrollHeight - innerHeight;
      var read = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
      if (railPct) railPct.textContent = String(Math.round(read * 100));
      if (nav) nav.style.setProperty("--read", read.toFixed(3));   // mobile progress bar (style.css)
      if (id === lastId) return;   // the bar above still updates on every scroll
      lastId = id;
      railLinks.forEach(function (a) {
        if (a.getAttribute("href") === "#" + id) a.setAttribute("aria-current", "location"); else a.removeAttribute("aria-current");
      });
      var group = id === "about" ? "about" : (work && work.contains(document.getElementById(id))) ? "work" : "";
      $$("[data-nav]").forEach(function (a) {
        if (a.getAttribute("data-nav") === group) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
      });
    };
    var onScroll = function () { if (!ticking) { ticking = true; requestAnimationFrame(updateRail); } };
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    updateRail();
  }
})();
