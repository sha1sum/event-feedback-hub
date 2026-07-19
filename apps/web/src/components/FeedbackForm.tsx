import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { useMutation } from '@apollo/client/react';
import { Show, SignInButton, useAuth, useUser } from '@clerk/react';
import { cn } from '@/lib/utils';
import { getFriendlyErrorMessage } from '@/lib/graphql-errors';
import { StarRatingSelect } from '@/components/StarRating';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FEEDBACK_QUERY, SUBMIT_FEEDBACK_MUTATION } from '@/graphql/operations';
import type { EventOption, StarRating } from '@/types/graphql';

const PENDING_FEEDBACK_STORAGE_KEY = 'event-feedback-hub:pending-feedback';
const PENDING_FEEDBACK_MAX_AGE_MS = 24 * 60 * 60 * 1000;
const SESSION_TOKEN_RETRY_DELAY_MS = 100;
const SESSION_TOKEN_MAX_ATTEMPTS = 10;

type GetToken = () => Promise<string | null>;

interface PendingFeedbackDraft {
  eventId: string;
  rating: StarRating | null;
  description: string;
  submitAfterAuth: boolean;
  savedAt: number;
}

function readPendingFeedbackDraft(): PendingFeedbackDraft | null {
  try {
    const storedDraft =
      window.localStorage.getItem(PENDING_FEEDBACK_STORAGE_KEY) ??
      window.sessionStorage.getItem(PENDING_FEEDBACK_STORAGE_KEY);
    if (!storedDraft) return null;

    const draft = JSON.parse(storedDraft) as Partial<PendingFeedbackDraft>;
    const validRating = draft.rating === null || [1, 2, 3, 4, 5].includes(draft.rating ?? 0);

    if (
      typeof draft.eventId !== 'string' ||
      typeof draft.description !== 'string' ||
      typeof draft.submitAfterAuth !== 'boolean' ||
      typeof draft.savedAt !== 'number' ||
      Date.now() - draft.savedAt > PENDING_FEEDBACK_MAX_AGE_MS ||
      !validRating
    ) {
      clearPendingFeedbackDraft();
      return null;
    }

    window.localStorage.setItem(PENDING_FEEDBACK_STORAGE_KEY, storedDraft);
    window.sessionStorage.removeItem(PENDING_FEEDBACK_STORAGE_KEY);
    return draft as PendingFeedbackDraft;
  } catch {
    return null;
  }
}

function writePendingFeedbackDraft(draft: PendingFeedbackDraft) {
  try {
    window.localStorage.setItem(PENDING_FEEDBACK_STORAGE_KEY, JSON.stringify(draft));
  } catch {
    // The in-memory form still preserves the draft if storage is unavailable.
  }
}

function clearPendingFeedbackDraft() {
  try {
    window.localStorage.removeItem(PENDING_FEEDBACK_STORAGE_KEY);
    window.sessionStorage.removeItem(PENDING_FEEDBACK_STORAGE_KEY);
  } catch {
    // Storage may be unavailable in privacy-restricted browser contexts.
  }
}

async function waitForSessionToken(getToken: GetToken): Promise<string | null> {
  for (let attempt = 0; attempt < SESSION_TOKEN_MAX_ATTEMPTS; attempt += 1) {
    const token = await getToken();
    if (token) return token;

    if (attempt < SESSION_TOKEN_MAX_ATTEMPTS - 1) {
      await new Promise((resolve) => window.setTimeout(resolve, SESSION_TOKEN_RETRY_DELAY_MS));
    }
  }

  return null;
}

interface FeedbackFormProps {
  events: EventOption[];
}

export function FeedbackForm({ events }: FeedbackFormProps) {
  const [initialDraft] = useState(readPendingFeedbackDraft);
  const [eventId, setEventId] = useState(initialDraft?.eventId ?? '');
  const [rating, setRating] = useState<StarRating | null>(initialDraft?.rating ?? null);
  const [description, setDescription] = useState(initialDraft?.description ?? '');
  const [submitAfterAuth, setSubmitAfterAuth] = useState(initialDraft?.submitAfterAuth ?? false);
  const [preparingSubmission, setPreparingSubmission] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const autoSubmissionStarted = useRef(false);

  const [submitFeedback, { loading: submitting }] = useMutation(SUBMIT_FEEDBACK_MUTATION);
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const { isLoaded: isUserLoaded, user } = useUser();

  const eventSelectId = useId();
  const reviewId = useId();

  const selectedEvent = events.find((event) => event.id === eventId) ?? null;
  const isFormVisible = selectedEvent !== null;
  const submitterName =
    user?.fullName?.trim() ||
    [user?.firstName, user?.lastName]
      .filter((name): name is string => Boolean(name?.trim()))
      .join(' ')
      .trim();

  const submitCurrentFeedback = useCallback(async () => {
    if (!selectedEvent || !rating || !description.trim()) return;
    setPreparingSubmission(true);
    setError(null);

    try {
      if (!submitterName) {
        setError('Add your full name to your Clerk profile before submitting feedback.');
        return;
      }

      const token = await waitForSessionToken(getToken);
      if (!token) {
        setError('Your sign-in is still being prepared. Please try submitting again.');
        return;
      }

      const { data } = await submitFeedback({
        awaitRefetchQueries: true,
        context: {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
        variables: {
          input: {
            eventId: selectedEvent.id,
            submitterName,
            rating,
            description: description.trim(),
          },
        },
        refetchQueries: [FEEDBACK_QUERY],
      });

      if (!data) {
        setError('Something went wrong submitting your feedback. Please try again.');
        return;
      }

      setEventId('');
      setRating(null);
      setDescription('');
      setSubmitAfterAuth(false);
      autoSubmissionStarted.current = false;
      clearPendingFeedbackDraft();
    } catch (submitError) {
      setError(
        getFriendlyErrorMessage(submitError, 'Unable to submit your feedback. Please try again.'),
      );
    } finally {
      setPreparingSubmission(false);
    }
  }, [description, getToken, rating, selectedEvent, submitFeedback, submitterName]);

  useEffect(() => {
    if (!isLoaded || isSignedIn) return;

    autoSubmissionStarted.current = false;
    const hasDraft = Boolean(eventId || rating || description);
    if (!hasDraft) {
      setSubmitAfterAuth(false);
      clearPendingFeedbackDraft();
      return;
    }

    setSubmitAfterAuth(true);
    writePendingFeedbackDraft({
      eventId,
      rating,
      description,
      submitAfterAuth: true,
      savedAt: Date.now(),
    });
  }, [description, eventId, isLoaded, isSignedIn, rating]);

  useEffect(() => {
    if (
      !isLoaded ||
      !isSignedIn ||
      !isUserLoaded ||
      !submitterName ||
      !submitAfterAuth ||
      autoSubmissionStarted.current ||
      !selectedEvent ||
      !rating ||
      !description.trim()
    ) {
      return;
    }

    autoSubmissionStarted.current = true;
    void submitCurrentFeedback();
  }, [
    description,
    isLoaded,
    isSignedIn,
    isUserLoaded,
    rating,
    selectedEvent,
    submitterName,
    submitAfterAuth,
    submitCurrentFeedback,
  ]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!isLoaded || !isSignedIn) {
      setError('Sign in to submit your feedback.');
      return;
    }
    if (!isUserLoaded || !submitterName) {
      setError('Add your full name to your Clerk profile before submitting feedback.');
      return;
    }
    if (!selectedEvent) return;
    if (!rating) {
      setError('Please select a star rating.');
      return;
    }
    if (!description.trim()) {
      setError('Please enter your feedback.');
      return;
    }

    await submitCurrentFeedback();
  }

  function preserveDraftForAuthentication() {
    setSubmitAfterAuth(true);
    writePendingFeedbackDraft({
      eventId,
      rating,
      description,
      submitAfterAuth: true,
      savedAt: Date.now(),
    });
  }

  function handleReviewKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    const isSubmitShortcut = e.key === 'Enter' && (e.metaKey || e.ctrlKey);
    if (isSubmitShortcut) {
      e.preventDefault();
      e.currentTarget.form?.requestSubmit();
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">Share your feedback</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <Label htmlFor={eventSelectId}>Event</Label>
            <Select
              value={eventId}
              onValueChange={(value) => {
                setEventId(value);
                setError(null);
              }}
            >
              <SelectTrigger id={eventSelectId} className="w-full">
                <SelectValue placeholder="Select an event…" />
              </SelectTrigger>
              <SelectContent>
                {events.map((event) => (
                  <SelectItem key={event.id} value={event.id}>
                    {event.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isFormVisible && (
            <RevealedFields key={selectedEvent.id}>
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-foreground">Rating</span>
                <StarRatingSelect value={rating} onChange={setRating} />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor={reviewId}>Your review</Label>
                <Textarea
                  id={reviewId}
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    setError(null);
                  }}
                  onKeyDown={handleReviewKeyDown}
                  rows={4}
                  placeholder="Tell us what you thought about this event…"
                />
                <p className="text-xs text-muted-foreground">
                  Press <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-sans">⌘</kbd>/
                  <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-sans">Ctrl</kbd> +{' '}
                  <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-sans">Enter</kbd> to
                  submit.
                </p>
              </div>

              {error && (
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              )}

              <Show when="signed-out">
                <div className="flex flex-wrap items-center gap-3 rounded-md border border-border bg-muted/40 p-3">
                  <p className="text-sm text-muted-foreground">
                    Your draft will be submitted automatically after you sign in.
                  </p>
                  <SignInButton mode="modal">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={preserveDraftForAuthentication}
                    >
                      Sign in to submit
                    </Button>
                  </SignInButton>
                </div>
              </Show>
              <Show when="signed-in">
                <Button
                  type="submit"
                  className="self-start"
                  disabled={!isUserLoaded || preparingSubmission || submitting}
                >
                  {preparingSubmission ? 'Preparing…' : submitting ? 'Submitting…' : 'Submit feedback'}
                </Button>
              </Show>
            </RevealedFields>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

function RevealedFields({ children }: { children: ReactNode }) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      className={cn(
        'flex flex-col gap-4 pt-4 transition-all duration-300 ease-out motion-reduce:transition-none',
        entered ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0',
      )}
    >
      {children}
    </div>
  );
}
