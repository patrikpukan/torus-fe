import { useState, useEffect } from "react";
import {
  useSetTypingStatusMutation,
  useTypingStatusSubscription,
} from "@/features/chat/graphql/chat.operations";

interface UseTypingStatusProps {
  pairingId: string | undefined;
  userId: string | undefined;
}

export const useTypingStatus = ({
  pairingId,
  userId,
}: UseTypingStatusProps) => {
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [setTypingStatus] = useSetTypingStatusMutation();

  const { data: typingData } = useTypingStatusSubscription(
    pairingId || "",
    userId || ""
  );

  // Handle typing status updates
  useEffect(() => {
    if (typingData?.typingStatus) {
      setOtherUserTyping(typingData.typingStatus.isTyping);
    }
  }, [typingData]);

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
