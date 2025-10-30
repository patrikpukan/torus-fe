import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { SetContextLink } from "@apollo/client/link/context";
import { supabaseClient } from "./supabaseClient";

const graphqlEndpoint =
  import.meta.env.VITE_GRAPHQL_API ?? "http://localhost:4000/graphql";

const httpLink = new HttpLink({
  uri: graphqlEndpoint,
  credentials: "include",
});

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
const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      if (
        err.extensions?.code === "UNAUTHENTICATED" ||
        err.message?.includes("Authentication required")
      ) {
        // Token might be expired, try to refresh
        return supabaseClient.auth
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
            return forward(operation);
          })
          .catch(() => {
            // Refresh failed, let the error through
            return forward(operation);
          });
      }
    }
  }
});

export const apolloClient = new ApolloClient({
  link: errorLink.concat(authLink.concat(httpLink)),
  cache: new InMemoryCache(),
});
