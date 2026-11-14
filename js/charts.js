/* ==========================================================================
   Charts for the walkthrough screens: inline SVG / HTML strings, no library.
   Ported from the BRTY v4 deck (presentation/v4/charts.js).
   Marks: bars <= 24px with a 4px rounded data end and a square baseline,
   recessive grid, one value axis, values in text ink (never series colour),
   a direct label only on the mark that matters.
   Colours come from CSS variables (--series-1..3, --accent) so the page
   theme restyles every chart. Bars grow in with CSS (.ch-bar / .ch-hb);
   the walkthrough's .is-instant switches that off for final-state jumps.
   ========================================================================== */
(function () {
  "use strict";

  var SERIES = ["var(--series-1)", "var(--series-2)", "var(--series-3)"];
  var esc = function (s) { return window.Walkthrough ? window.Walkthrough.esc(s) : String(s); };
  var niceMax = function (v) {
    var p = Math.pow(10, Math.floor(Math.log10(v || 1)));
    return Math.ceil(v / p * 2) / 2 * p;
  };
  var plain = function (v) { return String(Math.round(v * 100) / 100); };

  /* Path of a bar with a rounded top (or rounded right end when horizontal). */
  function barPath(x, top, w, base, round) {
    var h = base - top, r = round ? Math.min(4, h, w / 2) : 0;
    if (h <= 0) return "";
    return "M" + x + "," + base + "V" + (top + r) + "Q" + x + "," + top + " " + (x + r) + "," + top +
      "H" + (x + w - r) + "Q" + (x + w) + "," + top + " " + (x + w) + "," + (top + r) + "V" + base + "Z";
  }

  var Charts = {
    /* Vertical bars, single or stacked.
       items: [{label, value, hi, tip}] or [{label, parts:[a,b,c], hi, tip}]
       opts: {w, h, max, fmt (axis + value text), every (label step), alt,
              series: [css colours] for stacked parts, valueOn: index to label} */
    columns: function (items, opts) {
      opts = opts || {};
      var Wd = opts.w || 520, Ht = opts.h || 200, L = 44, T = 24, B = 26;
      var fmt = opts.fmt || plain;
      var series = opts.series || SERIES;
      var total = function (it) { return it.parts ? it.parts.reduce(function (s, v) { return s + v; }, 0) : it.value; };
      var max = opts.max || niceMax(Math.max.apply(null, items.map(total)));
      var band = (Wd - L) / items.length;
      var bw = Math.min(24, band * 0.62);
      var base = Ht - B;
      var y = function (v) { return T + (Ht - T - B) * (1 - v / max); };
      var grid = [0, 0.5, 1].map(function (f) {
        var v = max * f;
        return '<line x1="' + L + '" x2="' + Wd + '" y1="' + y(v) + '" y2="' + y(v) + '" class="ch-grid"/>' +
          '<text x="' + (L - 6) + '" y="' + (y(v) + 4) + '" text-anchor="end" class="ch-ax">' + esc(fmt(v)) + "</text>";
      }).join("");
      var marks = items.map(function (it, i) {
        var x = L + band * i + (band - bw) / 2;
        var cx = x + bw / 2;
        var out = "";
        if (it.parts) {
          var acc = 0;
          var lastIdx = -1;
          it.parts.forEach(function (v, k) { if (v > 0) lastIdx = k; });
          it.parts.forEach(function (v, k) {
            if (v <= 0) return;
            var b0 = y(acc), top = y(acc + v);
            out += '<path class="ch-bar" style="--i:' + i + ';fill:' + series[k % series.length] + '" d="' + barPath(x, top, bw, b0, k === lastIdx) + '"/>';
            acc += v;
          });
        } else if (it.value > 0) {
          out += '<path class="ch-bar" style="--i:' + i + ';fill:' + (it.hi ? "var(--series-2)" : series[0]) + '" d="' + barPath(x, y(it.value), bw, base, true) + '"/>';
        }
        var showLab = opts.every ? (i % opts.every === 0 || it.hi) : true;
        if (showLab) out += '<text x="' + cx + '" y="' + (Ht - 8) + '" text-anchor="middle" class="ch-ax' + (it.hi ? " ch-hi" : "") + '">' + esc(it.label) + "</text>";
        if (it.hi || opts.valueOn === i) {
          var anchor = cx > Wd - 60 ? "end" : cx < L + 40 ? "start" : "middle";
          var tx = anchor === "end" ? x + bw : anchor === "start" ? x : cx;
          out += '<text x="' + tx + '" y="' + (y(total(it)) - 8) + '" text-anchor="' + anchor + '" class="ch-val">' + esc(it.tip || fmt(total(it))) + "</text>";
        }
        return out;
      }).join("");
      return '<svg class="chart" viewBox="0 0 ' + Wd + " " + Ht + '" role="img" aria-label="' + esc(opts.alt || "") + '">' + grid + marks + "</svg>";
    },

    /* Ranked horizontal bars (HTML): rows [{label, sub, value, hi}] largest first. */
    hbars: function (rows, opts) {
      opts = opts || {};
      var fmt = opts.fmt || plain;
      var max = opts.max || Math.max.apply(null, rows.map(function (r) { return r.value; }));
      return '<div class="ch-hbars">' + rows.map(function (r, i) {
        var pct = Math.max(2, Math.round(r.value / max * 100));
        return '<div class="ch-hb' + (r.hi ? " is-hi" : "") + '" style="--i:' + i + '">' +
          '<div class="ch-hb-top"><span>' + esc(r.label) + (r.sub ? "<small>" + esc(r.sub) + "</small>" : "") + "</span><b>" + esc(fmt(r.value)) + "</b></div>" +
          '<i><em style="width:' + pct + "%;background:" + (r.color || (r.hi ? "var(--series-2)" : SERIES[0])) + '"></em></i></div>';
      }).join("") + "</div>";
    },

    /* Donut with 2px gaps, a centre figure and a labelled legend.
       parts [{label, value, color}] · opts {center: [small, big], fmt} */
    donut: function (parts, opts) {
      opts = opts || {};
      var fmt = opts.fmt || plain;
      var S = 148, R = 66, r = 44, c = S / 2;
      var sum = parts.reduce(function (s, p) { return s + p.value; }, 0) || 1;
      var a0 = -Math.PI / 2;
      var pt = function (a, rad) { return (c + rad * Math.cos(a)).toFixed(2) + "," + (c + rad * Math.sin(a)).toFixed(2); };
      var arcs = parts.map(function (p, i) {
        var a1 = a0 + p.value / sum * Math.PI * 2;
        var big = a1 - a0 > Math.PI ? 1 : 0;
        var d = "M" + pt(a0, R) + "A" + R + "," + R + " 0 " + big + " 1 " + pt(a1, R) + "L" + pt(a1, r) + "A" + r + "," + r + " 0 " + big + " 0 " + pt(a0, r) + "Z";
        a0 = a1;
        return '<path class="ch-slice" style="--i:' + i + ";fill:" + (p.color || SERIES[i % SERIES.length]) + '" d="' + d + '"/>';
      }).join("");
      var mid = opts.center || ["", fmt(sum)];
      return '<div class="ch-donut"><svg viewBox="0 0 ' + S + " " + S + '" role="img" aria-label="' + esc(parts.map(function (p) { return p.label + " " + fmt(p.value); }).join(", ")) + '">' + arcs +
        '<text x="' + c + '" y="' + (c - 4) + '" text-anchor="middle" class="ch-mid-s">' + esc(mid[0]) + "</text>" +
        '<text x="' + c + '" y="' + (c + 18) + '" text-anchor="middle" class="ch-mid">' + esc(mid[1]) + "</text></svg>" +
        '<ul class="ch-legend">' + parts.map(function (p, i) {
          return '<li><i style="background:' + (p.color || SERIES[i % SERIES.length]) + '"></i><span>' + esc(p.label) + "</span><b>" + Math.round(p.value / sum * 100) + "%</b></li>";
        }).join("") + "</ul></div>";
    }
  };

  window.Charts = Charts;
})();
