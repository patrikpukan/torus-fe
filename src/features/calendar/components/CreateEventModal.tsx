import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CalendarEventForm } from "./CalendarEventForm";

interface CreateEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  startDate?: string;
  endDate?: string;
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({
  open,
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Event</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <CalendarEventForm
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
