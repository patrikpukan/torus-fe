import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, startOfToday } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  GET_ALGORITHM_SETTINGS,
  useGetAlgorithmSettings,
  useUpdateAlgorithmSettings,
} from "../api/queries";

interface AlgorithmSettingsFormProps {
  organizationId: string;
}

const formSchema = z.object({
  startDate: z.date(),
  periodLengthDays: z.number().min(1).max(3650),
  unit: z.literal("days"),
  randomSeed: z.number().int().positive(),
});

type FormValues = z.infer<typeof formSchema>;

const buildDefaultValues = (today: Date): FormValues => ({
  startDate: today,
  periodLengthDays: 21,
  unit: "days",
  randomSeed: 12345,
});

export function AlgorithmSettingsForm({ organizationId }: AlgorithmSettingsFormProps) {
  const today = React.useMemo(() => startOfToday(), []);
  const defaultValues = React.useMemo(() => buildDefaultValues(today), [today]);

  const { toast } = useToast();
  const { data, loading } = useGetAlgorithmSettings(organizationId);
  const [updateSettings, { loading: updating }] = useUpdateAlgorithmSettings();
  const [warning, setWarning] = React.useState<string | null>(null);

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
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-8 py-12">
      <h1 className="mb-12 text-3xl font-bold">Algorithm settings</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
            <div>
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="mb-4 text-base font-medium">
                      Start Date
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "h-11 w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            if (date) {
                              field.onChange(date);
                            }
                          }}
                          disabled={(date) => date < today}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <Label className="text-base font-medium">
                  Period Length
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="periodLengthDays"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="number"
                            className="h-11"
                            placeholder="21"
                            {...field}
                            onChange={(event) => {
                              const nextValue = event.target.valueAsNumber;
                              field.onChange(
                                Number.isNaN(nextValue) ? undefined : nextValue
                              );
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="unit"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-11">
                              <SelectValue placeholder="Unit" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="days">Days</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="randomSeed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">
                      Random Number Generator Seed
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className="h-11"
                        placeholder="12345"
                        {...field}
                        onChange={(event) => {
                          const nextValue = event.target.valueAsNumber;
                          field.onChange(
                            Number.isNaN(nextValue) ? undefined : nextValue
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {warning && (
            <Alert className="border-amber-500 bg-amber-50 text-amber-900">
              <AlertDescription className="text-sm">
                {warning}
              </AlertDescription>
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
