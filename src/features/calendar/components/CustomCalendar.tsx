import React, { useState, useRef, useCallback, useEffect } from "react";
import { ScheduleXCalendar } from "@schedule-x/react";
import {
  createCalendar,
  createViewWeek,
  type CalendarEvent,
} from "@schedule-x/calendar";
import "@schedule-x/theme-default/dist/index.css";
import { EventPopover } from "./EventPopover";

type PopState = {
  open: boolean;
  event?: CalendarEvent;
  x: number;
  y: number;
};

interface CustomCalendarProps {
  /**
   * Pole Schedule X events na zobrazenie
   */
  events: CalendarEvent[];
  /**
   * Voliteľný callback keď sa klikne na event
   */
  onEventClick?: (event: CalendarEvent) => void;
  /**
   * Voliteľný callback pre úpravu eventu z popovers
   */
  onEditEvent?: (event: CalendarEvent) => void;
  /**
   * Voliteľný callback pre zmazanie eventu z popovers
   */
  onDeleteEvent?: (event: CalendarEvent) => void;
  /**
   * Locale pre kalendár
   */
  locale?: string;
  /**
   * Timezone
   */
  timezone?: string;
  /**
   * Definícia kalendárov s farbami
   */
  calendars?: Record<
    string,
    {
      colorName: string;
      lightColors: {
        main: string;
        container: string;
        onContainer: string;
      };
    }
  >;
}

/**
 * CustomCalendar - Reusable Schedule X komponent s popoverom
 *
 * Použitie:
 * ```tsx
 * <CustomCalendar
 *   events={scheduleXEvents}
 *   onEventClick={(event) => console.log(event)}
 *   onEditEvent={(event) => handleEdit(event)}
 * />
 * ```
 */
export const CustomCalendar: React.FC<CustomCalendarProps> = ({
  events,
  onEventClick,
  onEditEvent,
  onDeleteEvent,
  timezone = "Europe/Prague",
  calendars = {
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
}) => {
  const [pop, setPop] = useState<PopState>({ open: false, x: 0, y: 0 });
  const calendarContainerRef = useRef<HTMLDivElement>(null);
  const lastMouseEventRef = useRef<MouseEvent | null>(null);

  const closePop = useCallback(() => {
    setPop({ open: false, x: 0, y: 0 });
  }, []);

  // Sleduj všetky kliknutia v kalendári aby sme vedeli ich pozíciu
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      const inCalendar = calendarContainerRef.current?.contains(target);

      if (inCalendar) {
        // Uložíme mouse event pre prípad že sa klikne na Schedule X event
        lastMouseEventRef.current = e;
      }
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      const inCalendar = calendarContainerRef.current?.contains(target);

      // Ak sme klikli mimo kalendára - zatvoriť popover
      if (!inCalendar && pop.open) {
        closePop();
      }
    };

    document.addEventListener("mousedown", handleMouseDown, true);
    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown, true);
      document.removeEventListener("click", handleClick, true);
    };
  }, [pop.open, closePop]);

  // Univerzálny handler na klik eventu - otvor popover s pozíciou z lastMouseEventRef
  const handleEventClick = useCallback(
    (args: unknown) => {
      // Schedule X verzie môžu posielať rôzne polia
      let ev: CalendarEvent | null = null;

      if (args && typeof args === "object") {
        const argsObj = args as Record<string, unknown>;

        // Pokús sa zistiť CalendarEvent
        ev =
          (argsObj.event as CalendarEvent) ||
          (argsObj.calendarEvent as CalendarEvent) ||
          (args as CalendarEvent);
      }

      if (!ev) return;

      // Použijeme pozíciu z posledného mouse down eventu
      const mouseEvent = lastMouseEventRef.current;
      const x = mouseEvent?.clientX ?? 0;
      const y = mouseEvent?.clientY ?? 0;

      setPop({
        open: true,
        event: ev,
        x,
        y,
      });

      // Volaj voliteľný callback
      if (onEventClick) {
        onEventClick(ev);
      }
    },
    [onEventClick]
  );

  // Vytvor kalendár iba raz a updatuj eventy bez rekompilovávania
  const calendarRef = useRef<ReturnType<typeof createCalendar> | null>(null);

  if (!calendarRef.current) {
    calendarRef.current = createCalendar({
      views: [createViewWeek()],
      defaultView: "week",
      timezone: (timezone || "Europe/Prague") as never,
      calendars,
      events,
      weekOptions: { gridHeight: 720 },
      callbacks: {
        onEventClick: handleEventClick,
      },
    });
  } else {
    // Updatuj len eventy bez rekreácie kalendára
    calendarRef.current.events.set(events);
  }

  const calendar = calendarRef.current;

  return (
    <div ref={calendarContainerRef} className="relative">
      <ScheduleXCalendar calendarApp={calendar} />
      <EventPopover
        containerRef={calendarContainerRef as React.RefObject<HTMLDivElement>}
        pop={pop}
        onClose={closePop}
        onEdit={onEditEvent}
        onDelete={onDeleteEvent}
      />
    </div>
  );
};
