import { gql, type TypedDocumentNode } from '@apollo/client';
import type {
  EventOption,
  FeedbackEntry,
  FeedbackFilterInput,
  FeedbackPage,
  FeedbackSubscriptionFilterInput,
  SubmitFeedbackInput,
} from '@/types/graphql';

const FEEDBACK_FIELDS = gql`
  fragment FeedbackFields on Feedback {
    id
    eventId
    eventName
    submitterName
    rating
    description
    createdAt
  }
`;

export interface EventsQueryData {
  events: EventOption[];
}

export const EVENTS_QUERY: TypedDocumentNode<EventsQueryData, Record<string, never>> = gql`
  query Events {
    events {
      id
      name
      date
      location
    }
  }
`;

export interface FeedbackQueryData {
  feedback: FeedbackPage;
}

export interface FeedbackQueryVariables {
  filter?: FeedbackFilterInput;
}

export const FEEDBACK_QUERY: TypedDocumentNode<FeedbackQueryData, FeedbackQueryVariables> = gql`
  query Feedback($filter: FeedbackFilterInput) {
    feedback(filter: $filter) {
      items {
        ...FeedbackFields
      }
      totalCount
      offset
      limit
      hasMore
    }
  }
  ${FEEDBACK_FIELDS}
`;

export interface SubmitFeedbackMutationData {
  submitFeedback: FeedbackEntry;
}

export interface SubmitFeedbackMutationVariables {
  input: SubmitFeedbackInput;
}

export const SUBMIT_FEEDBACK_MUTATION: TypedDocumentNode<
  SubmitFeedbackMutationData,
  SubmitFeedbackMutationVariables
> = gql`
  mutation SubmitFeedback($input: SubmitFeedbackInput!) {
    submitFeedback(input: $input) {
      ...FeedbackFields
    }
  }
  ${FEEDBACK_FIELDS}
`;

export interface FeedbackAddedSubscriptionData {
  feedbackAdded: FeedbackEntry;
}

export interface FeedbackAddedSubscriptionVariables {
  filter?: FeedbackSubscriptionFilterInput;
}

export const FEEDBACK_ADDED_SUBSCRIPTION: TypedDocumentNode<
  FeedbackAddedSubscriptionData,
  FeedbackAddedSubscriptionVariables
> = gql`
  subscription FeedbackAdded($filter: FeedbackSubscriptionFilterInput) {
    feedbackAdded(filter: $filter) {
      ...FeedbackFields
    }
  }
  ${FEEDBACK_FIELDS}
`;
