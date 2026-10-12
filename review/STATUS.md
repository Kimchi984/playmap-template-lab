# Restoration checkpoint — 12 October 2026

Alina rejected the List v2 art-direction candidate at cef9d83. All three compositions are
rejected; they are not a design baseline. The subsequent conceptual Clean/Playful/Poster
policies are not accepted implementation scope either.

Current direction: restore existing Lovable source templates, fix known fitting bugs, then
improve individual bounded treatments. Cover is the current design priority; Curated Pick
must remain available as the existing mixed-post slide recipe.

The restoration uses source commit ec495d390df67643d9206f0d65f30902883f4271. Active List is v3;
Big Type, Split and Curated Pick are v2; Editorial Cover is v4. All visual acceptance is pending.

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
