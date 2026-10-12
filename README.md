# The Playmap Template Lab

A framework-light, deterministic pre-product workbench for designing, stress-testing and accepting Playmap social templates before they are implemented in Lovable or a future standalone renderer.

## Core principle

**Templates encode art direction, not rectangles.**

The Lab and production renderer consume the same versioned recipe manifests and fixtures. Complex fitting/layout algorithms remain in code and are referenced by stable rule IDs.

## Workflow

1. Define the template job and art-direction grammar.
2. Edit the shared recipe manifest and fixtures.
3. Stress-test short/medium/long and awkward cases in the Lab.
4. Visually approve behaviour.
5. Freeze the recipe version and accepted snapshots.
6. Production renderer consumes the same recipe + fixtures.
7. Agent-facing contracts are derived from the accepted recipe.

## Structure

- `recipes/<template>/v1/recipe.json` — shared template contract
- `recipes/<template>/v1/fixtures.json` — representative + stress inputs
- `rules/registry.json` — stable rule IDs and contracts
- `index.html`, `app.js`, `styles.css` — lightweight Lab UI

Accepted versions should be immutable. Behaviour-changing updates create a new version.

## List proof v2 — prepared, not visually accepted

List v1 remains preserved as scaffold history. The catalogue selects the experimental v2 contract.
Its three composition IDs resolve in `rules/list.js`; typography lives in `rules/typography.js` and
intent sizing in `rules/fitting.js`. Controls read allowed values from the active manifest.

- Clean: paper editorial index, restrained teal tabs and fine rules.
- Playful: teal expressive header, coloured route/rail, alternating numbered blocks on mint.
- Poster: yellow count-led header, diagonal band, full-bleed teal body and oversized numerals.

The candidate harness offers representative/awkward fixtures, a comparison strip, native-size view,
grid preview, a 390px iframe viewport, test URLs and a real-DOM stress matrix with a downloadable
report. Infeasible content must warn; a green unit test is not visual acceptance.

Run `node --test tests/*.test.mjs` for policy/contract checks. Serve the root as a static site for
real-font/DOM checks. The review HTML is a generated portable build of these exact modules and
JSON files; it is not a separately maintained recipe.

**Current verification:** four policy/contract tests and JavaScript syntax checks pass.
**Outstanding:** independent browser fitting/parity, desktop/phone visuals, 13-item readability,
art-direction judgement, publication to main and Alina's acceptance. No reference is frozen yet.

**GitHub access:** restored on 12 October 2026 after re-authorisation. Publish this candidate to
the existing repo/Pages and complete independent browser verification before acceptance.
