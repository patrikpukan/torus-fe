import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as
  | string
  | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  // Fail fast in development to catch missing environment variables early.
  // Vite injects variables prefixed with VITE_. Make sure your .env is configured.
  console.warn(
    "Supabase env not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file."
  );
}

export const supabase = createClient(supabaseUrl ?? "", supabaseAnonKey ?? "");

export async function checkSupabaseConnection(): Promise<{
  ok: boolean;
  error?: string;
}> {
  try {
    // This does a lightweight call and validates the client can talk to Supabase.
    const { error } = await supabase.auth.getSession();
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, error: message };
  }
}
