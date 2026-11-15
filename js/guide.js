/* ==========================================================================
   Motion for the Thai document guide (thai-document-guide.html)
   - Heading entrance is CSS only (document-guide.css).
   - Blocks rise in as they reach the viewport.
   - Source → draft: a scan line reads the memo, the OCR → check → Word
     chip pops, then the Word draft opens from the top.
   - Step 1: the misread character gets a wavy mark, then the fix slides in.
   - Step 2: removed words are struck through and added words highlighted,
     one at a time, like tracked changes.
   - Step 3: the command types itself out.
   Everything is in the HTML in its final state. Without JS, without
   IntersectionObserver, or with reduced motion, the page simply shows it.
   ========================================================================== */
(function () {
  "use strict";
  var reduced = false;
  try { reduced = matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}
  if (reduced || !("IntersectionObserver" in window)) return;

  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  document.documentElement.classList.add("guide-motion");

  /* tracked changes play in reading order */
  $$(".guide-revisions").forEach(function (dl) {
    $$("del, ins", dl).forEach(function (el, i) { el.style.setProperty("--d", (0.35 + i * 0.24).toFixed(2) + "s"); });
  });

  /* typewriter: the full command stays readable for screen readers */
  var typers = $$(".guide-command code").map(function (code) {
    var full = code.textContent;
    code.textContent = "";
    var sr = document.createElement("span"); sr.className = "visually-hidden"; sr.textContent = full;
    var typed = document.createElement("span"); typed.setAttribute("aria-hidden", "true");
    var caret = document.createElement("span"); caret.className = "type-caret"; caret.setAttribute("aria-hidden", "true");
    code.appendChild(sr); code.appendChild(typed); code.appendChild(caret);
    return { pre: code.parentNode, full: full, typed: typed };
  });
  var type = function (t) {
    var n = 0, chars = Array.from ? Array.from(t.full) : t.full.split("");
    var tick = function () {
      n = Math.min(chars.length, n + 2);
      t.typed.textContent = chars.slice(0, n).join("");
      if (n < chars.length) setTimeout(tick, 28); else t.pre.classList.add("is-typed");
    };
    setTimeout(tick, 350);
  };

  /* what rises in */
  $$(".guide-copy > p, .guide-copy section > *, .guide-references").forEach(function (el) { el.classList.add("rv"); });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      io.unobserve(en.target);
      en.target.classList.add("is-in");
      typers.forEach(function (t) { if (t.pre === en.target) type(t); });
    });
  }, { rootMargin: "0px 0px -12% 0px" });
  $$(".rv, .guide-specimens").forEach(function (el) { io.observe(el); });
})();
