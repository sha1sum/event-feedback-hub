import { LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Event Feedback Hub logo" className="h-10 w-10 object-contain" />
          <span className="text-lg font-semibold sm:text-xl">
            <span className="text-primary">Event Feedback</span> <span className="text-secondary">Hub</span>
          </span>
        </div>
        <Button variant="ghost" size="icon" asChild>
          <a href="/login" aria-label="Log in" title="Log in">
            <LogIn className="h-5 w-5" aria-hidden="true" />
          </a>
        </Button>
      </div>
    </header>
  );
}
