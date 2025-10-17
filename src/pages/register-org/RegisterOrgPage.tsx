import CreateOrganizationForm from "@/features/organization/components/CreateOrganizationForm";

const RegisterOrgPage = () => {
  return (
    <div className="flex flex-col items-center gap-8 py-10">
      <header className="max-w-2xl text-center">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Create a New Organization
        </h1>
        <p className="mt-3 text-base text-muted-foreground">
          Please fill in the information about the organization you want to manage. 
          After verification, we will grant you access to your organization's admin panel.
        </p>
      </header>
      <CreateOrganizationForm />
    </div>
  );
};

export default RegisterOrgPage;
