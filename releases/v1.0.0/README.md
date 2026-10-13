# Playmap template renderer 1.0.0

This package carries the reviewed Lab baseline: Big Type v2, Split v2, List v6,
Editorial Cover v5 and Curated Pick v8. It reuses the actual renderer components and
procedural fitting code. `contract.json` is generated from the same active recipes,
fixtures and stable rule registry that the Lab consumes. `capabilities.json` is derived
from those manifests for an agent or editor; it is not a separately maintained contract.

## Consume

Install the generated npm tarball (or build it from this repo with `npm ci`,
`npm run build`, `npm run export:renderer`). Use the existing application's compatible
React/React DOM, Vite or equivalent bundler. Include `@playmap/templates/style.css`.
The module imports the bundled font-source dependencies; real fonts must load before
rendering. The full artwork is always 1080 × 1350; scale its wrapper for previews.

```js
import {renderTemplate, createTemplateDocument} from '@playmap/templates';
import contract from '@playmap/templates/contract.json';
import '@playmap/templates/style.css';

const saved = {
  templateId: 'curated-pick',
  templateVersion: 8,
  content: {
    name: 'CERES Community Park',
    hook: 'Chooks, gardens and a creek to explore',
    location: 'Brunswick East',
    price: 'Free'
  },
  design: {treatment: 'visual-below', numberStyle: 'plain'}
};
// Application-owned asset resolution; URLs are not included in saved test state.
await renderTemplate(host, contract.recipes, saved, {visual: resolvedAssetUrl});
const {spec, assets, pin, warnings} = createTemplateDocument(
  contract.recipes, saved, {visual: resolvedAssetUrl}
);
```

All bounded defaults/allowed values come from the supplied manifest, including defaults
that depend on composition. Unknown pins or choices fail rather than silently falling
back to the latest recipe. Copy-guide lengths warn without truncation; unsupported list
counts and malformed required content fail. Preserve `templateId + templateVersion` on
each saved artwork/slide. Asset IDs and library access remain the application's concern.

## Integration boundary

This is a reusable handover, not a deployed production renderer. First consume it in an
isolated artwork frame: the compiled Tailwind CSS includes reset rules, and the existing
display-font selector is module state. Concurrent artworks must use one display-font
selection per frame. A production gallery mixing fonts needs instance-local typography
before integration. The Lab currently renders its main/grid pair with the same selection.
The semantic bridge also produces a single Pick slide numbered 01; multi-slide assembly
must retain the existing curated-post numbering model and persist a recipe pin per slide.

`renderTemplate` waits for real font availability and mounts the React artwork. Fitting
continues through the existing asynchronous layout effects; this is not an image-export
API. A production export must wait for fitting to settle and image decoding to complete.
The Lab's density/alpha-overlap diagnostics remain in `app.js`; the production adapter
must reuse those rule implementations/readouts alongside the portable fitting code.

Use the same fixtures for production parity checks, with real resolved assets. Do not
reimplement layouts from screenshots or introduce different template definitions.
Production's historic saved documents need an explicit compatibility route; do not
rewrite them silently. See `baseline-lock.json` for exact content hashes and remaining
limits. Private original image files are excluded.

## Acceptance

Alina agreed the current work was ready for a first version. That freezes the reviewed
compositions/options for integration preparation. Expanded Cover copy allocation and
arbitrary dense-copy/image collisions remain experiments. Native accepted reference
snapshots with exact asset provenance are still outstanding; current Lab screenshots
are QA evidence. This package does not claim visual-regression parity or production
readiness. Capture those references, then verify the same fixtures in the production
adapter before enabling it. No Lovable changes or credits were used to build this package.
