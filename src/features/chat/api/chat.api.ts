import { useCallback, useMemo } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiGet, apiSend } from "@/lib/restClient";

/**
 * Chat REST hooks (migrated from Apollo/GraphQL — Phase 7 strangler).
 * The query + mutations now hit /api/chat/*; the 3 realtime subscriptions moved
 * to Supabase Realtime Broadcast (see useChatChannel). Return/call shapes are
 * kept Apollo-compatible so the chat components/hooks need minimal changes.
 */

export type MessageModel = {
  id: string;
  pairingId: string;
  senderId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
};

export const messagesQueryKey = (pairingId: string) => [
  "chat",
  "messages",
  pairingId,
];

/** GET /api/chat/messages/:pairingId — mirrors useGetMessagesQuery (Apollo). */
export const useGetMessagesQuery = (pairingId: string) => {
  const query = useQuery({
    queryKey: messagesQueryKey(pairingId),
    queryFn: () => apiGet<MessageModel[]>(`/chat/messages/${pairingId}`),
    enabled: !!pairingId,
    // Was Apollo fetchPolicy "network-only" — always refetch on mount/key change.
    staleTime: 0,
  });

  // Memoize so the wrapped `data` keeps a stable reference between renders
  // (consumers depend on it in effects).
  const data = useMemo(
    () => (query.data ? { getMessages: query.data } : undefined),
    [query.data]
  );

  return {
    data,
    loading: query.isLoading,
    refetch: query.refetch,
  };
};

/**
 * POST /api/chat/messages. Preserves the Apollo tuple shape:
 *   const [sendMessage, { loading, error }] = useSendMessageMutation();
 *   await sendMessage({ variables: { input: { pairingId, content } } });
 */
export const useSendMessageMutation = (): [
  (args: {
    variables: { input: { pairingId: string; content: string } };
  }) => Promise<{ sendMessage: MessageModel }>,
  { loading: boolean; error: Error | null },
] => {
  const mutation = useMutation({
    mutationFn: (input: { pairingId: string; content: string }) =>
      apiSend<MessageModel>("POST", "/chat/messages", input),
  });

  // Stable identity: consumers pass these into effect deps (see useMessages),
  // so an unstable function would re-fire effects every render -> request storm.
  const sendMessage = useCallback(
    async ({
      variables,
    }: {
      variables: { input: { pairingId: string; content: string } };
    }) => {
      const message = await mutation.mutateAsync(variables.input);
      return { sendMessage: message };
    },
    [mutation.mutateAsync]
  );

  return [sendMessage, { loading: mutation.isPending, error: mutation.error }];
};

/**
 * POST /api/chat/messages/:pairingId/read. Preserves the Apollo call shape:
 *   const [markMessagesAsRead] = useMarkMessagesAsReadMutation();
 *   markMessagesAsRead({ variables: { pairingId } });
 */
export const useMarkMessagesAsReadMutation = (): [
  (args: { variables: { pairingId: string } }) => Promise<{
    markMessagesAsRead: boolean;
  }>,
  { loading: boolean },
] => {
  const mutation = useMutation({
    mutationFn: (pairingId: string) =>
      apiSend<{ success: boolean }>(
        "POST",
        `/chat/messages/${pairingId}/read`
      ),
  });

  // Stable identity (used in useMessages effect deps). Does NOT invalidate the
  // messages query — read state propagates to the sender via the messages_read
  // broadcast, so a refetch here is unnecessary and previously caused a
  // render -> refetch -> render loop (request storm).
  const markMessagesAsRead = useCallback(
    async ({ variables }: { variables: { pairingId: string } }) => {
      const { success } = await mutation.mutateAsync(variables.pairingId);
      return { markMessagesAsRead: success };
    },
    [mutation.mutateAsync]
  );

  return [markMessagesAsRead, { loading: mutation.isPending }];
};

/**
 * POST /api/chat/typing. Preserves the Apollo call shape:
 *   const [setTypingStatus] = useSetTypingStatusMutation();
 *   setTypingStatus({ variables: { pairingId, isTyping } });
 */
export const useSetTypingStatusMutation = (): [
  (args: {
    variables: { pairingId: string; isTyping: boolean };
  }) => Promise<{ setTypingStatus: boolean }>,
  { loading: boolean },
] => {
  const mutation = useMutation({
    mutationFn: (vars: { pairingId: string; isTyping: boolean }) =>
      apiSend<{ success: boolean }>("POST", "/chat/typing", vars),
  });

  const setTypingStatus = useCallback(
    async ({
      variables,
    }: {
      variables: { pairingId: string; isTyping: boolean };
    }) => {
      const { success } = await mutation.mutateAsync(variables);
      return { setTypingStatus: success };
    },
    [mutation.mutateAsync]
  );

  return [setTypingStatus, { loading: mutation.isPending }];
};
