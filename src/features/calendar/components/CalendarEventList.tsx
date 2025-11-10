import React from "react";
import { useCalendarEvents } from "../api/useCalendarEvents";
import { format } from "date-fns";

interface CalendarEventListProps {
  startDate: string;
  endDate: string;
}

export const CalendarEventList: React.FC<CalendarEventListProps> = ({
  startDate,
  endDate,
}) => {
  const { data, loading, error } = useCalendarEvents(startDate, endDate);

  if (loading) {
    return <div className="p-4">Loading calendar events...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-red-600">
        Error loading events: {error.message}
      </div>
    );
  }

  const occurrences = data?.expandedCalendarOccurrences || [];

  if (occurrences.length === 0) {
    return <div className="p-4 text-gray-500">No calendar events</div>;
  }

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-sm">Calendar Events</h3>
      <div className="space-y-1 max-h-48 overflow-y-auto">
        {occurrences.map((occurrence) => {
          const event = occurrence.originalEvent;

          return (
            <div
              key={occurrence.id}
              className={`p-2 rounded text-xs ${
                event.type === "availability"
                  ? "bg-green-100 text-green-900"
                  : "bg-red-100 text-red-900"
              }`}
            >
              <div className="font-medium">{event.title || "Untitled"}</div>
              <div className="text-xs opacity-75">
                <div>
                  Start:{" "}
                  {format(new Date(occurrence.occurrenceStart), "dd.MM HH:mm")}
                </div>
                <div>
                  End:{" "}
                  {format(new Date(occurrence.occurrenceEnd), "dd.MM HH:mm")}
                </div>
              </div>
              {event.rrule && (
                <div className="text-xs opacity-50">
                  Recurring: {event.rrule}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
