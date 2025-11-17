/**
 * Mapping of role values to human-readable display labels
 */
const ROLE_LABELS: Record<string, string> = {
  user: "Member",
  org_admin: "Organization Admin",
  org_member: "Member", // fallback for potential legacy data
  super_admin: "System Admin",
};

/**
 * Get human-readable label for a role value
 * @param role - The role value (e.g., 'org_admin', 'user', 'super_admin')
 * @returns The display label for the role
 */
export const getRoleLabel = (role: string): string => {
  return ROLE_LABELS[role] || role;
};

/**
 * Get all available role options for UI dropdowns
 * @returns Array of role options with value and label
 */
export const getRoleOptions = (): Array<{ value: string; label: string }> => [
  { value: "user", label: "Member" },
  { value: "org_admin", label: "Organization Admin" },
  { value: "super_admin", label: "System Admin" },
];
