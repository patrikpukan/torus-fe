import { Calendar } from "lucide-react";
import { useState } from "react";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type FilterType = "period" | "month-year";

type FilterStatisticsProps = {
  onFilterChange: (filter: {
    filterType: FilterType;
    startDate: string;
    endDate: string;
    month?: number;
    year?: number;
  }) => void;
  onClear: () => void;
};

export const FilterStatistics = ({
  onFilterChange,
  onClear,
}: FilterStatisticsProps) => {
  const [filterType, setFilterType] = useState<FilterType>("period");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [month, setMonth] = useState<number | undefined>(undefined);
  const [year, setYear] = useState<number | undefined>(undefined);

  const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 10 }, (_, i) => currentYear - i);

  const hasFilter =
    (filterType === "period" && startDate && endDate) ||
    (filterType === "month-year" && month && year);

  const handleApplyFilter = () => {
    onFilterChange({
      filterType,
      startDate,
      endDate,
      month,
      year,
    });
  };

  const handleClearFilter = () => {
    setStartDate("");
    setEndDate("");
    setMonth(undefined);
    setYear(undefined);
    onClear();
  };

  return (
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
            <Button onClick={handleApplyFilter} disabled={!hasFilter}>
              Apply Filter
            </Button>
            <Button
              variant="outline"
              onClick={handleClearFilter}
              disabled={!hasFilter}
            >
              Clear Filter
            </Button>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};
