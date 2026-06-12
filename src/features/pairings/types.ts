import type { UserProfile } from "@/types/User";

export type PairingMessageAuthor = "self" | "contact";

export type PairingMessage = {
  id: string;
  author: PairingMessageAuthor;
  content: string;
  timestamp: string;
};

export type PairingContact = {
  id: string;
  profile: UserProfile;
  pairedAt: string;
  lastMessageAt: string;
  messages: PairingMessage[];
  pairingId?: string;
  pairingStatus?: string;
  isCurrentlyMatched?: boolean;
};
