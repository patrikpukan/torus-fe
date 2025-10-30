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
  profileImageUrl?: string;
  isActive?: boolean;
  organizationId?: string;
};
