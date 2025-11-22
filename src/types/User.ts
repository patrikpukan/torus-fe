export type TagObject = {
  id: string;
  name: string;
  category: "HOBBY" | "INTEREST";
};

export type UserProfile = {
  organization?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  accountStatus?: string;
  pairingStatus?: string;
  about?: string;
  location?: string;
  position?: string;
  hobbies?: TagObject[] | null;
  interests?: TagObject[] | null;
  preferredActivity?: string;
  profileImageUrl?: string;
  isActive?: boolean;
  organizationId?: string;
  departmentId?: string | null;
};
