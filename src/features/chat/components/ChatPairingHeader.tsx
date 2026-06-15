import React, { useState } from "react";
import { Info } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReadOnlyUserCalendar from "@/features/calendar/ReadOnlyUserCalendar";
import MeetingBanner from "@/features/meetings/MeetingBanner";
import MeetingProposalModal from "@/features/meetings/MeetingProposalModal";
import {
  getDisplayName,
  getInitials,
} from "@/features/pairings/utils/displayName";
import ProfileForm from "@/features/profile/ProfileForm";
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
  const [infoOpen, setInfoOpen] = useState(false);
  const [proposalOpen, setProposalOpen] = useState(false);

  const pairingId = contact.pairingId || contact.id;
  const displayName = getDisplayName(contact.profile);

  return (
    <CardHeader className="flex flex-row items-center justify-between gap-2 border-b pb-4">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={contact.profile.profileImageUrl || undefined} />
          <AvatarFallback>{getInitials(contact.profile)}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-xl">{displayName}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {contact.profile.organization} · Last message{" "}
            {formatDateTime(contact.lastMessageAt)}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {onBack && (
          <Button variant="outline" size="sm" onClick={onBack}>
            Back
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          aria-label="View profile and calendar"
          onClick={() => setInfoOpen(true)}
        >
          <Info className="h-5 w-5" />
        </Button>
      </div>

      <Sheet open={infoOpen} onOpenChange={setInfoOpen}>
        <SheetContent
          side="right"
          className="flex w-full flex-col overflow-hidden sm:max-w-md"
        >
          <SheetHeader>
            <SheetTitle>{displayName}</SheetTitle>
          </SheetHeader>
          <Tabs
            defaultValue="profile"
            className="mt-4 flex flex-1 flex-col overflow-hidden"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
            </TabsList>
            <TabsContent
              value="profile"
              className="mt-4 flex-1 overflow-y-auto"
            >
              <ProfileForm value={contact.profile} readOnly />
            </TabsContent>
            <TabsContent
              value="calendar"
              className="mt-4 flex-1 overflow-y-auto"
            >
              <MeetingBanner
                pairingId={pairingId}
                otherUserName={displayName}
              />
              <ReadOnlyUserCalendar
                userId={contact.id}
                pairingId={pairingId}
                otherUserName={displayName}
              />
              <div className="mt-4">
                <Button onClick={() => setProposalOpen(true)}>
                  Propose meeting
                </Button>
              </div>
              <MeetingProposalModal
                open={proposalOpen}
                onOpenChange={setProposalOpen}
                otherUserId={contact.id ?? ""}
                pairingId={pairingId}
              />
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>
    </CardHeader>
  );
};
