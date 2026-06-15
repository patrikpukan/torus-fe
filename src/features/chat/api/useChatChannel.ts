import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import type { MessageModel } from "./chat.api";

/**
 * Realtime chat over a Supabase Realtime PRIVATE channel `chat:<pairingId>`,
 * replacing the 3 GraphQL subscriptions (messageSent / typingStatus /
 * messagesRead). The backend broadcasts these events with the service role key
 * (see RealtimeBroadcastService); RLS on realtime.messages (prisma/
 * realtime-chat.sql) ensures only the two pairing participants may listen.
 *
 * One channel per open conversation. Each return field holds the LATEST event
 * payload as a fresh object so consumers' effects fire on every event. Typing
 * and read-receipt events from the current user are filtered out here (the old
 * GraphQL subscriptions did this server-side via a `userId !== self` filter).
 */

type TypingPayload = { pairingId: string; userId: string; isTyping: boolean };
type ReadPayload = { pairingId: string; userId: string };

interface UseChatChannelProps {
  pairingId: string | undefined;
  userId: string | undefined;
}

export const useChatChannel = ({ pairingId, userId }: UseChatChannelProps) => {
  const [messageSent, setMessageSent] = useState<MessageModel | null>(null);
  const [typingStatus, setTypingStatus] = useState<TypingPayload | null>(null);
  const [messagesRead, setMessagesRead] = useState<ReadPayload | null>(null);

  useEffect(() => {
    if (!pairingId) return;

    let cancelled = false;

    const channel = supabaseClient.channel(`chat:${pairingId}`, {
      config: { private: true },
    });

    channel
      .on("broadcast", { event: "message_sent" }, ({ payload }) => {
        if (!cancelled) setMessageSent(payload as MessageModel);
      })
      .on("broadcast", { event: "typing" }, ({ payload }) => {
        const data = payload as TypingPayload;
        // Ignore our own typing echoes (server broadcasts to all participants).
        if (!cancelled && data.userId !== userId) setTypingStatus({ ...data });
      })
      .on("broadcast", { event: "messages_read" }, ({ payload }) => {
        const data = payload as ReadPayload;
        if (!cancelled && data.userId !== userId) setMessagesRead({ ...data });
      });

    // Attach the current access token so RLS can authorize the private channel,
    // then subscribe. realtime.setAuth keeps subsequent reconnects authorized.
    void supabaseClient.auth.getSession().then(({ data: { session } }) => {
      if (cancelled) return;
      if (session?.access_token) {
        supabaseClient.realtime.setAuth(session.access_token);
      }
      channel.subscribe();
    });

    return () => {
      cancelled = true;
      void supabaseClient.removeChannel(channel);
    };
  }, [pairingId, userId]);

  return { messageSent, typingStatus, messagesRead };
};
