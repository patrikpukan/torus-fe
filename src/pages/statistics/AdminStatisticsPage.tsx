import { useState } from "react";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOrganizationsQuery } from "@/features/organization/api/useOrganizationsQuery";

import { StatisticsView } from "./StatisticsView";

const ALL_ORGANIZATIONS_VALUE = "all";

const AdminStatisticsPage = () => {
  const { data, loading, error } = useOrganizationsQuery();
  const organizations = data?.organizations ?? [];
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);

  return (
    <StatisticsView
      organizationId={selectedOrgId}
      organizationSelector={
        <div className="max-w-xs space-y-2">
          <Label className="text-sm font-medium text-muted-foreground">
            Organization
          </Label>
          <Select
            value={selectedOrgId ?? ALL_ORGANIZATIONS_VALUE}
            disabled={loading}
            onValueChange={(value) =>
              setSelectedOrgId(value === ALL_ORGANIZATIONS_VALUE ? null : value)
            }
          >
            <SelectTrigger className="h-11 md:min-w-[260px]">
              <SelectValue placeholder="All organizations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_ORGANIZATIONS_VALUE}>
                All organizations
              </SelectItem>
              {organizations.map((org) => (
                <SelectItem key={org.id} value={org.id}>
                  {org.name || org.code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {error && (
            <p className="text-xs text-destructive">
              Unable to load organizations. Showing all data.
            </p>
          )}
        </div>
      }
    />
  );
};

export default AdminStatisticsPage;
