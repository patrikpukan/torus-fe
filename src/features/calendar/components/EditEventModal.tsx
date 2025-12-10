import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EditEventForm } from "./EditEventForm";
import type { Occurrence } from "./EditEventFormSchema";

interface EditEventModalProps {
  open: boolean;
  event: Occurrence | null;
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
            occurrence={event}
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
