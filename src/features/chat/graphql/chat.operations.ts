import { useMutation, useQuery, useSubscription } from "@apollo/client/react";
import { graphql } from "gql.tada";

export const GET_MESSAGES_QUERY = graphql(`
  query GetMessages($pairingId: ID!) {
    getMessages(pairingId: $pairingId) {
      id
      pairingId
      senderId
      content
      isRead
      createdAt
    }
  }
`);

export const SEND_MESSAGE_MUTATION = graphql(`
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
      id
      pairingId
      senderId
      content
      isRead
      createdAt
    }
  }
`);

export const MESSAGE_SENT_SUBSCRIPTION = graphql(`
  subscription MessageSent($pairingId: ID!) {
    messageSent(pairingId: $pairingId) {
      id
      pairingId
      senderId
      content
      isRead
      createdAt
    }
  }
`);

export const TYPING_STATUS_SUBSCRIPTION = graphql(`
  subscription TypingStatus($pairingId: ID!, $userId: ID!) {
    typingStatus(pairingId: $pairingId, userId: $userId) {
      pairingId
      userId
      isTyping
    }
  }
`);

export const SET_TYPING_STATUS_MUTATION = graphql(`
  mutation SetTypingStatus($pairingId: ID!, $isTyping: Boolean!) {
    setTypingStatus(pairingId: $pairingId, isTyping: $isTyping)
  }
`);

export const MESSAGES_READ_SUBSCRIPTION = graphql(`
  subscription MessagesRead($pairingId: ID!, $userId: ID!) {
    messagesRead(pairingId: $pairingId, userId: $userId) {
      pairingId
      userId
    }
  }
`);

export const MARK_MESSAGES_AS_READ_MUTATION = graphql(`
  mutation MarkMessagesAsRead($pairingId: ID!) {
    markMessagesAsRead(pairingId: $pairingId)
  }
`);

// Custom hooks
export const useGetMessagesQuery = (pairingId: string) =>
  useQuery(GET_MESSAGES_QUERY, {
    variables: { pairingId },
    skip: !pairingId, // Don't run query if pairingId is not set
  });

export const useSendMessageMutation = () => useMutation(SEND_MESSAGE_MUTATION);

export const useSetTypingStatusMutation = () =>
  useMutation(SET_TYPING_STATUS_MUTATION);

export const useMarkMessagesAsReadMutation = () =>
  useMutation(MARK_MESSAGES_AS_READ_MUTATION);

export const useMessageSentSubscription = (pairingId: string) =>
  useSubscription(MESSAGE_SENT_SUBSCRIPTION, {
    variables: { pairingId },
    skip: !pairingId, // Don't subscribe if pairingId is not set
  });

export const useTypingStatusSubscription = (
  pairingId: string,
  userId: string
) =>
  useSubscription(TYPING_STATUS_SUBSCRIPTION, {
    variables: { pairingId, userId },
    skip: !pairingId || !userId,
  });

export const useMessagesReadSubscription = (
  pairingId: string,
  userId: string
) =>
  useSubscription(MESSAGES_READ_SUBSCRIPTION, {
    variables: { pairingId, userId },
    skip: !pairingId || !userId,
  });

// Type exports
export type GetMessagesData = ReturnType<typeof GET_MESSAGES_QUERY>;
export type SendMessageData = ReturnType<typeof SEND_MESSAGE_MUTATION>;
export type MessageSentData = ReturnType<typeof MESSAGE_SENT_SUBSCRIPTION>;
export type TypingStatusData = ReturnType<typeof TYPING_STATUS_SUBSCRIPTION>;
export type MessagesReadData = ReturnType<typeof MESSAGES_READ_SUBSCRIPTION>;
