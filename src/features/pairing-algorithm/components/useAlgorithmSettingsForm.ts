import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import {
  GET_ALGORITHM_SETTINGS,
  useGetAlgorithmSettings,
  useUpdateAlgorithmSettings,
  useExecutePairingAlgorithm,
} from "../api/queries";
import {
  formSchema,
  buildDefaultValues,
  getToday,
  type FormValues,
} from "./AlgorithmSettingsFormSchema";

interface UseAlgorithmSettingsFormProps {
  organizationId: string;
}

export const useAlgorithmSettingsForm = ({
  organizationId,
}: UseAlgorithmSettingsFormProps) => {
  const today = React.useMemo(() => getToday(), []);
  const defaultValues = React.useMemo(() => buildDefaultValues(today), [today]);

  const { toast } = useToast();
  const { data, loading } = useGetAlgorithmSettings(organizationId);
  const [updateSettings, { loading: updating }] = useUpdateAlgorithmSettings();
  const [executePairing, { loading: executing }] = useExecutePairingAlgorithm();
  const [warning, setWarning] = React.useState<string | null>(null);
  const [executionResult, setExecutionResult] = React.useState<{
    success: boolean;
    message: string;
    pairingsCreated?: number;
    unpairedUsers?: number;
  } | null>(null);

  const settings = data?.getAlgorithmSettings;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onBlur",
  });

  React.useEffect(() => {
    if (settings) {
      form.reset({
        startDate: today,
        periodLengthDays: settings.periodLengthDays,
        unit: "days",
        randomSeed: settings.randomSeed,
      });
      setWarning(null);
    }
  }, [settings, form, today]);

  const handleCancel = React.useCallback(() => {
    if (settings) {
      form.reset({
        startDate: today,
        periodLengthDays: settings.periodLengthDays,
        unit: "days",
        randomSeed: settings.randomSeed,
      });
    } else {
      form.reset(defaultValues);
    }
    setWarning(null);
  }, [defaultValues, form, settings, today]);

  const onSubmit = async (values: FormValues) => {
    try {
      const result = await updateSettings({
        variables: {
          input: {
            organizationId,
            periodLengthDays: values.periodLengthDays,
            randomSeed: values.randomSeed,
          },
        },
        refetchQueries: [
          {
            query: GET_ALGORITHM_SETTINGS,
            variables: { organizationId },
          },
        ],
      });

      const responseData = result.data?.updateAlgorithmSettings;

      setWarning(responseData?.warning ?? null);

      toast({
        title: "Settings saved",
        description: responseData?.warning
          ? "Settings saved with warnings"
          : "Algorithm settings updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      });

      console.error(error);
    }
  };

  const handleExecutePairing = async () => {
    try {
      setExecutionResult(null);

      const result = await executePairing({
        variables: { organizationId },
      });

      const data = result.data?.executePairingAlgorithm;

      if (data) {
        setExecutionResult({
          success: data.success,
          message: data.message,
          pairingsCreated: data.pairingsCreated,
          unpairedUsers: data.unpairedUsers,
        });

        if (data.success) {
          toast({
            title: "Pairing Executed Successfully",
            description: `Created ${data.pairingsCreated} pairings${
              data.unpairedUsers
                ? `, ${data.unpairedUsers} user(s) unpaired`
                : ""
            }`,
          });
        } else {
          toast({
            title: "Execution Failed",
            description: `${data.message}${
              data.unpairedUsers !== undefined && data.unpairedUsers > 0
                ? ` (${data.unpairedUsers} user(s) unpaired)`
                : ""
            }`,
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Execution Error",
        description: "Failed to execute pairing algorithm",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  return {
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
  };
};

