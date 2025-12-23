import templates from "./message-templates.json";

/**
 * Generates quick reply suggestions for responding to messages
 * Similar to LinkedIn quick replies
 */
function pickRandomUnique<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, array.length));
}

/**
 * Generates quick reply suggestions
 * Includes acknowledgments and contextual answers
 *
 * @param userName - Name of the person to address in acknowledgments
 * @param count - Number of suggestions to generate (default: 4)
 * @returns Array of quick reply strings
 *
 * @example
 * const replies = generateQuickReplies("John", 4);
 * // Returns: ["Thanks John! 👍", "That's a great question!", "Absolutely! ✅", "I'm really into tech lately"]
 */
export function generateQuickReplies(
  userName: string,
  count: number = 4
): string[] {
  // Pool from different reply types
  const acknowledgments = templates.quickReplies.acknowledgments;
  const answers = templates.quickReplies.answers;

  const allReplies = [...acknowledgments, ...answers];
  const picked = pickRandomUnique(allReplies, count);

  // Replace {{name}} placeholder
  return picked.map((reply) => reply.replace("{{name}}", userName));
}

/**
 * Gets just the acknowledgment quick replies
 */
export function getAcknowledgmentReplies(
  userName: string,
  count: number = 2
): string[] {
  const picked = pickRandomUnique(
    templates.quickReplies.acknowledgments,
    count
  );
  return picked.map((reply) => reply.replace("{{name}}", userName));
}

/**
 * Gets answer-based quick replies
 */
export function getAnswerReplies(count: number = 2): string[] {
  return pickRandomUnique(templates.quickReplies.answers, count);
}
