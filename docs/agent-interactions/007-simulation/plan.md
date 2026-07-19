---
name: feedback simulation demo
overview: Add an unauthenticated, fire-and-forget REST simulation that submits 50 realistic fixture entries through the existing realtime publication path, plus an inline frontend trigger. Runs use random 500 ms–5 s sequential gaps, reject overlap, and return immediately so the UI stays responsive.
todos:
  - id: backend-simulator
    content: Create fixtures and the non-overlapping REST simulation controller
    status: completed
  - id: frontend-trigger
    content: Add the inline Simulate button and Vite API proxy
    status: completed
  - id: tests
    content: Add backend/frontend tests and run verification
    status: completed
isProject: false
---

# Feedback Simulation Demo

## Backend simulation
- Add a static 50-entry fixture set in [`apps/api/src/events/fixtures/simulation-feedback.fixtures.ts`](apps/api/src/events/fixtures/simulation-feedback.fixtures.ts), covering all five seeded event UUIDs with realistic names, ratings, and comments; shuffle a copy for each run so event arrival order varies.
- Add [`apps/api/src/events/events.controller.ts`](apps/api/src/events/events.controller.ts) with unauthenticated `POST /api/events/simulate`:
  - atomically reject a second active run with HTTP 409;
  - return HTTP 202 immediately with the scheduled item count;
  - continue a background sequential loop, waiting a random 500–5,000 ms before each fixture;
  - call `EventsService.submitFeedback()` for every item so persistence and the existing `feedbackAdded` PubSub subscription behave exactly like real submissions;
  - log individual failures and continue, then always clear the active-run flag.
- Register the controller in [`apps/api/src/events/events.module.ts`](apps/api/src/events/events.module.ts). Keep the endpoint intentionally unguarded as requested; no GraphQL schema or auth changes are needed.

## Frontend trigger
- Update [`apps/web/src/components/FeedbackStream.tsx`](apps/web/src/components/FeedbackStream.tsx) to place a shadcn `Simulate` button inline beside “Feedback from attendees.” The click handler will POST to `/api/events/simulate`, disable only while the request is starting, and show a compact accessible error for HTTP/network failures (including an already-running 409). Realtime entries will continue to arrive through the existing subscription without a manual refetch.
- Proxy `/api` to the Nest server in [`apps/web/vite.config.ts`](apps/web/vite.config.ts), matching the existing relative `/graphql` development setup.

## Verification
- Add controller unit coverage in [`apps/api/src/events/events.controller.spec.ts`](apps/api/src/events/events.controller.spec.ts) using fake timers/mocked randomness and a mocked `EventsService`: immediate acceptance, 50 sequential submissions, valid delay bounds, overlap rejection, failure continuation, and active-state cleanup.
- Extend [`apps/web/src/App.test.tsx`](apps/web/src/App.test.tsx) with mocked `fetch` coverage for the POST, request-in-flight button state, and friendly failure feedback.
- Run formatting, targeted API/web tests, typechecking, linting, and the repository CI suite.