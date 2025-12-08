import { Navigate } from "react-router-dom";

import { AlgorithmSettingsForm } from "../components/AlgorithmSettingsForm";
import { useAuth } from "@/hooks/useAuth";

import AdminAlgorithmSettingsPage from "./AdminAlgorithmSettingsPage";

export function AlgorithmSettingsPage() {
  const { appRole, organizationId, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const isAdminRole = appRole === "org_admin" || appRole === "super_admin";

  if (!isAdminRole) {
    return <Navigate to="/home" replace />;
  }

  if (appRole === "super_admin") {
    return <AdminAlgorithmSettingsPage />;
  }

  if (!organizationId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="max-w-md text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Organization Not Found
          </h2>
          <p className="mt-4 text-gray-600">
            Your account is not associated with an organization. Please contact
            support for assistance.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <AlgorithmSettingsForm organizationId={organizationId} />
    </div>
  );
}
