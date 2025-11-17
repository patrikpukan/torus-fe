export type UserProfile = {
  organization?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  accountStatus?: string;
  pairingStatus?: string;
  about?: string;
  hobbies?: string[] | string;
  interests?: string;
  preferredActivity?: string;
  profileImageUrl?: string;
  isActive?: boolean;
  organizationId?: string;
};
