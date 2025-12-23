import { useRef, useLayoutEffect } from "react";
import type { Message } from "./ChatPairingDetailTypes";

interface UseScrollProps {
  messages: Message[];
  otherUserTyping: boolean;
}

export const useScroll = ({ messages, otherUserTyping }: UseScrollProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages or typing status
  useLayoutEffect(() => {
    if (scrollRef.current) {
      requestAnimationFrame(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      });
    }
  }, [messages, otherUserTyping]);

  return scrollRef;
};
