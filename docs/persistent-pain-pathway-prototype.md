# Persistent Pain Pathway Prototype

## What this prototype demonstrates

The Persistent Pain Pathway is a five-resource, app-like guide inside the existing TJR Mind & Body website:

1. Understand Your Pain
2. Find Help and Explore Options
3. Manage Your Capacity
4. Prepare for Flares
5. My Pain Plan

The pathway is informational and self-management focused. It helps someone understand, organise, prepare and connect. It does not diagnose, prescribe, recommend an individual treatment or act as a clinical record.

## Interaction model

The pathway is designed to be read first and completed lightly. Most content is visible prose. Personalisation is limited to optional reflections, the interactive factor wheel, the Green / Amber / Red Capacity Map and explicit output actions such as save, print and export.

Bad Pain Day mode remains deliberately structured so a person with low capacity can reach their saved Flare Card, health advice, serious-change guidance or emergency route without completing the pathway.

## Privacy behaviour

Pain Profile data is session-only by default. It is written to browser local storage only after the person chooses “Save on this device”. There is no server-side Pain Profile persistence in this prototype. The person can export or clear the local profile.

## Ready for external review

- All pathway routes build successfully.
- The six historical URLs remain usable; `/pain/treatments` redirects to the combined Care resource.
- Local unit and sitemap tests pass: 21 tests.
- Production route checks return HTTP 200 after deployment.
- The production pathway is available at `/pain/understand`.

## Still requires approval or further validation

- Clinical and organisational approval of wording, evidence and resource links.
- Formal WCAG 2.2 AA audit and assistive-technology testing.
- Testing with people who experience persistent pain, including low-capacity and Bad Pain Day scenarios.
- Governance process for changing treatment-sensitive content and trusted resources.
- A future offline/PWA implementation if offline Flare Card access is required beyond print or local browser storage.
