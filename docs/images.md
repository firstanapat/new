# Images in `assets/img/`

Where each image comes from, so it can be remade.

| File | Source | Used for |
| --- | --- | --- |
| `profile.jpg` | Portrait from the Resume (real photo) | Hero, OG image |
| `card-<story>.webp`, `card-<story>-en.webp` | Captures of each walkthrough screen, 600 × 400 at 2× (TH and EN) | Project cards and the no-JS fallback in each story frame |
| `card-<story>-m.webp`, `card-<story>-m-en.webp` | The same screens on the compact 400 × 300 canvas phones use, at 2× (TH and EN) | Project cards on screens 700 px wide or less (`<picture>` source) |
| `card-thai-document-guide*.webp` | Final beat of the guide walkthrough (thai-docx → Word), wide and compact, TH and EN | Guide card on the home page and the no-JS fallback on `thai-document-guide.html` |
| `assets/thai-document-guide/*` | Fictional memo scan, OCR output, reviewed JSON and Word draft | Guide hero (the two papers), walkthrough screens and downloads |
| `scene-carbon-calculator.webp` | ImageGen, prompt "carbon-calculator-scene", version 2 of 3 | Carbon Calculator story head |
| `scene-cfo.webp` | ImageGen, prompt "cfo-scene", version 3 of 3 | CFO Dashboard story head |
| `farm-ef-workbook.webp` | ImageGen (first redesign round) | Farm EF Workbook story head |
| `sroi-assessment.webp` | ImageGen (first redesign round) | SROI story head |
| `texture-leaf.webp` | ImageGen, prompt "chapter-texture", version 2 of 3 | Background of the two dark chapters (Carbon Calculator, Contact) |
| `og-cover.jpg` | HTML page rendered at 1200 × 630 (name, role, numbers, portrait) | `og:image` |

All ImageGen pictures are illustrations and carry an "ภาพประกอบ / Illustration" label on the page. The walkthrough screens and card captures use sample data and are labelled "ภาพจำลองหน้าจอ / Screen mockup".

## Card captures

The cards show the same state the card click opens (`cover` in `js/stories.js`): Carbon Calculator after beat 3, CFO Dashboard after beat 2, Farm EF Workbook and SROI after their last beat. Rings are removed before capture. Recapture after changing a screen or its Thai/English text, otherwise the card and the story will differ.

## ImageGen prompts (3:2, 1536 × 1024)

**carbon-calculator-scene**

> Photorealistic 3:2 landscape editorial photograph for a sustainability × AI portfolio, illustrative fictional scene. Close view of a modern digital kWh electricity meter and main switchboard mounted on a deep forest-green painted wall inside a Thai food-processing factory. Behind it, softly out of focus, a clean stainless-steel food processing line under cool industrial light. Calm dusk mood, low-key lighting, deep forest green and muted sage tones with one soft warm highlight on the meter display. Subject placed in the right third; the left 45% of the frame is quiet, dark and uncluttered so white headline text can sit over it. Meter display shows only abstract glowing segments, no readable numbers. No people, no logos, no brand names, no signage, no readable text, no watermark. Sharp, restrained, contemporary industrial photography.

**cfo-scene**

> Photorealistic 3:2 landscape editorial photograph for a sustainability analyst portfolio, illustrative fictional scene. Top-down three-quarter view of a tidy light wooden office desk with three separate stacks of printed site reports and spreadsheets, each stack marked with a different coloured tab (muted green, blue, orange), a closed silver laptop, a calculator and a pen. The papers show only blurred table grids and faint bar shapes, no readable words or figures. The mood is "data from several sites that still needs to be brought together": slightly scattered but calm. Soft natural morning window light, warm white and pale sage palette with forest-green accents. Centered composition with generous margins, strong simple shapes that still read when shown small. No people, no hands, no logos, no brand names, no readable text, no watermark.

**chapter-texture**

> Extreme macro photograph of leaf venation filling the entire 3:2 landscape frame, abstract and edge-to-edge with no single focal point. Very dark deep forest green (around #0d2a1c) with low contrast; the veins catch only a faint, soft sage-green light, like thin lines in a data network. Even exposure across the frame, subtle natural grain, gentle vignette. Designed as a background texture behind white text, so no bright spots, no highlights, no bokeh circles, no water drops, no insects. No text, no logos, no watermark.
