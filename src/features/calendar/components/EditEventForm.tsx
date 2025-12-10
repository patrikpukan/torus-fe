import { Button } from "@/components/ui/button";
import React from "react";
import {
  EndDateTimeFields,
  RecurrenceField,
  StartDateTimeFields,
  TitleField,
  TypeField,
} from "./EditEventFormFields";
import type { Occurrence } from "./EditEventFormSchema";
import { EditEventFormScopeSelector } from "./EditEventFormScopeSelector";
import { useEditEventForm } from "./useEditEventForm";

interface EditEventFormProps {
  occurrence: Occurrence;
  onSuccess?: () => void;
  onCancel?: () => void;
  startDate?: string;
  endDate?: string;
}

export const EditEventForm: React.FC<EditEventFormProps> = ({
  occurrence,
  onSuccess,
  onCancel,
  startDate: initialStartDate,
  endDate: initialEndDate,
}) => {
  const {
    form,
    scope,
    setScope,
    submitError,
    loading,
    handleSubmit,
    isSubmitting,
  } = useEditEventForm({
    occurrence,
    initialStartDate,
    initialEndDate,
    onSuccess,
  });

  const event = occurrence.originalEvent;

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <TitleField form={form} />
      <TypeField form={form} />
      <StartDateTimeFields form={form} />
      <EndDateTimeFields form={form} />
      <RecurrenceField form={form} />

      {event.rrule && (
        <EditEventFormScopeSelector
          scope={scope}
          onScopeChange={setScope}
          disabled={loading}
        />
      )}

      {submitError && (
        <div className="rounded border border-destructive/50 bg-destructive/10 p-2 text-sm text-destructive">
          {submitError}
        </div>
      )}

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={loading || isSubmitting}>
          {loading || isSubmitting ? "Updating..." : "Update Event"}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};
