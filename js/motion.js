/* ==========================================================================
   Page motion outside the walkthroughs
   - Hero entrance (name lines, lead, expertise, photo) is CSS only, in
     style.css, so it runs without this file and turns off with reduced motion.
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

  /* ---------- card images follow the language ---------- */
  (function () {
    /* <img src> plus the phone-size <source srcset> inside the card <picture> */
    var swaps = [];
    Array.prototype.forEach.call(document.querySelectorAll("img[data-src-en], source[data-srcset-en]"), function (el) {
      var attr = el.tagName === "SOURCE" ? "srcset" : "src";
      el.setAttribute("data-" + attr + "-th", el.getAttribute(attr));
      swaps.push([el, attr]);
    });
    var swap = function () {
      swaps.forEach(function (s) {
        var url = s[0].getAttribute("data-" + s[1] + "-" + lang());
        if (url && s[0].getAttribute(s[1]) !== url) s[0].setAttribute(s[1], url);
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
