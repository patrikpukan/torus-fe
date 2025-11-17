import {
  type PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { useApolloClient } from "@apollo/client/react";
import { supabaseClient } from "@/lib/supabaseClient.ts";
import {
  AuthContext,
  type UserRoleType,
} from "@/features/auth/context/AuthContext.ts";
import type { AuthContextValue } from "@/features/auth/context/AuthContext.ts";
import { useGetCurrentUserQuery } from "../api/useGetCurrentUserQuery";
import { useToast } from "@/hooks/use-toast";

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const apolloClient = useApolloClient();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [appRole, setAppRole] = useState<UserRoleType | undefined>(undefined);
  const [organizationId, setOrganizationId] = useState<string | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(true);
  const [sessionLoaded, setSessionLoaded] = useState(false);
  const bannedHandledRef = useRef(false);
  const { toast } = useToast();

  // Query current user to get role and organization - only start after session is loaded and user has a session
  const {
    data: currentUserData,
    loading: currentUserLoading,
    refetch: refetchCurrentUser,
    error: currentUserError,
  } = useGetCurrentUserQuery({ skip: !sessionLoaded || !session });

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const {
        data: { session: initialSession },
      } = await supabaseClient.auth.getSession();

      if (mounted) {
        setSession(initialSession ?? null);
        setUser(initialSession?.user ?? null);
        setSessionLoaded(true);
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

  const resetAuthState = useCallback(() => {
    setSession(null);
    setUser(null);
    setAppRole(undefined);
    setOrganizationId(undefined);
  }, []);

  const handleBannedUser = useCallback(async () => {
    if (bannedHandledRef.current) {
      return;
    }

    bannedHandledRef.current = true;

    await supabaseClient.auth.signOut();
    resetAuthState();

    toast({
      variant: "destructive",
      title: "Account access blocked",
      description:
        "Your account has been banned. Please contact your organization administrator.",
    });
  }, [resetAuthState, toast]);

  useEffect(() => {
    if (!currentUserError) {
      return;
    }

    const banMessageMatch = (message?: string | null): boolean => {
      if (!message) {
        return false;
      }

      const normalized = message.toLowerCase();
      return (
        normalized.includes("banned") ||
        normalized.includes("suspended") ||
        normalized.includes("account access")
      );
    };

    type GraphQLErrorRecord = {
      message?: string | null;
      extensions?: {
        code?: string;
        [key: string]: unknown;
      };
    };

    const graphErrors =
      (currentUserError as { graphQLErrors?: GraphQLErrorRecord[] })
        .graphQLErrors ?? [];

    const hasForbiddenBan = graphErrors.some((graphError) => {
      const code = String(graphError.extensions?.code ?? "").toUpperCase();
      return code === "FORBIDDEN" && banMessageMatch(graphError.message);
    });

    if (hasForbiddenBan || banMessageMatch(currentUserError.message)) {
      void handleBannedUser();
    }
  }, [currentUserError, handleBannedUser]);

  useEffect(() => {
    if (!session) {
      bannedHandledRef.current = false;
    }
  }, [session]);

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

    // Clear Apollo Client cache to remove stale user data
    await apolloClient.clearStore();
    
    resetAuthState();
  }, [apolloClient, resetAuthState]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user,
      appRole,
      organizationId,
      loading:
        loading ||
        currentUserLoading ||
        (sessionLoaded && !appRole && !!session),
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
      sessionLoaded,
      signIn,
      signInWithGoogle,
      signOut,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
