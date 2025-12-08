import { useMutation, useQuery, useSubscription } from "@apollo/client/react";
import { graphql } from "gql.tada";

// Type definitions
export type MessageModel = {
  id: string;
  pairingId: string;
  senderId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
};

export type GetMessagesData = {
  getMessages: MessageModel[];
};

export type MessageSentData = {
  messageSent: MessageModel;
};

export type TypingStatusData = {
  typingStatus: {
    pairingId: string;
    userId: string;
    isTyping: boolean;
  };
};

export type MessagesReadData = {
  messagesRead: {
    pairingId: string;
    userId: string;
  };
};

// GraphQL operations
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
  useQuery<GetMessagesData>(GET_MESSAGES_QUERY, {
    variables: { pairingId },
    skip: !pairingId,
    fetchPolicy: "network-only",
  });

export const useSendMessageMutation = () => useMutation(SEND_MESSAGE_MUTATION);

export const useSetTypingStatusMutation = () =>
  useMutation(SET_TYPING_STATUS_MUTATION);

export const useMarkMessagesAsReadMutation = () =>
  useMutation(MARK_MESSAGES_AS_READ_MUTATION);

export const useMessageSentSubscription = (pairingId: string) =>
  useSubscription<MessageSentData>(MESSAGE_SENT_SUBSCRIPTION, {
    variables: { pairingId },
    skip: !pairingId,
  });

export const useTypingStatusSubscription = (
  pairingId: string,
  userId: string
) =>
  useSubscription<TypingStatusData>(TYPING_STATUS_SUBSCRIPTION, {
    variables: { pairingId, userId },
    skip: !pairingId || !userId,
  });

export const useMessagesReadSubscription = (
  pairingId: string,
  userId: string
) =>
  useSubscription<MessagesReadData>(MESSAGES_READ_SUBSCRIPTION, {
    variables: { pairingId, userId },
    skip: !pairingId || !userId,
  });
