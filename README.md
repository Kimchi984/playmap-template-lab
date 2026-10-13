# The Playmap Template Lab

A lightweight static workbench for improving the existing Playmap templates step by step.

The active templates are restored directly from the Lovable renderer at commit
`ec495d390df67643d9206f0d65f30902883f4271`, with specific Lab fitting corrections.
Clean / Playful / Poster experiments are removed from the active interface. Their historical
files are not accepted designs and must not be used as the baseline.

- Big Type and Split preserve their existing compositions with headline-font, emphasis,
  palette and existing image-slot choices. Split headlines share a size.
- List preserves its existing count/density/column/placement rules and four number styles.
  Headline sizing is monotonic. All primary/secondary/third fields remain intact.
- Editorial Cover and Curated Pick reuse their existing mixed-post slide components. Cover
  lower graphics and Pick photo-focus/graphic-bleed treatments remain available.
- Gabarito/DM Sans/Instrument Sans are real bundled fonts. Instrument Sans remains the wordmark.

## Shared contract

`recipes/catalog.json` identifies the active versioned recipe and fixture files. Controls read
bounds/defaults from those manifests. Procedural rendering stays in the source components;
registered rule IDs point to implementations. The production renderer has not been changed to
consume these manifests. No accepted snapshots have been frozen.

## Development

`npm ci`, `npm run build`, `npm test`. GitHub Pages deploys committed static files from main;
no runtime API, authentication, database or Lovable integration is needed.

Production image assets are private. Image slots accept local preview-only files and never
upload or include them in copied URLs. No fake stock or decorative stand-in is used when empty.

## Current gate

Build and focused source/contract checks are required, followed by real browser uploads for
any image treatment change. Cover v3's alpha-driven copy fitting is superseded by v4: optional
uploads now preserve the source copy zone. Both graphics are independent, removable local
previews. Additional graphics support all four corner anchors, a full-width overlay, or a
small accent; the source PNG is never flipped or cropped. Alpha is used only for conservative
copy-area overlap warnings, with near-transparent noise ignored. Visual acceptance remains
pending Alina's review. No new global style modes.

## Current bounded experiments

Cover v5 preserves the liked image reservation as its default and offers expanded copy space.
Copy allocation is explicit; graphics do not select it. Curated Pick v3 tests one visual-above
composition with one image upload for photographs or illustrations. Crop/contain, focus and
image-area background are independent of layout. Supporting fields use real measured height
before title fitting. Every field remains present; whole-copy overflow warns. Legacy v2
rendering remains available in the source for older inputs; it is not the active design.
`review/phone.html` runs the same hosted Lab in a real 390px iframe viewport for focused QA.
These changes are candidates for review, not accepted reference snapshots.

## Latest review pass

List v4 measures a hidden instance of the same rows at the 0.8 scale floor before allocating
headline space. Item/number weights are strengthened. CTA and graphic footer are exclusive;
No footer reclaims its space. Overflow is reported instead of silently clipping at the list
zone. Plain numerals use the foreground on light backgrounds to avoid faint palette colours.
Curated Pick v4 retains the upper-panel option and adds a lower composed frame. The second
option keeps the source aspect ratio/transparency and has bounded canvas widths. Stronger
suburb and price typography is measured separately; fit warnings and density guidance are
distinct. Nothing is omitted automatically to make a stress fixture look acceptable.


## Current refinement: List v6 and Pick v6

List keeps the liked hierarchy, with a stronger third line that remains smaller than the
secondary line at every supported density/count/column/fit scale. V5 oversized third text
is superseded. Pick offers plain price, filled tag or none; empty price is valid. Numbering
can be omitted, and each style now has its own font size and padding. Metadata no longer
outscales the hook: hook36, detail30, suburb/price28, beneath the dominant headline.

The lower-frame image stays unmasked. Optional copy protection is now a feathered scrim
behind actual measured copy bounds, rather than an image-wide alpha fade. It follows copy
position and height, including changes from optional number/price. Manifest controls and
shared rule IDs own the contract; see review/STATUS.md for actual verification and caveats.


Pick v7 focuses on plain numbering: it is a line inside the headline stack, using the same
real display typography and fitted size. Number and title are measured together; colour
choices remain. Pill/circle badge geometry and other templates stay as in the v6 checkpoint.
