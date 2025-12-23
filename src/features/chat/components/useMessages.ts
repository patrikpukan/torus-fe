import { useEffect, useState } from "react";
import {
  useGetMessagesQuery,
  useMessageSentSubscription,
  useMessagesReadSubscription,
  useMarkMessagesAsReadMutation,
} from "@/features/chat/graphql/chat.operations";
import type { Message } from "./ChatPairingDetailTypes";

interface UseMessagesProps {
  pairingId: string | undefined;
  activeTab: string;
  userId: string | undefined;
}

export const useMessages = ({
  pairingId,
  activeTab,
  userId,
}: UseMessagesProps) => {
  const {
    data: messagesData,
    loading: messagesLoading,
    refetch: refetchMessages,
  } = useGetMessagesQuery(pairingId || "");

  const [markMessagesAsRead] = useMarkMessagesAsReadMutation();

  const { data: subscriptionData } = useMessageSentSubscription(
    pairingId || ""
  );

  const { data: readReceiptData } = useMessagesReadSubscription(
    pairingId || "",
    userId || ""
  );

  // Update messages when query data arrives
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (messagesData?.getMessages) {
      setMessages(messagesData.getMessages);
    }
  }, [messagesData]);

  // Refetch messages when switching to chat tab
  useEffect(() => {
    if (activeTab === "chat" && pairingId) {
      refetchMessages();
      markMessagesAsRead({ variables: { pairingId } });
    }
  }, [activeTab, pairingId, refetchMessages, markMessagesAsRead]);

  // Add new message from subscription
  useEffect(() => {
    if (subscriptionData?.messageSent) {
      setMessages((prev) => {
        if (prev.find((m) => m.id === subscriptionData.messageSent.id)) {
          return prev;
        }
        return [...prev, subscriptionData.messageSent];
      });

      if (pairingId && subscriptionData.messageSent.senderId !== userId) {
        markMessagesAsRead({ variables: { pairingId } });
      }
    }
  }, [subscriptionData, pairingId, userId, markMessagesAsRead]);

  // Handle read receipts
  useEffect(() => {
    if (readReceiptData?.messagesRead) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.senderId === userId ? { ...msg, isRead: true } : msg
        )
      );
    }
  }, [readReceiptData, userId]);

  return {
    messages,
    messagesLoading,
    setMessages,
  };
};
