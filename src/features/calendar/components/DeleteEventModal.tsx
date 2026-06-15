import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useDeleteCalendarEventMutation } from "../api/useCalendarEvents";
import type { CalendarEventItem } from "../api/useCalendarEvents";

type Occurrence = {
  id: string;
  occurrenceStart: string;
  occurrenceEnd: string;
  originalEvent: CalendarEventItem;
};

interface DeleteEventModalProps {
  open: boolean;
  event: Occurrence | null;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  // Retained for API compatibility with callers; cache invalidation now covers
  // refetching, so these range hints are no longer used here.
  startDate?: string;
  endDate?: string;
}

export const DeleteEventModal: React.FC<DeleteEventModalProps> = ({
  open,
  event,
  onOpenChange,
  onSuccess,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [scope, setScope] = useState<"this" | "following" | "all">("all");
  const [mutate, { loading }] = useDeleteCalendarEventMutation();

  const handleDelete = async () => {
    if (!event) return;

    try {
      setError(null);
      const occurrenceStartDate = new Date(event.occurrenceStart);

      await mutate({
        variables: {
          input: {
            id: event.originalEvent.id,
            scope,
            occurrenceStart: occurrenceStartDate,
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
    setScope(event?.originalEvent.rrule ? "all" : "this");
    onOpenChange(false);
  };

  if (!event) return null;

  const isRecurring = !!event.originalEvent.rrule;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Event</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "
            {event.originalEvent.title || "Untitled event"}"?
            {isRecurring && " This is a recurring event."}
          </DialogDescription>
        </DialogHeader>

        {isRecurring && (
          <div className="space-y-3 border-y py-4">
            <Label>Delete scope</Label>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  id="scope-this"
                  value="this"
                  checked={scope === "this"}
                  onChange={(e) =>
                    setScope(e.target.value as "this" | "following" | "all")
                  }
                  disabled={loading}
                />
                <Label
                  htmlFor="scope-this"
                  className="font-normal cursor-pointer"
                >
                  This event only
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  id="scope-following"
                  value="following"
                  checked={scope === "following"}
                  onChange={(e) =>
                    setScope(e.target.value as "this" | "following" | "all")
                  }
                  disabled={loading}
                />
                <Label
                  htmlFor="scope-following"
                  className="font-normal cursor-pointer"
                >
                  This and following events
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  id="scope-all"
                  value="all"
                  checked={scope === "all"}
                  onChange={(e) =>
                    setScope(e.target.value as "this" | "following" | "all")
                  }
                  disabled={loading}
                />
                <Label
                  htmlFor="scope-all"
                  className="font-normal cursor-pointer"
                >
                  All events in series
                </Label>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="p-2 bg-destructive/10 text-destructive rounded text-sm">
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
