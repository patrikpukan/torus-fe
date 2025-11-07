import React, { useState } from "react";
import { useMutation } from "@apollo/client/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  CALENDAR_EVENTS_QUERY,
  DELETE_CALENDAR_EVENT,
} from "../api/useCalendarEvents";
import type { CalendarEventItem } from "../api/useCalendarEvents";

interface DeleteEventModalProps {
  open: boolean;
  event: CalendarEventItem | null;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  startDate?: string;
  endDate?: string;
}

export const DeleteEventModal: React.FC<DeleteEventModalProps> = ({
  open,
  event,
  onOpenChange,
  onSuccess,
  startDate,
  endDate,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [mutate, { loading }] = useMutation(DELETE_CALENDAR_EVENT, {
    refetchQueries: [
      {
        query: CALENDAR_EVENTS_QUERY,
        variables: {
          startDate: startDate || "",
          endDate: endDate || "",
        },
      },
    ],
  });

  const handleDelete = async () => {
    if (!event) return;

    try {
      setError(null);
      await mutate({
        variables: {
          input: {
            id: event.id,
          },
        },
      });

      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete event");
    }
  };

  const handleCancel = () => {
    setError(null);
    onOpenChange(false);
  };

  if (!event) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Event</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{event.title || "Untitled event"}"?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="p-2 bg-red-100 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
