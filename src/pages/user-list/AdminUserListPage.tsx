import { useMemo, useState } from "react";
import { Building2 } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useOrganizationsQuery } from "@/features/organization/api/useOrganizationsQuery";

import AdminUserTable from "./components/AdminUserTable";

const ALL_ORGANIZATIONS_VALUE = "all";

const AdminUserListPage = () => {
  const { data, loading, error } = useOrganizationsQuery();
  const organizations = data?.organizations ?? [];

  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);

  const selectValue = selectedOrgId ?? ALL_ORGANIZATIONS_VALUE;

  const orgOptions = useMemo(
    () =>
      organizations.map((org) => ({
        label: org.name || org.code,
        value: org.id,
      })),
    [organizations]
  );

  return (
    <div className="container space-y-6 py-8">
      <header className="space-y-1">
        <h1 className="flex items-center gap-3 text-3xl font-semibold tracking-tight">
          <Building2 aria-hidden className="h-8 w-8 text-primary" />
          <span>User directory</span>
        </h1>
        <p className="text-sm text-muted-foreground">
          Browse users across all organizations or focus on a single one.
        </p>
      </header>

      <div className="max-w-xl space-y-2">
        <Label className="text-sm font-medium text-muted-foreground">
          Organization
        </Label>
        <Select
          value={selectValue}
          disabled={loading}
          onValueChange={(value) =>
            setSelectedOrgId(value === ALL_ORGANIZATIONS_VALUE ? null : value)
          }
        >
          <SelectTrigger className="h-12">
            <SelectValue placeholder="All organizations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_ORGANIZATIONS_VALUE}>
              All organizations
            </SelectItem>
            {orgOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error && (
          <p className="text-sm text-destructive">
            Failed to load organizations. Showing all users.
          </p>
        )}
      </div>

      <AdminUserTable organizationId={selectedOrgId ?? undefined} />
    </div>
  );
};

export default AdminUserListPage;
