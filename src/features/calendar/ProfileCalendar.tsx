import { useMemo } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { Temporal } from "temporal-polyfill";
import { ScheduleXCalendar } from "@schedule-x/react";
import {
  createCalendar,
  createViewWeek,
  type CalendarEvent,
} from "@schedule-x/calendar";
import "@schedule-x/theme-default/dist/index.css";
import 'temporal-polyfill/global'

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
    // Add a quick 1-hour available slot starting at the next full hour (local timezone)
    const base = Temporal.Now.zonedDateTimeISO();
    const nextHour = base.with({
      minute: 0,
      second: 0,
      millisecond: 0,
      microsecond: 0,
      nanosecond: 0,
    }).add({ hours: 1 });
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
    // Could trigger OAuth flow and import events from Google Calendar
    // For now, we just log to the console
    console.log("Sync with Google Calendar clicked");
  };

  return (
    <Box>
      <Typography variant="h3" fontWeight={600} mb={3}>
        Calendar
      </Typography>

      <Paper variant="outlined" sx={{ p: 2 }}>
        <ScheduleXCalendar calendarApp={calendar} />
      </Paper>

      <Box display="flex" flexDirection="column" alignItems="center" gap={3} mt={5}>
        <Button
          variant="contained"
          color="inherit"
          size="large"
          onClick={handleAddEvent}
          sx={{ width: 320, py: 2, borderRadius: 2, bgcolor: "grey.700", color: "#fff" }}
        >
          Add event
        </Button>
        <Button
          variant="outlined"
          size="large"
          onClick={handleSyncGoogle}
          sx={{ width: 320, py: 2, borderRadius: 2 }}
        >
          Sync with google calendar
        </Button>
      </Box>
    </Box>
  );
};

export default ProfileCalendar;
