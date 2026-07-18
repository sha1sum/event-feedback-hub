---
name: frontend-scaffold
overview: Build a responsive, accessible one-page React scaffold backed entirely by local placeholder data, with branded theme tokens and interactive form/filter controls but no API or client-side filtering integration.
todos:
  - id: build-page
    content: Add typed placeholder data and compose the responsive one-page interface
    status: in_progress
  - id: brand-theme
    content: Apply brand theme tokens and accessible responsive styling
    status: pending
  - id: add-interactions
    content: Implement animated form reveal, local submission, stars, and stateful filter controls
    status: pending
  - id: verify-scaffold
    content: Expand interaction tests and run web validation commands
    status: pending
isProject: false
---

# Frontend Scaffold

## Structure and placeholder data

- Replace the empty root in [`apps/web/src/App.tsx`](apps/web/src/App.tsx) with the single-page composition: branded header, feedback form, feedback stream controls/list, and footer.
- Add typed placeholder events and enough varied feedback entries (multiple events, ratings, review lengths, submitter names, and dates) under [`apps/web/src/data/placeholder.ts`](apps/web/src/data/placeholder.ts) so the populated layout and responsive behavior are visible.
- Split reusable presentation and interaction into focused components under [`apps/web/src/components/`](apps/web/src/components/), including shared star display/selection, form, filters, and feedback cards.

## Branded, responsive interface

- Update [`apps/web/src/index.css`](apps/web/src/index.css) so the Tailwind/shadcn theme exposes the exact brand values `#0457a0` (primary), `#05adb3` (secondary), `#fe9e25` (accent/rating stars), and `#0f172a` (body text), plus supporting surface, border, focus, and typography defaults.
- Build a responsive header using `/logo.png`, the “Event Feedback Hub” title, and an accessible Lucide login icon link; use a constrained one-column content layout and a simple copyright footer.
- Render ratings as orange `★` characters everywhere, with semantic labels for assistive technology and visible keyboard/focus states.
- Present every feedback card with the event name, star rating, review text, and submitter name in a clear visual hierarchy.

## Form and stream interactions

- Keep only the event selector visible initially; after selection, reveal rating, review textarea, and submit button with an opacity/height transition that respects reduced-motion preferences.
- Make the 1–5 star input keyboard-accessible and add local form validation. Submitting will prepend the placeholder submission to the visible stream under the temporary submitter label “You” and reset the form, while remaining fully client-side and ready to replace with an authenticated API mutation later.
- Add an event filter selector and a rating dropdown containing five independently checkable star options. Their controls will maintain UI selection state but intentionally will not alter the placeholder feedback list, matching the current no-frontend-filtering scope.

## Verification

- Expand [`apps/web/src/App.test.tsx`](apps/web/src/App.test.tsx) to cover the branded shell, complete feedback-card fields, progressive form reveal, star selection/submission, and checkable rating-filter UI without asserting filtering behavior.
- Run the web workspace formatter/checks, lint, typecheck, tests, and production build; resolve any issues introduced by the scaffold.
