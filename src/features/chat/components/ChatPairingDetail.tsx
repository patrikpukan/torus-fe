import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { MessageSquare } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { ChatInput } from "./ChatInput";
import { ChatMessageList } from "./ChatMessageList";
import type { PairingDetailProps } from "./ChatPairingDetailTypes";
import { ChatPairingHeader } from "./ChatPairingHeader";
import { ChatTypingIndicator } from "./ChatTypingIndicator";
import { useChatPairing } from "./useChatPairing";

export default function PairingDetail({ contact, onBack }: PairingDetailProps) {
  const { user } = useAuth();

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
    appendToMessage,
  } = useChatPairing({ contact, activeTab: "chat" });

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
            <div className="flex h-full flex-col gap-4 px-6 py-4">
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
                onInsertEmoji={appendToMessage}
              />
            </div>
          </CardContent>
        </>
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <EmptyState
            icon={MessageSquare}
            title="No conversation selected"
            description="Choose a colleague to open the conversation and see their details."
          />
        </div>
      )}
    </Card>
  );
}
