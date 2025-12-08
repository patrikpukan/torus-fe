import { useMemo, useState } from "react";
import { Temporal } from "temporal-polyfill";
import { type CalendarEvent } from "@schedule-x/calendar";
import "@schedule-x/theme-default/dist/index.css";
import "temporal-polyfill/global";
import { Button } from "@/components/ui/button";
import {
  type CalendarEventsQueryData,
  useCalendarEvents,
} from "./api/useCalendarEvents";
import {
  CreateEventModal,
  CustomCalendar,
  DeleteEventModal,
  EditEventModal,
  GoogleCalendarSyncDialog,
} from "./components";
import { CalendarPlus, CalendarSync } from "lucide-react";
import { useMeetingEvents } from "./api/useMeetingEvents";

type CalendarOccurrence =
  CalendarEventsQueryData["expandedCalendarOccurrences"][number];

// Convert calendar events from GraphQL to ScheduleX format
const convertToScheduleXEvents = (
  calendarOccurrences?: CalendarOccurrence[]
): CalendarEvent[] => {
  if (!calendarOccurrences) {
    return [];
  }

  const filtered = calendarOccurrences.filter(
    (occ) => !occ.originalEvent.deletedAt
  );

  return filtered.map((occ) => {
    const tz = Temporal.Now.zonedDateTimeISO().timeZoneId;

    // Convert backend ISO (UTC) to the user's timezone using occurrence times
    const startZdt = Temporal.Instant.from(
      occ.occurrenceStart
    ).toZonedDateTimeISO(tz);
    const endZdt = Temporal.Instant.from(occ.occurrenceEnd).toZonedDateTimeISO(
      tz
    );

    // Generate unique ID for each occurrence by combining event ID and occurrence start time
    // The backend now provides unique IDs for each occurrence, so we use it directly
    const uniqueId = occ.id;

    // Add cloud emoji prefix for Google Calendar events
    const title =
      occ.originalEvent.externalSource === "google"
        ? `☁️ ${occ.originalEvent.title || "Untitled"}`
        : occ.originalEvent.title || "Untitled";

    return {
      id: uniqueId,
      title,
      calendarId:
        occ.originalEvent.type === "availability" ? "available" : "unavailable",
      start: startZdt,
      end: endZdt,
      // Store externalSource in a custom data field for later retrieval
      _externalSource: occ.originalEvent.externalSource,
    };
  });
};

const ProfileCalendar = () => {
  const [createEventModalOpen, setCreateEventModalOpen] = useState(false);
  const [editEventModalOpen, setEditEventModalOpen] = useState(false);
  const [deleteEventModalOpen, setDeleteEventModalOpen] = useState(false);
  const [googleSyncDialogOpen, setGoogleSyncDialogOpen] = useState(false);

  const [selectedEventForEdit, setSelectedEventForEdit] =
    useState<CalendarOccurrence | null>(null);
  const [selectedEventForDelete, setSelectedEventForDelete] =
    useState<CalendarOccurrence | null>(null);

  // Get date range for current week + extended future (to capture pause events)
  const today = Temporal.Now.plainDateISO();
  const startOfWeek = today.subtract({ days: (today.dayOfWeek + 6) % 7 });
  // Extended to 60 days to ensure pause events are visible even if they start in the future
  const endOfWeek = startOfWeek.add({ days: 60 });

  // Convert to ISO strings for API
  const startDate = startOfWeek.toString() + "T00:00:00Z";
  const endDate = endOfWeek.toString() + "T23:59:59Z";

  // Fetch calendar events
  const { data: calendarData, refetch: refetchCalendarEvents } =
    useCalendarEvents(startDate, endDate);
  const { data: meetingData } = useMeetingEvents(startDate, endDate);

  // Convert real calendar events to ScheduleX format
  const scheduleXEvents = useMemo(
    () => convertToScheduleXEvents(calendarData?.expandedCalendarOccurrences),
    [calendarData]
  );

  // Convert confirmed meetings to yellow ScheduleX events
  const scheduleXMeetingEvents = useMemo(() => {
    const items = meetingData?.meetingEventsByDateRange ?? [];
    const tz = Temporal.Now.zonedDateTimeISO().timeZoneId;
    return items
      .filter(
        (m) =>
          !m.cancelledAt &&
          String(m.userAConfirmationStatus) === "confirmed" &&
          String(m.userBConfirmationStatus) === "confirmed"
      )
      .map((m) => {
        const start = Temporal.Instant.from(m.startDateTime).toZonedDateTimeISO(
          tz
        );
        const end = Temporal.Instant.from(m.endDateTime).toZonedDateTimeISO(tz);
        return {
          id: `meeting-${m.id}`,
          title: "Meeting",
          calendarId: "meeting",
          start,
          end,
        } as CalendarEvent;
      });
  }, [meetingData]);

  // Map from unique occurrence ID to the occurrence object for edit/delete operations
  const eventItemsMap = useMemo(() => {
    const map = new Map<string, CalendarOccurrence>();
    calendarData?.expandedCalendarOccurrences.forEach((occ) => {
      map.set(occ.id, {
        id: occ.id,
        occurrenceStart: occ.occurrenceStart,
        occurrenceEnd: occ.occurrenceEnd,
        originalEvent: occ.originalEvent,
      });
    });
    return map;
  }, [calendarData]);

  const handleEditEvent = (event: CalendarEvent) => {
    const occ = eventItemsMap.get(String(event.id));
    if (occ) {
      setSelectedEventForEdit(occ);
      setEditEventModalOpen(true);
    }
  };

  const handleDeleteEvent = (event: CalendarEvent) => {
    const occ = eventItemsMap.get(String(event.id));
    if (occ) {
      setSelectedEventForDelete(occ);
      setDeleteEventModalOpen(true);
    }
  };

  const handleSyncGoogle = () => {
    setGoogleSyncDialogOpen(true);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Calendar</h1>
        <Button
          className="h-auto rounded-xl bg-muted-foreground py-2 font-semibold hover:bg-muted-foreground/90"
          onClick={() => setCreateEventModalOpen(true)}
        >
          <CalendarPlus className="mr-2 h-4 w-4" />
          Add event
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-6">
        <CustomCalendar
          events={[...scheduleXEvents, ...scheduleXMeetingEvents]}
          onEditEvent={handleEditEvent}
          onDeleteEvent={handleDeleteEvent}
          isEditVisible={(ev) =>
            ev.calendarId !== "meeting" && ev.title !== "Activity Paused"
          }
          isDeleteVisible={(ev) => ev.calendarId !== "meeting"}
        />
      </div>

      <div className="flex flex-col items-center gap-4">
        <Button
          className="h-auto w-80 rounded-xl py-2"
          variant="outline"
          onClick={handleSyncGoogle}
        >
          <CalendarSync className="mr-2 h-4 w-4" />
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
      <GoogleCalendarSyncDialog
        open={googleSyncDialogOpen}
        onOpenChange={setGoogleSyncDialogOpen}
        onSyncSuccess={() => refetchCalendarEvents()}
      />
    </div>
  );
};

export default ProfileCalendar;
