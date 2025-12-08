import type { User } from "@supabase/supabase-js";
import type { CurrentUserData } from "@/features/auth/api/useGetCurrentUserQuery";

type DisplayNameParams = {
  dbUser?: CurrentUserData | null;
  supabaseUser?: User | null;
};

export const formatUserDisplayName = ({
  dbUser,
  supabaseUser,
}: DisplayNameParams): string => {
  if (!supabaseUser) {
    return "Signed out";
  }

  if (dbUser?.firstName || dbUser?.lastName) {
    const parts = [dbUser?.firstName, dbUser?.lastName].filter(
      (part): part is string =>
        typeof part === "string" && part.trim().length > 0
    );
    if (parts.length > 0) {
      return parts.join(" ");
    }
  }

  const fullName = supabaseUser.user_metadata?.full_name;
  if (typeof fullName === "string" && fullName.trim().length > 0) {
    return fullName;
  }

  const metaParts = [
    supabaseUser.user_metadata?.first_name,
    supabaseUser.user_metadata?.last_name,
  ].filter(
    (part): part is string => typeof part === "string" && part.trim().length > 0
  );

  if (metaParts.length > 0) {
    return metaParts.join(" ");
  }

  return supabaseUser.email ?? "Signed out";
};
