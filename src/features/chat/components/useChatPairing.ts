import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSendMessageMutation } from "@/features/chat/graphql/chat.operations";
import { useTypingStatus } from "./useTypingStatus";
import { useMessages } from "./useMessages";
import { useScroll } from "./useScroll";
import type { PairingContact } from "@/mocks/mockPairings";

interface UseChatPairingProps {
  contact: PairingContact | undefined;
  activeTab: string;
}

export const useChatPairing = ({ contact, activeTab }: UseChatPairingProps) => {
  const { user } = useAuth();
  const [messageContent, setMessageContent] = useState("");

  const pairingId = contact?.pairingId || contact?.id;

  const [sendMessage, { loading: sendingMessage, error: sendError }] =
    useSendMessageMutation();

  const { otherUserTyping, handleTyping, stopTyping } = useTypingStatus({
    pairingId,
    userId: user?.id,
  });

  const { messages, messagesLoading } = useMessages({
    pairingId,
    activeTab,
    userId: user?.id,
  });

  const scrollRef = useScroll({ messages, otherUserTyping });

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageContent(e.target.value);
    handleTyping();
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
      await sendMessage({
        variables: {
          input: {
            pairingId,
            content: messageContent,
          },
        },
      });
      console.log("Message sent successfully");
      setMessageContent("");
      stopTyping();
    } catch (error) {
      console.error("Failed to send message:", error);
      if (sendError) {
        console.error("Mutation error:", sendError);
      }
    }
  };

  const sendMessageDirect = async (content: string) => {
    if (!content.trim() || !pairingId) {
      console.warn("Cannot send message - content empty or no pairingId", {
        content: content.trim(),
        pairingId,
      });
      return;
    }

    try {
      console.log("Sending message:", { pairingId, content });
      await sendMessage({
        variables: {
          input: {
            pairingId,
            content,
          },
        },
      });
      console.log("Message sent successfully");
      stopTyping();
    } catch (error) {
      console.error("Failed to send message:", error);
      if (sendError) {
        console.error("Mutation error:", sendError);
      }
    }
  };

  return {
    messages,
    messageContent,
    otherUserTyping,
    messagesLoading,
    sendingMessage,
    scrollRef,
    handleInputChange,
    handleSendMessage,
    sendMessageDirect,
  };
};
