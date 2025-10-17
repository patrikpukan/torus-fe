import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load .env, then fall back to .env.local if not found
const primary = dotenv.config();
if (primary.error) {
  dotenv.config({ path: ".env.local" });
}

const url = (process.env.VITE_SUPABASE_URL || "").trim();
const anonKey = (process.env.VITE_SUPABASE_ANON_KEY || "").trim();

if (!url || !anonKey) {
  console.error(
    "Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env/.env.local"
  );
  process.exit(1);
}

const supabase = createClient(url, anonKey);

try {
  const { error } = await supabase.auth.getSession();
  if (error) {
    console.error("Connection failed:", error.message);
    process.exit(2);
  }
  console.log("Supabase connection OK");
  process.exit(0);
} catch (e) {
  console.error("Unexpected error:", e?.message || e);
  process.exit(3);
}
