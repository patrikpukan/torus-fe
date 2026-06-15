import React from "react";
import { Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  onInsertEmoji?: (text: string) => void;
}

const EMOJIS = [
  "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🙂",
  "😉", "😊", "😍", "😘", "😎", "🤔", "🙃", "😴",
  "😢", "😭", "😡", "😮", "😱", "🤯", "🥳", "😇",
  "👍", "👎", "👏", "🙏", "🙌", "👌", "✌️", "🤝",
  "💪", "🎉", "🎊", "🔥", "✨", "⭐", "💡", "✅",
  "❤️", "🧡", "💛", "💚", "💙", "💜", "💯", "👀",
  "☕", "📅", "📌", "📎", "💬", "📞", "🚀", "🎯",
];

export const ChatInput: React.FC<ChatInputProps> = ({
  messageContent,
  onMessageChange,
  onSend,
  sending,
  isConversationEmpty,
  isReplyToFirstMessage,
  onSendSuggestion,
  messageCount = 0,
  onInsertEmoji,
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
      <div className="mt-3 flex items-center justify-end gap-2">
        {onInsertEmoji && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Insert emoji"
                disabled={sending}
              >
                <Smile className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-64">
              <div className="grid grid-cols-8 gap-1">
                {EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    aria-label={`Insert ${emoji}`}
                    onClick={() => onInsertEmoji(emoji)}
                    className="flex h-8 w-8 items-center justify-center rounded-md text-lg transition hover:bg-muted"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}
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
