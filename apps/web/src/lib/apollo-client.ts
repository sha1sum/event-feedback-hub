import { ApolloClient, HttpLink, InMemoryCache, split } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { OperationTypeNode } from 'graphql';

const httpUri = import.meta.env.VITE_GRAPHQL_HTTP_URL ?? '/graphql';
const wsUri = import.meta.env.VITE_GRAPHQL_WS_URL ?? deriveWebSocketUrl(httpUri);

function deriveWebSocketUrl(uri: string): string {
  if (typeof window === 'undefined') {
    return uri;
  }
  const url = new URL(uri, window.location.origin);
  url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
  return url.toString();
}

const httpLink = new HttpLink({ uri: httpUri });

const wsLink =
  typeof window !== 'undefined'
    ? new GraphQLWsLink(
        createClient({
          url: wsUri,
          lazy: true,
          retryAttempts: Infinity,
        }),
      )
    : null;

const link = wsLink
  ? split(({ operationType }) => operationType === OperationTypeNode.SUBSCRIPTION, wsLink, httpLink)
  : httpLink;

export const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});
