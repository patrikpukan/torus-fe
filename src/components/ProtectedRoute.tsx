import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import type { UserRoleType } from "@/features/auth/context/AuthContext";
import { Box, CircularProgress } from "@mui/material";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: readonly UserRoleType[];
  fallbackPath?: string;
}

/**
 * Route wrapper that protects access based on user roles.
 * If user doesn't have one of the allowed roles, redirects to fallbackPath (default: /access-denied)
 *
 * Usage:
 * <Route path="admin" element={
 *   <ProtectedRoute allowedRoles={["org_admin", "super_admin"]}>
 *     <AdminPage />
 *   </ProtectedRoute>
 * } />
 *
 * <Route path="super-admin" element={
 *   <ProtectedRoute allowedRoles={["super_admin"]}>
 *     <SuperAdminPage />
 *   </ProtectedRoute>
 * } />
 */
export function ProtectedRoute({
  children,
  allowedRoles,
  fallbackPath = "/access-denied",
}: ProtectedRouteProps) {
  const { appRole, loading } = useAuth();

  // While loading, show nothing (or a spinner)
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  // If user doesn't have one of the allowed roles, redirect
  if (!appRole || !allowedRoles.includes(appRole)) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
}
