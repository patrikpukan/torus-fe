import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { generateQuickReplies } from "@/lib/quick-replies";

interface QuickRepliesProps {
  /** The sender's name to personalize acknowledgments */
  senderName: string;
  /** Callback when a quick reply is selected */
  onSelectReply: (reply: string) => void;
  /** Number of suggestions to show (default: 3) */
  count?: number;
  /** Whether replies are disabled */
  disabled?: boolean;
}

/**
 * QuickReplies Component
 *
 * Displays contextual quick reply suggestions below messages
 * Similar to LinkedIn's quick reply feature
 *
 * Features:
 * - Personalized acknowledgments with sender's name
 * - Quick answers to common questions
 * - Compact horizontal layout
 * - Direct send on click
 */
export const QuickReplies: React.FC<QuickRepliesProps> = ({
  senderName,
  onSelectReply,
  count = 3,
  disabled = false,
}) => {
  const [replies, setReplies] = useState<string[]>([]);

  useEffect(() => {
    const generated = generateQuickReplies(senderName, count);
    setReplies(generated);
  }, [senderName, count]);

  if (replies.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {replies.map((reply, index) => (
        <Button
          key={index}
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onSelectReply(reply)}
          disabled={disabled}
          className="h-7 px-3 text-xs whitespace-nowrap hover:bg-accent hover:text-accent-foreground"
        >
          {reply}
        </Button>
      ))}
    </div>
  );
};
