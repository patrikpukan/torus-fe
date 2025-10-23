import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  from,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { supabaseClient } from './supabaseClient';

const graphqlEndpoint =
  import.meta.env.VITE_GRAPHQL_API ?? 'http://localhost:4000/graphql';

const httpLink = new HttpLink({
  uri: graphqlEndpoint,
  fetchOptions: {
    credentials: 'include',
  },
});

const authLink = setContext(async (_, { headers }) => {
  const {
    data: { session },
  } = await supabaseClient.auth.getSession();

  const token = session?.access_token;

  return {
    headers: {
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
});

export const apolloClient = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
});
