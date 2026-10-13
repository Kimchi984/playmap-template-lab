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


## Readability/options refinement — 13 October 2026 (Sydney)

Alina says the List is great and likes the second Pick composition. This qualifies the
existing hierarchy/composition, not blanket acceptance for arbitrary imagery or dense copy.
Current shared versions are List v5 and Pick v5; Cover v5/Big Type v2/Split v2 unchanged.

List third-line base sizes rise from 28/25/23 to 34/32/28 across spacious/standard/compact,
with 600 weight and .95 opacity (previously 400/.7). Real reusable row measurement remains
the source of fitting; no per-item patch or truncation.

Pick v5 exposes filled pill, plain numeral and outlined circle in both treatments, with
approved palette colour selection and automatic contrast defaults. Price can stack at the
headline left edge or align its tag to the text right edge; lower treatment defaults left,
upper right. Metadata reservation follows the selected geometry before title fitting.

For lower composed frames, Soft fade (default) masks artwork at .08 opacity through the
actual measured copy bottom +16px, restoring full colour over the next 130px. No pixels are
rewritten and no asset measurements change headline/copy allocation. Full colour remains
an explicit option. Image width is shown only in the lower treatment, with a short helper;
upper treatment no longer shows the confusing inactive width control.

Published renderer cbdac7358e25003a1b24cf6cf13220f8c88532dc; Pages workflow completed successfully.
Build, 11 focused checks, JavaScript syntax and diff checks pass. Live visual verification
was attempted but is blocked: browser getAXState timed out, documentation recovery timed
out, and a session reset also timed out. Those are browser-service failures, not evidence
of a site bot block or proof of rendered correctness. Do not claim v5 desktop/phone/image
checks are complete or reuse v4 screenshots as v5 evidence.

New rules: list-readable-third-v1, curated-number-options-v1, curated-aligned-price-v1,
curated-copy-protection-v1. Representative/stress fixtures copied with v5 expectations;
allowed choices/visibility/help stay in the shared manifest. No new reference snapshots
are frozen. Next: verify v5 on the hosted Lab when browser access recovers, particularly
third-line fit in 1/2-column and 13-item cases, image width interaction, fade with overlapping
illustrations, and both price edges/number treatments. Alina's original playground file
23557.png is not locally available; do not claim exact-image verification from screenshots.
No Lovable calls/changes; cumulative renderer spend stays 117.9 credits.


## V6 hierarchy and optional-field correction — 13 October 2026 (Sydney)

Supersedes v5 readability refinements. Alina says the third List line became larger than
secondary; Pick price needs a plain/empty option, numbering needs sensible proportions
and optionality, copy hierarchy is chaotic, and the fade needs actual-copy anchoring.
Retain the liked List/Pick compositions while treating these refinements as review candidates.

List v6 uses base third sizes 29/26/23 below secondary 34/30/27, retaining 600 weight and .95
opacity. Fourteen checks pass, including primary > secondary > third for every density,
count 3–13, one/two columns and .8–1 fitting scale. Hidden and visible reusable rows agree.
Browser verification caught a fitting lifecycle defect: a new fixture whose header geometry
matched the old fixture could leave scale 1 rows and an old PASS result. The effect now
includes settled fixture identity; it clears the old report and reruns fitting.

Pick v6 defaults to plain price, retains filled tag and offers None. Empty price is valid
in the shared content contract and reserves no metadata space. Number None is also allowed;
it removes the element and releases the space before copy. Pill/plain/outlined fonts are
style-owned; circle fonts 36/48 inside 72/96px diameters with a 3px ring. Plain numbering aligns
left. Existing palette/automatic contrast choice remains.

Hierarchy: dominant headline, hook 36/600, detail 30/500, suburb and price 28/600. Price variants
reserve their actual height. The lower image itself is no longer masked: optional feathered
background-colour scrim sits behind the measured copy rectangle, padded 32px horizontally,
24px above and 48px below. It follows copy position/height and optional fields, leaving image
outside that region intact. This is a local readability candidate, not blanket acceptance
of arbitrary image collisions. Original images remain unchanged.

Published renderer 72ec500b2c652d8fbb6d440249f4d6498d044461, Pages successful. Hosted checks:
- Main/grid two-column six-item sizes 41/28/24; one-column settled 36/23/20 with all last-row
  fields present. Six→thirteen transition now settles to .9 scale, sizes 31/21/18; left/right
  columns 720/591px fit the 720px available area, retaining 7+6 items. PASS matches geometry.
- Plain right-aligned upper price reaches the text right edge; no-price fixture produces
  zero price containers. No number produces zero numbered elements and moves lower copy
  from 286 to 176. Checks exercised both treatment controls and real font rendering.
- Actual original 23540.png and 23543.png chooser uploads verify frame preservation and local
  backdrop behaviour. Representative lower title 130px; hook 36, detail 30, suburb/price 28.
  Copy bottom 731 produces backdrop top 262/height517; optional fields reposition/resize it.
  The original playground 23557.png is unavailable, so this is not exact-asset verification.
- 390px iframe viewport checked with actual 23540.png, no number and plain price; artwork 351×438.75px. This is browser viewport evidence, not a physical-device test.
- Build, 14 focused checks and diff check pass. Browser service recovered after v5 timeouts.

New stable rule IDs: list-readable-third-v2, curated-number-options-v2,
curated-optional-price-v1, curated-copy-hierarchy-v1, curated-copy-protection-v2.
Price optionality, None choices and fixtures are manifest-owned; added no-price/no-number
fixtures and carried the stress fixtures into v6. Active List/Pick v6; Cover v5 and Big
Type/Split v2 unchanged. No accepted reference snapshots frozen; production does not yet
consume these manifests. Next: Alina reviews v6 hierarchy, circle/pill scale and copy-local
backdrop strength with her own illustration. Dense-copy/overlap warnings still require
judgement. No Lovable calls/changes; spend remains 117.9 credits.


## Pick v7 headline numbering — 13 October 2026 (Sydney)

Alina rejected the small, detached plain 01 at the image boundary in both treatments.
Plain numbering now forms the first line of the headline stack and inherits its actual
font family, fitted size, weight, tracking, line height and alignment. The number and title
are measured together using loaded fonts, with the visible 16px gap reserved in fitting.
Pill/circle retain compact badge geometry; None and number colour choices remain available.

Published renderer f58a18acc2fa3d04cfdbab38e8d6dfade2f0e82d deployed successfully to Pages.
Hosted desktop upper/lower checks: number and title both Gabarito 130px/900, tracking -5.2px,
line height 111.8px and identical left edges. DM Sans check: both 117px/900, tracking -4.68px,
line height 100.62px. Real fonts report loaded. Long title state retains honest fitting/density
warnings. A 390px iframe check shows the same number/title size and alignment in the 351px
artwork; this is a browser viewport check, not a physical-device test. This narrow pass used
no images because the change concerns typography; exact uploaded-illustration collisions
remain for Alina's review. Desktop main/grid screenshots show the change in both views.

Build and 15 focused checks pass. New rules curated-number-options-v3 and
curated-headline-number-fit-v1 are recorded in the shared manifest/registry. Pick v7 fixtures
carry the existing content cases with recipe version 7; List v6, Cover v5 and Big Type/Split v2
remain active. Plain-number typography is a review candidate, not a frozen accepted snapshot.
Production integration remains outstanding. Next: Alina reviews this plain numbering in
both compositions, then continue only the specific refinements she identifies. No Lovable
calls/changes; spend remains 117.9 credits.


## Pick v8 placement correction — 13 October 2026 (Sydney)

Alina clarified that alignment meant size/style, not joining the title. V7's position and
joint-fitting change is rejected. Plain number now matches the independently fitted
headline typography while remaining outside its copy stack at the original anchor.
Upper: left 84/top 548/height 96, copy top 700. Lower: left 84/top 176/height 72, copy top 286.
The fixed anchors centre the larger numeral. Title measurement uses title text alone.
None/colour, pill/circle, price options and all other templates remain unchanged.

Renderer 4ff3c8fcb8498bda090af20735914552a30aa2f7 deployed successfully. Hosted upper:
number/title both Gabarito 136px/900, tracking -5.44px, line height 116.96px; number outside
h2, hidden measure contains only CERES Community Park. Lower: both 130px/900, tracking
-5.2px, line height 111.8px, original anchor/copy positions confirmed. Fonts loaded.
Main and grid screenshots inspected in both views; this focused pass used no image uploads
and did not repeat phone/font matrices. Exact illustration overlap remains for visual review.
Build, 15 checks and diff check pass.

Active Pick v8, List v6, Cover v5, Big Type/Split v2. Shared v8 fixtures retain prior content
cases and matching version metadata. Rules curated-number-options-v4 and
curated-independent-number-scale-v1 record the corrected behaviour. V7 remains historical,
not accepted. No reference snapshots frozen or production integration. Next: Alina reviews
number scale in the restored placement in both views. No Lovable changes/calls; 117.9 credits.
