/**
 * Fail loud at startup if required build-time env vars are missing, rather
 * than discovering it mid-session via a broken request or a localhost fallback.
 */
const REQUIRED = [
  "VITE_GRAPHQL_API",
  "VITE_SUPABASE_URL",
  "VITE_SUPABASE_PUBLISHABLE_KEY",
] as const;

export function validateEnv(): void {
  const missing = REQUIRED.filter((key) => !import.meta.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}. ` +
        "Set them at build time before deploying."
    );
  }
}
