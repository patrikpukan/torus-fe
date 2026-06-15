import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/restClient";

export type Department = {
  id: string;
  name: string;
  description?: string | null;
  organizationId: string;
  employeeCount: number;
  createdAt: string;
  updatedAt: string;
};

export type GetDepartmentsByOrganizationData = {
  getDepartmentsByOrganization: Department[];
};

export type GetDepartmentsByOrganizationVariables = {
  organizationId: string;
};

/** Shared react-query key factory so mutations can invalidate the list. */
export const departmentsByOrganizationKey = (organizationId: string) => [
  "departments",
  "by-organization",
  organizationId,
];

/**
 * Migrated from Apollo to react-query (GraphQL -> REST strangler). Return shape
 * preserves `{ data: { getDepartmentsByOrganization }, loading }` so the
 * DepartmentManagementPage and ProfileForm consumers keep working.
 */
export const useGetDepartmentsByOrganizationQuery = (
  organizationId?: string
) => {
  const query = useQuery({
    queryKey: departmentsByOrganizationKey(organizationId ?? ""),
    queryFn: () =>
      apiGet<Department[]>("/departments", { organizationId }),
    enabled: Boolean(organizationId),
  });

  return {
    ...query,
    data: query.data
      ? { getDepartmentsByOrganization: query.data }
      : undefined,
    loading: query.isLoading,
  };
};
