import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatInputProps {
  messageContent: string;
  onMessageChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSend: () => void;
  sending: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  messageContent,
  onMessageChange,
  onSend,
  sending,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && messageContent.trim()) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="border-t pt-4">
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

