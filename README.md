# SOFT RIOT / prototype 001

A self-hosted knitting wardrobe and four-part fashion flipbook, inspired by the playful outfit selection in Clueless and a post-punk collage aesthetic.

## Run it locally

With Node.js installed, run `npm run dev` in this folder, then open http://127.0.0.1:8080.
No package installation or build is needed. Alternatively run `python -m http.server 8080 --bind 127.0.0.1` here.
Use an HTTP server; browser security prevents ES modules from working by double-clicking index.html.

## Host it yourself

Upload `index.html`, `style.css`, `app.js`, `catalog.js`, `garments.json`, `favicon.svg`, `assets/`, and `vendor/` to any static HTTP(S) host.
They work in a subdirectory as well as a domain root. Serve `.js` as JavaScript and `.png` as PNG.
No server-side app, OpenAI account, API key, CDN, external font, database, analytics, or build service is involved.
The JavaScript source and unmodified Three.js 0.180.0 distribution are included; preserve `vendor/LICENSE`.

The included Node server is a loopback-only development convenience, not a production server.

## Explore

- The Adult wardrobe lists every non-placeholder garment in `garments.json` with no audience tag or with `"audience": "adult"` (the archived concept boots are not shown or published).
- The header's `ADULT / YOUNGLINGS` switch selects a separate mannequin and garment lane. Younglings opens straight into the fitting bay and never places Adult layers on the smaller model.
- Choose a garment to wear it and open the flipbook.
- Click a garment on the figure, swipe sideways, or use the previous/next controls to cycle its section.
- The blue button changes every section that has more than one garment; the look counter shows the current combination out of the total.
- Pause motion stops the floating wardrobe and section animations; operating-system reduced motion is respected.
- Buttons support keyboard operation and have accessible names. Without WebGL the wardrobe uses static image cards.

## Where to change things

- `garments.json`: the garment list, one entry per layer (slot, image file, size, `audience`, and `fit`: centre x and y as a fraction of the figure box, width as a fraction of the figure width, layer order). Made by `02_WORK/photo-prep/export_garments.py`; the fits are set in the fitting editor (`04_DOCS/fitting-editor.html`).
- `catalog.js`: the four section names and boundaries, and the loader that reads `garments.json` into pieces.
- `style.css`: the neon void palette (black, violet, cobalt and teal), responsive layout, and page-turn animation.
- `app.js`: shared outfit state, the layered figure, the Three.js gallery, input handlers and optional WebMCP action.
- `assets/garments/`: transparent WebP layers, one per garment. Archived concept-boot source files remain local for recovery but are excluded from the public site.
- `assets/figure/cyber-goth-mannequin-base-v2.png`: the transparent, straight-on gloss-black Adult mannequin base beneath the layered garments.
- `assets/figure/cyber-goth-youngling-base-v1.png`: the transparent compact Younglings mannequin base, in the same black lacquer and neon reflection language.

SOFT RIOT is a working title, not a settled brand. The hairpieces, tops, bottoms and bag are photographs of the maker's own knits.

## Garment layers (2026-09-18)

The flipbook layers one transparent garment per section over a full rendered featureless neon-black mannequin, with placement from `garments.json`, so sleeves and long pieces are no longer cut at section edges. Changing a garment turns the old one away from its own left edge. Cutouts are made with rembg in a venv at `D:\venvs\knit-chaos` (see `02_WORK/photo-prep/requirements.txt`) and cleaned in `04_DOCS/cutout-touchup.html`.

For the next photo session:

1. Photograph each piece front-on on a plain matte background that contrasts with the yarn; leave room around all loose threads.
2. Use the same camera angle and soft, even light; retain full-resolution originals.
3. For pieces that drape, include a worn or mannequin shot as well as a flat shot.
4. Include an approximate width and height so the placement scale can be set consistently.

Keep original photos in the project's `01_RESEARCH/` (first drop: `photo-drop-2026-09-18/originals/`); derived web assets belong here in `assets/garments/`. Fits are set by hand, not automatically; the worn or mannequin shots would let a fit be checked against a real body.

## Younglings lane

Younglings is a separate, empty garment lane until the first youth knit cutouts arrive. It uses the compact, abstract neon-black display mannequin and a default 120 cm fitting reference. Nothing is copied from the Adult wardrobe.

To add a youth layer, process the cutout as usual, then set `"audience": "youngling"` on that garment in `garments.json` or select **Younglings** in the fitting editor and choose the garment's Audience field before saving. `export_garments.py` preserves that tag on future exports. The website filters the wardrobe by this field, so all four slots need at least one Younglings layer before the flipbook controls appear.

## Validation

See `QA.md` for the prototype checks. There is no backend and no outfit persistence; a reload restores the starting outfit.
