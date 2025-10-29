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

  type Metadata = {
    role?: string;
    appRole?: string;
    organizationId?: string;
    organization_id?: string;
  };

  const metadata = (user.user_metadata ?? {}) as Metadata;
  const appMetadata = (user.app_metadata ?? {}) as Metadata;

  const normalizeRole = (value: string | undefined | null) =>
    value
      ?.replace(/([a-z])([A-Z])/g, "$1_$2")
      .replace(/[\s-]+/g, "_")
      .toLowerCase() ?? null;

  const rawRole =
    metadata.role ??
    metadata.appRole ??
    appMetadata.role ??
    appMetadata.appRole ??
    null;

  const normalizedRole = normalizeRole(rawRole);
  const isAdminRole =
    normalizedRole === "admin" ||
    normalizedRole === "org_admin" ||
    normalizedRole === "super_admin";

  if (!isAdminRole) {
    return <Navigate to="/home" replace />;
  }

  const userWithOrg = user as typeof user & {
    organizationId?: string;
    organization_id?: string;
  };

  const organizationIdRaw =
    userWithOrg.organizationId ??
    userWithOrg.organization_id ??
    metadata.organizationId ??
    metadata.organization_id ??
    appMetadata.organizationId ??
    appMetadata.organization_id ??
    null;

  const organizationId =
    typeof organizationIdRaw === "string" && organizationIdRaw.length > 0
      ? organizationIdRaw
      : null;

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
