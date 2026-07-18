export type StarRating = 1 | 2 | 3 | 4 | 5;

export interface EventOption {
  id: string;
  name: string;
  date: string;
  location: string;
}

export interface FeedbackEntry {
  id: string;
  eventId: string;
  eventName: string;
  submitterName: string;
  rating: StarRating;
  description: string;
  createdAt: string;
}

export interface FeedbackPage {
  items: FeedbackEntry[];
  totalCount: number;
  offset: number;
  limit: number;
  hasMore: boolean;
}

export interface FeedbackFilterInput {
  eventId?: string;
  ratings?: StarRating[];
  offset?: number;
  limit?: number;
}

export interface FeedbackSubscriptionFilterInput {
  eventId?: string;
  ratings?: StarRating[];
}

export interface SubmitFeedbackInput {
  eventId: string;
  submitterName: string;
  rating: StarRating;
  description: string;
}
