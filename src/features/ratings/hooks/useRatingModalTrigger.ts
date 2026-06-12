import { useState, useEffect, useCallback, useRef } from "react";
import type { UnratedMeeting } from "../api/useUnratedMeetingsQuery";
import { useUnratedMeetingsQuery } from "../api/useUnratedMeetingsQuery";

const SESSION_STORAGE_KEY = "ratingModal_shownMeetings";

const getShownMeetings = (): Set<string> => {
  try {
    const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
    return new Set(stored ? JSON.parse(stored) : []);
  } catch {
    return new Set();
  }
};

const saveShownMeetings = (shown: Set<string>) => {
  try {
    sessionStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify(Array.from(shown))
    );
  } catch {
    // Silently fail if sessionStorage unavailable
  }
};

export const useRatingModalTrigger = () => {
  const { data } = useUnratedMeetingsQuery();
  const [queue, setQueue] = useState<UnratedMeeting[]>([]);
  const [currentMeeting, setCurrentMeeting] = useState<UnratedMeeting | null>(
    null
  );
  const [isOpen, setIsOpen] = useState(false);
  const [shownMeetings, setShownMeetings] = useState<Set<string>>(() =>
    getShownMeetings()
  );
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Build queue of unrated meetings that haven't been shown yet
  useEffect(() => {
    if (!data?.unratedMeetings) return;

    const newUnrated = data.unratedMeetings.filter(
      (m) => !shownMeetings.has(m.id)
    );

    if (newUnrated.length > 0 && queue.length === 0 && !currentMeeting) {
      setQueue(newUnrated);
      // Show the first one immediately
      setCurrentMeeting(newUnrated[0]);
      setIsOpen(true);
    }
  }, [data?.unratedMeetings, shownMeetings, currentMeeting, queue.length]);

  const handleClose = useCallback(() => {
    // "Remind me later": silence the whole queue for this browser session
    // (sessionStorage is ephemeral, so the prompt returns next session).
    const updated = new Set(shownMeetings);
    if (currentMeeting) updated.add(currentMeeting.id);
    for (const m of queue) updated.add(m.id);
    setShownMeetings(updated);
    saveShownMeetings(updated);

    setIsOpen(false);
    setCurrentMeeting(null);
    setQueue([]);
  }, [currentMeeting, queue, shownMeetings]);

  const handleSuccess = useCallback(() => {
    if (currentMeeting) {
      const updated = new Set(shownMeetings);
      updated.add(currentMeeting.id);
      setShownMeetings(updated);
      saveShownMeetings(updated);
    }

    setCurrentMeeting(null);
    setIsOpen(false);

    // Show next after delay if there are more in the queue
    setQueue((prev) => {
      const remaining = prev.slice(1);
      if (remaining.length > 0) {
        timeoutRef.current = setTimeout(() => {
          setCurrentMeeting(remaining[0]);
          setIsOpen(true);
        }, 3000);
      }
      return remaining;
    });
  }, [currentMeeting, shownMeetings]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return {
    meeting: currentMeeting,
    isOpen,
    onClose: handleClose,
    onSuccess: handleSuccess,
    hasMore: queue.length > 1,
  };
};
