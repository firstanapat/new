/* ==========================================================================
   Page motion outside the walkthroughs
   - Hero entrance (name lines, lead, stats, photo) is CSS only, in style.css,
     so it runs without this file and turns off with reduced motion.
   - Hero numbers count up once when they come into view. The final numbers
     are in the HTML, so without JS they simply show.
   - Card images follow the language (Thai or English screen captures).
   - Card → story: the card image morphs into the story's live frame with a
     same-document View Transition. Without support, or with reduced motion,
     the link just jumps to the story as before.
   ========================================================================== */
(function () {
  "use strict";
  var reduced = false;
  try { reduced = matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}
  var lang = function () { return (window.I18N && window.I18N.lang) === "en" ? "en" : "th"; };

  /* ---------- hero count-up ---------- */
  (function () {
    var nums = Array.prototype.slice.call(document.querySelectorAll("[data-count]"));
    if (reduced || !nums.length || !("IntersectionObserver" in window)) return;
    var show = function (el, v) {
      var d = +el.getAttribute("data-decimals") || 0;
      el.textContent = v.toLocaleString(lang() === "en" ? "en-US" : "th-TH", { minimumFractionDigits: d, maximumFractionDigits: d });
    };
    var run = function (el, delay) {
      var to = parseFloat(el.getAttribute("data-count"));
      setTimeout(function () {
        var t0 = performance.now();
        (function frame(now) {
          var k = Math.min(1, (now - t0) / 1100);
          show(el, to * (1 - Math.pow(1 - k, 3)));
          if (k < 1) requestAnimationFrame(frame);
        })(t0);
      }, delay);
    };
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        run(en.target, 500 + nums.indexOf(en.target) * 120);   // after the stats row fades in
      });
    }, { threshold: 0.6 });
    nums.forEach(function (el) { show(el, 0); io.observe(el); });
  })();

  /* ---------- card images follow the language ---------- */
  (function () {
    var imgs = Array.prototype.slice.call(document.querySelectorAll("img[data-src-en]"));
    imgs.forEach(function (img) { img.setAttribute("data-src-th", img.getAttribute("src")); });
    var swap = function () {
      imgs.forEach(function (img) {
        var src = img.getAttribute("data-src-" + lang());
        if (src && img.getAttribute("src") !== src) img.setAttribute("src", src);
      });
    };
    document.addEventListener("langchange", swap);
    swap();
  })();

  /* ---------- card → story View Transition ---------- */
  (function () {
    if (reduced || !document.startViewTransition || !window.Walkthrough) return;
    Array.prototype.forEach.call(document.querySelectorAll('.project-card[href^="#"]'), function (card) {
      card.addEventListener("click", function (e) {
        if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        var id = card.getAttribute("href").slice(1);
        var story = document.getElementById(id);
        var wt = window.Walkthrough.stories[id];
        var img = card.querySelector(".project-card-media img");
        var frame = story && story.querySelector(".wt-frame");
        if (!wt || !img || !frame) return;
        e.preventDefault();
        img.style.viewTransitionName = "story-media";
        var t = document.startViewTransition(function () {
          img.style.viewTransitionName = "";
          frame.style.viewTransitionName = "story-media";
          if (location.hash !== "#" + id) history.pushState(null, "", "#" + id);
          return wt.coverState().then(function () {
            frame.scrollIntoView({ block: "center", behavior: "instant" });
            story.focus({ preventScroll: true });
          });
        });
        t.finished.then(function () { frame.style.viewTransitionName = ""; }, function () { frame.style.viewTransitionName = ""; });
      });
    });
  })();
})();
