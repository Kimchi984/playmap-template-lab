# Existing Playmap renderer integration — 13 October 2026 (Sydney)

State: implemented and independently checked in Lovable preview; visual acceptance and
production publication remain pending. Existing project 2f2c6483-d376-4640-b0f5-447e0c4467f9.
No standalone project, database/schema migration or production deployment.

Upstream shared baseline: fe7165ffa87e69f34a30cfd13f09207a6b4a686f, renderer release 1.0.0.
Production starting commit: ec495d390df67643d9206f0d65f30902883f4271.
Final implementation commit: 01acf164682048c924af91f1149eec505a9d6cd7.
Reviewed template pins: Big Type/Split v2, List v6, Editorial Cover v5, Curated Pick v8.
Vendored production contract is structurally identical to all five shared recipes,
24 fixtures and referenced rules; no competing recipe catalogue or runtime GitHub fetch.

Implementation reuses the typed SocialPostSpec + mixed curated.slides model, Canvas,
private graphics, semantic content JSON and local drafts. Manifest-owned controls and
pins are wired into the existing route. Instance-local fonts prevent mixed-slide font
contamination; real fitting uses the reviewed monotonic helper. Export waits for fonts,
image decoding and settled fit state. Reviewed List footer choices are exclusive; old
unpinned Lists retain the original helper metrics until explicit upgrade. Cover frames
preserve transparency/aspect ratio; the additional image is independent and does not
duplicate or overwrite decorative accents. Both Pick compositions, optional/plain/tag
price, optional numbering/colour, original plain-number anchors and copy-local protection
are implemented. Aggregate copy/density warnings remain warning-only.

Independent review found and corrected: Big Type scale initially targeted inert panels;
Cover small-accent scale/identity did not follow its visible image; composition dependency
defaults were incomplete; legacy Lists shared new weights; total-copy diagnostics missing;
Split controls read an unused block; derived-default wordmark choice could inherit a hidden
parent. Corrections were scoped to existing adapters/controls; no new design direction.

## Independent validation

Actual post-build files were exported read-only through the Lovable connector and checked
outside Lovable. Modules bundled; route, Canvas and manifest controls passed TSX syntax
compilation. Eighteen focused checks pass:

- Exact upstream contract and all 24 fixtures supported.
- Plain Pick number typography and original separate anchors.
- Optional price/number; JSON clearing preserves design/pin state.
- Per-slide font isolation in mixed posts.
- Draft pin/media roundtrip; no persisted temporary image URLs.
- Carousel numbering, duplicate/reorder pin retention.
- Actual main-hero scale and pending scale with empty image.
- Visible additional-image scale, no duplication or decorative loss.
- Composition-dependent defaults and actual price-column layout.
- Unsupported pins produce an error instead of latest-version fallback.
- List primary > secondary > third across counts/densities/columns/scales.
- Legacy List item/number/third metrics retain original behaviour.
- Explicit legacy upgrade preserves semantic fields, media and native positions.
- Split controls read actual panel intent; per-slide Show overrides hidden parent.

These are source/component checks, not native visual/font-metric parity proof. No browser,
preview, Playwright or visual QA was requested from Lovable. Native accepted snapshots
and real-asset preview acceptance remain outstanding.

## Execution lineage / spend

- Initial implementation umsg_01m4tk0h86f87r9rms480b78d7: API cost 9.9 credits, commit b6cc6cae49f0da0b6db11311f44d7d104fdc9e32.
- Consolidated correction umsg_01m4tmbcwnenx8ce2460sb8jx1: API cost 5.7, commit 46cf887a082a648ccc7abff7702b7c97283a1508.
- Final adapter correction umsg_01m4tn1dkne73sxg56e2fza2qk: API cost 1.9, commit 01acf164682048c924af91f1149eec505a9d6cd7.
- API-attributed total 17.5; previous cumulative 117.9; new cumulative 135.4 credits.

Next: Alina reviews /admin/social in the existing preview with her actual graphics and
content. New designs use reviewed pins; existing legacy drafts have an explicit upgrade
action. After visual acceptance, freeze native references and publish when authorised.
Do not resubmit the completed implementation or restart art direction.
