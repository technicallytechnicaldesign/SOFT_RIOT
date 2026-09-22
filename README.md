# SOFT RIOT / prototype 001

A wardrobe for my chaotic knitting projects, and a try on gallery thing inspired by the outfit flipbook in Clueless but with a horrible half punk collage aesthetic.
LIVE: (https://technicallytechnicaldesign.github.io/SOFT_RIOT/)


## Explore

- The Adult wardrobe lists every non-placeholder garment in `garments.json` with no audience tag or with `"audience": "adult"` (the archived concept boots are not shown or published).
- The header's `ADULT / YOUNGLINGS` switch selects a separate mannequin and garment lane. Younglings opens straight into the fitting bay and never places Adult layers on the smaller model.
- Choose a garment to wear it and open the flipbook.
- Click a garment on the figure, swipe sideways, or use the previous/next controls to cycle its section.
- The blue button changes every section that has more than one garment; the look counter shows the current combination out of the total.
- Pause motion stops the floating wardrobe and section animations; operating-system reduced motion is respected.
- Buttons support keyboard operation and have accessible names. Without WebGL the wardrobe uses static image cards.



## If you want to take this shit and run it locally

With Node.js installed, run `npm run dev` in this folder, then open http://127.0.0.1:8080.
No package installation or build is needed. 

## If you wanna host it yourself

Upload `index.html`, `style.css`, `app.js`, `catalog.js`, `garments.json`, `favicon.svg`, `assets/`, and `vendor/` to any static HTTP(S) host.
They work in a subdirectory as well as a domain root. Serve `.js` as JavaScript and `.png` as PNG.
No server-side app, OpenAI account, API key, CDN, external font, database, analytics, or build service is involved.
The JavaScript source and unmodified Three.js 0.180.0 distribution are included; preserve `vendor/LICENSE`.

The included Node server is a loopback-only development convenience, not a production server.


## Where to change things

- `garments.json`: the garment list, one entry per layer (slot, image file, size, `audience`, and `fit`: centre x and y as a fraction of the figure box, width as a fraction of the figure width, layer order). Made by `02_WORK/photo-prep/export_garments.py`; the fits are set in the fitting editor (`04_DOCS/fitting-editor.html`).
- `catalog.js`: the four section names and boundaries, and the loader that reads `garments.json` into pieces.
- `style.css`: the neon void palette (black, violet, cobalt and teal), responsive layout, and page-turn animation.
- `app.js`: shared outfit state, the layered figure, the Three.js gallery, input handlers and optional WebMCP action.
- `assets/garments/`: transparent WebP layers, one per garment. Archived concept-boot source files remain local for recovery but are excluded from the public site.
- `assets/figure/cyber-goth-mannequin-base-v2.png`: the transparent, straight-on gloss-black Adult mannequin base beneath the layered garments.
- `assets/figure/cyber-goth-youngling-base-v1.png`: the transparent compact Younglings mannequin base, in the same black lacquer and neon reflection language.


## Younglings lane

Younglings is a separate, empty garment lane until the first youth knit cutouts arrive. It uses the compact, abstract neon-black display mannequin and a default 120 cm fitting reference. 

To add a youth layer, process the cutout as usual, then set `"audience": "youngling"` on that garment in `garments.json` or select **Younglings** in the fitting editor and choose the garment's Audience field before saving. `export_garments.py` preserves that tag on future exports. The website filters the wardrobe by this field, so all four slots need at least one Younglings layer before the flipbook controls appear.

## Validation

See `QA.md` for the prototype checks. There is no backend and no outfit persistence; a reload restores the starting outfit.
