import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type ColumnDef,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, Eye, Flag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useReportsQuery,
  type ReportsQueryItem,
} from "@/features/reports/api/useReportsQuery";

type ReportRow = {
  id: string;
  createdAt: string;
  reportedUserId: string;
  reportedUserName: string;
  reportedUserEmail?: string | null;
  status: ReportsQueryItem["status"];
  resolvedAt?: string | null;
};

const statusLabel = (status: ReportsQueryItem["status"]) =>
  status === "resolved" ? "Resolved" : "Pending review";

const statusVariant = (status: ReportsQueryItem["status"]) =>
  status === "resolved" ? "outline" : "secondary";

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

const formatUserName = (user: ReportsQueryItem["reportedUser"]) => {
  const parts = [user.firstName, user.lastName].filter(
    (value): value is string => Boolean(value && value.trim())
  );

  if (parts.length) {
    return parts.join(" ");
  }

  return user.email ?? "Unknown user";
};

const getColumns = (): ColumnDef<ReportRow>[] => [
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      const sorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          className="flex items-center gap-1 px-0 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:text-sm"
          onClick={() => column.toggleSorting(sorted === "asc")}
        >
          Reported at
          {sorted === "asc" ? (
            <ArrowUp className="h-3.5 w-3.5" />
          ) : sorted === "desc" ? (
            <ArrowDown className="h-3.5 w-3.5" />
          ) : (
            <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => (
      <span className="text-sm text-foreground">
        {dateFormatter.format(new Date(row.original.createdAt))}
      </span>
    ),
  },
  {
    accessorKey: "resolvedAt",
    header: ({ column }) => {
      const sorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          className="flex items-center gap-1 px-0 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:text-sm"
          onClick={() => column.toggleSorting(sorted === "asc")}
        >
          Resolved at
          {sorted === "asc" ? (
            <ArrowUp className="h-3.5 w-3.5" />
          ) : sorted === "desc" ? (
            <ArrowDown className="h-3.5 w-3.5" />
          ) : (
            <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.resolvedAt
          ? dateFormatter.format(new Date(row.original.resolvedAt))
          : "—"}
      </span>
    ),
  },
  {
    accessorKey: "reportedUserName",
    header: ({ column }) => {
      const sorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          className="flex items-center gap-1 px-0 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:text-sm"
          onClick={() => column.toggleSorting(sorted === "asc")}
        >
          Reported user
          {sorted === "asc" ? (
            <ArrowUp className="h-3.5 w-3.5" />
          ) : sorted === "desc" ? (
            <ArrowDown className="h-3.5 w-3.5" />
          ) : (
            <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-sm font-medium text-foreground">
          {row.original.reportedUserName}
        </span>
        {row.original.reportedUserEmail && (
          <span className="text-xs text-muted-foreground">
            {row.original.reportedUserEmail}
          </span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      const sorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          className="flex items-center gap-1 px-0 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:text-sm"
          onClick={() => column.toggleSorting(sorted === "asc")}
        >
          Status
          {sorted === "asc" ? (
            <ArrowUp className="h-3.5 w-3.5" />
          ) : sorted === "desc" ? (
            <ArrowDown className="h-3.5 w-3.5" />
          ) : (
            <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => (
      <Badge
        variant={statusVariant(row.original.status)}
        className="capitalize"
      >
        {statusLabel(row.original.status)}
      </Badge>
    ),
  },
  {
    id: "actions",
    enableSorting: false,
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => (
      <Button
        asChild
        size="icon"
        variant="ghost"
        className="h-10 w-10 text-muted-foreground hover:text-foreground [&_svg]:size-6"
      >
        <Link to={`/reports/${encodeURIComponent(row.original.id)}`}>
          <Eye />
          <span className="sr-only">View report</span>
        </Link>
      </Button>
    ),
  },
];

const ReportsPage = () => {
  const { data, loading, error } = useReportsQuery();
  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);
  const [showResolved, setShowResolved] = useState(false);
  const reports = useMemo(() => data?.reports ?? [], [data?.reports]);
  const columns = useMemo(() => getColumns(), []);

  const unresolvedReports = useMemo(
    () => reports.filter((report) => report.status !== "resolved"),
    [reports]
  );

  const resolvedReports = useMemo(
    () => reports.filter((report) => report.status === "resolved"),
    [reports]
  );

  const tableData = useMemo<ReportRow[]>(
    () =>
      (showResolved
        ? [...unresolvedReports, ...resolvedReports]
        : unresolvedReports
      ).map((report) => ({
        id: report.id,
        createdAt: report.createdAt,
        reportedUserId: report.reportedUser.id,
        reportedUserName: formatUserName(report.reportedUser),
        reportedUserEmail: report.reportedUser.email,
        status: report.status,
        resolvedAt: report.resolvedAt ?? null,
      })),
    [resolvedReports, showResolved, unresolvedReports]
  );

  const table = useReactTable({
    data: tableData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="flex items-center gap-3 text-3xl font-semibold tracking-tight">
            <Flag aria-hidden className="h-8 w-8 text-primary" />
            <span>Reports</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Review incident reports submitted by users. Click a row to see full
            details along with the reasoning provided by the reporter.
          </p>
        </div>
        <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <input
            id="show-resolved"
            type="checkbox"
            className="h-4 w-4 rounded border border-muted-foreground/60"
            checked={showResolved}
            onChange={(event) => setShowResolved(event.target.checked)}
          />
          Show resolved reports
        </label>
      </div>

      {error && (
        <div className="rounded border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Failed to load reports: {error.message}
        </div>
      )}

      <div className="rounded-md border border-muted-foreground/20 bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-sm text-muted-foreground"
                >
                  {!loading
                    ? "No reports found."
                    : "Loading reports, please wait."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ReportsPage;
