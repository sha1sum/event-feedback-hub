---
name: Dynamic GraphQL Frontend
overview: Replace the web app’s placeholder state with Apollo-backed event and feedback data, server-side filtering/pagination, mutation submission, and `graphql-ws` live updates. Keep submissions anonymous for now and add resilient loading, empty, retry, and friendly error states.
todos:
  - id: apollo-client
    content: Add Apollo HTTP/WebSocket client, proxy configuration, typed operations, and provider
    status: pending
  - id: dynamic-queries
    content: Replace placeholder events/feedback with filtered paginated GraphQL queries and UI states
    status: pending
  - id: feedback-mutation
    content: Submit anonymous feedback through the mutation with robust progress and error handling
    status: pending
  - id: live-subscription
    content: Merge filtered realtime feedback updates with deduplication and connection status
    status: pending
  - id: tests-verification
    content: Update Apollo-aware tests and run full verification
    status: pending
isProject: false
---

# Dynamic GraphQL Frontend

## 1. Establish the GraphQL client and typed operations
- Add an Apollo client module in [`apps/web/src/lib/apollo-client.ts`](apps/web/src/lib/apollo-client.ts) with split HTTP and `graphql-ws` links, normalized caching, and reconnect behavior.
- Use same-origin `/graphql` defaults and configure [`apps/web/vite.config.ts`](apps/web/vite.config.ts) to proxy both HTTP and WebSocket traffic to the API on port 1336; allow `VITE_GRAPHQL_HTTP_URL` / `VITE_GRAPHQL_WS_URL` overrides for other environments.
- Define typed `events`, paginated `feedback`, `submitFeedback`, and `feedbackAdded` documents in a focused GraphQL module. Replace placeholder-domain fields with the API contract (`description`, `createdAt`, UUID IDs) and remove runtime use of [`apps/web/src/data/placeholder.ts`](apps/web/src/data/placeholder.ts).
- Wrap the app with `ApolloProvider` in [`apps/web/src/main.tsx`](apps/web/src/main.tsx).

## 2. Load events and feedback from the API
- Update [`apps/web/src/App.tsx`](apps/web/src/App.tsx) to query events once and provide loading/error/retry states rather than seeding local placeholder state.
- Refactor [`apps/web/src/components/FeedbackStream.tsx`](apps/web/src/components/FeedbackStream.tsx) so event and multi-rating controls produce `FeedbackFilterInput`, reset pagination when filters change, and render the server’s newest-first page.
- Add offset-based “Load more” behavior using `hasMore`, with deduplication, loading/empty/error states, and retry controls.
- Update [`apps/web/src/components/FeedbackCard.tsx`](apps/web/src/components/FeedbackCard.tsx), rating components, and shared types to consume GraphQL-shaped feedback directly.

## 3. Submit feedback through the mutation
- Replace the local `crypto.randomUUID()` prepend path with `submitFeedback` from [`apps/web/src/components/FeedbackForm.tsx`](apps/web/src/components/FeedbackForm.tsx).
- Send the selected event UUID, rating, trimmed description, and fixed `submitterName: "Anonymous"`.
- Await the mutation before clearing the form; disable duplicate submissions and show progress. Preserve entered values and render a friendly inline error when validation, network, or API submission fails.

## 4. Wire real-time updates
- Subscribe to `feedbackAdded` using the currently selected event/rating filter so incoming rows match the visible stream.
- Prepend matching feedback into the current page, deduplicate mutation/subscription races by ID, and keep counts/pagination metadata coherent.
- Keep queried feedback usable if the socket is reconnecting or unavailable, while showing a non-blocking live-update status/error message.

## 5. Update tests and verify
- Rewrite [`apps/web/src/App.test.tsx`](apps/web/src/App.test.tsx) around Apollo mocks to cover event/query loading, API-backed cards, filter variables, pagination, successful anonymous mutation submission, retained form state plus friendly mutation errors, and subscription prepends without duplicates.
- Add/update focused test setup helpers only where needed; remove assertions that filters intentionally leave placeholder data unchanged.
- Verify with web tests, lint, typecheck, build, then the repository CI suite and a live API/web smoke test against migrated seed data.