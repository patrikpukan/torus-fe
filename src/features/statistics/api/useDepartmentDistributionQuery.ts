import { useQuery } from "@apollo/client/react";
import { graphql } from "gql.tada";

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

export const DEPARTMENT_DISTRIBUTION_QUERY = graphql(`
  query DepartmentDistribution {
    departmentDistribution {
      departments {
        departmentName
        userCount
      }
      totalUsers
    }
  }
`);

export const useDepartmentDistributionQuery = () => {
  const { data, loading, error } = useQuery<DepartmentDistributionData>(
    DEPARTMENT_DISTRIBUTION_QUERY,
    {
      fetchPolicy: "cache-and-network",
    }
  );

  return {
    data,
    loading,
    error: error?.message,
  };
};
