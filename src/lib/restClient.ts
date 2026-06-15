import { supabaseClient } from "./supabaseClient";

/**
 * REST base URL derived from VITE_GRAPHQL_API: strip a trailing `/graphql` so
 * it points at the `/api` origin.
 *   http://localhost:4399/graphql -> http://localhost:4399/api
 */
const graphqlApi = import.meta.env.VITE_GRAPHQL_API as string | undefined;

if (!graphqlApi) {
  throw new Error(
    "VITE_GRAPHQL_API is not set. Configure it at build time before deploying."
  );
}

export const REST_BASE_URL = graphqlApi.replace(/\/graphql$/, "");

type QueryParams = Record<
  string,
  string | number | boolean | null | undefined
>;

/**
 * Authenticated GET against the REST API. Attaches the current Supabase access
 * token as a Bearer header, serializes `params` (skipping null/undefined),
 * throws on non-2xx with the response body, and returns the parsed JSON.
 */
export async function apiGet<T>(path: string, params?: QueryParams): Promise<T> {
  const {
    data: { session },
  } = await supabaseClient.auth.getSession();
  const token = session?.access_token;

  const url = new URL(`${REST_BASE_URL}${path}`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value === null || value === undefined) {
        continue;
      }
      url.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || `Request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}
