import { Navigate } from "react-router-dom";

import { AlgorithmSettingsForm } from "../components/AlgorithmSettingsForm";
import { useAuth } from "@/features/auth/context/UseAuth";

export function AlgorithmSettingsPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/home" replace />;
  }

  const userWithOrg = user as typeof user & {
    organizationId?: string;
    organization_id?: string;
  };

  const metadata = (userWithOrg.user_metadata ?? null) as
    | {
        organizationId?: string;
        organization_id?: string;
      }
    | null;

  const organizationId =
    userWithOrg.organizationId ??
    userWithOrg.organization_id ??
    metadata?.organizationId ??
    metadata?.organization_id ??
    null;

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
    <div className="min-h-screen bg-white">
      <AlgorithmSettingsForm organizationId={organizationId} />
    </div>
  );
}
