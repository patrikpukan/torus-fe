import {
  type PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabaseClient } from "@/lib/supabaseClient.ts";
import { AuthContext } from "@/features/auth/context/AuthContext.ts";
import type { AuthContextValue } from "@/features/auth/context/AuthContext.ts";

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

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

  const signOut = useCallback(async () => {
    const { error } = await supabaseClient.auth.signOut();

    if (error) {
      throw error;
    }

    setSession(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user,
      loading,
      signIn,
      signOut,
    }),
    [session, user, loading, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
