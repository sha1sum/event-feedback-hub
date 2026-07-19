import '@testing-library/jest-dom/vitest';
import { createElement, type ReactNode } from 'react';
import { afterEach, vi } from 'vitest';

const clerkMock = vi.hoisted(() => ({
  isSignedIn: true,
  tokenResponses: [] as Array<string | null>,
}));

export function setMockClerkSignedIn(isSignedIn: boolean) {
  clerkMock.isSignedIn = isSignedIn;
}

export function setMockClerkTokenResponses(responses: Array<string | null>) {
  clerkMock.tokenResponses = [...responses];
}

vi.mock('@clerk/react', () => {
  const Passthrough = ({ children }: { children: ReactNode }) => children;

  return {
    ClerkProvider: Passthrough,
    Show: Passthrough,
    SignInButton: Passthrough,
    SignUpButton: Passthrough,
    UserButton: () => createElement('button', { 'aria-label': 'Open user menu' }),
    useAuth: () => ({
      getToken: async () => {
        if (clerkMock.tokenResponses.length > 0) {
          return clerkMock.tokenResponses.shift() ?? null;
        }
        return clerkMock.isSignedIn ? 'test-session-token' : null;
      },
      isLoaded: true,
      isSignedIn: clerkMock.isSignedIn,
    }),
    useUser: () => ({
      isLoaded: true,
      user: clerkMock.isSignedIn
        ? {
            firstName: 'Test',
            fullName: 'Test User',
            lastName: 'User',
          }
        : null,
    }),
  };
});

afterEach(() => {
  clerkMock.isSignedIn = true;
  clerkMock.tokenResponses = [];
  window.localStorage.clear();
  window.sessionStorage.clear();
});

// Radix UI primitives (Select, Popover, etc.) rely on browser APIs that jsdom
// does not implement. Polyfill them so interactions can be exercised in tests.
if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = () => false;
}
if (!Element.prototype.setPointerCapture) {
  Element.prototype.setPointerCapture = () => {};
}
if (!Element.prototype.releasePointerCapture) {
  Element.prototype.releasePointerCapture = () => {};
}
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}
if (!window.ResizeObserver) {
  window.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}
