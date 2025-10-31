import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Eye } from "lucide-react";
import { Link } from "react-router-dom";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
    cell: ({ row }) => row.original.email ?? "-",
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
        return <span className="text-muted-foreground">-</span>;
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
        return <span className="text-muted-foreground">-</span>;
      }

      return (
        <Badge variant="secondary" className="capitalize">
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original;

      return (
        <div className="flex justify-end">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 text-muted-foreground hover:text-foreground [&_svg]:size-6"
                  asChild
                >
                  <Link
                    to={`/user-list/${encodeURIComponent(user.id)}`}
                    aria-label={`View details for ${user.displayName}`}
                  >
                    <Eye />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">User detail</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
  },
];
