import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSuggestions } from "./MessageSuggestions";

interface ChatInputProps {
  messageContent: string;
  onMessageChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSend: () => void;
  sending: boolean;
  isConversationEmpty: boolean;
  isReplyToFirstMessage: boolean;
  onSendSuggestion: (message: string) => void;
  messageCount?: number;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  messageContent,
  onMessageChange,
  onSend,
  sending,
  isConversationEmpty,
  isReplyToFirstMessage,
  onSendSuggestion,
  messageCount = 0,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && messageContent.trim()) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="border-t pt-4">
      <MessageSuggestions
        onSelectMessage={onSendSuggestion}
        isConversationEmpty={isConversationEmpty}
        isReplyToFirstMessage={isReplyToFirstMessage}
        disabled={sending}
        messageCount={messageCount}
      />
      <Textarea
        placeholder="Type your message..."
        value={messageContent}
        onChange={onMessageChange}
        onKeyDown={handleKeyDown}
        rows={2}
        disabled={sending}
      />
      <div className="mt-3 flex justify-end">
        <Button
          type="button"
          onClick={onSend}
          disabled={!messageContent.trim() || sending}
        >
          {sending ? "Sending..." : "Send message"}
        </Button>
      </div>
    </div>
  );
};
