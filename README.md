# Anapat Tantikulanon — Portfolio

Static site (HTML / CSS / JS, no build step). Deployed on Vercel from this repo.

- `index.html`: home page with featured work, four project stories (each a guided walkthrough), skills and contact
- `resume.html`: the resume page, with the PDF in `assets/`
- `js/lang-en.js`: English copy for both pages. Thai copy lives in the HTML.
- `js/walkthrough.js`: guided walkthrough engine for the project stories (ported from the BRTY v4 deck). Each story's `<ol class="project-steps">` items are its beats; a story registers its screens and steps with `Walkthrough.register(id, def)`. Motion names: step build / beat, synced step list, tap indicator, spotlight ring, handoff chip, arrive, final-state jump.
- `js/stories.js`: the four walkthroughs (screens + beats): Carbon Calculator, CFO Dashboard, Farm EF Workbook, SROI.
- `js/charts.js`: inline SVG charts for the walkthrough screens (columns, stacked columns, ranked bars, donut).
- `js/motion.js`: hero count-up. The hero entrance itself is CSS.
- `assets/img/`: profile photo, card captures, ImageGen scenes and texture, OG image. Sources and prompts: `docs/images.md`

Preview locally:

```bash
python3 -m http.server 8790 --bind 127.0.0.1
```

The walkthrough screens use sample data. Carbon Calculator's AI matching is shown as in development.
