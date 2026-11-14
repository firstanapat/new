/* ==========================================================================
   Page motion outside the walkthroughs
   - Hero entrance (name lines, lead, stats, photo) is CSS only, in style.css,
     so it runs without this file and turns off with reduced motion.
   - Here: the hero numbers count up once when they come into view.
     The final numbers are in the HTML, so without JS they simply show.
   ========================================================================== */
(function () {
  "use strict";
  var reduced = false;
  try { reduced = matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}
  var nums = Array.prototype.slice.call(document.querySelectorAll("[data-count]"));
  if (reduced || !nums.length || !("IntersectionObserver" in window)) return;

  var locale = function () { return (window.I18N && window.I18N.lang) === "en" ? "en-US" : "th-TH"; };
  var show = function (el, v) {
    var d = +el.getAttribute("data-decimals") || 0;
    el.textContent = v.toLocaleString(locale(), { minimumFractionDigits: d, maximumFractionDigits: d });
  };

  function run(el, delay) {
    var to = parseFloat(el.getAttribute("data-count"));
    var ms = 1100;
    setTimeout(function () {
      var t0 = performance.now();
      (function frame(now) {
        var k = Math.min(1, (now - t0) / ms);
        show(el, to * (1 - Math.pow(1 - k, 3)));
        if (k < 1) requestAnimationFrame(frame);
      })(t0);
    }, delay);
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      io.unobserve(en.target);
      run(en.target, 500 + nums.indexOf(en.target) * 120);   // after the stats row fades in
    });
  }, { threshold: 0.6 });

  nums.forEach(function (el) { show(el, 0); io.observe(el); });
})();
