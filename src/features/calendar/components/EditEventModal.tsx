import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EditEventForm } from "./EditEventForm";
import type { CalendarEventItem } from "../api/useCalendarEvents";

interface EditEventModalProps {
  open: boolean;
  event: CalendarEventItem | null;
  onOpenChange: (open: boolean) => void;
  startDate?: string;
  endDate?: string;
}

export const EditEventModal: React.FC<EditEventModalProps> = ({
  open,
  event,
  onOpenChange,
  startDate,
  endDate,
}) => {
  const handleSuccess = () => {
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  if (!event) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <EditEventForm
            event={event}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
            startDate={startDate}
            endDate={endDate}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
