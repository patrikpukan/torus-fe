import { useMemo, useState } from "react";
import { Temporal } from "temporal-polyfill";
import { type CalendarEvent } from "@schedule-x/calendar";
import "@schedule-x/theme-default/dist/index.css";
import "temporal-polyfill/global";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  useCalendarEvents,
  type CalendarEventItem,
} from "./api/useCalendarEvents";
import {
  CalendarEventList,
  MeetingEventList,
  PendingMeetingConfirmations,
  CustomCalendar,
  CreateEventModal,
  EditEventModal,
  DeleteEventModal,
} from "./components";

// Convert calendar events from GraphQL to ScheduleX format
const convertToScheduleXEvents = (
  calendarEvents: CalendarEventItem[] | undefined
): CalendarEvent[] => {
  if (!calendarEvents) return [];

  return calendarEvents

    .filter((event) => !event.deletedAt) // Skip soft-deleted events
    .map((event) => {
      const tz = Temporal.Now.zonedDateTimeISO().timeZoneId;

      // Convert backend ISO (UTC) to the user's timezone
      const startZdt = Temporal.Instant.from(
        event.startDateTime
      ).toZonedDateTimeISO(tz);
      const endZdt = Temporal.Instant.from(
        event.endDateTime
      ).toZonedDateTimeISO(tz);

      return {
        id: event.id,
        title: event.title || "Untitled",
        calendarId: event.type === "availability" ? "available" : "unavailable",
        start: startZdt,
        end: endZdt,
      };
    });
};

const ProfileCalendar = () => {
  const [createEventModalOpen, setCreateEventModalOpen] = useState(false);
  const [editEventModalOpen, setEditEventModalOpen] = useState(false);
  const [deleteEventModalOpen, setDeleteEventModalOpen] = useState(false);
  const [selectedEventForEdit, setSelectedEventForEdit] =
    useState<CalendarEventItem | null>(null);
  const [selectedEventForDelete, setSelectedEventForDelete] =
    useState<CalendarEventItem | null>(null);

  // Get date range for current week + 2 weeks ahead (to show upcoming events)
  const today = Temporal.Now.plainDateISO();
  const startOfWeek = today.subtract({ days: (today.dayOfWeek + 6) % 7 });
  const endOfWeek = startOfWeek.add({ days: 20 }); // Show 3 weeks ahead

  // Convert to ISO strings for API
  const startDate = startOfWeek.toString() + "T00:00:00Z";
  const endDate = endOfWeek.toString() + "T23:59:59Z";

  // Fetch calendar events
  const { data: calendarData } = useCalendarEvents(startDate, endDate);

  // Convert real calendar events to ScheduleX format
  const scheduleXEvents = useMemo(
    () => convertToScheduleXEvents(calendarData?.calendarEventsByDateRange),
    [calendarData]
  );

  // Map from ScheduleX event ID to CalendarEventItem for edit/delete operations
  const eventItemsMap = useMemo(() => {
    const map = new Map<string, CalendarEventItem>();
    calendarData?.calendarEventsByDateRange.forEach((item) => {
      map.set(item.id, item);
    });
    return map;
  }, [calendarData]);

  const handleEditEvent = (event: CalendarEvent) => {
    const eventItem = eventItemsMap.get(String(event.id));
    if (eventItem) {
      setSelectedEventForEdit(eventItem);
      setEditEventModalOpen(true);
    }
  };

  const handleDeleteEvent = (event: CalendarEvent) => {
    const eventItem = eventItemsMap.get(String(event.id));
    if (eventItem) {
      setSelectedEventForDelete(eventItem);
      setDeleteEventModalOpen(true);
    }
  };

  const handleSyncGoogle = () => {
    // Placeholder for future implementation
    console.log("Sync with Google Calendar clicked");
  };

  return (
    <div>
      <h1 className="mb-6 text-3xl font-semibold">Calendar</h1>

      {/* <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <PendingMeetingConfirmations />
        </Card>
        <Card className="p-4">
          <CalendarEventList startDate={startDate} endDate={endDate} />
        </Card>
        <Card className="p-4">
          <MeetingEventList />
        </Card>
      </div> */}

      <div className="grid grid-cols-1 gap-4 mb-6">
        <CustomCalendar
          events={scheduleXEvents}
          onEditEvent={handleEditEvent}
          onDeleteEvent={handleDeleteEvent}
        />
      </div>

      <div className="flex flex-col items-center gap-4">
        <Button
          className="h-auto w-80 rounded-xl bg-muted-foreground py-2 font-semibold hover:bg-muted-foreground/90"
          onClick={() => setCreateEventModalOpen(true)}
        >
          Add event
        </Button>
        <Button
          className="h-auto w-80 rounded-xl py-2"
          variant="outline"
          onClick={handleSyncGoogle}
        >
          Sync with google calendar
        </Button>
      </div>

      {/* Modals */}
      <CreateEventModal
        open={createEventModalOpen}
        onOpenChange={setCreateEventModalOpen}
        startDate={startDate}
        endDate={endDate}
      />
      <EditEventModal
        open={editEventModalOpen}
        event={selectedEventForEdit}
        onOpenChange={setEditEventModalOpen}
        startDate={startDate}
        endDate={endDate}
      />
      <DeleteEventModal
        open={deleteEventModalOpen}
        event={selectedEventForDelete}
        onOpenChange={setDeleteEventModalOpen}
        startDate={startDate}
        endDate={endDate}
      />
    </div>
  );
};

export default ProfileCalendar;
