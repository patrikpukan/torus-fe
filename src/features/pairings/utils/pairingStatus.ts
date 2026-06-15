/**
 * Human-readable labels for pairing / meeting statuses. The backend uses
 * lowercase snake_case enum values (planned, met, not_met, not_planned,
 * unspecified, cancelled, matched); surface them as natural language in the UI.
 */
const STATUS_LABELS: Record<string, string> = {
  planned: "Planned",
  matched: "Matched",
  met: "Met",
  not_met: "Not met",
  not_planned: "Not planned",
  unspecified: "Unspecified",
  cancelled: "Cancelled",
};

/**
 * Maps a status value to its display label. Unknown values fall back to a
 * title-cased, de-underscored version so nothing renders as raw snake_case.
 */
export const formatPairingStatus = (status?: string | null): string => {
  if (!status) return "";
  const known = STATUS_LABELS[status];
  if (known) return known;
  return status
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};
