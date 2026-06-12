import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { InviteCode } from "@/features/organization/api/useInviteCodesQuery";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

interface InviteHistoryTableProps {
  inviteCodes?: InviteCode[];
  isLoading: boolean;
}

export const InviteHistoryTable = ({
  inviteCodes,
  isLoading,
}: InviteHistoryTableProps) => {
  const { toast } = useToast();
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const copyInviteCode = async (code: string, id: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
    toast({
      description: "Code copied!",
    });
  };

  const copyInviteUrl = async (code: string) => {
    const url = `${window.location.origin}/register?invite=${code}`;
    await navigator.clipboard.writeText(url);
    toast({
      description: "URL copied!",
    });
  };

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading text-2xl font-bold">Invite History</h2>
        <p className="text-sm text-muted-foreground">
          {inviteCodes?.length || 0} total invites
        </p>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Loading skeleton
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                  </TableRow>
                ))
              ) : inviteCodes && inviteCodes.length > 0 ? (
                inviteCodes.map((code) => {
                  const isExpired =
                    code.expiresAt && new Date(code.expiresAt) < new Date();
                  const isMaxed =
                    code.maxUses && code.usedCount >= code.maxUses;
                  const isInvalid = !code.isActive || isExpired || isMaxed;

                  return (
                    <TableRow
                      key={code.id}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <TableCell className="font-mono">
                        <div className="flex items-center gap-2">
                          <span>{code.code}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => copyInviteCode(code.code, code.id)}
                          >
                            {copiedCodeId === code.id ? (
                              <Check className="h-3 w-3" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(new Date(code.createdAt), "d MMM yyyy", {
                          locale: enUS,
                        })}
                      </TableCell>
                      <TableCell>
                        {code.expiresAt ? (
                          <span className={isExpired ? "text-destructive" : ""}>
                            {format(new Date(code.expiresAt), "d MMM yyyy", {
                              locale: enUS,
                            })}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">Never</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span>
                          {code.usedCount}
                          {code.maxUses && ` / ${code.maxUses}`}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={isInvalid ? "destructive" : "default"}>
                          {isExpired
                            ? "Expired"
                            : isMaxed
                              ? "Exhausted"
                              : !code.isActive
                                ? "Deactivated"
                                : "Active"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyInviteUrl(code.code)}
                        >
                          Copy URL
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <p className="text-sm text-muted-foreground">
                      No invites. Create your first invite using the tabs above.
                    </p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};
