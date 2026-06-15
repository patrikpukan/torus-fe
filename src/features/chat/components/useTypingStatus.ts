import { useState, useEffect } from "react";
import { useSetTypingStatusMutation } from "@/features/chat/api/chat.api";

interface UseTypingStatusProps {
  pairingId: string | undefined;
  userId: string | undefined;
  // Latest typing event from the pairing's Supabase channel (already filtered
  // to exclude the current user; see useChatChannel).
  typingStatus: { pairingId: string; userId: string; isTyping: boolean } | null;
}

export const useTypingStatus = ({
  pairingId,
  typingStatus,
}: UseTypingStatusProps) => {
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [setTypingStatus] = useSetTypingStatusMutation();

  // Handle typing status updates from the realtime channel
  useEffect(() => {
    if (typingStatus) {
      setOtherUserTyping(typingStatus.isTyping);
    }
  }, [typingStatus]);

  // Handle typing input with debounce
  useEffect(() => {
    if (!pairingId) return;

    const timeoutId = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        setTypingStatus({ variables: { pairingId, isTyping: false } });
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [isTyping, pairingId, setTypingStatus]);

  const handleTyping = () => {
    if (!isTyping && pairingId) {
      setIsTyping(true);
      setTypingStatus({ variables: { pairingId, isTyping: true } });
    }
  };

  const stopTyping = () => {
    setIsTyping(false);
    if (pairingId) {
      setTypingStatus({ variables: { pairingId, isTyping: false } });
    }
  };

  return {
    isTyping,
    otherUserTyping,
    handleTyping,
    stopTyping,
  };
};
