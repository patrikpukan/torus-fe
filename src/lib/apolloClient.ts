import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
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

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
