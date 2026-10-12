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
