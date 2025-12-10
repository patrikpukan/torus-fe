import React from "react";

export const GoogleCalendarSyncWarning: React.FC = () => {
  return (
    <div className="rounded-md bg-amber-50 border border-amber-200 p-3">
      <p className="text-sm text-amber-900">
        <strong>Note:</strong> All previously synced Google Calendar events will
        be replaced with fresh data from the selected date range.
      </p>
    </div>
  );
};
