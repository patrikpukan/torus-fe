import { useMemo } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TrendingUp } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useStatisticsTrendsQuery } from "../api/useStatisticsTrendsQuery";

type CycleTrendsChartProps = {
  organizationId?: string | null;
};

const formatCycleLabel = (startDate?: string | null, index?: number) => {
  if (startDate) {
    return new Date(startDate).toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
    });
  }
  return `Cycle ${(index ?? 0) + 1}`;
};

const percent = (value: number) => `${Math.round(value * 100)}%`;

const Delta = ({ current, previous }: { current: number; previous?: number }) => {
  if (previous === undefined) return null;
  const diff = current - previous;
  if (Math.abs(diff) < 0.005) return null;
  const up = diff > 0;
  return (
    <span
      className={`text-xs font-medium ${up ? "text-success" : "text-destructive"}`}
    >
      {up ? "▲" : "▼"} {Math.abs(Math.round(diff * 100))}pp
    </span>
  );
};

export const CycleTrendsChart = ({ organizationId }: CycleTrendsChartProps) => {
  const { data, loading, error } = useStatisticsTrendsQuery(organizationId);
  const trends = useMemo(
    () => data?.statisticsTrends?.trends ?? [],
    [data?.statisticsTrends?.trends]
  );

  const chartData = useMemo(
    () =>
      trends.map((t, i) => ({
        name: formatCycleLabel(t.startDate, i),
        pairings: t.pairingsCount,
        met: t.metPairingsCount,
        completion: Math.round(t.meetingCompletionRate * 100),
        participation: Math.round(t.participationRate * 100),
        rating: t.averageRating ?? null,
      })),
    [trends]
  );

  if (loading && trends.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trends across cycles</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-72 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/40 bg-destructive/10">
        <CardHeader>
          <CardTitle className="text-destructive">Trends across cycles</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">
            Error loading trends: {error.message}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (trends.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trends across cycles</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={TrendingUp}
            title="No pairing cycles yet"
            description="Once pairing cycles run, completion, participation and rating trends will appear here."
          />
        </CardContent>
      </Card>
    );
  }

  const latest = trends[trends.length - 1];
  const previous = trends.length > 1 ? trends[trends.length - 2] : undefined;

  const kpis = [
    {
      label: "Meeting completion",
      value: percent(latest.meetingCompletionRate),
      delta: (
        <Delta
          current={latest.meetingCompletionRate}
          previous={previous?.meetingCompletionRate}
        />
      ),
    },
    {
      label: "Participation",
      value: percent(latest.participationRate),
      delta: (
        <Delta
          current={latest.participationRate}
          previous={previous?.participationRate}
        />
      ),
      hint: `${latest.pairedUsersCount} of ${latest.activeUsersCount} active members`,
    },
    {
      label: "Average rating",
      value: latest.averageRating != null ? latest.averageRating.toFixed(1) : "—",
      hint:
        latest.ratingsCount > 0
          ? `${latest.ratingsCount} rating${latest.ratingsCount === 1 ? "" : "s"}`
          : "No ratings this cycle",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Trends across cycles</span>
          <span className="text-sm font-normal text-muted-foreground">
            Last {trends.length} cycle{trends.length === 1 ? "" : "s"}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Latest-cycle KPIs */}
        <div className="grid gap-3 sm:grid-cols-3">
          {kpis.map((kpi) => (
            <div
              key={kpi.label}
              className="rounded-lg border border-border/60 bg-muted/30 p-3"
            >
              <p className="text-sm text-muted-foreground">{kpi.label}</p>
              <p className="flex items-baseline gap-2 text-2xl font-bold tabular-nums">
                {kpi.value} {kpi.delta}
              </p>
              {kpi.hint && (
                <p className="text-xs text-muted-foreground">{kpi.hint}</p>
              )}
            </div>
          ))}
        </div>

        {/* Outcomes: pairings vs met + completion-rate line */}
        <div>
          <h3 className="mb-2 text-sm font-medium text-muted-foreground">
            Pairing outcomes per cycle
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <ComposedChart data={chartData} margin={{ top: 8, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <YAxis
                yAxisId="rate"
                orientation="right"
                domain={[0, 100]}
                tickFormatter={(v) => `${v}%`}
                tick={{ fontSize: 12 }}
              />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="pairings"
                name="Pairings"
                fill="hsl(var(--primary) / 0.35)"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="met"
                name="Met"
                fill="hsl(var(--primary))"
                radius={[6, 6, 0, 0]}
              />
              <Line
                yAxisId="rate"
                type="monotone"
                dataKey="completion"
                name="Completion %"
                stroke="hsl(var(--success))"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Engagement: participation % + average rating */}
        <div>
          <h3 className="mb-2 text-sm font-medium text-muted-foreground">
            Engagement and quality per cycle
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <ComposedChart data={chartData} margin={{ top: 8, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis
                domain={[0, 100]}
                tickFormatter={(v) => `${v}%`}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                yAxisId="rating"
                orientation="right"
                domain={[0, 5]}
                tick={{ fontSize: 12 }}
              />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="participation"
                name="Participation %"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line
                yAxisId="rating"
                type="monotone"
                dataKey="rating"
                name="Avg rating"
                stroke="hsl(var(--warning))"
                strokeWidth={2}
                dot={{ r: 3 }}
                connectNulls
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
