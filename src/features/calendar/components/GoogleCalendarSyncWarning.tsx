import React from "react";

export const GoogleCalendarSyncWarning: React.FC = () => {
  return (
    <div className="rounded-md bg-warning/10 border border-warning/40 p-3">
      <p className="text-sm text-warning">
        <strong>Note:</strong> All previously synced Google Calendar events will
        be replaced with fresh data from the selected date range.
      </p>
    </div>
  );
};
