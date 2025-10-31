import type { UserProfile } from "@/types/User";

/**
 * Get display name for a user profile.
 * Returns full name if available, otherwise falls back to email.
 */
export function getDisplayName(profile: UserProfile): string {
  const firstName = profile.firstName?.trim();
  const lastName = profile.lastName?.trim();

  // If we have both names, return full name
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }

  // If we have only one name, return it
  if (firstName) return firstName;
  if (lastName) return lastName;

  // Fall back to email
  return profile.email || "Unknown";
}

/**
 * Get initials for a user profile.
 * Returns first letter of first and last name, or falls back to email initials.
 */
export function getInitials(profile: UserProfile): string {
  const firstName = profile.firstName?.trim();
  const lastName = profile.lastName?.trim();

  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  }

  if (firstName) return firstName[0].toUpperCase();
  if (lastName) return lastName[0].toUpperCase();

  // Fall back to email initials
  const email = profile.email || "";
  return email.slice(0, 2).toUpperCase();
}
