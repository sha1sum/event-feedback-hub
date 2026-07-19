import { ClerkProvider } from '@clerk/react';
import { shadcn } from '@clerk/ui/themes';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { ClerkApolloProvider } from '@/components/ClerkApolloProvider';

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) throw new Error('VITE_CLERK_PUBLISHABLE_KEY is not configured');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={publishableKey} afterSignOutUrl="/" appearance={{ theme: shadcn }}>
      <ClerkApolloProvider>
        <App />
      </ClerkApolloProvider>
    </ClerkProvider>
  </StrictMode>,
);