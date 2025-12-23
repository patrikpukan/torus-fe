import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { generateSuggestedMessages } from "@/lib/message-composer";

interface MessageSuggestionsProps {
  /** Callback function when a suggestion is selected */
  onSelectMessage: (message: string) => void;
  /** Whether the conversation is empty (determines context) */
  isConversationEmpty: boolean;
  /** Whether this is a reply to the first message from the other user */
  isReplyToFirstMessage: boolean;
  /** Whether suggestions are currently disabled (e.g., while sending) */
  disabled?: boolean;
  /** Number of messages sent in the conversation */
  messageCount?: number;
}

/**
 * MessageSuggestions Component
 *
 * Displays 3 contextually appropriate message suggestions for the user to choose from.
 * Automatically determines whether to use 'opening' or 'reply' context based on
 * conversation state.
 *
 * Features:
 * - Automatic context detection (opening vs reply)
 * - Intelligently combines suggested messages and quick replies into single set
 * - Regenerates suggestions after each selection
 * - Prevents repetition within the same set
 * - Manual refresh button to regenerate without sending
 * - Responsive button layout
 * - Accessible keyboard navigation
 */
export const MessageSuggestions: React.FC<MessageSuggestionsProps> = ({
  onSelectMessage,
  isConversationEmpty,
  isReplyToFirstMessage,
  disabled = false,
  messageCount = 0,
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  /**
   * Determines the context for message generation
   */
  const getContext = (): "opening" | "reply" => {
    return isConversationEmpty || isReplyToFirstMessage ? "opening" : "reply";
  };

  // Initialize suggestions on mount or when context changes
  useEffect(() => {
    const context =
      isConversationEmpty || isReplyToFirstMessage ? "opening" : "reply";
    const newSuggestions = generateSuggestedMessages(context, 3, messageCount);
    setSuggestions(newSuggestions);
  }, [isConversationEmpty, isReplyToFirstMessage, messageCount]);

  /**
   * Generates new suggestions
   */
  const generateNewSuggestions = () => {
    const context = getContext();
    const newSuggestions = generateSuggestedMessages(context, 3, messageCount);
    setSuggestions(newSuggestions);
  };

  /**
   * Handles suggestion button click
   */
  const handleSuggestionClick = (message: string) => {
    onSelectMessage(message);
    // Regenerate suggestions for next use
    generateNewSuggestions();
  };

  /**
   * Handles manual refresh button click
   */
  const handleRefresh = (e: React.MouseEvent) => {
    e.preventDefault();
    generateNewSuggestions();
  };

  return (
    <div className="mb-3 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Suggested messages
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          disabled={disabled}
          className="h-6 w-6 p-0"
          title="Refresh suggestions"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleSuggestionClick(suggestion)}
            disabled={disabled}
            className="h-auto max-w-xs whitespace-normal py-2 px-3 text-left text-xs leading-relaxed hover:bg-accent hover:text-accent-foreground"
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  );
};
