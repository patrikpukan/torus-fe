export type UserProfile = {
  organization?: string;
  email: string;
  name?: string;
  surname?: string;
  accountStatus?: string;
  pairingStatus?: string;
  about?: string;
  hobbies?: string[] | string;
  meetingActivity?: string;
  interests?: string;
  username?: string;
  displayUsername?: string;
  profileImageUrl?: string;
  isActive?: boolean;
  organizationId?: string;
};
