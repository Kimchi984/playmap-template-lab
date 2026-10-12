# Playmap source baseline

Project: The Playmap (2f2c6483-d376-4640-b0f5-447e0c4467f9).
Source commit: ec495d390df67643d9206f0d65f30902883f4271.
Read directly via Lovable file tools on 12 October 2026; no paid Agent/Plan call.

The original SocialArtwork, SocialDisplayText, Wordmark and social helper modules are
copied into this directory so the Lab uses the existing compositions instead of approximations.
The active shared recipe manifests select bounded design controls; lab/restored.tsx adapts
fixture semantics and those controls to the existing document/slide model.

Local changes to the renderer source:
- Headline fit uses identical geometry and a shared capacity across size intents; font sizes
  are not scaled after measurement. Target limits/overflow remain visible diagnostics.
- Split shares one headline size across both panels.
- Display role can switch between Gabarito and DM Sans; support remains DM Sans and
  wordmark remains Instrument Sans. Exact roles still drive both display and measurement.
- Explicit line breaks are preserved. Single-line CTA measurement remains single-line.

Source list metrics/number treatments/readability floor/header-connected positioning,
Big Type composition, Cover lower-zone hero and Curated Pick photo/graphic bleed boxes remain.

Production is unchanged and does not yet consume these Lab manifests. Baseline restoration is
source-derived, not a claim of accepted screenshot parity. Visual QA is deferred per Alina.
Private production assets are not copied into the public repository. Local image inputs stay
in memory and are not uploaded, persisted, or included in state URLs.

Cover v3 adds frame placements in socialImagePlacement.ts: full-width bottom and independent
top-right/full-frame corner. Alpha bounds determine bottom copy safety while original
transparent files and aspect ratios remain unchanged.

Cover v4 supersedes the unaccepted v3 image-fit experiment. Copy geometry is reserved independently of upload state; transparent pixels are diagnostic only. The second optional graphic supports four corner anchors without asset flipping or cropping. Real two-file browser upload verification is required.

Cover v5 adds explicit copy-space allocation. Curated Pick v3 introduces one media-independent visual-above candidate; historical v2 is preserved behind its original inputs. The current candidate is identified by the shared manifest and rule IDs, not a separate UI template definition.
