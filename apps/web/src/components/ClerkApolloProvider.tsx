import { ApolloProvider } from '@apollo/client/react';
import { useAuth } from '@clerk/react';
import { useMemo, type ReactNode } from 'react';
import { createApolloClient } from '@/lib/apollo-client';

export function ClerkApolloProvider({ children }: { children: ReactNode }) {
  const { getToken } = useAuth();
  const client = useMemo(() => createApolloClient(getToken), [getToken]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
