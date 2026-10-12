# Restoration checkpoint — 12 October 2026

Alina rejected the List v2 art-direction candidate at cef9d83. All three compositions are
rejected; they are not a design baseline. The subsequent conceptual Clean/Playful/Poster
policies are not accepted implementation scope either.

Current direction: restore existing Lovable source templates, fix known fitting bugs, then
improve individual bounded treatments. Cover is the current design priority; Curated Pick
must remain available as the existing mixed-post slide recipe.

The restoration uses source commit ec495d390df67643d9206f0d65f30902883f4271. Historical restoration started with List v3, Big Type/Split/Pick v2 and Cover v4.
Current versions and qualified acceptance are recorded in the newest section below.

## Cover upload regression verification

Cover v3 was unaccepted and had a null image-geometry crash. Its alpha-based fitting treated
near-transparent stray pixels in Alina's bottom PNG as the start of the artwork, collapsing
copy height. V4 replaces that coupling with the original lower-zone reservation for every
upload state. The two optional graphics remain independent; additional artwork can use any
corner anchor. Copy-area overlap is a conservative warning, never an automatic reflow.

Real hosted browser checks on renderer state c6eaf5f919c8993535227b932ce83b72aa4f1a98 used
23540.png (1122 × 1402) and 23543.png (1448 × 1086) through actual file choosers. Both upload
orders and independent removals work. The representative headline stays 123px across zero,
one and two graphics. Small/Default/Large are 123/123/123px at this constrained geometry;
visible and hidden Gabarito typography match. DM Sans visible and measured sizes were 120px.
Moving the additional PNG to top left warned about overlap while preserving copy size.
Full composition and grid preview were visually inspected at desktop. A phone viewport and
a wider fixture/graphic matrix remain to be checked; this is not blanket renderer acceptance.

Build and seven focused checks pass. Asset URLs now carry content hashes to prevent stale
UI/renderer mixtures after deployment. Uploaded originals are local previews only and are
not published in the repository. No reference snapshots are accepted/frozen. Next: Alina
reviews this repaired Cover treatment; then improve individual treatments step by step.
Production/Lovable unchanged; cumulative Lovable renderer spend remains 117.9 credits.

## Cover v5 and Curated Pick v3 — first media-independent candidate

Alina likes the Cover appearance. V5 adds explicit image-reserved/expanded copy allocation;
the default retains the liked composition. On the long fixture, the hosted headline changed
from 123 to 179px on expansion and stayed 179px after the bottom PNG upload.

Curated Pick v3 tests only visual-above: one image slot, full-width visual area, a numbered
tab at the visual/copy boundary, dominant headline, supporting copy and inline metadata.
Photos and illustrations share the same geometry, number and wordmark behaviour.
Explicit cover/contain, focus and visual backdrop affect the image only. The title fits
after actual hook/detail/metadata measurements; whole-copy overflow remains diagnostic.

Hosted renderer eeb9489274085a11eb5cdc8220f3fa5cee1205ba was tested with Alina's 23540.png
and the CERES visitor photo credited to Kristoffer Paulsen, downloaded from the official
visitor page for local QA only. Neither original asset is included in this repository.
- Both uploads rendered in the same composition, with the short headline unchanged at 132px.
- Crop/contain changes left the short headline at 132px.
- Short, long, missing optional detail/location and stress fixtures retained all fields and
  their settled child rectangles stayed inside the copy area. Constrained targets warn.
- Long Gabarito headline: Small/Default/Large = 116/116/116px. DM Sans visible/measure = 112px.
- Real 390px iframe viewport runs the same hosted Lab and responsive CSS. Photo, type and
  metadata were visually checked; artwork scaled to 351 × 438.75px inside the scrollable
  viewport. This was a browser viewport check, not a physical-device test.
- Full and approximate grid-size compositions were inspected. Nine focused checks pass.
- Immediate captures after upload/scroll occasionally showed transient yellow paint blocks;
  settled captures were correct, DOM geometry was unchanged and no renderer errors appeared.
  Preserve this observation; investigate if the flash is reproducible for Alina.

This remains one experimental Curated Pick candidate, not a frozen/accepted recipe.
The second treatment is deliberately pending review. Cover expanded copy is also experimental;
its default appearance has qualified approval. No production/Lovable changes or spend; 117.9
credits cumulative. Next: Alina reviews the same candidate with a photo and illustration.


## List v4 and Curated Pick v4 — 13 October 2026 (Sydney)

Alina retains the visual-above Pick as one useful option, especially with less copy and a
suitable full-area visual. It is not accepted as a general Playmap baseline. The second
candidate puts copy above a bottom-anchored composed illustration frame; the original
transparent padding and aspect ratio remain intact. The same upload slot supports either
medium, with explicit frame/crop/contain choices. Larger suburb text and a content-sized
price tag give practical information stronger visual weight. Dense copy remains visible
and gets a separate density warning; it is not advertised as a successful visual merely
because it fits.

List v4 keeps the restored composition. Item names now use 700/900 weights, and numbers
use 900 with larger numerals. Plain numerals on light fields use the dark foreground.
Headline height is allocated after measuring minimum-scale rows from the exact same
ListRows markup. Body fitting restarts when the actual header geometry changes. Footer
choices explicitly select CTA, graphic or none: an inactive upload neither renders nor
reserves space. The list zone no longer silently hides overflowing rows.

Renderer verified: 97588f889dad9c008d27524636dfb859d51a6b2b, Pages deployment succeeded.
- Hosted Gabarito Small/Default/Large sizes: six-item 101/112/116px; short 101/112/130px;
  awkward long 82/82/82px; explicit multiline 101/112/126px. Constrained targets warn.
- DM Sans six-item 101/108/108px; actual font family matches measurement.
- Main and grid geometry match. Lab preview note CSS formerly added margins to artwork
  paragraphs in the grid; it is now scoped to the notes outside the artwork.
- Settled six-item geometry: body top 438, height 718, ending at safe bottom 1156; the
  secondary and third lines of item 6 are present above the CTA.
- 13-item auto columns retain all fields (7 + 6 rows), scale .85, no safe-area overflow.
  This remains a dense post: the grid carries its headline/list idea, not readable small print.
- Actual 23540.png chooser upload verifies the second Pick at 900px natural-width frame,
  anchored at bottom; title 130px, suburb/price 42px. No automatic image-type switch.
- Stress Pick retains all fields and reports a 9-line copy-heavy state. Switching back to
  visual-above selects crop fit without changing semantic content.
- Both candidates inspected in the real hosted Lab at desktop and in a 390px iframe
  viewport; the phone artwork is 351 × 438.75px. This is not physical-device testing.
- Immediate control-switch screenshots can catch intermediate List scale/placement before
  its measurements settle. Verify settled geometry; a render-readiness indicator remains
  a possible Lab improvement. No new accepted reference snapshots are frozen.
- Build and 11 focused checks pass. Source PNG and photo remain local QA assets, not repo files.

Shared manifests are active List v4/Pick v4/Cover v5/Big Type v2/Split v2. New rule IDs:
list-headline-budget-v1, list-exclusive-footer-v1, list-strong-type-v1,
curated-two-compositions-v1, curated-strong-metadata-v1, curated-copy-density-v1.
List carries the eight representative/stress fixtures forward. Pick adds a short, one-hook
fixture with optional detail absent. Allowed dependent fit values/defaults come from the
manifest; the UI does not define another template contract.

Next: Alina reviews the second Pick with an appropriate composed illustration and the
stronger List hierarchy. Treat these visual changes as candidates until that review;
keep the first Pick option and liked Cover default. Dense copy, arbitrary frame/image
collisions and lower-frame full-width overlap remain content-specific diagnostics.
Production/Lovable unchanged; cumulative Lovable renderer spend remains 117.9 credits.
