import { AlgorithmSettingsForm } from "../components/AlgorithmSettingsForm";

export function AlgorithmSettingsPage() {
  const organizationId = "dc1af891-ff22-4e19-9226-4a07e7747014";

  return (
    <div className="min-h-screen bg-white">
      <AlgorithmSettingsForm organizationId={organizationId} />
    </div>
  );
}
