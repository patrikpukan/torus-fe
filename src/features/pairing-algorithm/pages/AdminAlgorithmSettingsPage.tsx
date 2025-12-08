import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOrganizationsQuery } from "@/features/organization/api/useOrganizationsQuery";

import { AlgorithmSettingsForm } from "../components/AlgorithmSettingsForm";

const AdminAlgorithmSettingsPage = () => {
  const { data, loading, error } = useOrganizationsQuery();
  const organizations = useMemo(
    () => data?.organizations ?? [],
    [data?.organizations]
  );
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedOrgId && organizations.length > 0) {
      setSelectedOrgId(organizations[0].id);
    }
  }, [organizations, selectedOrgId]);

  const ready = !!selectedOrgId;

  return (
    <div className="min-h-screen">
      <div className="space-y-2 px-8 pt-8">
        <h1 className="text-3xl font-bold">Algorithm settings</h1>
        <p className="text-muted-foreground">
          Choose an organization to tune pairing cadence and execution.
        </p>
        <div className="max-w-sm space-y-2">
          <Label className="text-sm font-medium text-muted-foreground">
            Organization
          </Label>
          <Select
            value={selectedOrgId ?? ""}
            disabled={!organizations.length}
            onValueChange={(value) => setSelectedOrgId(value)}
          >
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Select organization" />
            </SelectTrigger>
            <SelectContent>
              {organizations.map((org) => (
                <SelectItem key={org.id} value={org.id}>
                  {org.name || org.code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {error && (
            <p className="text-xs text-destructive">
              Unable to load organizations. Please try again.
            </p>
          )}
        </div>
      </div>

      {ready ? (
        <AlgorithmSettingsForm
          key={selectedOrgId}
          organizationId={selectedOrgId as string}
        />
      ) : (
        <div className="flex items-center justify-center py-12">
          {loading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading organizations
            </div>
          ) : (
            <p className="text-muted-foreground">No organizations available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminAlgorithmSettingsPage;
