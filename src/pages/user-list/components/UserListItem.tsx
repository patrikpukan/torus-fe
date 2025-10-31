import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Link } from "react-router-dom";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { UsersQueryItem } from "@/features/users/api/useUsersQuery";

export type UserTableRow = UsersQueryItem & {
  displayName: string;
};

export const columns: ColumnDef<UserTableRow>[] = [
  {
    accessorKey: "displayName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="flex items-center gap-1 px-0 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:text-sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="h-3.5 w-3.5" />
      </Button>
    ),
    enableSorting: true,
    cell: ({ row }) => {
      const user = row.original;

      return (
        <Link
          to={`/user-list/${encodeURIComponent(user.id)}`}
          className="flex items-center gap-3"
        >
          <Avatar className="h-9 w-9">
            <AvatarImage alt={user.displayName} />
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
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="flex items-center gap-1 px-0 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:text-sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Email
        <ArrowUpDown className="h-3.5 w-3.5" />
      </Button>
    ),
    enableSorting: true,
    cell: ({ row }) => row.original.email ?? "—",
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="flex items-center gap-1 px-0 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:text-sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Role
        <ArrowUpDown className="h-3.5 w-3.5" />
      </Button>
    ),
    enableSorting: true,
    cell: ({ row }) => {
      const role = row.original.role;
      if (!role) {
        return <span className="text-muted-foreground">—</span>;
      }

      return (
        <Badge variant="outline" className="capitalize">
          {role}
        </Badge>
      );
    },
  },
  {
    accessorKey: "profileStatus",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="flex items-center gap-1 px-0 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:text-sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Status
        <ArrowUpDown className="h-3.5 w-3.5" />
      </Button>
    ),
    enableSorting: true,
    cell: ({ row }) => {
      const status = row.original.profileStatus;
      if (!status) {
        return <span className="text-muted-foreground">—</span>;
      }

      return (
        <Badge variant="secondary" className="capitalize">
          {status}
        </Badge>
      );
    },
  },
];
