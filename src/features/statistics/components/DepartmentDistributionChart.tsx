import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDepartmentDistributionQuery } from "../api/useDepartmentDistributionQuery";
import { useIsMobile } from "@/hooks/use-mobile";

type Props = {
  organizationId?: string | null;
};

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
}) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          border: "none",
          borderRadius: "4px",
          padding: "8px 12px",
        }}
      >
        <p style={{ color: "#ffffff", margin: 0, fontSize: "14px" }}>Count</p>
        <p style={{ color: "#ffffff", margin: "4px 0 0 0", fontSize: "14px" }}>
          {payload[0].value} users
        </p>
      </div>
    );
  }
  return null;
};

export const DepartmentDistributionChart = (_props: Props) => {
  const isMobile = useIsMobile();
  const { data, loading, error } = useDepartmentDistributionQuery();

  const distribution = data?.departmentDistribution;
  const chartData = useMemo(() => {
    if (!distribution?.departments || distribution.departments.length === 0) {
      return [];
    }
    return distribution.departments.map(
      (dept: { departmentName: string; userCount: number }) => ({
        name: dept.departmentName || "Unassigned",
        users: dept.userCount,
      })
    );
  }, [distribution]);

  const colors = [
    "hsl(217, 55%, 65%)", // Happy blue
    "hsl(142, 50%, 60%)", // Happy green
    "hsl(38, 60%, 65%)", // Happy amber
    "hsl(0, 50%, 62%)", // Happy coral
    "hsl(262, 55%, 65%)", // Happy purple
    "hsl(199, 55%, 65%)", // Happy cyan
    "hsl(24, 60%, 65%)", // Happy orange
  ];

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Department Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-80 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-800">
            Department Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-700">
            Error loading department distribution: {error}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Department Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex min-h-80 items-center justify-center text-center">
            <p className="text-sm text-muted-foreground">
              No departments found. Create departments to see distribution data.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalUsers = distribution?.totalUsers ?? 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Department Distribution</span>
          <span className="text-sm font-normal text-muted-foreground">
            Total: {totalUsers} users
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer
          width="100%"
          height={isMobile === true ? 300 : 400}
        >
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: isMobile === true ? 60 : 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              angle={isMobile === true ? -45 : 0}
              textAnchor={isMobile === true ? "end" : "middle"}
            />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="users" radius={[8, 8, 0, 0]} name="User Count">
              {chartData.map(
                (_entry: Record<string, unknown>, index: number) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                )
              )}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
