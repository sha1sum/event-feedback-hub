import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/react';
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
        <div className="flex items-center gap-2">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm">
                <LogIn className="h-4 w-4" aria-hidden="true" />
                Sign in
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button size="sm">Sign up</Button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>
      </div>
    </header>
  );
}
