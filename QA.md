# Prototype verification / 2026-09-11

## Measured in the Codex browser

- The wardrobe initializes Three.js and displays all 12 image cards; the WebGL class is active.
- Selecting Acid mesh from the wardrobe opens the flipbook with that top selected.
- Next and previous hairpiece controls cycle Blue devil to Solar flare and back.
- Shuffle changes every section; the displayed outfit and look number update.
- At a 390 × 844 viewport, a horizontal drag across the head changes Night antenna to Blue devil.
- Enter on the next-top control changes Acid mesh to Pink noise.
- Enter on the motion control changes its state to Resume motion; selection remains intact.
- Wardrobe and flipbook navigation retain the current selections within the page session.
- Layout widths checked at 320, 390, 768 and 1440 CSS pixels; a 320px flipbook overflow was found and fixed, then verified at 305px document content width (320px viewport including scrollbar).
- Phone and desktop screenshots inspected for garment rendering, section alignment, navigation and control layout.
- Browser warning/error logs were empty during the checked interactions.
- WebMCP configure_outfit accepts four valid variants and updates visible state; an out-of-range variant rejects without altering the selected outfit.

## Logged through the standalone server

- HTML, JavaScript, CSS, favicon, artwork and both vendored Three.js modules return HTTP 200 with the appropriate MIME types.
- A missing image returns HTTP 404.
- App, catalog and development-server JavaScript syntax checks pass.

## Limits of this pass

- Browser viewport emulation and pointer dragging were used, not a physical phone or Safari.
- OS reduced-motion handling and the no-WebGL fallback were inspected in source; hardware failure and OS preference changes were not simulated.
- The generated figures are cut into horizontal bands; garments crossing a cut will intentionally show collage seams.
- Automatic garment fitting, uploads, photo background removal and saved looks are not implemented.
- Three choices in each of four independent sections give 3⁴ = 81 combinations; the interface was sampled rather than screenshot-tested in every combination.

## 2026-09-12 correction

- Changed pageflip keyframes from rotateX to rotateY; previous/next and swipe input supply opposite horizontal turn directions.
- JavaScript syntax and served CSS/JavaScript were checked; browser interaction QA was not rerun for this focused animation change.

## 2026-09-18 garment layers (browser pane, 1280 x 900 and 390 x 800)

- MEASURED: The site reads `garments.json` and builds 26 wardrobe cards, 22 hangers and 4 drawer items; the look counter reads "OF 792 POSSIBLE MUTATIONS" (11 x 9 x 2 x 4). Browser console logs were empty on the flipbook, wardrobe and closet.
- MEASURED: The flipbook draws four garment layers from their fits; all four images load. Next on the top section creates one turning leaf during the turn and none after it; previous does the same in reverse. Stepping the accessory section four times wraps Blue stomp, Fuzz pedal, String bag, Heavy metal. Shuffle changed the look from 001 to 567.
- MEASURED: The Three.js wardrobe is active (webgl class present, canvas 1189 x 1728); the closet wears a hanger on click and the drawer opens with 4 thumbnails.
- MEASURED: At 390 px wide there is no horizontal scroll on the flipbook and all four garments sit inside the viewport.
- LOGGED: Screenshots at 1280 px show the shrug, scrunchie, lace dress and boots layered on the figure; the wardrobe grid shows the cutouts on paper cards.
- Not checked: touch swipe on a real phone, Safari, the no-WebGL fallback, and whether every combination of 792 looks acceptable. The mesh tube and lace dress overlap the boots at their default fits.

## 2026-09-12 book-spine refinement

- MEASURED: The loaded page uses a left-edge origin at 0px, with separate front and back faces on the turning leaf.
- MEASURED: Next and previous update the selected garment; pausing a turn leaves zero temporary leaves and retains the selected top; browser error logs were empty.
- LOGGED: Versioned the changed CSS and JavaScript URLs to prevent stale preview assets; JavaScript syntax passes.

## 2026-09-19 featureless mannequin base

- MEASURED: Reloaded the local flipbook with the rendered transparent PNG base and confirmed the mannequin keeps one accessible garment button for each of the four sections.
- MEASURED: The default shrug and lace dress keep their fitted layers above the straight, featureless gloss-black mannequin, with cyan, violet and magenta reflections visible around the knit layers; browser logs were empty.
- LOGGED: `npm run check` passed for app.js, catalog.js and serve.mjs, and the changed CSS and JavaScript URLs carry a new cache version.

## 2026-09-19 Younglings lane and neon void reskin

- MEASURED: In the local browser, the header switch moves between the Adult flipbook with all 26 existing layers and the Younglings fitting bay. Returning to Adult restores the four active garment controls and the 792-look counter.
- MEASURED: Younglings shows the compact featureless black mannequin with violet, cobalt and teal reflections, no Adult garment layers, a 0 / 4 staging panel and a direct link to the Younglings fitting editor.
- MEASURED: `04_DOCS/fitting-editor.html?model=youngling` loads the matching mannequin, selects the Younglings mode, reports 0 Younglings garments, preserves the 120 cm figure reference and exposes the `audience` field for future youth layers.
- MEASURED: Browser warning and error logs were empty after switching Adult to Younglings and back. `npm run check` passed after the model and catalogue changes.
- NOT YET CHECKED: Younglings flipbook controls need a real youth garment in every slot before they can be exercised. No youth knit assets were present in this pass.

