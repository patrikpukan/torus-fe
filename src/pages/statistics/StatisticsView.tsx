import { useMemo, useState, type ReactNode } from "react";
import { BarChart3, Calendar, FileText, Users, UserX } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStatisticsQuery } from "@/features/statistics/api/useStatisticsQuery";

type FilterType = "period" | "month-year";

export type StatisticsViewProps = {
  organizationId?: string | null;
  organizationSelector?: ReactNode;
};

export const StatisticsView = ({
  organizationId,
  organizationSelector,
}: StatisticsViewProps) => {
  const [filterType, setFilterType] = useState<FilterType>("period");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [month, setMonth] = useState<number | undefined>(undefined);
  const [year, setYear] = useState<number | undefined>(undefined);

  const baseFilter = useMemo(() => {
    if (filterType === "period") {
      return startDate && endDate ? { startDate, endDate } : undefined;
    }

    if (month && year) {
      return { month, year };
    }

    return undefined;
  }, [endDate, filterType, month, startDate, year]);

  const filter = useMemo(() => {
    if (!organizationId && !baseFilter) {
      return undefined;
    }

    return {
      ...(baseFilter ?? {}),
      ...(organizationId ? { organizationId } : {}),
    };
  }, [baseFilter, organizationId]);

  const { data, loading, error, refetch } = useStatisticsQuery(filter);

  const handleApplyFilter = () => {
    refetch();
  };

  const handleClearFilter = () => {
    setStartDate("");
    setEndDate("");
    setMonth(undefined);
    setYear(undefined);
    refetch();
  };

  const statistics = data?.statistics;

  const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 10 }, (_, i) => currentYear - i);

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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Filter Statistics
          </CardTitle>
          <CardDescription>
            Choose to view statistics for a specific period or by month/year
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={filterType}
            onValueChange={(value) => setFilterType(value as FilterType)}
            className="w-full"
          >
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="period">Date Range</TabsTrigger>
              <TabsTrigger value="month-year">Month/Year</TabsTrigger>
            </TabsList>

            <TabsContent value="period" className="mt-4 space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(event) => setStartDate(event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">End Date</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(event) => setEndDate(event.target.value)}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="month-year" className="mt-4 space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="month">Month</Label>
                  <Select
                    value={month?.toString() || ""}
                    onValueChange={(value) =>
                      setMonth(value ? parseInt(value, 10) : undefined)
                    }
                  >
                    <SelectTrigger id="month">
                      <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent>
                      {monthOptions.map((m) => (
                        <SelectItem key={m} value={m.toString()}>
                          {new Date(2000, m - 1).toLocaleString("default", {
                            month: "long",
                          })}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Select
                    value={year?.toString() || ""}
                    onValueChange={(value) =>
                      setYear(value ? parseInt(value, 10) : undefined)
                    }
                  >
                    <SelectTrigger id="year">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {yearOptions.map((y) => (
                        <SelectItem key={y} value={y.toString()}>
                          {y}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <div className="mt-4 flex gap-2">
              <Button onClick={handleApplyFilter} disabled={!filter}>
                Apply Filter
              </Button>
              <Button
                variant="outline"
                onClick={handleClearFilter}
                disabled={!filter}
              >
                Clear Filter
              </Button>
            </div>
          </Tabs>
        </CardContent>
      </Card>

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
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : statistics ? (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {statistics.newUsersCount}
                </div>
                <p className="text-xs text-muted-foreground">
                  Users registered in selected period
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Inactive Users
                </CardTitle>
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
                <div className="text-2xl font-bold">
                  {statistics.reportsCount}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total reports submitted
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Pairings
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {statistics.pairingsByStatus.reduce(
                    (sum, item) => sum + item.count,
                    0
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  All pairing statuses combined
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Pairings by Status</CardTitle>
              <CardDescription>
                Overview of pairings grouped by their current status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {statistics.pairingsByStatus.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Count</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {statistics.pairingsByStatus.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Badge variant="outline">{item.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {item.count}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  No pairing data available for the selected period
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pairings by Status and User</CardTitle>
              <CardDescription>
                Detailed breakdown of pairings by status for each user
              </CardDescription>
            </CardHeader>
            <CardContent>
              {statistics.pairingsByStatusAndUser.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Count</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {statistics.pairingsByStatusAndUser.map((item, index) => (
                        <TableRow
                          key={`${item.userId}-${item.status}-${index}`}
                        >
                          <TableCell>{item.userName || "N/A"}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {item.userEmail}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{item.status}</Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {item.count}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  No pairing data by user available for the selected period
                </p>
              )}
            </CardContent>
          </Card>
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
