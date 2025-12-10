import { BarChart3, FileText, Users, UserX } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Statistics = {
  newUsersCount: number;
  inactiveUsersCount: number;
  reportsCount: number;
  pairingsByStatus: Array<{ status: string | null; count: number }>;
};

type StatisticsCardsProps = {
  statistics: Statistics;
};

export const StatisticsCards = ({ statistics }: StatisticsCardsProps) => {
  const totalPairings = statistics.pairingsByStatus.reduce(
    (sum, item) => sum + item.count,
    0
  );

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">New Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{statistics.newUsersCount}</div>
          <p className="text-xs text-muted-foreground">
            Users registered in selected period
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Inactive Users</CardTitle>
          <UserX className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {statistics.inactiveUsersCount}
          </div>
          <p className="text-xs text-muted-foreground">
            Users currently inactive
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Reports</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{statistics.reportsCount}</div>
          <p className="text-xs text-muted-foreground">
            Total reports submitted
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Pairings</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalPairings}</div>
          <p className="text-xs text-muted-foreground">
            All pairing statuses combined
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
