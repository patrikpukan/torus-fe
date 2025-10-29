import {
  type PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabaseClient } from "@/lib/supabaseClient.ts";
import {
  AuthContext,
  type UserRoleType,
} from "@/features/auth/context/AuthContext.ts";
import type { AuthContextValue } from "@/features/auth/context/AuthContext.ts";
import { useGetCurrentUserQuery } from "../api/useGetCurrentUserQuery";

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [appRole, setAppRole] = useState<UserRoleType | undefined>(undefined);
  const [organizationId, setOrganizationId] = useState<string | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(true);

  // Query current user to get role and organization
  const {
    data: currentUserData,
    loading: currentUserLoading,
    refetch: refetchCurrentUser,
  } = useGetCurrentUserQuery();

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const {
        data: { session: initialSession },
      } = await supabaseClient.auth.getSession();

      if (mounted) {
        setSession(initialSession ?? null);
        setUser(initialSession?.user ?? null);
        setLoading(false);
      }
    };

    void init();

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      // Refetch current user when session changes
      void refetchCurrentUser();
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [refetchCurrentUser]);

  // Update appRole and organizationId when currentUserData changes
  useEffect(() => {
    if (currentUserData?.getCurrentUser) {
      const role = currentUserData.getCurrentUser.role as UserRoleType;
      setAppRole(role);
      setOrganizationId(currentUserData.getCurrentUser.organizationId);
    }
  }, [currentUserData]);

  const signIn = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    setSession(data.session ?? null);
    setUser(data.user ?? null);
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabaseClient.auth.signOut();

    if (error) {
      throw error;
    }

    setSession(null);
    setUser(null);
    setAppRole(undefined);
    setOrganizationId(undefined);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user,
      appRole,
      organizationId,
      loading: loading || currentUserLoading,
      signIn,
      signInWithGoogle,
      signOut,
    }),
    [
      session,
      user,
      appRole,
      organizationId,
      loading,
      currentUserLoading,
      signIn,
      signInWithGoogle,
      signOut,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
