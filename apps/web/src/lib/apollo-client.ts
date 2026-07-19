import { ApolloClient, HttpLink, InMemoryCache, split } from '@apollo/client';
import { SetContextLink } from '@apollo/client/link/context';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { OperationTypeNode } from 'graphql';

const httpUri = import.meta.env.VITE_GRAPHQL_HTTP_URL ?? '/graphql';
const wsUri = import.meta.env.VITE_GRAPHQL_WS_URL ?? deriveWebSocketUrl(httpUri);

type GetToken = () => Promise<string | null>;

function deriveWebSocketUrl(uri: string): string {
  if (typeof window === 'undefined') {
    return uri;
  }
  const url = new URL(uri, window.location.origin);
  url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
  return url.toString();
}

export function createApolloClient(getToken: GetToken) {
  const authLink = new SetContextLink(async (previousContext) => {
    const token = await getToken();

    return {
      headers: {
        ...previousContext.headers,
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
    };
  });
  const httpLink = authLink.concat(new HttpLink({ uri: httpUri }));

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

  return new ApolloClient({
    link,
    cache: new InMemoryCache(),
  });
}
