# Frontend dynamic data update
_Exported on 7/18/2026 at 18:30:17 EDT from Cursor (3.12.17)_

---

**User**

When we made the UI for the `web` app, it was made without dynamic data capabilities because we did not have the backend infrastructure built yet to handle the fetching of the data. We have now completed that, and the `api` app has a GraphQL endpoint which can handle all of the functionality that's needed by the frontend. Let's now update the frontend to pull the data dynamically.

Check the backend data schema and then let's replace the static data with new dynamic data that matches the requirements of @README.md . 

Also in place is the mutation for feedback submission that we should replace when the form is submitted. We should remember to handle any errors that may occur as part of submission and display them in a friendly manner to the user.

And for the last piece of dynamic data, we have the subscription functionality in place for the realtime feedback updates, so let's wire that up as well.

---

**Cursor**

**Feedback author identity**

> **The API requires `submitterName`, but the current form and README do not ask users for a name. How should submissions populate it?**
> - Keep the existing fixed “You” value (Recommended)
> - Add a required name field to the form
> - Submit a fixed “Anonymous” value
>
> Answer: Submit a fixed "Anonymous" value for now, and this will be updated to use an authenticated user name later.

---

**User**

Let's not worry about the README updates with the dynamic client behavior or evaluator instructions, because I will be adding that later.

---

**Cursor**

Plan updated. README changes and evaluator instructions are now out of scope.

---

**User**

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

---

**Cursor**

Now the GraphQL operations module:

Now the Apollo client module and the friendly-error helper:

Now update `main.tsx` to wrap with `ApolloProvider`, and configure the vite proxy:

Now let's mark todo 1 complete and move to todo 2: replace placeholder queries in `App.tsx`, `FeedbackForm.tsx`, `FeedbackStream.tsx`, `FeedbackCard.tsx`, `StarRating.tsx`, `RatingFilterDropdown.tsx`.

Now let's remove the placeholder data file and check for remaining references, then check TypeScript compile.

Now todos 2 and 3 (queries + mutation) are effectively done together since I wrote FeedbackForm's mutation already. Let's update todos and verify with typecheck.

Good, node/yarn is available once nvm is sourced. Let's run typecheck.

Typecheck passes. Now let's run lint.

Pre-existing warning unrelated to our changes. Now let's update the test suite to work with Apollo mocks.

Now let's re-run typecheck, then write the tests.

Now let's write the new test suite.

Now let's typecheck and run the tests.

Now let's fix the two submission tests to scope card lookups to the list to avoid matching the form's textarea before it clears.

Now let's view the "Load more" test and rating-toggle test to add `__typename` and confirm the offset math is correct.

These look fine now that `feedbackMock`/`asFeedback` handle typenames. Let's re-run the full test suite.

Now remove the temporary debug line and re-run tests.

Also give the mutation mock a fixed `delay: 0` and bump the subscription delivery delay a bit for safety margin:

Now let's set `delay: 0` for the submit mutation mocks too:

Now let's remove the debug logging from `FeedbackStream.tsx` and the temporary debug wait/dump in the test, then re-run.

Now let's re-run the full test suite and typecheck/lint.

All 8 tests pass. Now let's run the web build to be sure, then the full repository CI plus a live API/web smoke test as the plan requires.

Build succeeds (the chunk-size warning is expected/benign for a bundle including Apollo Client). Now let's run the API's own tests to make sure nothing else is broken, then do a live smoke test of web talking to the real API.

Migrations already applied. Now let's run the API's own test suite (unit + e2e) to confirm nothing on the backend broke, then start both servers for a live smoke test.

All pass. Now let's run the full `yarn ci` (lint, typecheck, test, e2e) at the root, plus start both servers for a live smoke test.

Full CI passes. Now let's do a live smoke test: start the API, then the web dev server, and verify the proxy + GraphQL flow works end-to-end.

API is already running (from an earlier terminal, EADDRINUSE is fine since it's already serving on 1336) and responds with real event data. Now let's start the web dev server and test the proxy.

The vite proxy works correctly for GraphQL queries. Now let's verify the actual served HTML/JS loads and check the app doesn't error at runtime by fetching the page and checking for build artifacts issues.

Everything transforms and serves cleanly. Let's also verify a real mutation + subscription round trip works using `curl` for the mutation and a quick websocket check via a small Node script for the subscription.

Mutation works end-to-end via the proxy. Let's quickly verify the WS proxy for subscriptions using a small node script with `graphql-ws`.

Full end-to-end flow confirmed: queries, mutation, and websocket subscription all work correctly through the vite dev proxy against the real API. Let's clean up the background dev servers I started for the smoke test.

Good — the pre-existing dev servers on ports 1336/1337 (from the user's own terminals) are still running fine; only the extra instances I spawned for the smoke test were terminated. Everything is intact. Let's finalize by marking the last todo complete.

All five plan to-dos are complete. Here's a summary of what was implemented:

**Apollo client & typed operations**
- `apps/web/src/lib/apollo-client.ts`: split HTTP/`graphql-ws` link (via `split`/`operationType`), same-origin `/graphql` defaults with `VITE_GRAPHQL_HTTP_URL`/`VITE_GRAPHQL_WS_URL` overrides, `InMemoryCache`.
- `apps/web/vite.config.ts`: dev proxy forwarding both HTTP and WebSocket traffic on `/graphql` to the API (port 1336).
- `apps/web/src/graphql/operations.ts`: typed `gql` documents for `events`, `feedback`, `submitFeedback`, `feedbackAdded`, sharing a `FeedbackFields` fragment.
- `apps/web/src/types/graphql.ts` replaces `data/placeholder.ts` with API-shaped types (`description`/`createdAt`, UUID ids).
- `main.tsx` now wraps the app in `ApolloProvider`.

**Dynamic data & mutation**
- `App.tsx` queries `events` once with loading/error/retry states.
- `FeedbackStream.tsx` owns event/rating filters, queries `feedback` with server-side filtering, and implements offset-based "Load more" via `fetchMore`.
- `FeedbackForm.tsx` submits via `submitFeedback` with a fixed `submitterName: "Anonymous"`, shows submit progress, preserves entered values and shows a friendly inline error on failure (`lib/graphql-errors.ts` extracts user-safe messages from `CombinedGraphQLErrors`).

**Realtime updates**
- `FeedbackStream.tsx` uses `subscribeToMore` for `feedbackAdded` (filtered to match the active view), deduplicating by id and updating `totalCount`, with a non-blocking notice if the live channel errors.

**Tests & verification**
- Rewrote `App.test.tsx` with `MockedProvider` covering initial load, filter-driven queries, pagination, anonymous submission + realtime prepend, friendly mutation errors with retained form state, and rating-filter refetching (8 tests, all passing).
- Verified `yarn typecheck`, `yarn lint`, `yarn test`, `yarn build`, and the full root `yarn ci` (API + web) all pass.
- Did a live smoke test: started both dev servers, confirmed GraphQL queries/mutations proxy correctly and a `graphql-ws` subscription receives a mutation-triggered update over the proxied WebSocket connection.

---

**User**

Walk me through this code and explain it to me:

@apps/web/src/components/FeedbackStream.tsx:46-67 

---

**Cursor**

This snippet lives inside a `useEffect` in `FeedbackStream` and is responsible for keeping the on-screen feedback list updated in real time whenever someone (anywhere) submits new feedback that matches the currently active filters. Let me walk through it piece by piece.

## The setup: what `subscribeToMore` is

`subscribeToMore` comes from the `useQuery(FEEDBACK_QUERY, ...)` call earlier in the component (`{ data, loading, error, fetchMore, subscribeToMore, refetch }`). It's a special Apollo helper attached to that specific query's live cache entry. Calling it opens a GraphQL **subscription** (a long-lived connection over the WebSocket link) and lets you describe how each incoming subscription message should be merged into the *existing* query's result — without firing a whole new query.

```32:37:apps/web/src/components/FeedbackStream.tsx
const unsubscribe = subscribeToMore({
  document: FEEDBACK_ADDED_SUBSCRIPTION,
  variables: { filter: buildFeedbackSubscriptionFilter(eventId, ratings) },
```

- `document: FEEDBACK_ADDED_SUBSCRIPTION` — the subscription document to run, defined in `graphql/operations.ts`. It's the `feedbackAdded` subscription from the API schema.
- `variables: { filter: ... }` — `buildFeedbackSubscriptionFilter(eventId, ratings)` turns the component's currently selected event/rating filters into a `FeedbackSubscriptionFilterInput`. This means the server only pushes new feedback that matches what the user is currently looking at (e.g. if they've filtered to "5 stars only", they won't get pinged about 2-star submissions).

## The merge logic: `updateQuery`

This is the interesting part — it's called every time a new subscription message arrives, and its return value becomes the new cached result for the *original* `FEEDBACK_QUERY`.

```49:53:apps/web/src/components/FeedbackStream.tsx
updateQuery: (_unsafePreviousData, options) => {
  const incoming = options.subscriptionData.data?.feedbackAdded;
  if (!options.complete || !incoming) {
    return;
  }
```

- The first argument (`_unsafePreviousData`) is a legacy/deprecated way to access the previous cache value; it's prefixed with `_` and ignored because Apollo recommends using `options.previousData` instead (it's more type-safe).
- `options.subscriptionData.data?.feedbackAdded` pulls the actual new `Feedback` object out of the subscription payload.
- `options.complete` tells you whether the *previous* query result is fully present in the cache (not partial/missing). If the original query hasn't finished loading yet, or `incoming` is missing for some reason, the function returns `undefined` — returning `undefined` from `updateQuery` means "don't change anything," so the cache is left untouched.

```54:57:apps/web/src/components/FeedbackStream.tsx
const { previousData } = options;
if (previousData.feedback.items.some((item) => item.id === incoming.id)) {
  return;
}
```

This is the **deduplication** step. It's possible for the same feedback item to arrive twice — e.g. if the person who submits feedback is also subscribed and their own mutation result plus the subscription push both try to land in the list, or if a resubscribe happens to replay something. So before merging, it checks whether an item with this `id` is already in `previousData.feedback.items`. If so, it bails out (returns `undefined`) rather than inserting a duplicate card.

```58:64:apps/web/src/components/FeedbackStream.tsx
return {
  feedback: {
    ...previousData.feedback,
    items: [incoming, ...previousData.feedback.items],
    totalCount: previousData.feedback.totalCount + 1,
  },
};
```

If it's genuinely new, this constructs the new cached shape for the query:
- `...previousData.feedback` spreads in the existing `offset`, `limit`, `hasMore`, etc. unchanged.
- `items: [incoming, ...previousData.feedback.items]` **prepends** the new item to the front of the list (so newest feedback shows first, matching the "realtime stream" UX).
- `totalCount: previousData.feedback.totalCount + 1` bumps the count so pagination bookkeeping stays consistent.

Because this return value replaces the cached data for `FEEDBACK_QUERY`, React re-renders `FeedbackStream` with the updated `items` array automatically — no manual `setState` needed for the list itself.

## Error handling

```66:66:apps/web/src/components/FeedbackStream.tsx
onError: () => setRealtimeError(true),
```

If the subscription connection itself fails (e.g. the WebSocket drops and retries are exhausted), this flips a local `realtimeError` state flag, which the component uses elsewhere to show a small non-blocking notice ("Live updates are temporarily unavailable...") without breaking the rest of the page — the previously-loaded feedback list still stays visible and usable.

## Why this matters architecturally

This design means `FeedbackForm` (where the mutation is submitted) and `FeedbackStream` (where the list is displayed) are **fully decoupled** — the form doesn't need to know about or update the stream directly. Instead:

1. `FeedbackForm` calls `submitFeedback`.
2. The API publishes a `feedbackAdded` event.
3. Every connected client's `feedbackAdded` subscription receives it (if it matches their filter).
4. This `updateQuery` merges it into the cache, and the UI updates.

This also naturally supports multi-user realtime updates — if a *different* browser tab or user submits feedback matching your current filter, you'd see it appear live too, not just your own submissions.

One subtlety worth flagging: this whole `subscribeToMore` call sits inside a `useEffect` keyed on `[eventId, ratingsKey]` (visible just below the snippet you selected), specifically *excluding* `subscribeToMore` itself from the dependency array — because Apollo hands back a brand-new bound function on every render, which would otherwise cause the subscription to be torn down and re-established constantly instead of only when the filters actually change.

