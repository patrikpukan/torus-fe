import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

const GRAPHQL_URL =
  import.meta.env.VITE_GRAPHQL_URL ||
  "https://voiceless-tedda-torus-bd3c6e6a.koyeb.app/graphql";

const httpLink = new HttpLink({ uri: GRAPHQL_URL, credentials: "include" });

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  // Default options can be tuned later based on needs
});
