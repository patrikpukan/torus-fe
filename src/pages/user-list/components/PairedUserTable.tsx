import { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  type ColumnDef,
  useReactTable,
} from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { Eye } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/features/pairings/components/dateUtils";
import { useAuth } from "@/hooks/useAuth";

export type PairedUserRow = {
  id: string;
  displayName: string;
  email: string;
  pairedAt: string;
  profileImageUrl?: string;
};

type PairedUserTableProps = {
  rows: PairedUserRow[];
  loading: boolean;
  errorMessage?: string | null;
};

const getColumnsForPairedTable = (
  currentUserId?: string
): ColumnDef<PairedUserRow>[] => [
  {
    accessorKey: "displayName",
    header: () => (
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:text-sm">
        Name
      </span>
    ),
    cell: ({ row }) => {
      const user = row.original;
      const href =
        user.id === currentUserId
          ? "/profile"
          : `/user-list/${encodeURIComponent(user.id)}`;

      return (
        <Link to={href} className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage alt={user.displayName} src={user.profileImageUrl} />
            <AvatarFallback delayMs={0}>
              {user.displayName?.[0]?.toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium leading-tight sm:text-base">
              {user.displayName}
            </span>
            {user.email && (
              <span className="text-xs text-muted-foreground sm:text-sm">
                {user.email}
              </span>
            )}
          </div>
        </Link>
      );
    },
  },
  {
    accessorKey: "email",
    header: () => (
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:text-sm">
        Email
      </span>
    ),
    cell: ({ row }) => row.original.email ?? "-",
  },
  {
    accessorKey: "pairedAt",
    header: () => (
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:text-sm">
        Paired On
      </span>
    ),
    cell: ({ row }) =>
      row.original.pairedAt ? formatDateTime(row.original.pairedAt) : "Unknown",
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original;
      const href =
        user.id === currentUserId
          ? "/profile"
          : `/user-list/${encodeURIComponent(user.id)}`;

      return (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 text-muted-foreground hover:text-foreground [&_svg]:size-6"
            asChild
          >
            <Link to={href} aria-label={`View details for ${user.displayName}`}>
              <Eye />
            </Link>
          </Button>
        </div>
      );
    },
  },
];

const PairedUserTable = ({
  rows,
  loading,
  errorMessage,
}: PairedUserTableProps) => {
  const { user: currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  const columns = useMemo(
    () => getColumnsForPairedTable(currentUser?.id),
    [currentUser?.id]
  );

  const filteredData = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      return rows;
    }

    return rows.filter((user) => {
      const nameMatches = user.displayName.toLowerCase().includes(term);
      const emailMatches = (user.email ?? "").toLowerCase().includes(term);
      return nameMatches || emailMatches;
    });
  }, [rows, searchTerm]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    autoResetAll: false,
  });

  const visibleRows = table.getRowModel().rows;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)]">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="paired-user-search"
            className="text-sm font-medium text-muted-foreground"
          >
            Search
          </label>
          <Input
            id="paired-user-search"
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
      </div>

      {errorMessage && (
        <div className="rounded border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Failed to load users: {errorMessage}
        </div>
      )}

      <div className="rounded-md border bg-card border-muted-foreground/20">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  const sortedState = header.column.getIsSorted();
                  const canSort = header.column.getCanSort();
                  return (
                    <TableHead
                      key={header.id}
                      aria-sort={
                        canSort
                          ? sortedState === "asc"
                            ? "ascending"
                            : sortedState === "desc"
                              ? "descending"
                              : "none"
                          : undefined
                      }
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {visibleRows.length ? (
              visibleRows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      data-user-name={
                        cell.column.id === "displayName"
                          ? row.getValue<string>("displayName")
                          : undefined
                      }
                    >
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
                    ? "No paired users to display."
                    : "Loading rows, please wait."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PairedUserTable;
