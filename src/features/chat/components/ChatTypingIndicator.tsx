import React from "react";
import { getDisplayName } from "@/features/pairings/utils/displayName";
import type { PairingContact } from "@/mocks/mockPairings";

interface ChatTypingIndicatorProps {
  isTyping: boolean;
  contact: PairingContact;
}

export const ChatTypingIndicator: React.FC<ChatTypingIndicatorProps> = ({
  isTyping,
  contact,
}) => {
  if (!isTyping) return null;

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse px-1">
      <div className="flex gap-1">
        <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></span>
        <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></span>
        <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"></span>
      </div>
      {getDisplayName(contact.profile)} is typing...
    </div>
  );
};

