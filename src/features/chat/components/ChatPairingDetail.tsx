import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReadOnlyUserCalendar from "@/features/calendar/ReadOnlyUserCalendar";
import MeetingBanner from "@/features/meetings/MeetingBanner";
import MeetingProposalModal from "@/features/meetings/MeetingProposalModal";
import { getDisplayName } from "@/features/pairings/utils/displayName";
import ProfileForm from "@/features/profile/ProfileForm";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ChatInput } from "./ChatInput";
import { ChatMessageList } from "./ChatMessageList";
import type { PairingDetailProps } from "./ChatPairingDetailTypes";
import { ChatPairingHeader } from "./ChatPairingHeader";
import { ChatTypingIndicator } from "./ChatTypingIndicator";
import { useChatPairing } from "./useChatPairing";

export default function PairingDetail({ contact, onBack }: PairingDetailProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("chat");
  const [proposalOpen, setProposalOpen] = useState(false);

  // Get contact identifier for detecting contact changes
  const contactIdentifier = contact?.pairingId || contact?.id;

  // Reset active tab only when contact actually changes (different contact ID)
  useEffect(() => {
    // If switching to a new contact (not the same contact), reset to chat tab
    // This prevents losing tab state when just updating the same contact
    setActiveTab("chat");
  }, [contactIdentifier]);

  const {
    messages,
    messageContent,
    otherUserTyping,
    messagesLoading,
    sendingMessage,
    scrollRef,
    handleInputChange,
    handleSendMessage,
    sendMessageDirect,
  } = useChatPairing({ contact, activeTab });

  const pairingId = contact?.pairingId || contact?.id;

  // Determine conversation state for message suggestions
  const isConversationEmpty = messages.length === 0;
  const isReplyToFirstMessage =
    messages.length === 1 && messages[0]?.senderId !== user?.id;
  const messageCount = messages.length;

  return (
    <Card className="flex flex-col h-full">
      {contact ? (
        <>
          <ChatPairingHeader contact={contact} onBack={onBack} />
          <CardContent className="flex flex-1 flex-col overflow-hidden p-0">
            <Tabs
              key={contact?.id}
              defaultValue="chat"
              onValueChange={setActiveTab}
              className="flex flex-col h-full"
            >
              <div className="border-b px-6 pt-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="chat">Chat</TabsTrigger>
                  <TabsTrigger value="profile">User profile</TabsTrigger>
                  <TabsTrigger value="calendar">User calendar</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent
                value="chat"
                className={cn(
                  "mt-0 flex flex-1 flex-col overflow-hidden px-6 py-4",
                  activeTab !== "chat" && "hidden"
                )}
              >
                <div className="flex h-full flex-col gap-4">
                  <ChatMessageList
                    messages={messages}
                    loading={messagesLoading}
                    currentUserId={user?.id}
                    scrollRef={scrollRef}
                  />
                  <ChatTypingIndicator
                    isTyping={otherUserTyping}
                    contact={contact}
                  />
                  <ChatInput
                    messageContent={messageContent}
                    onMessageChange={handleInputChange}
                    onSend={handleSendMessage}
                    sending={sendingMessage}
                    isConversationEmpty={isConversationEmpty}
                    isReplyToFirstMessage={isReplyToFirstMessage}
                    onSendSuggestion={sendMessageDirect}
                    messageCount={messageCount}
                  />
                </div>
              </TabsContent>

              <TabsContent
                value="profile"
                className="mt-0 max-h-full flex-1 overflow-y-scroll dis px-12 py-6"
              >
                <div className="relative">
                  <ProfileForm value={contact.profile} readOnly />
                </div>
              </TabsContent>

              <TabsContent
                value="calendar"
                className="mt-0 flex-1 overflow-y-scroll px-6 py-4"
              >
                <MeetingBanner
                  pairingId={pairingId}
                  otherUserName={getDisplayName(contact.profile)}
                />
                <ReadOnlyUserCalendar
                  userId={contact?.id}
                  pairingId={pairingId}
                  otherUserName={getDisplayName(contact.profile)}
                />
                <div className="mt-4">
                  <Button onClick={() => setProposalOpen(true)}>
                    Propose meeting
                  </Button>
                </div>
                <MeetingProposalModal
                  open={proposalOpen}
                  onOpenChange={setProposalOpen}
                  otherUserId={contact?.id ?? ""}
                  pairingId={pairingId}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </>
      ) : (
        <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
          Select a contact to display details.
        </div>
      )}
    </Card>
  );
}
