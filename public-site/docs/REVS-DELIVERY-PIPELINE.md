# REVS v3.0 Delivery Pipeline

This document now describes the current MVP and connected flow rather than a
future build plan. The REVS shell is in place, the key routes exist, and the
main work is refining the database-backed assessment and the connected user
journey.

## Current Product Goal

Ship a low-load, accessible recovery platform that can:

- assess a new user in about 10 minutes
- detect the right starting stage
- save the assessment when `DATABASE_URL` is set
- show a connected dashboard with the latest stage and next concepts
- expose the content shell for stage-based browsing
- keep the admin and delivery flow understandable for future expansion

## Delivery Principles

- Keep the first release small and stable.
- Build for mobile first and executive-function strain first.
- Prefer clear workflows over feature density.
- Use PostgreSQL for relational content and progress data.
- Use a simple web app before considering native mobile apps.
- Ship the admin workflow only as far as it is needed for the first cohort.
- Prefer a working connected flow over broad feature claims.
- Document what is live today separately from what still belongs in later phases.

## What Exists Now

The current REVS MVP includes:

- `/revs-v3` overview shell
- `/revs-v3/assessment` for low-load sign-up, stage detection, and save flow
- `/revs-v3/dashboard` for current stage, profile summary, and recommendations
- `/revs-v3/content` for the stage-organized content shell
- `/revs-v3/admin` for the admin shell
- API routes for auth, assessment, dashboard, concepts, progress, and export
- local-storage-backed state so the flow still works before Postgres is wired

## Delivery Stages

### Stage 0: MVP alignment

Outcome:

- final MVP scope
- stage definitions
- database setup
- connected route map
- plain-language product promise

Done when:

- the four stages are fixed
- the 12 capacity systems are fixed
- the assessment saves when a database is present
- the current route flow is documented clearly

### Stage 1: Foundation and access

Build:

- email/password auth
- user records
- session handling
- dark mode preference
- profile shell

Done when:

- a user can create an account and sign in
- a user can return to the same account
- the app renders clearly on phone and desktop
- the saved assessment can be loaded into the dashboard

### Stage 2: Assessment and stage detection

Build:

- 60-70 question assessment
- save and resume
- capacity profile across 12 systems
- stage detection rules
- reassessment marker for later use

Done when:

- the user gets a stage result immediately after completion
- the profile is readable at a glance
- CSV export of the profile is possible
- the assessment can fall back gracefully when `DATABASE_URL` is absent

### Stage 3: Content model and delivery

Build:

- atomic concept database tables
- audience framings
- format variants
- depth variants
- prerequisites and pairs-with relationships
- evidence and accessibility metadata

Done when:

- one concept can be rendered in multiple audiences, formats, and depths
- the content page can switch between variants without duplicating the concept
- concepts can be browsed by stage
- the stage-aware content shell matches the dashboard recommendations

### Stage 4: Personalization and progress

Build:

- completion tracking
- recommendation rules
- adjacent concept suggestions
- depth adaptation based on engagement
- basic user journey sequencing

Done when:

- the app can recommend 3-5 next concepts
- the app can adapt depth after skipping a longer version
- completed concepts are visible in the dashboard
- progress data is reflected in the connected flow

### Stage 5: Admin and operational workflow

Build:

- concept create/edit forms
- metadata validation
- draft/publish states
- preview by audience and format
- import/export utilities

Done when:

- a non-technical founder can add a concept without SQL
- content can be edited safely
- the founder can ship new concepts quickly
- the admin workflow is understandable from the same route shell

### Stage 6: Launch readiness

Build:

- accessibility review
- performance review
- error handling
- analytics
- support process
- onboarding copy
- legal/consent pages as needed

Done when:

- the cohort can use the product without support friction
- the founder can see who is stuck
- the team can respond to bugs and content changes quickly
- the MVP is ready for a small real cohort

## Week-by-Week Plan

This is now a reference plan only. It should be used to explain sequencing,
not to imply unfinished work is already blocked out in the codebase.

### Week 1

- auth
- assessment UI
- stage detection
- dashboard shell

### Week 2

- PostgreSQL schema
- concept model
- admin UI scaffold
- content delivery shell

### Week 3

- personalization logic
- progress tracking
- adjacent concept rules
- variant rendering

### Week 4

- accessibility pass
- dark mode polish
- validation
- error states
- export flow

### Week 5-6

- pilot feedback
- bug fixing
- copy refinement
- onboarding improvements
- cohort support

## Minimum Sellable Version

The product is sellable to a small niche cohort when all of these are true:

- a new user can sign up and complete assessment without help
- the app gives a meaningful starting stage
- the dashboard shows next steps clearly
- the content system has enough concepts to support the first journey
- the admin can add or revise concepts quickly
- the product works well on mobile
- the interface is calm, accessible, and low friction
- the connected routes feel coherent from assessment through dashboard

## What Waits for Later

- native mobile apps
- community features
- coach portals
- complex analytics
- advanced branching journeys
- print/PDF automation
- large-scale multi-tenant architecture

## Suggested Order of Build

1. Stabilize the current assessment save/load flow
2. Keep the dashboard and content shell aligned with the stage model
3. Finalize the Postgres setup and schema docs
4. Tighten auth and session flow where needed
5. Improve content and variant rendering
6. Expand admin editing
7. Add progress tracking and export polish
8. Refine personalization rules
9. Finish accessibility and launch polish
