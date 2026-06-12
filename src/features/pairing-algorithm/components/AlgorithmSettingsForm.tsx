import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { PageHeader } from "@/components/ui/page-header";
import { Settings2 } from "lucide-react";
import {
  PeriodLengthField,
  RandomSeedField,
  StartDateField,
} from "./AlgorithmSettingsFormFields";
import { ExecutePairingSection } from "./ExecutePairingSection";
import { useAlgorithmSettingsForm } from "./useAlgorithmSettingsForm";

interface AlgorithmSettingsFormProps {
  organizationId: string;
}

export function AlgorithmSettingsForm({
  organizationId,
}: AlgorithmSettingsFormProps) {
  const {
    form,
    today,
    loading,
    updating,
    executing,
    warning,
    executionResult,
    handleCancel,
    onSubmit,
    handleExecutePairing,
  } = useAlgorithmSettingsForm({ organizationId });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-8 py-12">
      <PageHeader
        icon={Settings2}
        title="Algorithm settings"
        className="mb-12"
      />

      <ExecutePairingSection
        onExecute={handleExecutePairing}
        executing={executing}
        loading={loading}
        executionResult={executionResult}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
            <StartDateField form={form} today={today} />
            <div className="space-y-8">
              <PeriodLengthField form={form} today={today} />
              <RandomSeedField form={form} today={today} />
            </div>
          </div>

          {warning && (
            <Alert className="border-amber-500 bg-amber-50 text-amber-900">
              <AlertDescription className="text-sm">{warning}</AlertDescription>
            </Alert>
          )}

          <div className="flex items-center justify-center gap-6 pt-4">
            <Button
              type="submit"
              disabled={updating}
              className="h-12 w-48 bg-gray-800 text-white hover:bg-gray-900"
            >
              {updating ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-12 w-48"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
