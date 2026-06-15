import type { UserProfile } from "@/types/User.ts";

export type ProfileFormValues = UserProfile & {
  preferredActivity?: string | null;
  profileImageUrl?: string | null;
  about?: string | null;
  location?: string | null;
  position?: string | null;
};

export const normalizeProfile = (profile: UserProfile): ProfileFormValues => ({
  ...profile,
  firstName: profile.firstName ?? "",
  lastName: profile.lastName ?? "",
  about: profile.about ?? "",
  location: profile.location ?? "",
  position: profile.position ?? "",
  preferredActivity: profile.preferredActivity ?? "",
  profileImageUrl: profile.profileImageUrl ?? "",
  organization: profile.organization ?? "",
  accountStatus: profile.accountStatus ?? "",
  pairingStatus: profile.pairingStatus ?? "",
  hobbies: Array.isArray(profile.hobbies) ? profile.hobbies : [],
  interests: Array.isArray(profile.interests) ? profile.interests : [],
  departmentId: profile.departmentId ?? null,
  hiddenFromDirectory: profile.hiddenFromDirectory ?? false,
});

export const buildProfilePayload = (
  values: ProfileFormValues,
  prev: UserProfile
): UserProfile => ({
  ...prev,
  ...values,
  firstName: values.firstName?.trim() || undefined,
  lastName: values.lastName?.trim() || undefined,
  about: values.about?.trim() || undefined,
  location: values.location?.trim() || undefined,
  position: values.position?.trim() || undefined,
  preferredActivity: values.preferredActivity?.trim() || undefined,
  // Preserve profileImageUrl if it exists (even if empty string, let backend handle it)
  // Only set to undefined if it's explicitly null or empty after trimming
  profileImageUrl:
    values.profileImageUrl && values.profileImageUrl.trim()
      ? values.profileImageUrl.trim()
      : undefined,
  hobbies: Array.isArray(values.hobbies) ? values.hobbies : [],
  interests: Array.isArray(values.interests) ? values.interests : [],
  departmentId: values.departmentId ?? null,
  hiddenFromDirectory: values.hiddenFromDirectory ?? false,
});
