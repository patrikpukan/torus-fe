import { useMemo, useState } from "react";

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useUsersQuery,
  type UsersQueryItem,
} from "@/features/users/api/useUsersQuery";

import { columns, type UserTableRow } from "./UserListItem";

const EMPTY_USERS: UsersQueryItem[] = [];

const buildDisplayName = (user: UsersQueryItem): string => {
  const name = [user.firstName, user.lastName]
    .filter((part) => part && part.trim().length > 0)
    .join(" ")
    .trim();

  return name || user.email || "Unknown user";
};

const AdminUserTable = () => {
  const { data, loading, error } = useUsersQuery();
  const users = data?.users ?? EMPTY_USERS;

  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const tableData = useMemo<UserTableRow[]>(
    () =>
      users.map((user) => ({
        ...user,
        displayName: buildDisplayName(user),
      })),
    [users]
  );

  const availableRoles = useMemo(() => {
    const roles = new Set<string>();
    tableData.forEach((user) => {
      const role = user.role?.trim();
      if (role) {
        roles.add(role);
      }
    });
    return Array.from(roles).sort((a, b) => a.localeCompare(b));
  }, [tableData]);

  const availableStatuses = useMemo(() => {
    const statuses = new Set<string>();
    tableData.forEach((user) => {
      const status = user.profileStatus?.trim();
      if (status) {
        statuses.add(status);
      }
    });
    return Array.from(statuses).sort((a, b) => a.localeCompare(b));
  }, [tableData]);

  const filteredData = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return tableData.filter((user) => {
      const role = user.role?.trim() ?? "";
      if (roleFilter !== "all" && role !== roleFilter) {
        return false;
      }

      const status = user.profileStatus?.trim() ?? "";
      if (statusFilter !== "all" && status !== statusFilter) {
        return false;
      }

      if (!term) {
        return true;
      }

      const displayNameMatches = user.displayName.toLowerCase().includes(term);
      const emailMatches = (user.email ?? "").toLowerCase().includes(term);

      return displayNameMatches || emailMatches;
    });
  }, [roleFilter, searchTerm, statusFilter, tableData]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="container py-8">
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-semibold tracking-tight">Users</h1>
        </div>

        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_repeat(2,minmax(0,220px))]">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="user-search"
              className="text-sm font-medium text-muted-foreground"
            >
              Search
            </label>
            <Input
              id="user-search"
              placeholder="Search by name or email"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              Role
            </span>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All roles</SelectItem>
                {availableRoles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              Status
            </span>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {availableStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {error && (
          <div className="rounded border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            Failed to load users: {error.message}
          </div>
        )}

        <div className="rounded-md border bg-card border-muted-foreground/20">
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
                      ? "No users to display."
                      : "Loading rows, please wait."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default AdminUserTable;
