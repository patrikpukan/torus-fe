import type { PairingContact } from "@/mocks/mockPairings";

export interface Message {
  id: string;
  senderId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export type PairingDetailProps = {
  contact: PairingContact | undefined;
  onBack?: () => void; // for mobile
};

