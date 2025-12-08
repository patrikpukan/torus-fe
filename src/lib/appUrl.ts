const stripTrailingSlashes = (value: string): string =>
  value.replace(/\/+$/, "");

const envAppUrl =
  typeof import.meta.env.VITE_APP_URL === "string" &&
  import.meta.env.VITE_APP_URL.trim().length > 0
    ? stripTrailingSlashes(import.meta.env.VITE_APP_URL.trim())
    : null;

if (!envAppUrl) {
  throw new Error("VITE_APP_URL is required but was not provided.");
}

export const appUrl = envAppUrl;
