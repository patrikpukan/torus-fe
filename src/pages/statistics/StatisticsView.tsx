import { BarChart3 } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useStatisticsQuery } from "@/features/statistics/api/useStatisticsQuery";
import { DepartmentDistributionChart } from "@/features/statistics/components/DepartmentDistributionChart";
import { FilterStatistics } from "./components/FilterStatistics";
import { PairingsByStatus } from "./components/PairingsByStatus";
import { PairingsByUser } from "./components/PairingsByUser";
import { StatisticsCards } from "./components/StatisticsCards";

export type StatisticsViewProps = {
  organizationId?: string | null;
  organizationSelector?: ReactNode;
};

type FilterType = "period" | "month-year";

export const StatisticsView = ({
  organizationId,
  organizationSelector,
}: StatisticsViewProps) => {
  const [filterState, setFilterState] = useState<{
    filterType: FilterType;
    startDate: string;
    endDate: string;
    month?: number;
    year?: number;
  } | null>(null);

  const baseFilter = useMemo(() => {
    if (!filterState) return undefined;

    if (filterState.filterType === "period") {
      return filterState.startDate && filterState.endDate
        ? { startDate: filterState.startDate, endDate: filterState.endDate }
        : undefined;
    }

    if (filterState.month && filterState.year) {
      return { month: filterState.month, year: filterState.year };
    }

    return undefined;
  }, [filterState]);

  const filter = useMemo(() => {
    if (!organizationId && !baseFilter) {
      return undefined;
    }

    return {
      ...(baseFilter ?? {}),
      ...(organizationId ? { organizationId } : {}),
    };
  }, [baseFilter, organizationId]);

  const { data, loading, error } = useStatisticsQuery(filter);

  const handleFilterChange = (newFilter: {
    filterType: FilterType;
    startDate: string;
    endDate: string;
    month?: number;
    year?: number;
  }) => {
    setFilterState(newFilter);
  };

  const handleClearFilter = () => {
    setFilterState(null);
  };

  const statistics = data?.statistics;

  return (
    <div className="container mx-auto max-w-7xl space-y-8 px-4 py-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold">
            <BarChart3 className="h-8 w-8" />
            Statistics
          </h1>
          <p className="mt-2 text-muted-foreground">
            View statistics and insights about your organization
          </p>
        </div>
        {organizationSelector}
      </div>

      <FilterStatistics
        onFilterChange={handleFilterChange}
        onClear={handleClearFilter}
      />

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-sm text-red-800">
              Error loading statistics: {error.message}
            </p>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : statistics ? (
        <>
          <StatisticsCards statistics={statistics} />
          <PairingsByStatus pairingsByStatus={statistics.pairingsByStatus} />
          <DepartmentDistributionChart />
          <PairingsByUser
            pairingsByStatusAndUser={statistics.pairingsByStatusAndUser}
          />
        </>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-sm text-muted-foreground">
              No statistics data available. Apply a filter to view statistics.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
