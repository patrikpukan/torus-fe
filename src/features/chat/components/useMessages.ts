import { useEffect, useState } from "react";
import {
  useGetMessagesQuery,
  useMarkMessagesAsReadMutation,
  type MessageModel,
} from "@/features/chat/api/chat.api";
import type { Message } from "./ChatPairingDetailTypes";

interface UseMessagesProps {
  pairingId: string | undefined;
  activeTab: string;
  userId: string | undefined;
  // Latest realtime events from the pairing's Supabase channel (see useChatChannel).
  messageSent: MessageModel | null;
  messagesRead: { pairingId: string; userId: string } | null;
}

export const useMessages = ({
  pairingId,
  activeTab,
  userId,
  messageSent,
  messagesRead,
}: UseMessagesProps) => {
  const {
    data: messagesData,
    loading: messagesLoading,
    refetch: refetchMessages,
  } = useGetMessagesQuery(pairingId || "");

  const [markMessagesAsRead] = useMarkMessagesAsReadMutation();

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

  // Add new message from the realtime channel
  useEffect(() => {
    if (messageSent) {
      setMessages((prev) => {
        if (prev.find((m) => m.id === messageSent.id)) {
          return prev;
        }
        return [...prev, messageSent];
      });

      if (pairingId && messageSent.senderId !== userId) {
        markMessagesAsRead({ variables: { pairingId } });
      }
    }
  }, [messageSent, pairingId, userId, markMessagesAsRead]);

  // Handle read receipts
  useEffect(() => {
    if (messagesRead) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.senderId === userId ? { ...msg, isRead: true } : msg
        )
      );
    }
  }, [messagesRead, userId]);

  return {
    messages,
    messagesLoading,
    setMessages,
  };
};
