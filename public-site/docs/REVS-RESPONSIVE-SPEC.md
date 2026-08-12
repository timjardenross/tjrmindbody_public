# REVS Responsive Design Spec

This spec turns the REVS v3 desktop workbench into a touch-first, neurodiversity-aware product for iPad and mobile without losing the stable desktop structure.

## Design Goal

Design a calm, predictable, low-friction workbench that supports:

- desktop productivity
- iPad landscape as a first-class work mode
- iPad portrait as a focused reading and review mode
- mobile portrait as a single-task mode
- mobile landscape as a compact return-to-work mode

The product should support ADHD and autistic users without stereotyping them. It should offer clarity, consistency, and recovery after interruption.

## Global Rules

- Keep one primary action visible per screen.
- Keep current stage, page title, and route context stable across devices.
- Preserve state when a user moves between pages or gets interrupted.
- Avoid hover-only interactions.
- Avoid surprise motion or layout shifts.
- Use drawers, sheets, or collapsible sections for secondary detail on smaller screens.
- Keep touch targets large and spaced apart.
- Make admin/debug content optional and clearly separated from user content.
- Prefer explicit labels over implied meaning.

## Device Modes

### Desktop

- Full workbench mode.
- Multi-column layouts are allowed.
- Stage bar and top navigation remain visible.
- Admin pages can show richer density and multiple panels.

### iPad Landscape

- First-class productivity mode.
- Preserve the shell and stage context.
- Use master-detail patterns where possible.
- Keep filters and detail panes visible without forcing modal navigation.
- Favor side-by-side content on dashboard, content, and admin.

### iPad Portrait

- Focused review mode.
- Stack panels vertically.
- Keep primary CTA and stage context above the fold.
- Collapse secondary metadata into accordions.
- Use full-width buttons and generous spacing.

### Mobile Portrait

- Single-task mode.
- Use one-column layouts only.
- Present one primary action, one supporting action, and one optional admin link.
- Turn filters and admin detail into drawers or full-screen sheets.
- Keep resume and return points obvious.

### Mobile Landscape

- Compact single-task mode.
- Keep the same structure as mobile portrait, but allow tighter vertical spacing.
- Do not introduce extra columns unless the screen is clearly wide enough.

## Page-by-Page Rules

### Overview

Desktop:
- Show the hero, stage strip, and quick entry actions.

iPad Landscape:
- Keep the journey strip visible.
- Show `Start`, `Continue`, `Resume`, and `Admin` in a single stable row.

iPad Portrait:
- Stack the intro, journey strip, and actions.
- Keep `Resume last setup` near the top.

Mobile:
- Make `Continue to assessment` and `Resume last setup` the main actions.
- Collapse secondary explanatory text.

### Assessment

Desktop:
- Two-column layout is acceptable if the scoring flow stays clear.

iPad Landscape:
- Use a split view with progress and scoring on one side and guidance on the other when space allows.

iPad Portrait:
- Convert to a stepper or chunked vertical flow.
- Keep progress visible and sticky.

Mobile:
- Use a step-by-step flow.
- Chunk the assessment into smaller screens or grouped sections.
- Preserve resume state and make save feedback explicit.

### Dashboard

Desktop:
- Summary cards, queue, activity, and profile can remain multi-panel.

iPad Landscape:
- Best place for master-detail.
- Keep stage, resume, and queue prominent.

iPad Portrait:
- Show stage and next steps first.
- Collapse lower analytics and recent activity.

Mobile:
- Show stage, next action, and one short summary block.
- Move activity and advanced detail below the fold.

### Content Index

Desktop:
- Filters and browse grid can remain visible together.

iPad Landscape:
- Keep filters visible in a compact rail or top bar.
- Use two-column browsing where possible.

iPad Portrait:
- Convert filters to an accordion or drawer.
- Keep the current stage and search visible.

Mobile:
- Search first.
- Stage and filter chips second.
- Results list third.
- Filter detail should open in a sheet or drawer.

### Content Detail

Desktop:
- Show summary, metadata, variants, related concepts, and delivery notes.

iPad Landscape:
- Best candidate for master-detail reading.
- Keep summary and related concepts visible if space allows.

iPad Portrait:
- Stack the summary first, then variants, then delivery notes, then related concepts.

Mobile:
- Lead with the core summary.
- Collapse variants and delivery notes unless the user opens them.

### Admin

Desktop:
- Dense workbench is acceptable if sections stay readable.

iPad Landscape:
- Split invite management, concept editor, and variants into clear panels or tabs.

iPad Portrait:
- Use accordions or sectioned forms.
- Keep one editing task active at a time.

Mobile:
- Avoid complex admin editing unless necessary.
- Use full-screen sheets for editing and review.
- Keep invite actions separate from concept operations.

## Interaction Rules

- Tap targets should be at least 44x44.
- Keep the primary action near the thumb zone on mobile.
- Do not require precision taps for critical actions.
- Do not depend on hover for status or meaning.
- Use visible focus states for keyboard users.
- Keep scroll containers predictable and limited.
- Avoid nested modals.
- Keep destructive actions visually distinct.

## ADHD Considerations

- Make the next action obvious.
- Reduce the number of competing actions on one screen.
- Keep progress visible.
- Preserve state after interruption.
- Use clear “continue” and “resume” affordances.
- Break long flows into small steps.

## Autism Considerations

- Keep navigation and key controls in the same place across visits.
- Use literal, stable labels.
- Make state explicit.
- Avoid surprise animation.
- Keep visual noise low.
- Let users control density and presentation where possible.

## Tensions and Compromises

- ADHD may want visible prompts; autism may want fewer interruptions.
- ADHD may like rapid switching; autism may prefer stable spatial memory.
- The solution is configurable control, not one universal interface.

Recommended compromise:

- one primary action
- one secondary action
- optional details by expansion
- stable navigation
- optional density and motion settings

## Implementation Priorities

P0:

- make assessment mobile-safe
- make dashboard resume behavior clear
- make admin forms touch-safe

P1:

- add the responsive shell rules
- convert filters to drawers / sheets
- simplify content detail on mobile

P2:

- add density and motion preferences
- refine iPad master-detail behavior
- improve tablet spacing and typography

P3:

- polish transitions
- refine empty states
- improve visual rhythm

