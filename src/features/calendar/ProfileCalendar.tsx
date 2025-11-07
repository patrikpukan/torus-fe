import { useMemo } from "react";
import { Temporal } from "temporal-polyfill";
import { ScheduleXCalendar } from "@schedule-x/react";
import {
  createCalendar,
  createViewWeek,
  type CalendarEvent,
} from "@schedule-x/calendar";
import "@schedule-x/theme-default/dist/index.css";
import "temporal-polyfill/global";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCalendarEvents } from "./api/useCalendarEvents";
import {
  CalendarEventList,
  MeetingEventList,
  PendingMeetingConfirmations,
} from "./components";

const normalizeLocale = (l?: string): string => {
  if (!l) return "en-US";
  const lower = l.toLowerCase();
  if (/^[a-z]{2}$/.test(lower)) {
    if (lower === "en") return "en-US";
    return `${lower}-${lower.toUpperCase()}`;
  }
  return l;
};

const makeDemoEvents = (): CalendarEvent[] => {
  const today = Temporal.Now.plainDateISO();
  const monday = today.subtract({ days: (today.dayOfWeek + 6) % 7 });
  const tz = Temporal.Now.zonedDateTimeISO().timeZoneId;

  const day = (offset: number, startHour: number, durationHours: number) => {
    const date = monday.add({ days: offset });
    const start = date
      .toPlainDateTime({ hour: startHour, minute: 0 })
      .toZonedDateTime(tz);
    const end = start.add({ hours: durationHours });
    return { start, end };
  };

  return [
    // Available (green)
    {
      id: "a-1",
      title: "Available",
      calendarId: "available",
      ...day(0, 9, 2),
    },
    {
      id: "a-2",
      title: "Available",
      calendarId: "available",
      ...day(1, 13, 2),
    },
    // Unavailable (red)
    {
      id: "u-1",
      title: "Unavailable",
      calendarId: "unavailable",
      ...day(2, 10, 1),
    },
    {
      id: "u-2",
      title: "Unavailable",
      calendarId: "unavailable",
      ...day(4, 14, 2),
    },
  ];
};

const ProfileCalendar = () => {
  // Get date range for current week
  const today = Temporal.Now.plainDateISO();
  const startOfWeek = today.subtract({ days: (today.dayOfWeek + 6) % 7 });
  const endOfWeek = startOfWeek.add({ days: 6 });

  // Convert to ISO strings for API
  const startDate = startOfWeek.toString() + "T00:00:00Z";
  const endDate = endOfWeek.toString() + "T23:59:59Z";

  // Fetch calendar and meeting events
  useCalendarEvents(startDate, endDate);

  const calendar = useMemo(
    () =>
      createCalendar({
        views: [createViewWeek()],
        defaultView: "week",
        calendars: {
          available: {
            colorName: "available",
            lightColors: {
              main: "#16a34a",
              container: "#dcfce7",
              onContainer: "#052e16",
            },
          },
          unavailable: {
            colorName: "unavailable",
            lightColors: {
              main: "#dc2626",
              container: "#fee2e2",
              onContainer: "#450a0a",
            },
          },
        },
        events: makeDemoEvents(),
        // Quality of life
        locale: normalizeLocale(navigator.language),
        weekOptions: { gridHeight: 720 },
      }),
    []
  );

  const handleAddEvent = () => {
    // Add a quick 1-hour available slot starting at the next full hour
    const base = Temporal.Now.zonedDateTimeISO();
    const nextHour = base
      .with({
        minute: 0,
        second: 0,
        millisecond: 0,
        microsecond: 0,
        nanosecond: 0,
      })
      .add({ hours: 1 });
    calendar.events.add({
      id: String(Date.now()),
      title: "Available",
      calendarId: "available",
      start: nextHour,
      end: nextHour.add({ hours: 1 }),
    });
  };

  const handleSyncGoogle = () => {
    // Placeholder for future implementation
    console.log("Sync with Google Calendar clicked");
  };

  return (
    <div>
      <h1 className="mb-6 text-3xl font-semibold">Calendar</h1>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="p-4 col-span-2">
          <ScheduleXCalendar calendarApp={calendar} />
        </Card>

        <div className="space-y-4">
          <Card className="p-4">
            <PendingMeetingConfirmations />
          </Card>
          <Card className="p-4">
            <CalendarEventList startDate={startDate} endDate={endDate} />
          </Card>
          <Card className="p-4">
            <MeetingEventList />
          </Card>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <Button
          className="h-auto w-80 rounded-xl bg-muted-foreground py-4 text-lg font-semibold hover:bg-muted-foreground/90"
          size="lg"
          onClick={handleAddEvent}
        >
          Add event
        </Button>
        <Button
          className="h-auto w-80 rounded-xl py-4 text-lg"
          size="lg"
          variant="outline"
          onClick={handleSyncGoogle}
        >
          Sync with google calendar
        </Button>
      </div>
    </div>
  );
};

export default ProfileCalendar;
