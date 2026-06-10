/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApolloClient, HttpLink, InMemoryCache, split } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { SetContextLink } from "@apollo/client/link/context";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";
import { Observable } from "rxjs";
import { supabaseClient } from "./supabaseClient";

const isDev = import.meta.env.DEV;

const graphqlEndpoint = import.meta.env.VITE_GRAPHQL_API;
if (!graphqlEndpoint) {
  // Fail loud rather than silently pointing at localhost in a deployed build.
  throw new Error(
    "VITE_GRAPHQL_API is not set. Configure it at build time before deploying."
  );
}
const wsEndpoint = (
  import.meta.env.VITE_GRAPHQL_WS_API ?? graphqlEndpoint
).replace(/^http/, "ws");

if (isDev) {
  console.log("[Apollo] GraphQL Endpoint:", graphqlEndpoint);
  console.log("[Apollo] WebSocket Endpoint:", wsEndpoint);
}

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
      return {
        authorization: session?.access_token
          ? `Bearer ${session.access_token}`
          : undefined,
      };
    },
    shouldRetry: () => true,
    retryAttempts: 5,
    on: isDev
      ? {
          connected: () => console.log("[Apollo/WS] connected"),
          closed: () => console.log("[Apollo/WS] closed"),
          error: (error) => console.error("[Apollo/WS] error:", error),
        }
      : {},
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

// Redirect to login once when the session can't be recovered.
let redirectingToLogin = false;
const goToLogin = () => {
  if (redirectingToLogin) return;
  redirectingToLogin = true;
  void supabaseClient.auth.signOut().finally(() => {
    if (window.location.pathname !== "/login") {
      window.location.assign("/login");
    }
  });
};

// On UNAUTHENTICATED, refresh the session and retry the operation EXACTLY once.
// A per-operation flag prevents an infinite refresh→retry→401 loop; a failed
// refresh sends the user to login instead of silently forwarding a dead request.
const errorLink = onError((errorResponse: any) => {
  const { graphQLErrors, operation, forward } = errorResponse;
  if (!graphQLErrors) return;

  const isAuthError = graphQLErrors.some(
    (err: any) =>
      err.extensions?.code === "UNAUTHENTICATED" ||
      err.message?.includes("Authentication required")
  );
  if (!isAuthError) return;

  if (operation.getContext().__authRetried) {
    goToLogin();
    return;
  }

  return new Observable((observer) => {
    supabaseClient.auth
      .refreshSession()
      .then(({ data }) => {
        const token = data.session?.access_token;
        if (!token) {
          goToLogin();
          observer.error(new Error("Session expired"));
          return;
        }
        operation.setContext(({ headers }: any) => ({
          __authRetried: true,
          headers: { ...headers, Authorization: `Bearer ${token}` },
        }));
        forward(operation).subscribe(observer);
      })
      .catch(() => {
        goToLogin();
        observer.error(new Error("Session refresh failed"));
      });
  });
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
