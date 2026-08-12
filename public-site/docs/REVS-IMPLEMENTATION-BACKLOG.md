# REVS Implementation Backlog

This backlog turns the CORE and PRINCIPLES concepts into delivery work for the REVS app.
It is ordered for a small cohort MVP and keeps the philosophy visible in the product.
It now also includes the 12 self-education modules that sit underneath the 12 capacity systems.

## Guiding Rules

- Start with understanding, not optimization.
- Keep cognitive load low at every step.
- Design around capacity, not deficit.
- Prefer practical, shippable changes over large platform work.
- If a feature does not help a user move to the next useful step, it waits.

## MVP

### 1. Foundation onboarding

- Add a short, skippable but first-time-required introduction for `CORE-001` and `PRINCIPLES`
- Explain what REVS is, why it exists, and how the four stages work
- Make the language calm, plain, and shame-free

Owner:
- Agent 1

Acceptance criteria:
- First-time users can understand REVS without leaving the app
- The intro takes less than 2 minutes to read
- The intro clearly points to the assessment or the current stage

### 1a. 12-system self-education module framework

- Define one reusable self-education module template for all 12 capacity systems
- Treat each module as a guided learning path, not just a long article
- Keep the module structure consistent: `Orient`, `Understand`, `Reflect`, `Act`, `Integrate`
- Make `REC-001` the gateway module for the 12-system framework

Owner:
- Agent 1

Acceptance criteria:
- Every capacity system can be expressed through the same module structure
- The template supports text, HTML, or PDF delivery without rewriting the pedagogy
- REC-001 is the canonical entry point for the 12 systems

### 2. Framework-first navigation

- Make `Recognise → Regulate → Rebuild → Redesign` visible across the app shell
- Add a persistent “Why REVS works” or “What is REVS?” entry point
- Keep the hidden app coherent across overview, assessment, dashboard, content, and admin

Owner:
- Agent 2

Acceptance criteria:
- Users can always tell where they are in the four-stage journey
- The top-level app feels like one system, not separate pages
- The navigation supports low-stress return visits

### 3. Principle-aware content governance

- Add principle tags to concepts
- Add review guidance for shame-free, practical, low-load writing
- Add an admin view for reviewing concepts against REVS principles
- Add module-level review criteria so each self-education module stays aligned with its system, stage, and pedagogical flow

Owner:
- Agent 3

Acceptance criteria:
- Every concept can be checked against the REVS philosophy
- Reviewers can tell whether a concept is capacity-first, practical, and low-load
- The admin workflow supports consistent content quality
- Each self-education module can be checked against the same principle set

### 3a. 12-system content model

- Add first-class metadata for the 12 capacity systems
- Link each system to its primary self-education module
- Allow concepts and assessment outputs to reference one or more systems directly
- Keep the module-to-concept relationship simple enough for a small cohort MVP

Owner:
- Agent 2

Acceptance criteria:
- Each of the 12 systems has a stable ID, label, and description
- Each system can point to one canonical module
- Concepts can declare which systems they support or explain

### 4. Assessment framing update

- Reword assessment introduction so it matches CORE language
- Emphasize conditions, capacity, and patterns rather than diagnosis or self-fix
- Keep the user-facing assessment path simple and reassuring

Owner:
- Agent 1

Acceptance criteria:
- The assessment reads like a capacity discovery tool
- The intro reinforces REVS philosophy
- No copy implies failure, deficiency, or blame

### 5. Content browser alignment

- Add principle-aware content filters
- Make browsing language match the REVS tone
- Keep search and filters calm, obvious, and mobile-first

Owner:
- Agent 2

Acceptance criteria:
- Users can browse content without cognitive overload
- Published concepts are easy to find by stage and principle
- Search and filters do not create clutter

### 6. Dashboard capacity intelligence

- Replace generic progress language with capacity language
- Summarize the 12 systems in a way that shows interdependence
- Make the dashboard useful for a quick return visit
- Show the current module or next module alongside stage guidance

Owner:
- Agent 3

Acceptance criteria:
- Dashboard clearly explains current stage and capacity
- Users can see recent activity and useful next steps
- The view works well on mobile
- Dashboard can surface module-level next steps without adding clutter

### 6a. Module progression tracking

- Track which self-education modules the user has started, resumed, or completed
- Keep the progression record lightweight and easy to export
- Use module completion to inform the next recommendation

Owner:
- Agent 3

Acceptance criteria:
- The app can record module progress with minimal friction
- Progress is visible in the dashboard without becoming a heavy tracker
- Completed modules can be used to shape the next queue

### 6b. Responsive mobile and iPad workbench

- Audit every REVS v3 page across desktop, iPad landscape, iPad portrait, mobile portrait, and mobile landscape
- Rework the desktop workbench into a touch-first tablet and mobile experience instead of shrinking the current layout
- Keep the app shell stable across devices while adapting density, hierarchy, and interaction patterns
- Prioritize iPad landscape as a first-class productivity mode with stable navigation and master-detail behavior

Owner:
- Agent 2

Acceptance criteria:
- Each major page has a defined desktop, iPad, and mobile behavior
- The layout supports touch, keyboard, and trackpad use without loss of context
- Mobile users can resume their place without hunting through the app
- iPad users can work in split-screen and portrait without losing the core flow

### 6c. ADHD-aware interaction support

- Make task initiation obvious on every page
- Keep one primary next action visible at a time
- Preserve working state and make resumption easy after interruption
- Reduce decision fatigue by chunking long flows and minimizing competing actions
- Add visible progress and completion cues where users need momentum

Owner:
- Agent 1

Acceptance criteria:
- The UI clearly signals what to do next
- Users can pause and return without losing context
- Long workflows are chunked into manageable steps
- The dashboard, overview, and assessment all support quick re-entry

### 6d. Autism-aware interaction support

- Keep navigation, labels, and page structure predictable
- Use literal, stable wording and reduce ambiguity
- Make system state and feedback explicit
- Avoid unnecessary motion, surprise layout shifts, and competing visual noise
- Support user control over density, motion, and presentation

Owner:
- Agent 3

Acceptance criteria:
- The interface feels stable across repeated visits
- Buttons, nav, and state indicators stay in consistent locations
- Users can choose a calmer or denser presentation without breaking the flow
- Feedback for save, publish, lock, and resume states is explicit

### 6e. Neurodiversity tensions and configurable balance

- Document where ADHD and autism needs pull in different directions
- Prefer configurable controls over one universal interaction pattern
- Support visible prompts without forcing animation or interruption
- Keep task switching possible without moving core navigation or summary areas

Owner:
- Agent 2

Acceptance criteria:
- The backlog explicitly identifies design tensions
- The app can support different presentation and density modes
- Primary navigation and context remain stable even when content changes

### 6f. Touch and tablet interaction rules

- Ensure touch targets are large enough for mobile and iPad use
- Keep filters, forms, and action clusters finger-friendly
- Use drawers, sheets, or full-screen panels for dense admin tasks on small screens
- Keep keyboard behavior and focus handling reliable for iPad users with external keyboards
- Avoid hover-only dependencies and gesture-only affordances

Owner:
- Agent 2

Acceptance criteria:
- All interactive controls are comfortably tappable
- Mobile pages do not require precision interactions
- Tablet users can complete key flows with touch or keyboard
- No critical action depends on hover

### 6g. Sensory control and personalization

- Add density, motion, and presentation controls
- Make admin/debug cues optional for ordinary users
- Keep secondary metadata collapsed by default on mobile
- Support calmer, lower-stimulation reading modes

Owner:
- Agent 3

Acceptance criteria:
- Users can reduce visual clutter without breaking the workflow
- Motion and layout changes can be kept minimal
- Extra metadata stays optional until the user asks for it

### 6h. Responsive shell architecture

- Define a device-aware shell that treats desktop, iPad landscape, iPad portrait, mobile portrait, and mobile landscape as distinct modes
- Keep the REVS stage bar, page title, and primary action visible in every mode
- Move secondary metadata, filters, and admin detail into drawers or collapsible sections on smaller screens
- Preserve stable navigation placement so users can return to the same context after interruption

Owner:
- Agent 2

Acceptance criteria:
- The app shell has explicit rules for each major device class
- The same page keeps its identity and primary action across breakpoints
- Secondary detail collapses without losing access

### 6i. Assessment and dashboard small-screen flow

- Convert the assessment into a chunked, step-based flow for mobile and iPad portrait
- Keep the dashboard queue, stage, and resume actions prominent on small screens
- Make interruption recovery and resume behavior visible and explicit
- Preserve state when users move between assessment, dashboard, and overview

Owner:
- Agent 1

Acceptance criteria:
- The assessment is comfortable to complete on a phone or tablet
- The dashboard still feels like a quick return surface on mobile
- Resume and back-navigation never hide the current state

### 6j. Content and admin responsive behavior

- Turn content filtering into a touch-friendly mobile interaction pattern
- Make content detail pages readable and stable on tablet and mobile
- Reduce admin density on small screens with sectioned panels, drawers, or full-screen forms
- Keep user-facing content calm while preserving admin-only operational detail

Owner:
- Agent 3

Acceptance criteria:
- Content discovery remains usable on touch devices
- Admin editing does not require desktop-only precision
- User and admin contexts remain clearly separated on all screen sizes

## Next

- Add concept completion tracking
- Add note-taking tied to progress events
- Add a review queue dashboard for concepts and variants
- Add principle-based validation on publish
- Add a compact content preview for each audience / format / depth
- Add archive hygiene and restore flows
- Add search and sort controls for the admin library
- Add system-level metadata to concepts and modules
- Add REC-001 as the first full self-education module
- Add the remaining REC-002 to REC-012 module briefs
- Add module progress states to the dashboard and CSV export
- Add tablet-first layout rules for overview, dashboard, content, and admin
- Add mobile-first stepper patterns for assessment and content reading
- Add configurable density and motion preferences
- Add stable sidebar / drawer behavior for iPad and mobile
- Add interaction rules for touch targets, focus, and keyboard support
- Add explicit resume / interruption recovery cues throughout the app
- Draft device-specific layout rules for overview, assessment, dashboard, content, and admin
- Turn the assessment into a mobile-first stepper
- Turn dashboard recommendations into a compact queue on small screens
- Turn content filters into a mobile drawer or accordion
- Split admin into touch-safe sections for invites, concepts, and variants

## Later

- Recommendation tuning from engagement
- Reassessment workflow
- Coaching handoff tools
- Version history for concepts and variants
- Optional CMS sync for editorial display copies
- Native mobile apps
- Larger-scale analytics and operational tooling
- Automated module generation from the self-education template
- Module-specific assessments and checkpoints
- Adaptive module sequencing based on system depletion
- Adaptive layouts per device class
- Sensory mode presets
- Tablet-optimized master-detail content browsing
- Mobile-first admin shortcuts for emergencies only

## Three-Agent Delivery Split

### Agent 1: Foundation and assessment

- Build the `CORE-001` / `PRINCIPLES` intro path
- Update assessment copy and handoff language
- Ensure the entry experience feels calm and non-judgmental
- Define the self-education module template and the REC-001 gateway module
- Design the small-screen assessment stepper and dashboard resume flow

### Agent 2: Navigation and browsing

- Strengthen stage-first navigation
- Add principle-aware content browsing
- Keep content discovery light, fast, and mobile-friendly
- Add system-level browsing and filters for the 12 capacity systems
- Define iPad and mobile navigation patterns
- Specify master-detail behavior for tablet browsing
- Document touch-first interaction rules and responsive layout breaks
- Draft responsive shell behavior for desktop, iPad, and mobile

### Agent 3: Governance and dashboard intelligence

- Add principle-aware review tools
- Improve dashboard capacity summaries
- Add progress signals that support reflection without clutter
- Track module progress and surface the next module in the dashboard
- Add sensory-control, density, and motion preferences
- Define admin mobile behavior and collapse rules
- Capture autism-informed predictability and feedback requirements
- Define mobile-safe content and admin workflows

## Backlog Order

1. Foundation intro
2. Assessment framing
3. 12-system self-education module framework
4. Stage-first navigation
5. Principle-aware content governance
6. 12-system content model
7. Capacity intelligence dashboard
8. Content browser alignment
9. Module progression tracking

## Notes

- Blog CMS stays separate for editorial content.
- REVS content ops owns atomic concepts, variants, stage logic, and delivery rules.
- The self-education module layer sits above atomic concepts and below the stage journey.
- All new content should be able to pass a low-cognitive-load review.
