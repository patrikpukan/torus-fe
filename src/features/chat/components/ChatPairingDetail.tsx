import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import ReadOnlyUserCalendar from "@/features/calendar/ReadOnlyUserCalendar";
import ProfileForm from "@/features/profile/ProfileForm";
import MeetingProposalModal from "@/features/meetings/MeetingProposalModal";
import MeetingBanner from "@/features/meetings/MeetingBanner";
import { cn } from "@/lib/utils";
import type { PairingContact } from "@/mocks/mockPairings";
import { getDisplayName } from "@/features/pairings/utils/displayName";
import { useAuth } from "@/hooks/useAuth";
import { CheckCheck } from "lucide-react";
import {
  useGetMessagesQuery,
  useSendMessageMutation,
  useMessageSentSubscription,
  useSetTypingStatusMutation,
  useTypingStatusSubscription,
  useMarkMessagesAsReadMutation,
  useMessagesReadSubscription,
} from "@/features/chat/graphql/chat.operations";

export type PairingDetailProps = {
  contact: PairingContact | undefined;
  onBack?: () => void; // for mobile
};

const formatDateTime = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleString([], {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

const formatMessageTime = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

interface Message {
  id: string;
  senderId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export default function PairingDetail({ contact, onBack }: PairingDetailProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("chat");
  const [proposalOpen, setProposalOpen] = useState(false);
  const [messageContent, setMessageContent] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Get pairingId from contact or use contact id as fallback
  const pairingId = contact?.pairingId || contact?.id;

  // Log pairing ID for debugging
  console.log(
    "ChatPairingDetail - pairingId:",
    pairingId,
    "contact:",
    contact?.id
  );

  // Fetch messages
  const {
    data: messagesData,
    loading: messagesLoading,
    error: messagesError,
  } = useGetMessagesQuery(pairingId || "");

  // Log query status
  console.log(
    "Messages query - loading:",
    messagesLoading,
    "error:",
    messagesError,
    "data:",
    messagesData
  );

  // Send message mutation
  const [sendMessage, { loading: sendingMessage, error: sendError }] =
    useSendMessageMutation();

  // Typing status mutation
  const [setTypingStatus] = useSetTypingStatusMutation();

  // Mark as read mutation
  const [markMessagesAsRead] = useMarkMessagesAsReadMutation();

  // Subscribe to new messages
  const {
    data: subscriptionData,
    error: subscriptionError,
    loading: subscriptionLoading,
  } = useMessageSentSubscription(pairingId || "");

  // Subscribe to typing status
  const { data: typingData } = useTypingStatusSubscription(
    pairingId || "",
    user?.id || ""
  );

  // Subscribe to read receipts
  const { data: readReceiptData } = useMessagesReadSubscription(
    pairingId || "",
    user?.id || ""
  );

  console.log(
    "Subscription - loading:",
    subscriptionLoading,
    "error:",
    subscriptionError,
    "data:",
    subscriptionData
  );
  useEffect(() => {
    if (messagesData?.getMessages) {
      setMessages(messagesData.getMessages);
      // Mark messages as read when loaded if chat is active
      if (pairingId && activeTab === "chat") {
        markMessagesAsRead({ variables: { pairingId } });
      }
    }
  }, [messagesData, pairingId, markMessagesAsRead, activeTab]);

  // Add new message from subscription
  useEffect(() => {
    if (subscriptionData?.messageSent) {
      setMessages((prev) => {
        // Avoid duplicates
        if (prev.find((m) => m.id === subscriptionData.messageSent.id)) {
          return prev;
        }
        return [...prev, subscriptionData.messageSent];
      });

      // Mark as read if it's from the other user and chat is active
      if (
        pairingId &&
        subscriptionData.messageSent.senderId !== user?.id &&
        activeTab === "chat"
      ) {
        markMessagesAsRead({ variables: { pairingId } });
      }
    }
  }, [subscriptionData, pairingId, user?.id, markMessagesAsRead, activeTab]);

  // Mark as read when switching to chat tab
  useEffect(() => {
    if (activeTab === "chat" && pairingId) {
      markMessagesAsRead({ variables: { pairingId } });
    }
  }, [activeTab, pairingId, markMessagesAsRead]);

  // Handle typing status updates
  useEffect(() => {
    if (typingData?.typingStatus) {
      setOtherUserTyping(typingData.typingStatus.isTyping);
    }
  }, [typingData]);

  // Reset active tab when contact changes
  useEffect(() => {
    setActiveTab("chat");
  }, [contact?.id]);

  // Handle read receipts
  useEffect(() => {
    if (readReceiptData?.messagesRead) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.senderId === user?.id ? { ...msg, isRead: true } : msg
        )
      );
    }
  }, [readReceiptData, user?.id]);

  // Scroll to bottom on new messages or typing status
  useLayoutEffect(() => {
    if (scrollRef.current) {
      // Use requestAnimationFrame to ensure the DOM is fully updated and layout is calculated
      requestAnimationFrame(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      });
    }
  }, [messages, otherUserTyping, activeTab]);

  // Handle typing input with debounce
  useEffect(() => {
    if (!pairingId) return;

    const timeoutId = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        setTypingStatus({ variables: { pairingId, isTyping: false } });
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [messageContent, pairingId, isTyping, setTypingStatus]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageContent(e.target.value);
    if (!isTyping && pairingId) {
      setIsTyping(true);
      setTypingStatus({ variables: { pairingId, isTyping: true } });
    }
  };

  const handleSendMessage = async () => {
    if (!messageContent.trim() || !pairingId) {
      console.warn("Cannot send message - content empty or no pairingId", {
        messageContent: messageContent.trim(),
        pairingId,
      });
      return;
    }

    try {
      console.log("Sending message:", { pairingId, content: messageContent });
      const result = await sendMessage({
        variables: {
          input: {
            pairingId,
            content: messageContent,
          },
        },
      });
      console.log("Message sent successfully:", result);
      setMessageContent("");
      setIsTyping(false);
      setTypingStatus({ variables: { pairingId, isTyping: false } });
    } catch (error) {
      console.error("Failed to send message:", error);
      if (sendError) {
        console.error("Mutation error:", sendError);
      }
    }
  };

  return (
    <Card className="flex flex-col h-full">
      {contact ? (
        <>
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
          <CardContent className="flex flex-1 flex-col overflow-hidden p-0">
            <Tabs
              key={contact?.id}
              defaultValue="chat"
              onValueChange={setActiveTab}
              className={cn(
                "flex flex-col",
                activeTab === "chat" ? "h-full" : ""
              )}
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
                  <div
                    className="flex-1 space-y-3 overflow-y-auto rounded-lg bg-muted/20 p-4"
                    ref={scrollRef}
                  >
                    <div className="flex min-h-full flex-col justify-end gap-3">
                      {messagesLoading ? (
                        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                          Loading messages...
                        </div>
                      ) : messages.length ? (
                        messages.map((m) => {
                          const isSelf = m.senderId === user?.id;
                          return (
                            <div
                              key={m.id}
                              className={cn(
                                "flex flex-col gap-1",
                                isSelf ? "items-end" : "items-start"
                              )}
                            >
                              <div
                                className={cn(
                                  "max-w-[70%] rounded-2xl px-4 py-2 text-sm shadow-sm",
                                  isSelf
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted"
                                )}
                              >
                                <p>{m.content}</p>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-muted-foreground">
                                  {formatMessageTime(m.createdAt)}
                                </span>
                                {isSelf && m.isRead && (
                                  <CheckCheck className="h-3 w-3 text-muted-foreground" />
                                )}
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="flex h-full items-center justify-center rounded-md border border-dashed p-6 text-sm text-muted-foreground">
                          Start the conversation by sending a message.
                        </div>
                      )}
                    </div>
                  </div>
                  {otherUserTyping && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse px-1">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"></span>
                      </div>
                      {getDisplayName(contact.profile)} is typing...
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <Textarea
                      placeholder="Type your message..."
                      value={messageContent}
                      onChange={handleInputChange}
                      onKeyDown={(e) => {
                        if (
                          e.key === "Enter" &&
                          e.ctrlKey &&
                          messageContent.trim()
                        ) {
                          handleSendMessage();
                        }
                      }}
                      rows={3}
                      disabled={sendingMessage}
                    />
                    <div className="mt-3 flex justify-end">
                      <Button
                        type="button"
                        onClick={handleSendMessage}
                        disabled={!messageContent.trim() || sendingMessage}
                      >
                        {sendingMessage ? "Sending..." : "Send message"}
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent
                value="profile"
                className="mt-0 flex-1 overflow-y-auto px-6 py-4"
              >
                <ProfileForm value={contact.profile} readOnly />
              </TabsContent>

              <TabsContent
                value="calendar"
                className="mt-0 flex-1 overflow-y-auto px-6 py-4"
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
