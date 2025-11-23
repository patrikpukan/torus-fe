import { useContext } from "react";
import { AuthContext } from "../features/auth/context/AuthContext";

/**
 * Hook to access auth context with role information.
 *
 * Returns:
 * - loading: boolean - whether auth is still loading
 * - appRole: UserRoleType | undefined - current user's role
 * - organizationId: string | undefined - current user's organization ID
 * - currentUserData: CurrentUserData | null - current user's profile data from GraphQL
 * - session: Session | null - Supabase session
 * - user: User | null - Supabase user
 *
 * Usage:
 * const { appRole, organizationId, currentUserData, loading } = useAuth();
 *
 * if (loading) return <Spinner />;
 * if (!appRole) return <Redirect to="/login" />;
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return {
    session: context.session,
    user: context.user,
    appRole: context.appRole,
    organizationId: context.organizationId,
    currentUserData: context.currentUserData,
    loading: context.loading,
    signIn: context.signIn,
    signInWithGoogle: context.signInWithGoogle,
    signOut: context.signOut,
  };
}
