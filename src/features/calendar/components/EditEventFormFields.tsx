import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { EditEventFormValues, Recurrence } from "./EditEventFormSchema";

interface FormFieldsProps {
  form: UseFormReturn<EditEventFormValues>;
}

export const TitleField: React.FC<FormFieldsProps> = ({ form }) => {
  return (
    <div>
      <Label htmlFor="title">Event Title *</Label>
      <Input
        id="title"
        placeholder="e.g., Team Meeting"
        {...form.register("title")}
        aria-invalid={!!form.formState.errors.title}
      />
      {form.formState.errors.title && (
        <p className="text-sm text-destructive">
          {form.formState.errors.title.message}
        </p>
      )}
    </div>
  );
};

export const TypeField: React.FC<FormFieldsProps> = ({ form }) => {
  return (
    <div>
      <Label htmlFor="type">Type *</Label>
      <Select
        value={form.watch("type")}
        onValueChange={(v) =>
          form.setValue("type", v as "availability" | "unavailability")
        }
      >
        <SelectTrigger id="type">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="availability">Available</SelectItem>
          <SelectItem value="unavailability">Unavailable</SelectItem>
        </SelectContent>
      </Select>
      {form.formState.errors.type && (
        <p className="text-sm text-destructive">
          {form.formState.errors.type.message}
        </p>
      )}
    </div>
  );
};

export const StartDateTimeFields: React.FC<FormFieldsProps> = ({ form }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="startDate">Start Date *</Label>
        <Input
          id="startDate"
          type="date"
          {...form.register("startDate")}
          aria-invalid={!!form.formState.errors.startDate}
        />
        {form.formState.errors.startDate && (
          <p className="text-sm text-destructive">
            {form.formState.errors.startDate.message}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="startTime">Time *</Label>
        <Input
          id="startTime"
          type="time"
          {...form.register("startTime")}
          aria-invalid={!!form.formState.errors.startTime}
        />
        {form.formState.errors.startTime && (
          <p className="text-sm text-destructive">
            {form.formState.errors.startTime.message}
          </p>
        )}
      </div>
    </div>
  );
};

export const EndDateTimeFields: React.FC<FormFieldsProps> = ({ form }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="endDate">End Date *</Label>
        <Input
          id="endDate"
          type="date"
          {...form.register("endDate")}
          aria-invalid={!!form.formState.errors.endDate}
        />
        {form.formState.errors.endDate && (
          <p className="text-sm text-destructive">
            {form.formState.errors.endDate.message}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="endTime">Time *</Label>
        <Input
          id="endTime"
          type="time"
          {...form.register("endTime")}
          aria-invalid={!!form.formState.errors.endTime}
        />
        {form.formState.errors.endTime && (
          <p className="text-sm text-destructive">
            {form.formState.errors.endTime.message}
          </p>
        )}
      </div>
    </div>
  );
};

export const RecurrenceField: React.FC<FormFieldsProps> = ({ form }) => {
  return (
    <div>
      <Label htmlFor="recurrence">Recurrence</Label>
      <Select
        value={form.watch("recurrence")}
        onValueChange={(value) =>
          form.setValue("recurrence", value as Recurrence)
        }
        disabled
      >
        <SelectTrigger id="recurrence">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">No recurrence</SelectItem>
          <SelectItem value="weekly">Every week</SelectItem>
        </SelectContent>
      </Select>
      <p className="mt-1 text-xs text-muted-foreground">
        Recurrence cannot be edited. Delete and recreate the event to change
        recurrence.
      </p>
    </div>
  );
};

