import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/restClient";

export type DepartmentUser = {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  profileImageUrl?: string | null;
  role: string;
};

export type GetUsersByDepartmentData = {
  getUsersByDepartment: DepartmentUser[];
};

export type GetUsersByDepartmentVariables = {
  departmentId: string;
};

/**
 * Migrated from Apollo to react-query (GraphQL -> REST strangler). Return shape
 * preserves `{ data: { getUsersByDepartment }, loading }`.
 */
export const useGetUsersByDepartmentQuery = (departmentId?: string) => {
  const query = useQuery({
    queryKey: ["departments", departmentId ?? "", "users"],
    queryFn: () =>
      apiGet<DepartmentUser[]>(`/departments/${departmentId}/users`),
    enabled: Boolean(departmentId),
  });

  return {
    ...query,
    data: query.data ? { getUsersByDepartment: query.data } : undefined,
    loading: query.isLoading,
  };
};
