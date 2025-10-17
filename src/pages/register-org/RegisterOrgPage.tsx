import CreateOrganizationForm from "@/features/organization/components/CreateOrganizationForm";

const RegisterOrgPage = () => {
  return (
    <div className="flex flex-col items-center gap-8 py-10">
      <header className="max-w-2xl text-center">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Založení nové organizace
        </h1>
        <p className="mt-3 text-base text-muted-foreground">
          Vyplňte prosím informace o společnosti, kterou chcete spravovat. Po
          ověření vám zpřístupníme administrační rozhraní a vytvoříme účet
          správce.
        </p>
      </header>
      <CreateOrganizationForm />
    </div>
  );
};

export default RegisterOrgPage;
