import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FeedbackForm } from '@/components/FeedbackForm';
import { FeedbackStream } from '@/components/FeedbackStream';
import { placeholderEvents, placeholderFeedback, type FeedbackEntry } from '@/data/placeholder';

function App() {
  const [feedback, setFeedback] = useState<FeedbackEntry[]>(placeholderFeedback);

  function handleSubmit(entry: Omit<FeedbackEntry, 'id' | 'submittedAt'>) {
    const newEntry: FeedbackEntry = {
      ...entry,
      id: `fb-${crypto.randomUUID()}`,
      submittedAt: new Date().toISOString(),
    };
    setFeedback((prev) => [newEntry, ...prev]);
  }

  return (
    <div id="app" className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6 sm:px-6">
        <FeedbackForm events={placeholderEvents} onSubmit={handleSubmit} />
        <FeedbackStream events={placeholderEvents} feedback={feedback} />
      </main>
      <Footer />
    </div>
  );
}

export default App;
