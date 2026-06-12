import React from "react";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { getDisplayName } from "@/features/pairings/utils/displayName";
import { formatDateTime } from "./ChatPairingDetailUtils";
import type { PairingContact } from "@/features/pairings/types";

interface ChatPairingHeaderProps {
  contact: PairingContact;
  onBack?: () => void;
}

export const ChatPairingHeader: React.FC<ChatPairingHeaderProps> = ({
  contact,
  onBack,
}) => {
  return (
    <CardHeader className="flex flex-row items-start justify-between gap-2 border-b pb-4">
      <div>
        <CardTitle className="text-xl">
          {getDisplayName(contact.profile)}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {contact.profile.organization} · Last message{" "}
          {formatDateTime(contact.lastMessageAt)}
        </p>
      </div>
      {onBack && (
        <Button variant="outline" size="sm" onClick={onBack}>
          Back
        </Button>
      )}
    </CardHeader>
  );
};
