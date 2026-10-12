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
