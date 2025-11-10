import React from "react";
import { useUpcomingMeetings } from "../api/useMeetingEvents";
import { format } from "date-fns";

export const MeetingEventList: React.FC = () => {
  const { data, loading, error } = useUpcomingMeetings();

  if (loading) {
    return <div className="p-4">Loading meetings...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-red-600">
        Error loading meetings: {error.message}
      </div>
    );
  }

  const meetings = data?.upcomingMeetings || [];

  if (meetings.length === 0) {
    return <div className="p-4 text-gray-500">No upcoming meetings</div>;
  }

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-sm">Upcoming Meetings</h3>
      <div className="space-y-1 max-h-48 overflow-y-auto">
        {meetings.map((meeting) => (
          <div
            key={meeting.id}
            className="p-2 rounded text-xs bg-blue-100 text-blue-900"
          >
            <div className="font-medium">Meeting</div>
            <div className="text-xs opacity-75">
              {format(new Date(meeting.startDateTime), "dd.MM HH:mm")} -{" "}
              {format(new Date(meeting.endDateTime), "HH:mm")}
            </div>
            <div className="flex gap-1 mt-1">
              <span className="px-1 py-0.5 bg-blue-200 rounded">
                User A: {meeting.userAConfirmationStatus}
              </span>
              <span className="px-1 py-0.5 bg-blue-200 rounded">
                User B: {meeting.userBConfirmationStatus}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
