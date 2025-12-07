/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApolloClient, HttpLink, InMemoryCache, split } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { SetContextLink } from "@apollo/client/link/context";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";
import { Observable } from "rxjs";
import { supabaseClient } from "./supabaseClient";

const graphqlEndpoint =
  import.meta.env.VITE_GRAPHQL_API ?? "http://localhost:4000/graphql";
const wsEndpoint = (
  import.meta.env.VITE_GRAPHQL_WS_API ?? graphqlEndpoint
).replace(/^http/, "ws");

console.log("[Apollo] GraphQL Endpoint:", graphqlEndpoint);
console.log("[Apollo] WebSocket Endpoint:", wsEndpoint);

const httpLink = new HttpLink({
  uri: graphqlEndpoint,
  credentials: "include",
});

// Create WebSocket link for subscriptions
const wsLink = new GraphQLWsLink(
  createClient({
    url: wsEndpoint,
    connectionParams: async () => {
      const {
        data: { session },
      } = await supabaseClient.auth.getSession();
      console.log(
        "[Apollo/WS] Getting connection params, token exists:",
        !!session?.access_token
      );
      return {
        authorization: session?.access_token
          ? `Bearer ${session.access_token}`
          : undefined,
      };
    },
    shouldRetry: () => true,
    retryAttempts: 5,
    on: {
      connected: () => console.log("[Apollo/WS] ✅ WebSocket CONNECTED"),
      connecting: () => console.log("[Apollo/WS] 🔄 WebSocket CONNECTING..."),
      closed: () => console.log("[Apollo/WS] ❌ WebSocket CLOSED"),
      error: (error) => console.error("[Apollo/WS] ❌ WebSocket ERROR:", error),
      message: (message) => console.log("[Apollo/WS] 📨 Message:", message),
    },
  })
);

const authLink = new SetContextLink(async (prevContext) => {
  const {
    data: { session },
  } = await supabaseClient.auth.getSession();

  const token = session?.access_token;

  return {
    ...prevContext,
    headers: {
      ...(prevContext?.headers ?? {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
});

// Error link to handle 401 errors by refreshing the session
const errorLink = onError((errorResponse: any) => {
  const { graphQLErrors, operation, forward } = errorResponse;

  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      if (
        err.extensions?.code === "UNAUTHENTICATED" ||
        err.message?.includes("Authentication required")
      ) {
        // Token might be expired, try to refresh
        return new Observable((observer) => {
          supabaseClient.auth
            .refreshSession()
            .then(({ data }) => {
              // Retry the request with the new token
              const token = data.session?.access_token;
              if (token) {
                operation.setContext(({ headers }: any) => ({
                  headers: {
                    ...headers,
                    Authorization: `Bearer ${token}`,
                  },
                }));
              }
              forward(operation).subscribe(observer);
            })
            .catch(() => {
              // Refresh failed, let the error through
              forward(operation).subscribe(observer);
            });
        });
      }
    }
  }
});

// Split link: use WebSocket for subscriptions, HTTP for queries and mutations
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  authLink.concat(httpLink)
);

export const apolloClient = new ApolloClient({
  link: errorLink.concat(splitLink),
  cache: new InMemoryCache(),
});
