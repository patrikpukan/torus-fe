import {
  Cell,
  Pie,
  PieChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Cheerful but toned-down color palette
const pieColors = [
  "hsl(217, 55%, 65%)", // Happy blue
  "hsl(142, 50%, 60%)", // Happy green
  "hsl(38, 60%, 65%)", // Happy amber
  "hsl(0, 50%, 62%)", // Happy coral
  "hsl(262, 55%, 65%)", // Happy purple
  "hsl(199, 55%, 65%)", // Happy cyan
  "hsl(24, 60%, 65%)", // Happy orange
];

type PairingsByStatusProps = {
  pairingsByStatus: Array<{ status: string | null; count: number }>;
};

export const PairingsByStatus = ({
  pairingsByStatus,
}: PairingsByStatusProps) => {
  const pieData = pairingsByStatus.map((item) => ({
    name: item.status ?? "Unknown",
    value: item.count,
  }));
  const pieTotal = pieData.reduce((sum, item) => sum + item.value, 0);

  if (pairingsByStatus.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pairings by Status</CardTitle>
          <CardDescription>
            Overview of pairings grouped by their current status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="py-4 text-center text-sm text-muted-foreground">
            No pairing data available for the selected period
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pairings by Status</CardTitle>
        <CardDescription>
          Overview of pairings grouped by their current status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 lg:grid-cols-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Count</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pairingsByStatus.map((item, index) => (
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

          <div className="flex h-full w-full flex-col items-center justify-center gap-8">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={75}
                  outerRadius={115}
                  paddingAngle={2}
                  startAngle={90}
                  endAngle={-270}
                  animationBegin={0}
                  animationDuration={600}
                  animationEasing="ease-out"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={pieColors[index % pieColors.length]}
                      stroke="hsl(var(--background))"
                      strokeWidth={3}
                    />
                  ))}
                </Pie>
                {pieTotal > 0 && (
                  <g>
                    <text
                      x="50%"
                      y="48%"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-4xl font-bold fill-foreground"
                      style={{ fontFamily: "system-ui" }}
                    >
                      {pieTotal}
                    </text>
                    <text
                      x="50%"
                      y="58%"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-xs font-medium fill-muted-foreground uppercase tracking-wider"
                    >
                      Total
                    </text>
                  </g>
                )}
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                    boxShadow:
                      "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
                    padding: "10px 14px",
                  }}
                  labelStyle={{
                    color: "hsl(var(--foreground))",
                    fontWeight: 600,
                    fontSize: "13px",
                    marginBottom: "6px",
                  }}
                  itemStyle={{
                    color: "hsl(var(--foreground))",
                    fontSize: "13px",
                    padding: "2px 0",
                  }}
                  formatter={(value: number, name: string) => [
                    `${value} (${((value / pieTotal) * 100).toFixed(1)}%)`,
                    name,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
            {pieData.length > 0 && (
              <div className="flex flex-wrap justify-center gap-3 w-full">
                {pieData.map((entry, index) => {
                  const percentage =
                    pieTotal > 0
                      ? ((entry.value / pieTotal) * 100).toFixed(1)
                      : "0";
                  return (
                    <div
                      key={entry.name}
                      className="flex items-center gap-2.5 rounded-md px-3 py-2 bg-muted/50 border border-border/50 hover:bg-muted transition-colors"
                    >
                      <div
                        className="h-3 w-3 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor: pieColors[index % pieColors.length],
                        }}
                      />
                      <span className="text-sm font-medium text-foreground">
                        {entry.name}
                      </span>
                      <span className="text-sm font-semibold text-foreground">
                        {entry.value}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({percentage}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

