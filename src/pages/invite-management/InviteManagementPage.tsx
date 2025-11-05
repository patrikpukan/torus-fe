import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { useInviteCodesQuery } from "@/features/organization/api/useInviteCodesQuery";
import { CreateInviteDialog } from "@/features/organization/components/CreateInviteDialog";
import { useAuth } from "@/hooks/useAuth";
import { Plus } from "lucide-react";
import { format } from "date-fns";
import { cs } from "date-fns/locale";

const InviteManagementPage = () => {
  const { appRole, loading: authLoading } = useAuth();
  const { data: inviteCodes, isLoading } = useInviteCodesQuery();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // Check authorization
  const isAdmin = appRole === "org_admin" || appRole === "super_admin";

  if (authLoading) {
    return (
      <div className="flex min-h-[240px] items-center justify-center">
        <span className="text-sm text-muted-foreground">Načítání...</span>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container py-8">
        <div className="rounded-lg bg-red-50 p-4">
          <p className="text-sm text-red-800">
            Nemáte oprávnění pro přístup k této stránce
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Správa pozvánek</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Spravujte pozvánky pro nové členy vaší organizace
            </p>
          </div>
          <Button
            onClick={() => setCreateDialogOpen(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Vytvořit pozvánku
          </Button>
        </div>

        {/* Invite Table */}
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kód</TableHead>
                  <TableHead>Vytvořeno</TableHead>
                  <TableHead>Vypršení</TableHead>
                  <TableHead>Použití</TableHead>
                  <TableHead>Stav</TableHead>
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
                    const isExpired = code.expiresAt && new Date(code.expiresAt) < new Date();
                    const isMaxed =
                      code.maxUses && code.usedCount >= code.maxUses;
                    const isInvalid = !code.isActive || isExpired || isMaxed;

                    return (
                      <TableRow key={code.id}>
                        <TableCell className="font-mono font-semibold">
                          {code.code}
                        </TableCell>
                        <TableCell>
                          {format(new Date(code.createdAt), "d. MMM yyyy", {
                            locale: cs,
                          })}
                        </TableCell>
                        <TableCell>
                          {code.expiresAt ? (
                            <span
                              className={isExpired ? "text-red-600" : ""}
                            >
                              {format(new Date(code.expiresAt), "d. MMM yyyy", {
                                locale: cs,
                              })}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">
                              Nikdy
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span>
                            {code.usedCount}
                            {code.maxUses && ` / ${code.maxUses}`}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              isInvalid ? "destructive" : "default"
                            }
                          >
                            {isExpired
                              ? "Vypršelo"
                              : isMaxed
                                ? "Vyčerpáno"
                                : !code.isActive
                                  ? "Deaktivováno"
                                  : "Aktivní"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <p className="text-sm text-muted-foreground">
                        Žádné pozvánky. Vytvořte svou první pozvánku kliknutím na tlačítko výše.
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      {/* Create Invite Dialog */}
      <CreateInviteDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </div>
  );
};

export default InviteManagementPage;
