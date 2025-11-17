import type { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, Eye, UserRoundX } from "lucide-react";
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
import BanUserDialog from "@/features/users/components/BanUserDialog";

export type UserTableRow = UsersQueryItem & {
  displayName: string;
};

export const getColumns = (currentUserId?: string): ColumnDef<UserTableRow>[] => [
  {
    accessorKey: "displayName",
    header: ({ column }) => {
      const sorted = column.getIsSorted();

      return (
        <Button
          variant="ghost"
          className="flex items-center gap-1 px-0 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:text-sm"
          onClick={() => column.toggleSorting(sorted === "asc")}
        >
          Name
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
    enableSorting: true,
    cell: ({ row }) => {
      const user = row.original;
      const href = user.id === currentUserId ? "/profile" : `/user-list/${encodeURIComponent(user.id)}`;

      return (
        <Link
          to={href}
          className="flex items-center gap-3"
        >
          <Avatar className="h-9 w-9">
            <AvatarImage alt={user.displayName} src={user.profileImageUrl || undefined} />
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
    header: ({ column }) => {
      const sorted = column.getIsSorted();

      return (
        <Button
          variant="ghost"
          className="flex items-center gap-1 px-0 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:text-sm"
          onClick={() => column.toggleSorting(sorted === "asc")}
        >
          Email
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
    enableSorting: true,
    cell: ({ row }) => row.original.email ?? "-",
  },
  {
    accessorKey: "role",
    header: ({ column }) => {
      const sorted = column.getIsSorted();

      return (
        <Button
          variant="ghost"
          className="flex items-center gap-1 px-0 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:text-sm"
          onClick={() => column.toggleSorting(sorted === "asc")}
        >
          Role
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
        <TooltipProvider>
          <div className="flex justify-end gap-1">
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
            <BanUserDialog userId={user.id} userDisplayName={user.displayName}>
              {({ openDialog, loading }) => (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={openDialog}
                      disabled={loading}
                      className="h-10 w-10 text-muted-foreground hover:text-destructive [&_svg]:size-6"
                    >
                      <UserRoundX />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">Ban user</TooltipContent>
                </Tooltip>
              )}
            </BanUserDialog>
          </div>
        </TooltipProvider>
      );
    },
  },
];
