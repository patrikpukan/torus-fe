import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import { useOrganizationByIdQuery } from "@/features/organization/api/useOrganizationByIdQuery";
import { useMyOrganizationQuery } from "@/features/organization/api/useMyOrganizationQuery";
import { UPDATE_ORGANIZATION_MUTATION } from "@/features/organization/api/useUpdateOrganizationMutation";
import OrganizationForm, {
  type OrganizationFormData,
} from "@/features/organization/components/OrganizationForm";
import InviteUserModal from "@/features/organization/components/InviteUserModal";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ArrowLeft, UserPlus } from "lucide-react";

const OrganizationDetailPage = () => {
  const { appRole } = useAuth();
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<OrganizationFormData | null>(null);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  // Determine if this is "my-org" or "org-detail/:id"
  const isMyOrg = location.pathname === "/my-org";
  const organizationId = params.id ? decodeURIComponent(params.id) : undefined;

  // Use appropriate query based on route
  const {
    data: myOrgData,
    loading: myOrgLoading,
    error: myOrgError,
  } = useMyOrganizationQuery();

  const {
    data: orgByIdData,
    loading: orgByIdLoading,
    error: orgByIdError,
  } = useOrganizationByIdQuery(organizationId);

  const [updateOrganization, { loading: mutationLoading }] = useMutation(
    UPDATE_ORGANIZATION_MUTATION
  );

  // Select the appropriate data source
  const loading = isMyOrg ? myOrgLoading : orgByIdLoading;
  const error = isMyOrg ? myOrgError : orgByIdError;
  const organization = isMyOrg
    ? myOrgData?.myOrganization
    : orgByIdData?.organizationById;

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl py-8 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Loading organization...
        </h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl py-8">
        <h1 className="text-2xl font-semibold tracking-tight">
          Unable to load organization
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="mx-auto max-w-3xl py-8">
        <h1 className="text-2xl font-semibold tracking-tight">
          Organization not found
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We couldn't find an organization for that link.
        </p>
      </div>
    );
  }

  const currentFormData: OrganizationFormData = formData || {
    id: organization.id,
    name: organization.name,
    code: organization.code,
    size: organization.size ?? null,
    address: organization.address ?? null,
    imageUrl: organization.imageUrl ?? null,
  };

  const handleChange = (updatedOrg: OrganizationFormData) => {
    setFormData(updatedOrg);
  };

  const handleSubmit = async (updatedOrg: OrganizationFormData) => {
    try {
      await updateOrganization({
        variables: {
          input: {
            id: updatedOrg.id,
            name: updatedOrg.name,
            size: updatedOrg.size,
            address: updatedOrg.address,
            imageUrl: updatedOrg.imageUrl,
          },
        },
        refetchQueries: isMyOrg
          ? ["MyOrganization"]
          : ["OrganizationById", "Organizations"],
      });

      setIsEditing(false);
      setFormData(null);
    } catch (error) {
      console.error("Error updating organization:", error);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData(null);
  };

  return (
    <div className="mx-auto max-w-3xl py-8">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {appRole === "super_admin" && !isMyOrg && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/organization-list")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Organizations
            </Button>
          )}
        </div>
        <Button
          variant="default"
          size="sm"
          onClick={() => setInviteModalOpen(true)}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Invite User
        </Button>
      </div>

      <h1 className="mb-4 text-3xl font-semibold">
        {isMyOrg ? "My Organization" : "Organization Details"}
      </h1>

      <OrganizationForm
        value={currentFormData}
        onChange={isEditing ? handleChange : undefined}
        readOnly={!isEditing}
        onSubmit={handleSubmit}
        submitLabel={mutationLoading ? "Saving..." : "Save Changes"}
        onEditClick={handleEditClick}
      />

      {isEditing && (
        <div className="mt-4 flex justify-center">
          <Button
            variant="outline"
            onClick={handleCancelEdit}
            disabled={mutationLoading}
          >
            Cancel
          </Button>
        </div>
      )}

      <InviteUserModal
        open={inviteModalOpen}
        onOpenChange={setInviteModalOpen}
        organizationId={organization.id}
        organizationName={organization.name}
      />
    </div>
  );
};

export default OrganizationDetailPage;
