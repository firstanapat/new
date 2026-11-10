/* ==========================================================================
   Thai / English switch
   - Thai text lives in the HTML. English text lives in js/lang-en.js.
   - Mark text with data-i18n="key", an aria-label with data-i18n-aria="key".
   - Language order: ?lang= in the URL → saved choice → browser language.
   - Fires a "langchange" event on document so other scripts can re-render.
   ========================================================================== */
(function () {
  "use strict";
  var KEY = "lang";
  var EN = window.I18N_EN || {};
  var TH = {};
  var current = "th";

  function store(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  function saved() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function valid(v) { return v === "th" || v === "en"; }

  function detect() {
    var q = null;
    try { q = new URLSearchParams(location.search).get("lang"); } catch (e) {}
    if (valid(q)) { store(q); return q; }
    var s = saved();
    if (valid(s)) return s;
    return (navigator.language || "").toLowerCase().indexOf("th") === 0 ? "th" : "en";
  }

  var meta = document.querySelector('meta[name="description"]');
  var textEls = Array.prototype.slice.call(document.querySelectorAll("[data-i18n]"));
  var ariaEls = Array.prototype.slice.call(document.querySelectorAll("[data-i18n-aria]"));

  // Capture the Thai copy that is already in the page.
  textEls.forEach(function (el) { TH[el.getAttribute("data-i18n")] = el.innerHTML; });
  ariaEls.forEach(function (el) { TH[el.getAttribute("data-i18n-aria")] = el.getAttribute("aria-label"); });
  TH.__title = document.title;
  TH.__desc = meta ? meta.getAttribute("content") : "";

  function pick(key) {
    var d = current === "en" ? EN : TH;
    return d[key] != null ? d[key] : TH[key];
  }

  function apply(lang) {
    current = valid(lang) ? lang : "th";
    document.documentElement.lang = current;
    textEls.forEach(function (el) {
      var v = pick(el.getAttribute("data-i18n"));
      if (v != null && el.innerHTML !== v) el.innerHTML = v;
    });
    ariaEls.forEach(function (el) {
      var v = pick(el.getAttribute("data-i18n-aria"));
      if (v != null) el.setAttribute("aria-label", v);
    });
    var page = document.body.getAttribute("data-page") || "home";
    var t = current === "en" ? EN["__title_" + page] : TH.__title;
    if (t) document.title = t;
    var d = current === "en" ? EN["__desc_" + page] : TH.__desc;
    if (meta && d) meta.setAttribute("content", d);

    Array.prototype.forEach.call(document.querySelectorAll("[data-lang-btn]"), function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-lang-btn") === current));
    });
    document.documentElement.classList.remove("i18n-wait");
    document.dispatchEvent(new CustomEvent("langchange", { detail: { lang: current } }));
  }

  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-lang-btn]");
    if (!b) return;
    var lang = b.getAttribute("data-lang-btn");
    if (lang === current) return;
    store(lang);
    // keep ?lang= in the address bar in sync so the link can be shared
    try {
      var u = new URL(location.href);
      if (u.searchParams.has("lang")) { u.searchParams.set("lang", lang); history.replaceState(null, "", u); }
    } catch (err) {}
    apply(lang);
  });

  window.I18N = {
    get lang() { return current; },
    t: function (key) { return pick(key); },
    set: apply
  };

  apply(detect());
})();
