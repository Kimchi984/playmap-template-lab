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

Build and five focused source/contract checks pass. Browser/visual QA is deferred at Alina's
request to limit usage. Do not claim visual acceptance or bug-free rendering from those tests.
Next design work: Cover image treatment first, then Curated Pick; incremental List softening
and image/full-bleed experiments after the baseline is reviewed. No new global style modes.
