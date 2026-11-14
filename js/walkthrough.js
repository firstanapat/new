/* ==========================================================================
   Guided walkthrough engine
   Ported from the BRTY v4 deck (presentation/v4/deck.js + phone.js) and
   reshaped for a scrolling page. Same vocabulary:
     step build / beat · synced step list · tap indicator · spotlight ring (mark)
     · handoff chip (fly) · arrive · final-state jump

   One live screen in a browser frame per project story.
   - The beats are the story's <ol class="project-steps"> items. Their text
     stays in the HTML, so the story reads in full without JavaScript.
   - Scroll: a beat plays when its item reaches the middle of the viewport.
     Scrolling only moves forward; it never rewinds what has played.
   - Click: each beat gets a stretched button. Clicking jumps to that beat
     (earlier beats run instantly, the chosen one animates).
   - The frame's replay button plays every beat again from the start.
   - Opening #story-id, or prefers-reduced-motion, shows the final state.

   A story registers itself with
     Walkthrough.register("story-id", {
       url, label: {th, en}, start: "screenId", state: {...},
       screens: { screenId: { render(state, h), actions: { name(ctx, el) } } },
       steps: [ { run(ctx) }, ... ]          // one per <li> beat
     });
   Screens render HTML from state only, so a language change or a final-state
   jump can redraw them at any time. h = { tx, esc, lang }.
   ========================================================================== */
(function () {
  "use strict";

  var REDUCED = false;
  try { REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}

  /* Design size of the screen canvas; the frame scales it to fit. 3:2 matches
     the fallback images and the 1200 × 800 card captures. */
  var W = 600, H = 400;

  var lang = function () { return (window.I18N && window.I18N.lang) || document.documentElement.lang || "th"; };
  /* {th, en} → string in the current language; anything else passes through */
  var tx = function (v) {
    if (v && typeof v === "object" && !Array.isArray(v)) return v[lang()] != null ? v[lang()] : v.th;
    return v;
  };
  var esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  };
  var clone = function (o) { return JSON.parse(JSON.stringify(o || {})); };
  /* Thai vowels and tone marks must stay on their consonant while typing */
  var graphemes = function (text) {
    try {
      if (window.Intl && Intl.Segmenter) {
        return Array.from(new Intl.Segmenter(lang(), { granularity: "grapheme" }).segment(text), function (s) { return s.segment; });
      }
    } catch (e) {}
    return Array.from(text);
  };
  var UI = {
    replay: { th: "เล่นใหม่ทั้งเรื่อง", en: "Replay the walkthrough" },
    beat: { th: "เล่นขั้นนี้", en: "Play this step" }
  };
  var ICON_REPLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4.5h4.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  /* ---------------------------------------------------------------------
     Screen: the live mockup inside a browser frame (BRTY's Phone)
     --------------------------------------------------------------------- */
  function Screen(host, def) {
    this.def = def;
    this.host = host;
    this.instant = false;
    this.state = clone(def.state);
    this.screenId = def.start;
    host.classList.add("wt-host");
    host.innerHTML =
      '<div class="wt-frame">' +
        '<div class="wt-bar">' +
          '<span class="wt-dots" aria-hidden="true"><i></i><i></i><i></i></span>' +
          '<span class="wt-url" aria-hidden="true">' + esc(def.url || "") + '</span>' +
          '<button type="button" class="wt-replay">' + ICON_REPLAY + '<span class="visually-hidden"></span></button>' +
        '</div>' +
        '<div class="wt-viewport" role="img">' +
          '<div class="wt-canvas" aria-hidden="true">' +
            '<div class="wt-screen"></div>' +
            '<div class="wt-taplayer"></div>' +
          '</div>' +
        '</div>' +
      '</div>';
    this.frame = host.querySelector(".wt-frame");
    this.viewport = host.querySelector(".wt-viewport");
    this.canvas = host.querySelector(".wt-canvas");
    this.screenEl = host.querySelector(".wt-screen");
    this.tapLayer = host.querySelector(".wt-taplayer");
    this.replayBtn = host.querySelector(".wt-replay");
    var self = this;
    this.fit();
    if ("ResizeObserver" in window) new ResizeObserver(function () { self.fit(); }).observe(this.viewport);
    else addEventListener("resize", function () { self.fit(); });
    this.canvas.addEventListener("click", function (e) { self.handleClick(e); });
    this.label();
    this.render();
  }

  Screen.prototype = {
    off: function () { return REDUCED || this.instant; },
    sleep: function (ms) { return this.off() ? Promise.resolve() : new Promise(function (r) { setTimeout(r, ms); }); },
    setInstant: function (on) {
      /* Leaving instant mode would let CSS animations start on everything
         already drawn (bars would grow again), so freeze those elements first. */
      if (!on && this.instant) {
        this.screenEl.querySelectorAll("*").forEach(function (el) { el.classList.add("wt-still"); });
      }
      this.instant = on;
      this.canvas.classList.toggle("is-instant", on || REDUCED);
    },

    fit: function () {
      var w = this.viewport.clientWidth;
      if (w) this.canvas.style.setProperty("--wt-scale", String(w / W));
    },

    label: function () {
      this.viewport.setAttribute("aria-label", tx(this.def.label) || "");
      var t = tx(UI.replay);
      this.replayBtn.querySelector(".visually-hidden").textContent = t;
      this.replayBtn.title = t;
    },

    view: function (id) {
      var s = this.def.screens[id || this.screenId];
      if (!s) return "";
      return s.render(this.state, { tx: tx, esc: esc, lang: lang() });
    },

    render: function () {
      this.screenEl.innerHTML = '<div class="wt-layer current" data-screen="' + esc(this.screenId) + '">' + this.view() + "</div>";
    },

    current: function () { return this.screenEl.querySelector(".wt-layer.current"); },

    find: function (sel) {
      var cur = this.current();
      return (cur && cur.querySelector(sel)) || this.screenEl.querySelector(sel);
    },

    findAll: function (sel) {
      var cur = this.current();
      return cur ? Array.prototype.slice.call(cur.querySelectorAll(sel)) : [];
    },

    /* Change screen. dir: 'push' (forward), 'pop' (back), 'fade' or 'none'. */
    go: function (id, dir) {
      var self = this;
      dir = dir || "fade";
      if (!this.def.screens[id]) return Promise.reject(new Error("unknown screen " + id));
      var from = this.current();
      this.screenId = id;
      this.markSel = null;
      if (this.off() || dir === "none" || !from) { this.render(); return Promise.resolve(); }
      var next = document.createElement("div");
      next.className = "wt-layer wt-enter-" + dir;
      next.setAttribute("data-screen", id);
      next.innerHTML = this.view();
      this.screenEl.appendChild(next);
      from.classList.add("wt-leave-" + dir);
      from.classList.remove("current");
      next.getBoundingClientRect();
      next.classList.add("current");
      return this.sleep(380).then(function () {
        from.remove();
        next.className = "wt-layer current";
        if (self.screenId !== id) self.render();
      });
    },

    /* Redraw the current screen from state. pulse: soft ring on [data-pulse]. */
    refresh: function (pulse) {
      var cur = this.current();
      if (!cur) { this.render(); return; }
      cur.innerHTML = this.view();
      /* keep the spotlight on its target across redraws, without re-animating it */
      if (this.markSel) {
        var m = this.find(this.markSel);
        if (m) m.classList.add("wt-hl", "wt-still");
      }
      if (pulse !== false && !this.off()) this.findAll("[data-pulse]").forEach(function (el) { el.classList.add("wt-pulse"); });
    },

    set: function (patch, pulse) {
      Object.assign(this.state, patch);
      this.refresh(pulse);
      return Promise.resolve();
    },

    /* Point in canvas units (before scaling) at a fraction of an element's box. */
    pos: function (el, fx, fy) {
      var c = this.canvas.getBoundingClientRect();
      var r = el.getBoundingClientRect();
      var s = c.width / W || 1;
      return { x: (r.left + r.width * (fx == null ? 0.5 : fx) - c.left) / s, y: (r.top + r.height * (fy == null ? 0.5 : fy) - c.top) / s };
    },

    /* Visible finger tap on an element, then its data-act action if it has one. */
    tap: function (sel) {
      var self = this;
      var el = this.find(sel);
      if (!el) { console.warn("walkthrough: tap target missing", sel); return Promise.resolve(); }
      var run = function () {
        el.classList.remove("wt-pressed");
        if (el.closest("[data-act]")) return self.act(el.closest("[data-act]"));
      };
      if (this.off()) return Promise.resolve(run());
      var p = this.pos(el);
      var dot = document.createElement("span");
      dot.className = "wt-tap";
      dot.style.left = p.x + "px";
      dot.style.top = p.y + "px";
      this.tapLayer.appendChild(dot);
      setTimeout(function () { dot.remove(); }, 900);
      return this.sleep(380)
        .then(function () { el.classList.add("wt-pressed"); return self.sleep(160); })
        .then(run);
    },

    /* Spotlight ring on the control or value that matters. mark(null) clears. */
    mark: function (sel) {
      this.screenEl.querySelectorAll(".wt-hl").forEach(function (x) { x.classList.remove("wt-hl"); });
      this.markSel = sel || null;
      if (!sel) return Promise.resolve();
      var el = this.find(sel);
      if (!el) { console.warn("walkthrough: mark target missing", sel); return Promise.resolve(); }
      el.classList.remove("wt-still");
      el.classList.add("wt-hl");
      return this.sleep(350);
    },

    /* Type text into an element, then keep it in state[key]. */
    type: function (sel, key, text, cps) {
      var self = this;
      var el = this.find(sel);
      var done = function () { self.state[key] = text; self.refresh(false); };
      if (!el || this.off()) { done(); return Promise.resolve(); }
      var parts = graphemes(text);
      var gap = 1000 / (cps || 16);
      var i = 0;
      el.classList.add("wt-typing");
      el.textContent = "";
      return new Promise(function (resolve) {
        (function next() {
          if (i >= parts.length) { el.classList.remove("wt-typing"); done(); resolve(); return; }
          el.textContent += parts[i++];
          setTimeout(next, gap);
        })();
      });
    },

    /* Count a number up from state[key] (or 0) to `to`, then keep it in state. */
    count: function (sel, key, to, opts) {
      var self = this;
      opts = opts || {};
      var fmt = opts.fmt || function (v) { return Math.round(v).toLocaleString(lang() === "th" ? "th-TH" : "en-US"); };
      var el = this.find(sel);
      var from = Number(this.state[key]) || 0;
      var done = function () { self.state[key] = to; self.refresh(false); };
      if (!el || this.off()) { done(); return Promise.resolve(); }
      var ms = opts.ms || 900;
      return new Promise(function (resolve) {
        var t0 = performance.now();
        (function frame(now) {
          var k = Math.min(1, (now - t0) / ms);
          var e = 1 - Math.pow(1 - k, 3);
          el.textContent = fmt(from + (to - from) * e);
          if (k < 1) requestAnimationFrame(frame);
          else { done(); resolve(); }
        })(t0);
      });
    },

    /* Spring pop-in for new rows or cards, staggered. */
    arrive: function (sel) {
      if (this.off()) return Promise.resolve();
      var els = this.findAll(sel);
      els.forEach(function (el, i) {
        el.classList.remove("wt-still");
        el.style.animationDelay = i * 70 + "ms";
        el.classList.add("wt-arrive");
      });
      return this.sleep(420 + Math.max(0, els.length - 1) * 70);
    },

    /* Handoff chip that travels from one part of the screen to another. */
    fly: function (fromSel, toSel, text) {
      if (this.off()) return Promise.resolve();
      var a = this.find(fromSel), b = this.find(toSel);
      if (!a || !b) { console.warn("walkthrough: fly target missing", fromSel, toSel); return Promise.resolve(); }
      var p0 = this.pos(a, 0.7, 0.5), p1 = this.pos(b, 0.35, 0.5);
      var dx = p1.x - p0.x, dy = p1.y - p0.y;
      var chip = document.createElement("div");
      chip.className = "wt-chip";
      chip.textContent = tx(text);
      chip.style.left = p0.x + "px";
      chip.style.top = p0.y + "px";
      this.tapLayer.appendChild(chip);
      chip.animate([
        { transform: "translate(-50%,-50%) scale(.6)", opacity: 0 },
        { transform: "translate(-50%,-50%) scale(1)", opacity: 1, offset: 0.15 },
        { transform: "translate(calc(-50% + " + dx / 2 + "px), calc(-50% + " + (dy / 2 - 60) + "px)) scale(1)", opacity: 1, offset: 0.55 },
        { transform: "translate(calc(-50% + " + dx + "px), calc(-50% + " + dy + "px)) scale(.7)", opacity: 0 }
      ], { duration: 900, easing: "cubic-bezier(.4,0,.2,1)", fill: "forwards" });
      return this.sleep(900).then(function () { chip.remove(); });
    },

    act: function (el) {
      var screen = this.def.screens[this.screenId];
      var fn = screen && screen.actions && screen.actions[el.getAttribute("data-act")];
      return fn ? Promise.resolve(fn(this.ctx, el)) : Promise.resolve();
    },

    /* The canvas is aria-hidden and its controls are not focusable, so hand
       clicks are a bonus for mouse users; the beat buttons carry the story. */
    handleClick: function (e) {
      var el = e.target.closest && e.target.closest("[data-act]");
      if (el && this.onUserAct) this.onUserAct(el);
    }
  };

  /* ---------------------------------------------------------------------
     Story: one project's beats, its step list and its triggers (BRTY's Deck)
     --------------------------------------------------------------------- */
  function Story(article, def) {
    var self = this;
    this.article = article;
    this.def = def;
    this.items = Array.prototype.slice.call(article.querySelectorAll(".project-steps > li"));
    this.steps = def.steps || [];
    if (this.items.length !== this.steps.length) console.warn("walkthrough: " + article.id + " has " + this.items.length + " items and " + this.steps.length + " steps");
    this.screen = new Screen(article.querySelector("[data-walkthrough]"), def);
    this.screen.ctx = this.ctx();
    this.step = 0;         // beats done
    this.target = 0;       // beats that should be done
    this.running = false;
    this.playing = -1;     // beat running now
    this.via = "scroll";
    this.resetReq = false;
    this.allInstant = false;

    article.classList.add("wt-on");
    this.screen.replayBtn.addEventListener("click", function () { self.replay(); });
    this.screen.onUserAct = function (el) {
      if (self.running) return;
      self.screen.act(el);
    };
    this.bindBeats();
    this.observe();
    this.paint();

    if (REDUCED || location.hash === "#" + article.id) this.finalState();
    addEventListener("hashchange", function () { if (location.hash === "#" + article.id) self.finalState(); });
    document.addEventListener("langchange", function () {
      if (self.running) { self.langPending = true; return; }
      self.redraw();
    });
  }

  Story.prototype = {
    ctx: function () {
      var s = this.screen;
      return {
        get state() { return s.state; },
        screen: s,
        wait: function (ms) { return s.sleep(ms); },
        tap: function (sel) { return s.tap(sel); },
        mark: function (sel) { return s.mark(sel); },
        go: function (id, dir) { return s.go(id, dir); },
        set: function (patch, pulse) { return s.set(patch, pulse); },
        type: function (sel, key, text, cps) { return s.type(sel, key, text, cps); },
        count: function (sel, key, to, opts) { return s.count(sel, key, to, opts); },
        arrive: function (sel) { return s.arrive(sel); },
        fly: function (from, to, text) { return s.fly(from, to, text); },
        tx: tx
      };
    },

    redraw: function () {
      this.screen.label();
      this.screen.refresh(false);
      this.labelBeats();
    },

    reset: function () {
      var s = this.screen;
      s.state = clone(this.def.state);
      s.screenId = this.def.start;
      s.markSel = null;
      s.tapLayer.innerHTML = "";
      s.render();
      this.step = 0;
      this.paint();
    },

    runStep: function (i, instant) {
      var self = this;
      this.screen.setInstant(instant);
      this.playing = i;
      this.paint();
      var p;
      try { p = Promise.resolve(this.steps[i].run(this.screen.ctx)); }
      catch (err) { p = Promise.reject(err); }
      return p.catch(function (err) { console.error("walkthrough: step failed", self.article.id, i, err); })
        .then(function () {
          self.screen.setInstant(false);
          self.playing = -1;
          self.step = i + 1;
          self.paint();
        });
    },

    /* Ask for `count` beats to be done; the queue plays them in order.
       Returns a promise that settles when the queue is empty. */
    play: function (count, via) {
      this.target = Math.max(0, Math.min(count, this.steps.length));
      this.via = via || "scroll";
      if (!this.running) this.drained = this.drain();
      return this.drained;
    },

    drain: function () {
      var self = this;
      this.running = true;
      var loop = function () {
        if (self.resetReq) { self.resetReq = false; self.reset(); }
        if (self.target < self.step) self.reset();
        if (self.step >= self.target) {
          self.running = false;
          self.allInstant = false;
          if (self.langPending) { self.langPending = false; self.redraw(); }
          return Promise.resolve();
        }
        var i = self.step;
        /* earlier beats run instantly so the chosen one plays without a wait;
           replay plays every beat; final-state and reduced motion skip all */
        var instant = REDUCED || self.allInstant || (self.via !== "replay" && i < self.target - 1);
        return self.runStep(i, instant).then(loop);
      };
      return loop();
    },

    /* Jump straight to the state after `n` beats, without animation. */
    showBeat: function (n) {
      this.resetReq = true;
      this.allInstant = true;
      return this.play(n, "final");
    },

    finalState: function () { return this.showBeat(this.steps.length); },

    /* The beat the project card's image was captured from (def.cover). */
    coverState: function () { return this.showBeat(this.def.cover || this.steps.length); },

    replay: function () {
      this.resetReq = true;
      this.play(this.steps.length, "replay");
    },

    /* Click on a beat: show the state before it, then play it. */
    jumpTo: function (i) {
      if (i < this.step || this.running) this.resetReq = true;
      this.play(i + 1, "click");
    },

    bindBeats: function () {
      var self = this;
      this.items.forEach(function (li, i) {
        var h = li.querySelector("h4");
        if (h && !h.id) h.id = self.article.id + "-beat-" + (i + 1);
        var b = document.createElement("button");
        b.type = "button";
        b.className = "wt-beat";
        b.innerHTML = '<span class="visually-hidden"></span>';
        if (h) b.setAttribute("aria-describedby", h.id);
        b.addEventListener("click", function () { self.jumpTo(i); });
        li.classList.add("wt-beat-item");
        li.appendChild(b);
      });
      this.labelBeats();
    },

    labelBeats: function () {
      var label = tx(UI.beat);
      this.items.forEach(function (li, i) {
        var b = li.querySelector(".wt-beat .visually-hidden");
        if (b) b.textContent = label + " " + (i + 1);
      });
    },

    observe: function () {
      var self = this;
      if (!("IntersectionObserver" in window)) { this.finalState(); return; }
      /* A thin line across the middle of the viewport: only the beat that
         crosses it plays, even when beats are short and close together. If a
         jump lands past several beats at once, play only the furthest one
         (the queue runs the ones before it instantly). */
      var io = new IntersectionObserver(function (entries) {
        if (REDUCED) return;
        var far = -1;
        entries.forEach(function (en) {
          if (en.isIntersecting) far = Math.max(far, self.items.indexOf(en.target));
        });
        if (far >= 0 && far + 1 > self.target) self.play(far + 1, "scroll");
      }, {
        /* on narrow screens the frame is pinned at the top (see style.css),
           so the line sits lower, at ~72%, where the beats are visible */
        rootMargin: matchMedia("(max-width: 700px)").matches ? "-71% 0px -28% 0px" : "-49% 0px -49% 0px"
      });
      this.items.forEach(function (li) { io.observe(li); });
    },

    /* Synced step list: done ticks, the beat on screen is current. */
    paint: function () {
      var cur = this.playing >= 0 ? this.playing : this.step - 1;
      var self = this;
      this.items.forEach(function (li, i) {
        li.classList.toggle("is-done", i < self.step && i !== cur);
        li.classList.toggle("is-current", i === cur);
        var b = li.querySelector(".wt-beat");
        if (b) { if (i === cur) b.setAttribute("aria-current", "step"); else b.removeAttribute("aria-current"); }
      });
      this.screen.host.setAttribute("data-step", String(this.step));
    }
  };

  var stories = {};
  window.Walkthrough = {
    register: function (id, def) {
      var el = document.getElementById(id);
      if (!el || !el.querySelector("[data-walkthrough]")) return null;
      stories[id] = new Story(el, def);
      return stories[id];
    },
    stories: stories,
    tx: tx,
    esc: esc,
    reduced: REDUCED,
    size: { w: W, h: H }
  };
})();
