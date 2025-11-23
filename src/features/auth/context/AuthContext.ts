import { createContext } from "react";
import type { Session, User } from "@supabase/supabase-js";
import type { CurrentUserData } from "../api/useGetCurrentUserQuery";

export type UserRoleType = "user" | "org_admin" | "super_admin";

export type AuthContextValue = {
  session: Session | null;
  user: User | null;
  appRole?: UserRoleType;
  organizationId?: string;
  currentUserData?: CurrentUserData | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);
AuthContext.displayName = "AuthContext";
