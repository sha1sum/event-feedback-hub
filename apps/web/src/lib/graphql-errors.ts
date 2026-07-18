import { CombinedGraphQLErrors } from '@apollo/client/errors';

const DEFAULT_FALLBACK = 'Something went wrong. Please check your connection and try again.';

/**
 * Extracts a user-presentable message from a thrown Apollo error. GraphQL
 * errors returned by the API (e.g. "Event ... was not found") are shown
 * as-is since they are already written for end users; anything else
 * (network failures, server errors) falls back to a generic, friendly
 * message so raw technical details are never surfaced.
 */
export function getFriendlyErrorMessage(error: unknown, fallback: string = DEFAULT_FALLBACK): string {
  if (CombinedGraphQLErrors.is(error)) {
    const message = error.errors[0]?.message?.trim();
    if (message) {
      return message;
    }
  }
  return fallback;
}
