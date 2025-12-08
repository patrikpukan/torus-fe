export const apiBaseFromGraphQL = (() => {
  const gql = import.meta.env.VITE_GRAPHQL_API as string | undefined;
  if (!gql) return undefined;
  try {
    const u = new URL(gql);
    if (u.pathname.endsWith("/graphql")) {
      u.pathname = u.pathname.replace(/\/graphql$/, "");
    }
    return u.toString().replace(/\/$/, "");
  } catch {
    return undefined;
  }
})();

export const normalizeAssetUrl = (src?: string | null): string => {
  if (!src) return "";
  if (/^blob:/i.test(src)) return "";
  if (/^https?:\/\//i.test(src)) return src;
  const base =
    (import.meta.env.VITE_API_BASE as string | undefined) ?? apiBaseFromGraphQL;
  if (!base) return src;
  if (src.startsWith("/")) return `${base}${src}`;
  return `${base}/${src}`;
};
