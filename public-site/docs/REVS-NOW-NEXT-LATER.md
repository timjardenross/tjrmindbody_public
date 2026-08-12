# REVS v3.0 Now / Next / Later

This is the simple working track for the REVS app as it exists today.
It should stay aligned with the live MVP shell, the assessment save path, and
the connected dashboard/content flow.

## Now

- Keep the assessment flow working end to end
- Persist assessments when `DATABASE_URL` is available
- Keep the dashboard reading the latest stage and capacity profile
- Keep the REVS route shell coherent across overview, assessment, dashboard, content, and admin
- Document the database setup clearly
- Keep the local fallback behavior understandable
- Align all first-step UX with CORE-001 and PRINCIPLES

## Next

- Strengthen the connected flow between assessment and dashboard
- Tighten the stage-based content browsing experience
- Align content variants with the current stage model
- Improve admin editing and publish workflows
- Polish CSV export and profile summaries
- Add clearer empty states and error handling
- Add principle-aware content governance and review cues

## Later

- Recommendation engine
- Progress tracking
- Dark mode refinement
- Accessibility polish
- Pilot feedback loop
- Coaching integration
- Reassessment workflow
- Native mobile apps
- Larger-scale analytics and operational tooling
- Version history and archive hygiene

## Rule

Only build what helps a user move from signup to a useful next step.
If a feature does not improve the connected flow, it stays out of the MVP.
