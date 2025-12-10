import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import React from "react";
import type { UseFormReturn } from "react-hook-form";
import type { FormValues } from "./AlgorithmSettingsFormSchema";

interface AlgorithmSettingsFormFieldsProps {
  form: UseFormReturn<FormValues>;
  today: Date;
}

export const StartDateField: React.FC<AlgorithmSettingsFormFieldsProps> = ({
  form,
  today,
}) => {
  return (
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
  );
};

export const PeriodLengthField: React.FC<AlgorithmSettingsFormFieldsProps> = ({
  form,
}) => {
  return (
    <div className="space-y-4">
      <Label className="text-base font-medium">Period Length</Label>
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
  );
};

export const RandomSeedField: React.FC<AlgorithmSettingsFormFieldsProps> = ({
  form,
}) => {
  return (
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
                field.onChange(Number.isNaN(nextValue) ? undefined : nextValue);
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
