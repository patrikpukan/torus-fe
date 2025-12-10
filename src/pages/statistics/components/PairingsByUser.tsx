import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type PairingByUser = {
  userId: string;
  userName: string | null;
  userEmail: string;
  status: string | null;
  count: number;
};

type PairingsByUserProps = {
  pairingsByStatusAndUser: PairingByUser[];
};

type SortColumn = "userName" | "userEmail" | "status" | "count";

export const PairingsByUser = ({
  pairingsByStatusAndUser,
}: PairingsByUserProps) => {
  const [userSearch, setUserSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortColumn>("count");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const statusOptions = useMemo(() => {
    const statuses = new Set<string>();
    pairingsByStatusAndUser.forEach((item) => {
      if (item.status) {
        statuses.add(item.status);
      }
    });
    return Array.from(statuses).sort((a, b) => a.localeCompare(b));
  }, [pairingsByStatusAndUser]);

  const filteredRows = useMemo(() => {
    const term = userSearch.trim().toLowerCase();
    return pairingsByStatusAndUser.filter((item) => {
      if (statusFilter !== "all" && item.status !== statusFilter) {
        return false;
      }
      if (!term) return true;
      return (
        (item.userName ?? "").toLowerCase().includes(term) ||
        item.userEmail.toLowerCase().includes(term)
      );
    });
  }, [pairingsByStatusAndUser, statusFilter, userSearch]);

  const sortedRows = useMemo(() => {
    const rows = [...filteredRows];
    rows.sort((a, b) => {
      const direction = sortDir === "asc" ? 1 : -1;
      if (sortBy === "count") {
        return direction * ((a.count ?? 0) - (b.count ?? 0));
      }
      const aVal = (a[sortBy] ?? "").toString().toLowerCase();
      const bVal = (b[sortBy] ?? "").toString().toLowerCase();
      return direction * aVal.localeCompare(bVal);
    });
    return rows;
  }, [filteredRows, sortBy, sortDir]);

  const toggleSort = (column: SortColumn) => {
    if (sortBy === column) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortDir("asc");
    }
  };

  const renderSortIcon = (column: SortColumn) => {
    if (sortBy !== column) {
      return <ArrowUpDown className="ml-2 h-3.5 w-3.5 text-muted-foreground" />;
    }
    return sortDir === "asc" ? (
      <ArrowUp className="ml-2 h-3.5 w-3.5 text-foreground" />
    ) : (
      <ArrowDown className="ml-2 h-3.5 w-3.5 text-foreground" />
    );
  };

  if (pairingsByStatusAndUser.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pairings by Status and User</CardTitle>
          <CardDescription>
            Detailed breakdown of pairings by status for each user
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="py-4 text-center text-sm text-muted-foreground">
            No pairing data by user available for the selected period
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pairings by Status and User</CardTitle>
        <CardDescription>
          Detailed breakdown of pairings by status for each user
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="grid gap-3 md:grid-cols-[minmax(0,2fr)_repeat(2,minmax(0,200px))]">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">
                Search users
              </Label>
              <Input
                placeholder="Search by name or email"
                value={userSearch}
                onChange={(event) => setUserSearch(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">
                Status
              </Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer select-none"
                    onClick={() => toggleSort("userName")}
                  >
                    <div className="flex items-center">
                      User
                      {renderSortIcon("userName")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer select-none"
                    onClick={() => toggleSort("userEmail")}
                  >
                    <div className="flex items-center">
                      Email
                      {renderSortIcon("userEmail")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer select-none"
                    onClick={() => toggleSort("status")}
                  >
                    <div className="flex items-center">
                      Status
                      {renderSortIcon("status")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer select-none text-right"
                    onClick={() => toggleSort("count")}
                  >
                    <div className="flex items-center justify-end">
                      Count
                      {renderSortIcon("count")}
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedRows.map((item, index) => (
                  <TableRow key={`${item.userId}-${item.status}-${index}`}>
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
        </div>
      </CardContent>
    </Card>
  );
};
