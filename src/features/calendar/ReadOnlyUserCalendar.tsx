import { useMemo } from "react";
import { Temporal } from "temporal-polyfill";
import { type CalendarEvent } from "@schedule-x/calendar";
import "@schedule-x/theme-default/dist/index.css";
import "temporal-polyfill/global";
import { CustomCalendar } from "./components";
import { useUserCalendarEvents } from "./api/useUserCalendarEvents";
import { useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";

// Convert calendar events from GraphQL to ScheduleX format
const convertToScheduleXEvents = (
  calendarOccurrences:
    | Array<{
        id: string;
        occurrenceStart: string;
        occurrenceEnd: string;
        originalEvent: {
          id: string;
          title?: string | null;
          description?: string | null;
          type: string;
          startDateTime: string;
          endDateTime: string;
          rrule?: string | null;
          exceptionDates?: string | null;
          exceptionRrules?: string | null;
          createdAt: string;
          updatedAt: string;
          deletedAt?: string | null;
        };
      }>
    | undefined
): CalendarEvent[] => {
  if (!calendarOccurrences) return [];

  return calendarOccurrences
    .filter((occ) => !occ.originalEvent.deletedAt)
    .map((occ) => {
      const tz = Temporal.Now.zonedDateTimeISO().timeZoneId;

      const startZdt = Temporal.Instant.from(
        occ.occurrenceStart
      ).toZonedDateTimeISO(tz);
      const endZdt = Temporal.Instant.from(
        occ.occurrenceEnd
      ).toZonedDateTimeISO(tz);

      const uniqueId = occ.id;

      return {
        id: uniqueId,
        title: occ.originalEvent.title || "Untitled",
        calendarId:
          occ.originalEvent.type === "availability"
            ? "available"
            : "unavailable",
        start: startZdt,
        end: endZdt,
      };
    });
};

type ReadOnlyUserCalendarProps = {
  userId: string | undefined;
  pairingId?: string;
  otherUserName?: string;
};

const ALL_MEETINGS_FOR_PAIRING = gql`
  query AllMeetingsForPairing($pairingId: ID!) {
    allMeetingsForPairing(pairingId: $pairingId) {
      id
      startDateTime
      endDateTime
      userAId
      userBId
      userAConfirmationStatus
      userBConfirmationStatus
      cancelledAt
    }
  }
`;

type AllMeetingsForPairingData = {
  allMeetingsForPairing: Array<{
    id: string;
    startDateTime: string;
    endDateTime: string;
    userAId: string;
    userBId: string;
    userAConfirmationStatus: string;
    userBConfirmationStatus: string;
    cancelledAt?: string | null;
  }>;
};

/**
 * Read-only calendar for displaying another user's events inside pairings.
 * Shows event details popover without edit/delete actions.
 */
const ReadOnlyUserCalendar = ({ userId, pairingId, otherUserName }: ReadOnlyUserCalendarProps) => {
  // Date range: current week start through ~3 weeks ahead
  const today = Temporal.Now.plainDateISO();
  const startOfWeek = today.subtract({ days: (today.dayOfWeek + 6) % 7 });
  const endOfRange = startOfWeek.add({ days: 20 });

  const startDate = startOfWeek.toString() + "T00:00:00Z";
  const endDate = endOfRange.toString() + "T23:59:59Z";

  // Fetch target user's calendar (skips if userId is undefined)
  const { data: calendarData } = useUserCalendarEvents(userId, startDate, endDate);
  // Fetch meetings for this pairing to overlay (skips if no pairingId)
  const { data: pairingMeetings } = useQuery<AllMeetingsForPairingData>(ALL_MEETINGS_FOR_PAIRING, {
    variables: { pairingId: pairingId as string },
    skip: !pairingId,
    fetchPolicy: "cache-and-network",
  });

  const scheduleXEvents = useMemo(
    () => convertToScheduleXEvents(calendarData?.expandedCalendarOccurrences),
    [calendarData]
  );

  // Map confirmed meetings to yellow events for this pairing
  const scheduleXMeetingEvents: CalendarEvent[] = useMemo(() => {
    const items: Array<{
      id: string;
      startDateTime: string;
      endDateTime: string;
      userAConfirmationStatus: string;
      userBConfirmationStatus: string;
      cancelledAt?: string | null;
    }> = pairingMeetings?.allMeetingsForPairing ?? [];
    const tz = Temporal.Now.zonedDateTimeISO().timeZoneId;
    return items
      .filter(
        (m) =>
          !m.cancelledAt &&
          String(m.userAConfirmationStatus) === "confirmed" &&
          String(m.userBConfirmationStatus) === "confirmed"
      )
      .map((m) => {
        const start = Temporal.Instant.from(m.startDateTime).toZonedDateTimeISO(tz);
        const end = Temporal.Instant.from(m.endDateTime).toZonedDateTimeISO(tz);
        return {
          id: `pairing-meeting-${m.id}`,
          title: otherUserName ? `You ↔ ${otherUserName}` : "Meeting",
          calendarId: "meeting",
          start,
          end,
        } as CalendarEvent;
      });
  }, [pairingMeetings, otherUserName]);

  return (
    <div className="grid grid-cols-1 gap-4 mb-6">
      {/* No edit/delete callbacks passed -> popover is details-only */}
      <CustomCalendar events={[...scheduleXEvents, ...scheduleXMeetingEvents]} />
    </div>
  );
};

export default ReadOnlyUserCalendar;
