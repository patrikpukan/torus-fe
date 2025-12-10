import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  useGetMessagesQuery,
  useSendMessageMutation,
  useMessageSentSubscription,
  useSetTypingStatusMutation,
  useTypingStatusSubscription,
  useMarkMessagesAsReadMutation,
  useMessagesReadSubscription,
} from "@/features/chat/graphql/chat.operations";
import type { Message } from "./ChatPairingDetailTypes";
import type { PairingContact } from "@/mocks/mockPairings";

interface UseChatPairingProps {
  contact: PairingContact | undefined;
  activeTab: string;
}

export const useChatPairing = ({ contact, activeTab }: UseChatPairingProps) => {
  const { user } = useAuth();
  const [messageContent, setMessageContent] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Get pairingId from contact or use contact id as fallback
  const pairingId = contact?.pairingId || contact?.id;

  // Fetch messages - refetch when switching to chat tab
  const {
    data: messagesData,
    loading: messagesLoading,
    refetch: refetchMessages,
  } = useGetMessagesQuery(pairingId || "");

  // Send message mutation
  const [sendMessage, { loading: sendingMessage, error: sendError }] =
    useSendMessageMutation();

  // Typing status mutation
  const [setTypingStatus] = useSetTypingStatusMutation();

  // Mark as read mutation
  const [markMessagesAsRead] = useMarkMessagesAsReadMutation();

  // Subscribe to new messages
  const { data: subscriptionData } = useMessageSentSubscription(
    pairingId || ""
  );

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

  // Update messages when query data arrives
  useEffect(() => {
    if (messagesData?.getMessages) {
      setMessages(messagesData.getMessages);
    }
  }, [messagesData]);

  // Refetch messages when switching to chat tab
  useEffect(() => {
    if (activeTab === "chat" && pairingId) {
      refetchMessages().then(() => {
        // Scroll to bottom after refetch completes
        setTimeout(() => {
          if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
          }
        }, 50);
      });
      markMessagesAsRead({ variables: { pairingId } });
    }
  }, [activeTab, pairingId, refetchMessages, markMessagesAsRead]);

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

      // Mark as read if it's from the other user
      if (pairingId && subscriptionData.messageSent.senderId !== user?.id) {
        markMessagesAsRead({ variables: { pairingId } });
      }
    }
  }, [subscriptionData, pairingId, user?.id, markMessagesAsRead]);

  // Handle typing status updates
  useEffect(() => {
    if (typingData?.typingStatus) {
      setOtherUserTyping(typingData.typingStatus.isTyping);
    }
  }, [typingData]);

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
  }, [messages, otherUserTyping]);

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

  return {
    // State
    messages,
    messageContent,
    otherUserTyping,
    messagesLoading,
    sendingMessage,
    scrollRef,

    // Actions
    handleInputChange,
    handleSendMessage,
  };
};
