import templates from "./message-templates.json";

export type ContextType = "opening" | "reply";

/**
 * Selects n unique items from an array without repetition
 */
function pickRandomUnique<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, array.length));
}

/**
 * Generates suggested messages for the chat input
 * Returns individual template strings based on context
 *
 * @param context - 'opening' for first message/reply to first, 'reply' for subsequent
 * @param count - Number of suggestions to generate (default: 3)
 * @param messagesSent - Number of messages sent in the conversation (for context-aware suggestions)
 * @returns Array of message strings from templates
 *
 * @example
 * // For an empty conversation
 * const messages = generateSuggestedMessages('opening', 3);
 * // Returns: ["Hi!", "How's it going?", "What's something you've discovered lately?"]
 *
 * @example
 * // For a reply before 3 messages
 * const messages = generateSuggestedMessages('reply', 3, 2);
 * // Returns: ["What's your favorite way to spend a weekend?", "Any hobbies you're passionate about?", "Talk soon!"]
 *
 * @example
 * // For a reply after 3+ messages (only closers)
 * const messages = generateSuggestedMessages('reply', 3, 5);
 * // Returns: ["Thanks for sharing!", "Looking forward to our next chat!", "That's great to know!"]
 */
export function generateSuggestedMessages(
  context: ContextType = "opening",
  count: number = 3,
  messagesSent: number = 0
): string[] {
  // Validate inputs
  if (!["opening", "reply"].includes(context)) {
    throw new Error(
      `Invalid context: ${context}. Must be 'opening' or 'reply'.`
    );
  }

  if (count < 1) {
    return [];
  }

  const suggestions: string[] = [];

  if (context === "opening") {
    // For opening context: greetings + openings + questions
    const allOpenings = [
      ...templates.greetings,
      ...templates.openings.general,
      ...templates.openings.work,
      ...templates.openings.personal,
    ];

    // Pick unique suggestions
    const picked = pickRandomUnique(allOpenings, count);
    suggestions.push(...picked);
  } else {
    // For reply context: check if we've sent 3+ messages
    if (messagesSent >= 3) {
      // After 3 messages: only show closers
      const picked = pickRandomUnique(templates.closers, count);
      suggestions.push(...picked);
    } else {
      // Before 3 messages: questions + closers + quick replies
      const allReplies = [
        ...templates.questions.general,
        ...templates.questions.work,
        ...templates.questions.personal,
        ...templates.closers,
        ...templates.quickReplies.acknowledgments,
        ...templates.quickReplies.answers,
      ];

      // Pick unique suggestions
      const picked = pickRandomUnique(allReplies, count);
      suggestions.push(...picked);
    }
  }

  return suggestions;
}
