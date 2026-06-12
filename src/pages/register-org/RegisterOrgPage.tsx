import CreateOrganizationForm from "@/features/organization/components/CreateOrganizationForm";
import { Building } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";

const RegisterOrgPage = () => {
  return (
    <div className="flex flex-col items-center gap-8 py-10">
      <PageHeader
        icon={Building}
        title="Create a New Organization"
        description="Please fill in the information about the organization you want to manage. After verification, we will grant you access to your organization's admin panel."
        className="max-w-2xl"
      />
      <CreateOrganizationForm />
    </div>
  );
};

export default RegisterOrgPage;
