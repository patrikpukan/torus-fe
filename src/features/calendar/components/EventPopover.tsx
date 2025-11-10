import React, { useEffect, useRef, useCallback } from "react";
import { type CalendarEvent } from "@schedule-x/calendar";
import { Button } from "@/components/ui/button";

type PopState = {
  open: boolean;
  event?: CalendarEvent;
  x: number;
  y: number;
};

interface EventPopoverProps {
  containerRef: React.RefObject<HTMLDivElement>;
  pop: PopState;
  onClose: () => void;
  onEdit?: (event: CalendarEvent) => void;
  onDelete?: (event: CalendarEvent) => void;
  isEditVisible?: (event: CalendarEvent) => boolean;
  isDeleteVisible?: (event: CalendarEvent) => boolean;
}

const clamp = (val: number, min: number, max: number) =>
  Math.min(Math.max(val, min), max);

/**
 * Formátuje Temporal ZonedDateTime alebo iný čas objekt na čitateľný reťazec
 */
const formatTime = (timeObj: unknown): string => {
  try {
    if (
      timeObj &&
      typeof timeObj === "object" &&
      "toLocaleString" in timeObj &&
      typeof (timeObj as Record<string, unknown>).toLocaleString === "function"
    ) {
      return (
        (timeObj as Record<string, unknown>).toLocaleString as (
          locale: string,
          options: Record<string, string>
        ) => string
      )("sk-SK", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    }
    return String(timeObj);
  } catch {
    return String(timeObj);
  }
};

export const EventPopover: React.FC<EventPopoverProps> = ({
  containerRef,
  pop,
  onClose,
  onEdit,
  onDelete,
  isEditVisible,
  isDeleteVisible,
}) => {
  const popRef = useRef<HTMLDivElement>(null);

  // Zatvoriť na ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Zatvoriť na klik mimo
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!pop.open) return;
      const target = e.target as Node;
      if (popRef.current && !popRef.current.contains(target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [pop.open, onClose]);

  // Zavolaj handleEdit callback
  const handleEdit = useCallback(() => {
    if (onEdit && pop.event) {
      onEdit(pop.event);
    }
  }, [onEdit, pop.event]);

  // Zavolaj handleDelete callback
  const handleDelete = useCallback(() => {
    if (onDelete && pop.event) {
      onDelete(pop.event);
    }
  }, [onDelete, pop.event]);

  if (!pop.open || !pop.event) return null;

  const containerRect = containerRef.current?.getBoundingClientRect();
  const cx = containerRect?.left ?? 0;
  const cy = containerRect?.top ?? 0;
  const cw = containerRect?.width ?? 0;
  const ch = containerRect?.height ?? 0;

  const PADDING = 8; // malý offset od kurzora
  const POPOVER_W = 280; // odhad šírky
  const POPOVER_H = 160; // odhad výšky

  // Pozícia kurzora -> relatívne ku kontajneru + clamp dovnútra
  const left = clamp(pop.x - cx + PADDING, 0, Math.max(0, cw - POPOVER_W));
  const top = clamp(pop.y - cy + PADDING, 0, Math.max(0, ch - POPOVER_H));

  return (
    <div
      ref={popRef}
      role="dialog"
      aria-label="Event details"
      className="absolute z-50 rounded-lg border border-gray-200 bg-white p-3 shadow-xl w-[280px] select-text"
      style={{ left, top }}
    >
      <div className="mb-1 text-sm font-semibold line-clamp-2">
        {pop.event.title || "Untitled event"}
      </div>

      <div className="space-y-1 text-xs text-muted-foreground">
        <div>
          <span className="font-medium">Start:</span>{" "}
          {formatTime(pop.event.start)}
        </div>
        <div>
          <span className="font-medium">End:</span> {formatTime(pop.event.end)}
        </div>
        {pop.event.calendarId && (
          <div>
            <span className="font-medium">Type:</span>{" "}
            {pop.event.calendarId === "available" ? "Available" : "Unavailable"}
          </div>
        )}
      </div>

      <div className="mt-3 flex gap-2">
        {onEdit && (!isEditVisible || isEditVisible(pop.event)) && (
          <Button size="sm" onClick={handleEdit}>
            Edit
          </Button>
        )}
        {onDelete && (!isDeleteVisible || isDeleteVisible(pop.event)) && (
          <Button size="sm" variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        )}
        <Button size="sm" variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
};
