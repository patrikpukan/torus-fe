import React from "react";
import { CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatMessageTime } from "./ChatPairingDetailUtils";
import type { Message } from "./ChatPairingDetailTypes";

interface ChatMessageListProps {
  messages: Message[];
  loading: boolean;
  currentUserId?: string;
  scrollRef:
    | React.RefObject<HTMLDivElement | null>
    | React.RefObject<HTMLDivElement>;
}

export const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  loading,
  currentUserId,
  scrollRef,
}) => {
  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Loading messages...
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center rounded-md border border-dashed p-6 text-sm text-muted-foreground">
        Start the conversation by sending a message.
      </div>
    );
  }

  return (
    <div
      className="flex-1 space-y-3 overflow-y-auto rounded-lg bg-muted/20 p-4"
      ref={scrollRef}
    >
      <div className="flex min-h-full flex-col justify-end gap-3">
        {messages.map((m) => {
          const isSelf = m.senderId === currentUserId;
          return (
            <div
              key={m.id}
              className={cn(
                "flex flex-col gap-1",
                isSelf ? "items-end" : "items-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[70%] rounded-2xl px-4 py-2 text-sm shadow-sm",
                  isSelf ? "bg-primary text-primary-foreground" : "bg-muted"
                )}
              >
                <p>{m.content}</p>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground">
                  {formatMessageTime(m.createdAt)}
                </span>
                {isSelf && m.isRead && (
                  <CheckCheck className="h-3 w-3 text-muted-foreground" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
