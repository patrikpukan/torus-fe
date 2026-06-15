import { apiGet } from "@/lib/restClient";
import { useQuery } from "@tanstack/react-query";

export type DepartmentDistributionItem = {
  departmentName: string;
  userCount: number;
};

export type DepartmentDistributionData = {
  departmentDistribution: {
    departments: DepartmentDistributionItem[];
    totalUsers: number;
  };
};

type DepartmentDistributionResponse = {
  departments: DepartmentDistributionItem[];
  totalUsers: number;
};

export const useDepartmentDistributionQuery = () => {
  const query = useQuery({
    queryKey: ["department-distribution"],
    queryFn: () =>
      apiGet<DepartmentDistributionResponse>(
        "/statistics/department-distribution"
      ),
  });

  return {
    data: query.data ? { departmentDistribution: query.data } : undefined,
    loading: query.isLoading,
    error: query.error?.message,
  };
};
