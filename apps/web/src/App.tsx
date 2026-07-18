import { useQuery } from '@apollo/client/react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FeedbackForm } from '@/components/FeedbackForm';
import { FeedbackStream } from '@/components/FeedbackStream';
import { Button } from '@/components/ui/button';
import { EVENTS_QUERY } from '@/graphql/operations';
import { getFriendlyErrorMessage } from '@/lib/graphql-errors';

function App() {
  const {
    data,
    loading,
    error,
    refetch: refetchEvents,
  } = useQuery(EVENTS_QUERY);

  const events = data?.events ?? [];

  return (
    <div id="app" className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6 sm:px-6">
        {loading && !data && <p className="text-sm text-muted-foreground">Loading events…</p>}

        {error && !data && (
          <div className="flex flex-col items-start gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-4">
            <p className="text-sm text-destructive">
              {getFriendlyErrorMessage(error, 'Unable to load events. Please try again.')}
            </p>
            <Button variant="outline" size="sm" onClick={() => refetchEvents()}>
              Retry
            </Button>
          </div>
        )}

        {data && (
          <>
            <FeedbackForm events={events} />
            <FeedbackStream events={events} />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;
