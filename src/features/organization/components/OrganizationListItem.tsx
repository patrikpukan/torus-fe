import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { OrganizationQueryItem } from "@/features/organization/api/useOrganizationsQuery";
import { Link } from "react-router-dom";

type OrganizationListItemProps = {
  organization: OrganizationQueryItem;
};

const OrganizationListItem = ({ organization }: OrganizationListItemProps) => {
  const sizeLabel = organization.size
    ? `~${organization.size} employees`
    : "Size not specified";

  return (
    <Link
      to={`/org-detail/${encodeURIComponent(organization.id)}`}
      className="block"
    >
      <Card className="cursor-pointer p-4 transition-colors hover:bg-muted/50">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src={organization.imageUrl || undefined}
                  alt={organization.name}
                />
                <AvatarFallback delayMs={0}>
                  {organization.name?.[0]?.toUpperCase() ?? "O"}
                </AvatarFallback>
              </Avatar>
              <div className="text-base font-medium md:text-lg">
                {organization.name}
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              {organization.code}
            </div>
            {organization.address && (
              <div className="text-xs text-muted-foreground">
                📍 {organization.address}
              </div>
            )}
          </div>
          <div className="flex gap-2 pt-1 sm:pt-0">
            <Badge variant="secondary">{sizeLabel}</Badge>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default OrganizationListItem;
