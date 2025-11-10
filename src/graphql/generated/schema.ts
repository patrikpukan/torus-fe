/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { GraphQLClient, RequestOptions } from "graphql-request";
import gql from "graphql-tag";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: string; output: string; }
  /** The `Upload` scalar type represents a file upload. */
  Upload: { input: any; output: any; }
};

export type AlgorithmSettings = {
  __typename?: 'AlgorithmSettings';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  organizationId: Scalars['String']['output'];
  periodLengthDays: Scalars['Int']['output'];
  randomSeed: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type AlgorithmSettingsResponse = {
  __typename?: 'AlgorithmSettingsResponse';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  organizationId: Scalars['String']['output'];
  periodLengthDays: Scalars['Int']['output'];
  randomSeed: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
  warning: Maybe<Scalars['String']['output']>;
};

export type CalendarEvent = {
  __typename?: 'CalendarEvent';
  createdAt: Scalars['DateTime']['output'];
  deletedAt: Maybe<Scalars['DateTime']['output']>;
  description: Maybe<Scalars['String']['output']>;
  endDateTime: Scalars['DateTime']['output'];
  exceptionDates: Maybe<Scalars['String']['output']>;
  exceptionRrules: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  rrule: Maybe<Scalars['String']['output']>;
  rruleRecurringId: Maybe<Scalars['String']['output']>;
  startDateTime: Scalars['DateTime']['output'];
  title: Maybe<Scalars['String']['output']>;
  type: CalendarEventType;
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['ID']['output'];
};

/** Type of calendar event: availability or unavailability */
export type CalendarEventType =
  | 'availability'
  | 'unavailability';

export type CancelMeetingEventInput = {
  cancelledByUserId: Scalars['ID']['input'];
  meetingId: Scalars['ID']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
};

export type CreateCalendarEventInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  endDateTime: Scalars['DateTime']['input'];
  rrule?: InputMaybe<Scalars['String']['input']>;
  startDateTime: Scalars['DateTime']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
  type: CalendarEventType;
  userId: Scalars['ID']['input'];
};

export type CreateInviteCodeInputType = {
  /** Optional: hours until code expires (default: 30 days if not set) */
  expiresInHours?: InputMaybe<Scalars['Float']['input']>;
  /** Optional: max uses for this code */
  maxUses?: InputMaybe<Scalars['Float']['input']>;
};

export type CreateInviteCodeResponseType = {
  __typename?: 'CreateInviteCodeResponseType';
  code: Scalars['String']['output'];
  expiresAt: Maybe<Scalars['DateTime']['output']>;
  inviteUrl: Scalars['String']['output'];
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type CreateInviteCodeInputType = {
  /** Optional: hours until code expires (default: 30 days if not set) */
  expiresInHours?: InputMaybe<Scalars['Float']['input']>;
  /** Optional: max uses for this code */
  maxUses?: InputMaybe<Scalars['Float']['input']>;
};

export type CreateInviteCodeResponseType = {
  __typename?: 'CreateInviteCodeResponseType';
  code: Scalars['String']['output'];
  expiresAt: Maybe<Scalars['DateTime']['output']>;
  inviteUrl: Scalars['String']['output'];
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type CreateMeetingEventInput = {
  createdByUserId: Scalars['ID']['input'];
  endDateTime: Scalars['DateTime']['input'];
  note?: InputMaybe<Scalars['String']['input']>;
  pairingId?: InputMaybe<Scalars['ID']['input']>;
  startDateTime: Scalars['DateTime']['input'];
  userAId: Scalars['ID']['input'];
  userBId: Scalars['ID']['input'];
};

export type CurrentUser = {
  __typename?: 'CurrentUser';
  about: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  firstName: Maybe<Scalars['String']['output']>;
  hobbies: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  interests: Maybe<Scalars['String']['output']>;
  isActive: Scalars['Boolean']['output'];
  lastName: Maybe<Scalars['String']['output']>;
  organization: SimpleOrganizationType;
  organization: SimpleOrganizationType;
  organizationId: Scalars['ID']['output'];
  preferredActivity: Maybe<Scalars['String']['output']>;
  profileImageUrl: Maybe<Scalars['String']['output']>;
  profileStatus: ProfileStatusEnum;
  role: UserRoleEnum;
  supabaseUserId: Maybe<Scalars['String']['output']>;
};

export type DeleteCalendarEventInput = {
  id: Scalars['ID']['input'];
  occurrenceStart?: InputMaybe<Scalars['DateTime']['input']>;
  scope: Scalars['String']['input'];
};

export type ExpandedCalendarEventOccurrence = {
  __typename?: 'ExpandedCalendarEventOccurrence';
  id: Scalars['ID']['output'];
  occurrenceEnd: Scalars['DateTime']['output'];
  occurrenceStart: Scalars['DateTime']['output'];
  originalEvent: CalendarEvent;
};

export type InviteCodeType = {
  __typename?: 'InviteCodeType';
  code: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  createdBy: Maybe<User>;
  createdById: Scalars['String']['output'];
  expiresAt: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  inviteUrl: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  maxUses: Maybe<Scalars['Float']['output']>;
  organizationId: Scalars['String']['output'];
  usedCount: Scalars['Float']['output'];
};

export type InviteCodeValidationResponseType = {
  __typename?: 'InviteCodeValidationResponseType';
  expiresAt: Maybe<Scalars['DateTime']['output']>;
  isValid: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
  organizationId: Maybe<Scalars['String']['output']>;
  organizationName: Maybe<Scalars['String']['output']>;
  remainingUses: Maybe<Scalars['Float']['output']>;
};

export type InviteCodeType = {
  __typename?: 'InviteCodeType';
  code: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  createdBy: Maybe<User>;
  createdById: Scalars['String']['output'];
  expiresAt: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  inviteUrl: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  maxUses: Maybe<Scalars['Float']['output']>;
  organizationId: Scalars['String']['output'];
  usedCount: Scalars['Float']['output'];
};

export type InviteCodeValidationResponseType = {
  __typename?: 'InviteCodeValidationResponseType';
  expiresAt: Maybe<Scalars['DateTime']['output']>;
  isValid: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
  organizationId: Maybe<Scalars['String']['output']>;
  organizationName: Maybe<Scalars['String']['output']>;
  remainingUses: Maybe<Scalars['Float']['output']>;
};

export type InviteUserInputType = {
  email: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
};

export type InviteUserResponseType = {
  __typename?: 'InviteUserResponseType';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
  userId: Maybe<Scalars['String']['output']>;
};

/** Meeting confirmation status: pending, confirmed, rejected, or proposed */
export type MeetingConfirmationStatus =
  | 'confirmed'
  | 'pending'
  | 'proposed'
  | 'rejected';

export type MeetingEvent = {
  __typename?: 'MeetingEvent';
  cancellationReason: Maybe<Scalars['String']['output']>;
  cancelledAt: Maybe<Scalars['DateTime']['output']>;
  cancelledByUserId: Maybe<Scalars['ID']['output']>;
  createdAt: Scalars['DateTime']['output'];
  createdByUserId: Scalars['ID']['output'];
  endDateTime: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  pairingId: Maybe<Scalars['ID']['output']>;
  startDateTime: Scalars['DateTime']['output'];
  updatedAt: Scalars['DateTime']['output'];
  userAConfirmationStatus: MeetingConfirmationStatus;
  userAId: Scalars['ID']['output'];
  userANote: Maybe<Scalars['String']['output']>;
  userAProposedEndDateTime: Maybe<Scalars['DateTime']['output']>;
  userAProposedStartDateTime: Maybe<Scalars['DateTime']['output']>;
  userBConfirmationStatus: MeetingConfirmationStatus;
  userBId: Scalars['ID']['output'];
  userBNote: Maybe<Scalars['String']['output']>;
  userBProposedEndDateTime: Maybe<Scalars['DateTime']['output']>;
  userBProposedStartDateTime: Maybe<Scalars['DateTime']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  cancelMeeting: MeetingEvent;
  confirmMeeting: MeetingEvent;
  createCalendarEvent: CalendarEvent;
  createInviteCode: CreateInviteCodeResponseType;
  createInviteCode: CreateInviteCodeResponseType;
  createMeetingEvent: MeetingEvent;
  deleteCalendarEvent: Scalars['Boolean']['output'];
  deleteUser: User;
  executePairingAlgorithm: PairingExecutionResult;
  inviteUserToOrganization: InviteUserResponseType;
  proposeMeetingTime: MeetingEvent;
  registerOrganization: RegisterOrganizationResponseType;
  rejectMeeting: MeetingEvent;
  signUp: User;
  updateAlgorithmSettings: AlgorithmSettingsResponse;
  updateCalendarEvent: Array<CalendarEvent>;
  updateCurrentUserProfile: CurrentUser;
  updateMeetingToProposedTime: MeetingEvent;
  updateOrganization: OrganizationType;
  updateUser: User;
};


export type MutationCancelMeetingArgs = {
  input: CancelMeetingEventInput;
};


export type MutationConfirmMeetingArgs = {
  meetingId: Scalars['ID']['input'];
  note: InputMaybe<Scalars['String']['input']>;
};


export type MutationCreateCalendarEventArgs = {
  input: CreateCalendarEventInput;
};


export type MutationCreateInviteCodeArgs = {
  input: InputMaybe<CreateInviteCodeInputType>;
};


export type MutationCreateInviteCodeArgs = {
  input: InputMaybe<CreateInviteCodeInputType>;
};


export type MutationCreateMeetingEventArgs = {
  input: CreateMeetingEventInput;
};


export type MutationDeleteCalendarEventArgs = {
  input: DeleteCalendarEventInput;
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationExecutePairingAlgorithmArgs = {
  organizationId: Scalars['String']['input'];
};


export type MutationInviteUserToOrganizationArgs = {
  input: InviteUserInputType;
};


export type MutationProposeMeetingTimeArgs = {
  input: UpdateMeetingEventConfirmationInput;
};


export type MutationRegisterOrganizationArgs = {
  input: RegisterOrganizationInputType;
};


export type MutationRejectMeetingArgs = {
  meetingId: Scalars['ID']['input'];
  note: InputMaybe<Scalars['String']['input']>;
};


export type MutationSignUpArgs = {
  data: SignUpInputType;
};


export type MutationUpdateAlgorithmSettingsArgs = {
  input: UpdateAlgorithmSettingsInput;
};


export type MutationUpdateCalendarEventArgs = {
  input: UpdateCalendarEventInput;
  occurrenceStart: InputMaybe<Scalars['DateTime']['input']>;
  scope?: Scalars['String']['input'];
};


export type MutationUpdateCurrentUserProfileArgs = {
  input: UpdateCurrentUserProfileInputType;
};


export type MutationUpdateMeetingToProposedTimeArgs = {
  meetingId: Scalars['ID']['input'];
};


export type MutationUpdateOrganizationArgs = {
  input: UpdateOrganizationInputType;
};


export type MutationUpdateUserArgs = {
  data: UpdateUserInputType;
};

export type OrganizationType = {
  __typename?: 'OrganizationType';
  address: Maybe<Scalars['String']['output']>;
  code: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  imageUrl: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  size: Maybe<Scalars['Float']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type PairingExecutionResult = {
  __typename?: 'PairingExecutionResult';
  message: Scalars['String']['output'];
  pairingsCreated: Scalars['Int']['output'];
  success: Scalars['Boolean']['output'];
  unpairedUsers: Maybe<Scalars['Int']['output']>;
};

export type PairingHistory = {
  __typename?: 'PairingHistory';
  createdAt: Scalars['DateTime']['output'];
  derivedStatus: PairingStatusEnum;
  id: Scalars['ID']['output'];
  status: PairingStatusEnum;
  userA: User;
  userAId: Scalars['ID']['output'];
  userB: User;
  userBId: Scalars['ID']['output'];
};

export type PairingStatusByUserType = {
  __typename?: 'PairingStatusByUserType';
  count: Scalars['Int']['output'];
  status: Scalars['String']['output'];
  userEmail: Scalars['String']['output'];
  userId: Scalars['ID']['output'];
  userName: Maybe<Scalars['String']['output']>;
};

/** Pairing status */
export type PairingStatusEnum =
  | 'cancelled'
  | 'matched'
  | 'met'
  | 'not_met'
  | 'not_planned'
  | 'planned'
  | 'unspecified';

export type PairingStatusOverviewType = {
  __typename?: 'PairingStatusOverviewType';
  count: Scalars['Int']['output'];
  status: Scalars['String']['output'];
};

export type PairingStatusOverviewType = {
  __typename?: 'PairingStatusOverviewType';
  count: Scalars['Int']['output'];
  status: Scalars['String']['output'];
};

/** Profile onboarding status */
export type ProfileStatusEnum =
  | 'active'
  | 'pending'
  | 'suspended';

export type Query = {
  __typename?: 'Query';
  allMeetingsForPairing: Array<MeetingEvent>;
  calendarEventById: Maybe<CalendarEvent>;
  calendarEventsByDateRange: Array<CalendarEvent>;
  expandedCalendarOccurrences: Array<ExpandedCalendarEventOccurrence>;
  getAlgorithmSettings: AlgorithmSettings;
  getCurrentUser: Maybe<CurrentUser>;
  getOrganizationInvites: Array<InviteCodeType>;
  getPairedUsers: Array<User>;
  getPairingHistory: Array<PairingHistory>;
  latestMeetingForPairing: Maybe<MeetingEvent>;
  meetingEventById: Maybe<MeetingEvent>;
  meetingEventsByDateRange: Array<MeetingEvent>;
  myOrganization: Maybe<OrganizationType>;
  organizationById: Maybe<OrganizationType>;
  organizations: Array<OrganizationType>;
  pendingMeetingConfirmations: Array<MeetingEvent>;
  statistics: StatisticsResponseType;
  upcomingMeetings: Array<MeetingEvent>;
  userById: Maybe<User>;
  users: Array<User>;
  validateInviteCode: InviteCodeValidationResponseType;
  validateInviteCode: InviteCodeValidationResponseType;
};


export type QueryAllMeetingsForPairingArgs = {
  pairingId: Scalars['ID']['input'];
};


export type QueryCalendarEventByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCalendarEventsByDateRangeArgs = {
  endDate: Scalars['DateTime']['input'];
  startDate: Scalars['DateTime']['input'];
};


export type QueryExpandedCalendarOccurrencesArgs = {
  endDate: Scalars['DateTime']['input'];
  startDate: Scalars['DateTime']['input'];
  userId: InputMaybe<Scalars['ID']['input']>;
};


export type QueryGetAlgorithmSettingsArgs = {
  organizationId: Scalars['String']['input'];
};


export type QueryLatestMeetingForPairingArgs = {
  pairingId: Scalars['ID']['input'];
};


export type QueryMeetingEventByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryMeetingEventsByDateRangeArgs = {
  endDate: Scalars['DateTime']['input'];
  startDate: Scalars['DateTime']['input'];
};


export type QueryOrganizationByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryStatisticsArgs = {
  filter: InputMaybe<StatisticsFilterInputType>;
};


export type QueryUserByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryValidateInviteCodeArgs = {
  code: Scalars['String']['input'];
};


export type QueryValidateInviteCodeArgs = {
  code: Scalars['String']['input'];
};

export type RegisterOrganizationInputType = {
  adminEmail: Scalars['String']['input'];
  organizationAddress: Scalars['String']['input'];
  organizationName: Scalars['String']['input'];
  organizationSize: Scalars['String']['input'];
};

export type RegisterOrganizationResponseType = {
  __typename?: 'RegisterOrganizationResponseType';
  adminEmail: Scalars['String']['output'];
  message: Scalars['String']['output'];
  organization: OrganizationType;
};

export type SignUpInputType = {
  email: Scalars['String']['input'];
  firstName?: InputMaybe<Scalars['String']['input']>;
  /** Optional invite code for organization assignment */
  inviteCode?: InputMaybe<Scalars['String']['input']>;
  /** Optional invite code for organization assignment */
  inviteCode?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
  profilePicture?: InputMaybe<Scalars['Upload']['input']>;
};

export type SimpleOrganizationType = {
  __typename?: "SimpleOrganizationType";
  code: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  imageUrl: Maybe<Scalars["String"]["output"]>;
  name: Scalars["String"]["output"];
};

export type StatisticsFilterInputType = {
  endDate?: InputMaybe<Scalars["String"]["input"]>;
  month?: InputMaybe<Scalars["Int"]["input"]>;
  organizationId?: InputMaybe<Scalars["String"]["input"]>;
  startDate?: InputMaybe<Scalars["String"]["input"]>;
  year?: InputMaybe<Scalars["Int"]["input"]>;
};

export type StatisticsResponseType = {
  __typename?: "StatisticsResponseType";
  inactiveUsersCount: Scalars["Int"]["output"];
  newUsersCount: Scalars["Int"]["output"];
  pairingsByStatus: Array<PairingStatusOverviewType>;
  pairingsByStatusAndUser: Array<PairingStatusByUserType>;
  reportsCount: Scalars["Int"]["output"];
};

export type UpdateAlgorithmSettingsInput = {
  organizationId: Scalars['String']['input'];
  periodLengthDays?: InputMaybe<Scalars['Int']['input']>;
  randomSeed?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateCalendarEventInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  endDateTime?: InputMaybe<Scalars['DateTime']['input']>;
  id: Scalars['ID']['input'];
  startDateTime?: InputMaybe<Scalars['DateTime']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<CalendarEventType>;
};

export type UpdateCurrentUserProfileInputType = {
  about?: InputMaybe<Scalars['String']['input']>;
  avatarUrl?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  hobbies?: InputMaybe<Scalars['String']['input']>;
  interests?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  preferredActivity?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateMeetingEventConfirmationInput = {
  meetingId: Scalars['ID']['input'];
  note?: InputMaybe<Scalars['String']['input']>;
  proposedEndDateTime?: InputMaybe<Scalars['DateTime']['input']>;
  proposedStartDateTime?: InputMaybe<Scalars['DateTime']['input']>;
  status: MeetingConfirmationStatus;
  userId: Scalars['ID']['input'];
};

export type UpdateOrganizationInputType = {
  address?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateUserInputType = {
  about?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  hobbies?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  interests?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  preferredActivity?: InputMaybe<Scalars['String']['input']>;
  profileImageUrl?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<UserRoleEnum>;
};

export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  firstName: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lastName: Maybe<Scalars['String']['output']>;
  profileImageUrl: Maybe<Scalars['String']['output']>;
  profileStatus: ProfileStatusEnum;
  role: UserRoleEnum;
};

/** User role */
export type UserRoleEnum =
  | 'org_admin'
  | 'super_admin'
  | 'user';

export type GetCurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentUserQuery = { __typename?: 'Query', getCurrentUser: { __typename?: 'CurrentUser', id: string, email: string, organizationId: string, role: UserRoleEnum, firstName: string | null, lastName: string | null, about: string | null, hobbies: string | null, interests: string | null, profileImageUrl: string | null, profileStatus: ProfileStatusEnum, isActive: boolean, organization: { __typename?: 'SimpleOrganizationType', id: string, name: string, code: string, imageUrl: string | null } } | null };

export type GetCalendarEventsQueryVariables = Exact<{
  startDate: Scalars['DateTime']['input'];
  endDate: Scalars['DateTime']['input'];
}>;


export type GetCalendarEventsQuery = { __typename?: 'Query', expandedCalendarOccurrences: Array<{ __typename?: 'ExpandedCalendarEventOccurrence', id: string, occurrenceStart: string, occurrenceEnd: string, originalEvent: { __typename?: 'CalendarEvent', id: string, title: string | null, description: string | null, type: CalendarEventType, startDateTime: string, endDateTime: string, rrule: string | null, exceptionDates: string | null, exceptionRrules: string | null, createdAt: string, updatedAt: string, deletedAt: string | null } }> };

export type UpdateCalendarEventMutationVariables = Exact<{
  input: UpdateCalendarEventInput;
  scope: InputMaybe<Scalars['String']['input']>;
  occurrenceStart: InputMaybe<Scalars['DateTime']['input']>;
}>;


export type UpdateCalendarEventMutation = { __typename?: 'Mutation', updateCalendarEvent: Array<{ __typename?: 'CalendarEvent', id: string, title: string | null, description: string | null, type: CalendarEventType, startDateTime: string, endDateTime: string, rrule: string | null, exceptionDates: string | null, exceptionRrules: string | null, createdAt: string, updatedAt: string, deletedAt: string | null }> };

export type DeleteCalendarEventMutationVariables = Exact<{
  input: DeleteCalendarEventInput;
}>;


export type DeleteCalendarEventMutation = { __typename?: 'Mutation', deleteCalendarEvent: boolean };

export type GetMeetingEventsQueryVariables = Exact<{
  startDate: Scalars['DateTime']['input'];
  endDate: Scalars['DateTime']['input'];
}>;


export type GetMeetingEventsQuery = { __typename?: 'Query', meetingEventsByDateRange: Array<{ __typename?: 'MeetingEvent', id: string, startDateTime: string, endDateTime: string, userAId: string, userBId: string, userAConfirmationStatus: MeetingConfirmationStatus, userBConfirmationStatus: MeetingConfirmationStatus, userAProposedStartDateTime: string | null, userAProposedEndDateTime: string | null, userBProposedStartDateTime: string | null, userBProposedEndDateTime: string | null, userANote: string | null, userBNote: string | null, pairingId: string | null, createdAt: string, cancelledAt: string | null, createdByUserId: string }> };

export type GetUpcomingMeetingsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUpcomingMeetingsQuery = { __typename?: 'Query', upcomingMeetings: Array<{ __typename?: 'MeetingEvent', id: string, startDateTime: string, endDateTime: string, userAId: string, userBId: string, userAConfirmationStatus: MeetingConfirmationStatus, userBConfirmationStatus: MeetingConfirmationStatus, userAProposedStartDateTime: string | null, userAProposedEndDateTime: string | null, userBProposedStartDateTime: string | null, userBProposedEndDateTime: string | null, userANote: string | null, userBNote: string | null, pairingId: string | null, createdAt: string, cancelledAt: string | null, createdByUserId: string }> };

export type GetPendingConfirmationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPendingConfirmationsQuery = { __typename?: 'Query', pendingMeetingConfirmations: Array<{ __typename?: 'MeetingEvent', id: string, startDateTime: string, endDateTime: string, userAId: string, userBId: string, userAConfirmationStatus: MeetingConfirmationStatus, userBConfirmationStatus: MeetingConfirmationStatus, userAProposedStartDateTime: string | null, userAProposedEndDateTime: string | null, userBProposedStartDateTime: string | null, userBProposedEndDateTime: string | null, userANote: string | null, userBNote: string | null, pairingId: string | null, createdAt: string, cancelledAt: string | null, createdByUserId: string }> };

export type ConfirmMeetingMutationVariables = Exact<{
  meetingId: Scalars['ID']['input'];
  note: InputMaybe<Scalars['String']['input']>;
}>;


export type ConfirmMeetingMutation = { __typename?: 'Mutation', confirmMeeting: { __typename?: 'MeetingEvent', id: string, userAConfirmationStatus: MeetingConfirmationStatus, userBConfirmationStatus: MeetingConfirmationStatus, userANote: string | null, userBNote: string | null } };

export type RejectMeetingMutationVariables = Exact<{
  meetingId: Scalars['ID']['input'];
  note: InputMaybe<Scalars['String']['input']>;
}>;


export type RejectMeetingMutation = { __typename?: 'Mutation', rejectMeeting: { __typename?: 'MeetingEvent', id: string, userAConfirmationStatus: MeetingConfirmationStatus, userBConfirmationStatus: MeetingConfirmationStatus, userANote: string | null, userBNote: string | null } };

export type CreateMeetingMutationVariables = Exact<{
  input: CreateMeetingEventInput;
}>;

export type CreateMeetingMutation = {
  __typename?: "Mutation";
  createMeetingEvent: {
    __typename?: "MeetingEvent";
    id: string;
    startDateTime: string;
    endDateTime: string;
    userAId: string;
    userBId: string;
    userAConfirmationStatus: MeetingConfirmationStatus;
    userBConfirmationStatus: MeetingConfirmationStatus;
    pairingId: string | null;
    createdAt: string;
    createdByUserId: string;
  };
};

export type LatestMeetingForPairingQueryVariables = Exact<{
  pairingId: Scalars["ID"]["input"];
}>;

export type LatestMeetingForPairingQuery = {
  __typename?: "Query";
  latestMeetingForPairing: {
    __typename?: "MeetingEvent";
    id: string;
    startDateTime: string;
    endDateTime: string;
    userAId: string;
    userBId: string;
    userAConfirmationStatus: MeetingConfirmationStatus;
    userBConfirmationStatus: MeetingConfirmationStatus;
    userAProposedStartDateTime: string | null;
    userAProposedEndDateTime: string | null;
    userBProposedStartDateTime: string | null;
    userBProposedEndDateTime: string | null;
    userANote: string | null;
    userBNote: string | null;
    pairingId: string | null;
    createdAt: string;
    cancelledAt: string | null;
    createdByUserId: string;
  } | null;
};

export type ProposeMeetingTimeMutationVariables = Exact<{
  input: UpdateMeetingEventConfirmationInput;
}>;

export type ProposeMeetingTimeMutation = {
  __typename?: "Mutation";
  proposeMeetingTime: {
    __typename?: "MeetingEvent";
    id: string;
    userAConfirmationStatus: MeetingConfirmationStatus;
    userBConfirmationStatus: MeetingConfirmationStatus;
    userAProposedStartDateTime: string | null;
    userAProposedEndDateTime: string | null;
    userBProposedStartDateTime: string | null;
    userBProposedEndDateTime: string | null;
    userANote: string | null;
    userBNote: string | null;
  };
};

export type UpdateMeetingToProposedTimeMutationVariables = Exact<{
  meetingId: Scalars["ID"]["input"];
}>;

export type UpdateMeetingToProposedTimeMutation = {
  __typename?: "Mutation";
  updateMeetingToProposedTime: {
    __typename?: "MeetingEvent";
    id: string;
    startDateTime: string;
    endDateTime: string;
    userAConfirmationStatus: MeetingConfirmationStatus;
    userBConfirmationStatus: MeetingConfirmationStatus;
    userAProposedStartDateTime: string | null;
    userAProposedEndDateTime: string | null;
    userBProposedStartDateTime: string | null;
    userBProposedEndDateTime: string | null;
  };
};

export type CancelMeetingMutationVariables = Exact<{
  input: CancelMeetingEventInput;
}>;

export type CancelMeetingMutation = {
  __typename?: "Mutation";
  cancelMeeting: {
    __typename?: "MeetingEvent";
    id: string;
    cancelledAt: string | null;
  };
};

export type GetCalendarEventsForUserQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
  startDate: Scalars['DateTime']['input'];
  endDate: Scalars['DateTime']['input'];
}>;


export type GetCalendarEventsForUserQuery = { __typename?: 'Query', expandedCalendarOccurrences: Array<{ __typename?: 'ExpandedCalendarEventOccurrence', id: string, occurrenceStart: string, occurrenceEnd: string, originalEvent: { __typename?: 'CalendarEvent', id: string, title: string | null, description: string | null, type: CalendarEventType, startDateTime: string, endDateTime: string, rrule: string | null, exceptionDates: string | null, exceptionRrules: string | null, createdAt: string, updatedAt: string, deletedAt: string | null } }> };

export type CreateInviteCodeMutationVariables = Exact<{
  input: InputMaybe<CreateInviteCodeInputType>;
}>;


export type CreateInviteCodeMutation = { __typename?: 'Mutation', createInviteCode: { __typename?: 'CreateInviteCodeResponseType', success: boolean, message: string, code: string, inviteUrl: string, expiresAt: string | null } };

export type GetOrganizationInvitesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetOrganizationInvitesQuery = { __typename?: 'Query', getOrganizationInvites: Array<{ __typename?: 'InviteCodeType', id: string, code: string, createdAt: string, expiresAt: string | null, usedCount: number, maxUses: number | null, isActive: boolean, inviteUrl: string, createdBy: { __typename?: 'User', id: string, email: string, firstName: string | null, lastName: string | null } | null }> };

export type InviteUserToOrganizationMutationVariables = Exact<{
  input: InviteUserInputType;
}>;


export type InviteUserToOrganizationMutation = { __typename?: 'Mutation', inviteUserToOrganization: { __typename?: 'InviteUserResponseType', success: boolean, message: string, userId: string | null } };

export type MyOrganizationQueryVariables = Exact<{ [key: string]: never; }>;


export type MyOrganizationQuery = { __typename?: 'Query', myOrganization: { __typename?: 'OrganizationType', id: string, name: string, code: string, size: number | null, address: string | null, imageUrl: string | null, createdAt: string, updatedAt: string } | null };

export type OrganizationByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type OrganizationByIdQuery = { __typename?: 'Query', organizationById: { __typename?: 'OrganizationType', id: string, name: string, code: string, size: number | null, address: string | null, imageUrl: string | null, createdAt: string, updatedAt: string } | null };

export type OrganizationsQueryVariables = Exact<{ [key: string]: never; }>;


export type OrganizationsQuery = { __typename?: 'Query', organizations: Array<{ __typename?: 'OrganizationType', id: string, name: string, code: string, size: number | null, address: string | null, imageUrl: string | null, createdAt: string, updatedAt: string }> };

export type RegisterOrganizationMutationVariables = Exact<{
  input: RegisterOrganizationInputType;
}>;


export type RegisterOrganizationMutation = { __typename?: 'Mutation', registerOrganization: { __typename?: 'RegisterOrganizationResponseType', adminEmail: string, message: string, organization: { __typename?: 'OrganizationType', id: string, name: string, code: string, size: number | null, address: string | null, createdAt: string, updatedAt: string } } };

export type UpdateOrganizationMutationVariables = Exact<{
  input: UpdateOrganizationInputType;
}>;


export type UpdateOrganizationMutation = { __typename?: 'Mutation', updateOrganization: { __typename?: 'OrganizationType', id: string, name: string, code: string, size: number | null, address: string | null, imageUrl: string | null, createdAt: string, updatedAt: string } };

export type ValidateInviteCodeQueryVariables = Exact<{
  code: Scalars['String']['input'];
}>;


export type ValidateInviteCodeQuery = { __typename?: 'Query', validateInviteCode: { __typename?: 'InviteCodeValidationResponseType', isValid: boolean, message: string, organizationId: string | null, organizationName: string | null, remainingUses: number | null } };

export type ValidateInviteCodeQueryVariables = Exact<{
  code: Scalars['String']['input'];
}>;


export type ValidateInviteCodeQuery = { __typename?: 'Query', validateInviteCode: { __typename?: 'InviteCodeValidationResponseType', isValid: boolean, message: string, organizationId: string | null, organizationName: string | null, remainingUses: number | null } };

export type GetAlgorithmSettingsQueryVariables = Exact<{
  organizationId: Scalars['String']['input'];
}>;


export type GetAlgorithmSettingsQuery = { __typename?: 'Query', getAlgorithmSettings: { __typename?: 'AlgorithmSettings', id: string, organizationId: string, periodLengthDays: number, randomSeed: number, createdAt: string, updatedAt: string } };

export type UpdateAlgorithmSettingsMutationVariables = Exact<{
  input: UpdateAlgorithmSettingsInput;
}>;


export type UpdateAlgorithmSettingsMutation = { __typename?: 'Mutation', updateAlgorithmSettings: { __typename?: 'AlgorithmSettingsResponse', id: string, organizationId: string, periodLengthDays: number, randomSeed: number, warning: string | null, updatedAt: string } };

export type ExecutePairingAlgorithmMutationVariables = Exact<{
  organizationId: Scalars['String']['input'];
}>;


export type ExecutePairingAlgorithmMutation = { __typename?: 'Mutation', executePairingAlgorithm: { __typename?: 'PairingExecutionResult', success: boolean, pairingsCreated: number, message: string, unpairedUsers: number | null } };

export type GetPairingHistoryQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPairingHistoryQuery = { __typename?: 'Query', getPairingHistory: Array<{ __typename?: 'PairingHistory', id: string, userAId: string, userBId: string, status: PairingStatusEnum, derivedStatus: PairingStatusEnum, createdAt: string, userA: { __typename?: 'User', id: string, email: string, firstName: string | null, lastName: string | null, profileImageUrl: string | null, profileStatus: ProfileStatusEnum }, userB: { __typename?: 'User', id: string, email: string, firstName: string | null, lastName: string | null, profileImageUrl: string | null, profileStatus: ProfileStatusEnum } }> };

export type UpdateUserProfileMutationVariables = Exact<{
  input: UpdateCurrentUserProfileInputType;
}>;

export type UpdateUserProfileMutation = {
  __typename?: "Mutation";
  updateCurrentUserProfile: {
    __typename?: "CurrentUser";
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    about: string | null;
    hobbies: string | null;
    interests: string | null;
    profileImageUrl: string | null;
    profileStatus: ProfileStatusEnum;
    isActive: boolean;
  };
};

export type StatisticsQueryVariables = Exact<{
  filter: InputMaybe<StatisticsFilterInputType>;
}>;

export type StatisticsQuery = {
  __typename?: "Query";
  statistics: {
    __typename?: "StatisticsResponseType";
    newUsersCount: number;
    inactiveUsersCount: number;
    reportsCount: number;
    pairingsByStatus: Array<{
      __typename?: "PairingStatusOverviewType";
      status: string;
      count: number;
    }>;
    pairingsByStatusAndUser: Array<{
      __typename?: "PairingStatusByUserType";
      userId: string;
      userEmail: string;
      userName: string | null;
      status: string;
      count: number;
    }>;
  };
};

export type GetPairedUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPairedUsersQuery = { __typename?: 'Query', getPairedUsers: Array<{ __typename?: 'User', id: string, email: string, firstName: string | null, lastName: string | null, profileStatus: ProfileStatusEnum, role: UserRoleEnum }> };

export type UserByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type UserByIdQuery = { __typename?: 'Query', userById: { __typename?: 'User', id: string, email: string, firstName: string | null, lastName: string | null, profileStatus: ProfileStatusEnum, role: UserRoleEnum } | null };

export type UsersQueryVariables = Exact<{ [key: string]: never; }>;


export type UsersQuery = { __typename?: 'Query', users: Array<{ __typename?: 'User', id: string, email: string, firstName: string | null, lastName: string | null, profileStatus: ProfileStatusEnum, role: UserRoleEnum }> };


export const GetCurrentUserDocument = gql`
    query GetCurrentUser {
  getCurrentUser {
    id
    email
    organizationId
    role
    firstName
    lastName
    about
    hobbies
    interests
    profileImageUrl
    profileStatus
    isActive
    organization {
      id
      name
      code
      imageUrl
    }
  }
}
    `;
export const GetCalendarEventsDocument = gql`
    query GetCalendarEvents($startDate: DateTime!, $endDate: DateTime!) {
  expandedCalendarOccurrences(startDate: $startDate, endDate: $endDate) {
    id
    occurrenceStart
    occurrenceEnd
    originalEvent {
      id
      title
      description
      type
      startDateTime
      endDateTime
      rrule
      exceptionDates
      exceptionRrules
      createdAt
      updatedAt
      deletedAt
    }
  }
}
    `;
export const UpdateCalendarEventDocument = gql`
    mutation UpdateCalendarEvent($input: UpdateCalendarEventInput!, $scope: String, $occurrenceStart: DateTime) {
  updateCalendarEvent(
    input: $input
    scope: $scope
    occurrenceStart: $occurrenceStart
  ) {
    id
    title
    description
    type
    startDateTime
    endDateTime
    rrule
    exceptionDates
    exceptionRrules
    createdAt
    updatedAt
    deletedAt
  }
}
    `;
export const DeleteCalendarEventDocument = gql`
    mutation DeleteCalendarEvent($input: DeleteCalendarEventInput!) {
  deleteCalendarEvent(input: $input)
}
    `;
export const GetMeetingEventsDocument = gql`
    query GetMeetingEvents($startDate: DateTime!, $endDate: DateTime!) {
  meetingEventsByDateRange(startDate: $startDate, endDate: $endDate) {
    id
    startDateTime
    endDateTime
    userAId
    userBId
    userAConfirmationStatus
    userBConfirmationStatus
    userAProposedStartDateTime
    userAProposedEndDateTime
    userBProposedStartDateTime
    userBProposedEndDateTime
    userANote
    userBNote
    pairingId
    createdAt
    cancelledAt
    createdByUserId
  }
}
    `;
export const GetUpcomingMeetingsDocument = gql`
    query GetUpcomingMeetings {
  upcomingMeetings {
    id
    startDateTime
    endDateTime
    userAId
    userBId
    userAConfirmationStatus
    userBConfirmationStatus
    userAProposedStartDateTime
    userAProposedEndDateTime
    userBProposedStartDateTime
    userBProposedEndDateTime
    userANote
    userBNote
    pairingId
    createdAt
    cancelledAt
    createdByUserId
  }
}
    `;
export const GetPendingConfirmationsDocument = gql`
    query GetPendingConfirmations {
  pendingMeetingConfirmations {
    id
    startDateTime
    endDateTime
    userAId
    userBId
    userAConfirmationStatus
    userBConfirmationStatus
    userAProposedStartDateTime
    userAProposedEndDateTime
    userBProposedStartDateTime
    userBProposedEndDateTime
    userANote
    userBNote
    pairingId
    createdAt
    cancelledAt
    createdByUserId
  }
}
    `;
export const ConfirmMeetingDocument = gql`
    mutation ConfirmMeeting($meetingId: ID!, $note: String) {
  confirmMeeting(meetingId: $meetingId, note: $note) {
    id
    userAConfirmationStatus
    userBConfirmationStatus
    userANote
    userBNote
  }
}
    `;
export const RejectMeetingDocument = gql`
    mutation RejectMeeting($meetingId: ID!, $note: String) {
  rejectMeeting(meetingId: $meetingId, note: $note) {
    id
    userAConfirmationStatus
    userBConfirmationStatus
    userANote
    userBNote
  }
}
    `;
export const CreateMeetingDocument = gql`
  mutation CreateMeeting($input: CreateMeetingEventInput!) {
    createMeetingEvent(input: $input) {
      id
      startDateTime
      endDateTime
      userAId
      userBId
      userAConfirmationStatus
      userBConfirmationStatus
      pairingId
      createdAt
      createdByUserId
    }
  }
`;
export const LatestMeetingForPairingDocument = gql`
  query LatestMeetingForPairing($pairingId: ID!) {
    latestMeetingForPairing(pairingId: $pairingId) {
      id
      startDateTime
      endDateTime
      userAId
      userBId
      userAConfirmationStatus
      userBConfirmationStatus
      userAProposedStartDateTime
      userAProposedEndDateTime
      userBProposedStartDateTime
      userBProposedEndDateTime
      userANote
      userBNote
      pairingId
      createdAt
      cancelledAt
      createdByUserId
    }
  }
`;
export const ProposeMeetingTimeDocument = gql`
  mutation ProposeMeetingTime($input: UpdateMeetingEventConfirmationInput!) {
    proposeMeetingTime(input: $input) {
      id
      userAConfirmationStatus
      userBConfirmationStatus
      userAProposedStartDateTime
      userAProposedEndDateTime
      userBProposedStartDateTime
      userBProposedEndDateTime
      userANote
      userBNote
    }
  }
`;
export const UpdateMeetingToProposedTimeDocument = gql`
  mutation UpdateMeetingToProposedTime($meetingId: ID!) {
    updateMeetingToProposedTime(meetingId: $meetingId) {
      id
      startDateTime
      endDateTime
      userAConfirmationStatus
      userBConfirmationStatus
      userAProposedStartDateTime
      userAProposedEndDateTime
      userBProposedStartDateTime
      userBProposedEndDateTime
    }
  }
`;
export const CancelMeetingDocument = gql`
  mutation CancelMeeting($input: CancelMeetingEventInput!) {
    cancelMeeting(input: $input) {
      id
      cancelledAt
    }
  }
`;
export const GetCalendarEventsForUserDocument = gql`
    query GetCalendarEventsForUser($userId: ID!, $startDate: DateTime!, $endDate: DateTime!) {
  expandedCalendarOccurrences(
    userId: $userId
    startDate: $startDate
    endDate: $endDate
  ) {
    id
    occurrenceStart
    occurrenceEnd
    originalEvent {
      id
      title
      description
      type
      startDateTime
      endDateTime
      rrule
      exceptionDates
      exceptionRrules
      createdAt
      updatedAt
      deletedAt
    }
  }
}
    `;
export const CreateInviteCodeDocument = gql`
    mutation CreateInviteCode($input: CreateInviteCodeInputType) {
  createInviteCode(input: $input) {
    success
    message
    code
    inviteUrl
    expiresAt
  }
}
    `;
export const GetOrganizationInvitesDocument = gql`
    query GetOrganizationInvites {
  getOrganizationInvites {
    id
    code
    createdAt
    expiresAt
    usedCount
    maxUses
    isActive
    createdBy {
      id
      email
      firstName
      lastName
    }
    inviteUrl
  }
}
    `;
export const InviteUserToOrganizationDocument = gql`
    mutation InviteUserToOrganization($input: InviteUserInputType!) {
  inviteUserToOrganization(input: $input) {
    success
    message
    userId
  }
}
    `;
export const MyOrganizationDocument = gql`
    query MyOrganization {
  myOrganization {
    id
    name
    code
    size
    address
    imageUrl
    createdAt
    updatedAt
  }
}
    `;
export const OrganizationByIdDocument = gql`
    query OrganizationById($id: ID!) {
  organizationById(id: $id) {
    id
    name
    code
    size
    address
    imageUrl
    createdAt
    updatedAt
  }
}
    `;
export const OrganizationsDocument = gql`
    query Organizations {
  organizations {
    id
    name
    code
    size
    address
    imageUrl
    createdAt
    updatedAt
  }
}
    `;
export const RegisterOrganizationDocument = gql`
    mutation RegisterOrganization($input: RegisterOrganizationInputType!) {
  registerOrganization(input: $input) {
    organization {
      id
      name
      code
      size
      address
      createdAt
      updatedAt
    }
    adminEmail
    message
  }
}
    `;
export const UpdateOrganizationDocument = gql`
    mutation UpdateOrganization($input: UpdateOrganizationInputType!) {
  updateOrganization(input: $input) {
    id
    name
    code
    size
    address
    imageUrl
    createdAt
    updatedAt
  }
}
    `;
export const ValidateInviteCodeDocument = gql`
    query ValidateInviteCode($code: String!) {
  validateInviteCode(code: $code) {
    isValid
    message
    organizationId
    organizationName
    remainingUses
  }
}
    `;
export const ValidateInviteCodeDocument = gql`
    query ValidateInviteCode($code: String!) {
  validateInviteCode(code: $code) {
    isValid
    message
    organizationId
    organizationName
    remainingUses
  }
}
    `;
export const GetAlgorithmSettingsDocument = gql`
    query GetAlgorithmSettings($organizationId: String!) {
  getAlgorithmSettings(organizationId: $organizationId) {
    id
    organizationId
    periodLengthDays
    randomSeed
    createdAt
    updatedAt
  }
}
    `;
export const UpdateAlgorithmSettingsDocument = gql`
    mutation UpdateAlgorithmSettings($input: UpdateAlgorithmSettingsInput!) {
  updateAlgorithmSettings(input: $input) {
    id
    organizationId
    periodLengthDays
    randomSeed
    warning
    updatedAt
  }
}
    `;
export const ExecutePairingAlgorithmDocument = gql`
    mutation ExecutePairingAlgorithm($organizationId: String!) {
  executePairingAlgorithm(organizationId: $organizationId) {
    success
    pairingsCreated
    message
    unpairedUsers
  }
}
    `;
export const GetPairingHistoryDocument = gql`
    query GetPairingHistory {
  getPairingHistory {
    id
    userAId
    userBId
    status
    derivedStatus
    createdAt
    userA {
      id
      email
      firstName
      lastName
      profileImageUrl
      profileStatus
    }
    userB {
      id
      email
      firstName
      lastName
      profileImageUrl
      profileStatus
    }
  }
}
    `;
export const UpdateUserProfileDocument = gql`
  mutation UpdateUserProfile($input: UpdateCurrentUserProfileInputType!) {
    updateCurrentUserProfile(input: $input) {
      id
      email
      firstName
      lastName
      about
      hobbies
      interests
      profileImageUrl
      profileStatus
      isActive
    }
  }
`;
export const StatisticsDocument = gql`
  query Statistics($filter: StatisticsFilterInputType) {
    statistics(filter: $filter) {
      newUsersCount
      inactiveUsersCount
      reportsCount
      pairingsByStatus {
        status
        count
      }
      pairingsByStatusAndUser {
        userId
        userEmail
        userName
        status
        count
      }
    }
  }
`;
export const GetPairedUsersDocument = gql`
    query GetPairedUsers {
  getPairedUsers {
    id
    email
    firstName
    lastName
    profileStatus
    role
  }
}
    `;
export const UserByIdDocument = gql`
    query UserById($id: ID!) {
  userById(id: $id) {
    id
    email
    firstName
    lastName
    profileStatus
    role
  }
}
    `;
export const UsersDocument = gql`
    query Users {
  users {
    id
    email
    firstName
    lastName
    profileStatus
    role
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    GetCurrentUser(variables?: GetCurrentUserQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetCurrentUserQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetCurrentUserQuery>({ document: GetCurrentUserDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetCurrentUser', 'query', variables);
    },
    GetCalendarEvents(variables: GetCalendarEventsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetCalendarEventsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetCalendarEventsQuery>({ document: GetCalendarEventsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetCalendarEvents', 'query', variables);
    },
    UpdateCalendarEvent(variables: UpdateCalendarEventMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<UpdateCalendarEventMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateCalendarEventMutation>({ document: UpdateCalendarEventDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'UpdateCalendarEvent', 'mutation', variables);
    },
    DeleteCalendarEvent(variables: DeleteCalendarEventMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DeleteCalendarEventMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteCalendarEventMutation>({ document: DeleteCalendarEventDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'DeleteCalendarEvent', 'mutation', variables);
    },
    GetMeetingEvents(variables: GetMeetingEventsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetMeetingEventsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetMeetingEventsQuery>({ document: GetMeetingEventsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetMeetingEvents', 'query', variables);
    },
    GetUpcomingMeetings(variables?: GetUpcomingMeetingsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetUpcomingMeetingsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetUpcomingMeetingsQuery>({ document: GetUpcomingMeetingsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetUpcomingMeetings', 'query', variables);
    },
    GetPendingConfirmations(variables?: GetPendingConfirmationsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetPendingConfirmationsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetPendingConfirmationsQuery>({ document: GetPendingConfirmationsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetPendingConfirmations', 'query', variables);
    },
    ConfirmMeeting(variables: ConfirmMeetingMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<ConfirmMeetingMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<ConfirmMeetingMutation>({ document: ConfirmMeetingDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'ConfirmMeeting', 'mutation', variables);
    },
    RejectMeeting(variables: RejectMeetingMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<RejectMeetingMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<RejectMeetingMutation>({ document: RejectMeetingDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'RejectMeeting', 'mutation', variables);
    },
    CreateMeeting(variables: CreateMeetingMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CreateMeetingMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateMeetingMutation>({ document: CreateMeetingDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CreateMeeting', 'mutation', variables);
    },
    LatestMeetingForPairing(
      variables: LatestMeetingForPairingQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit["signal"]
    ): Promise<LatestMeetingForPairingQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<LatestMeetingForPairingQuery>({
            document: LatestMeetingForPairingDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        "LatestMeetingForPairing",
        "query",
        variables
      );
    },
    ProposeMeetingTime(
      variables: ProposeMeetingTimeMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit["signal"]
    ): Promise<ProposeMeetingTimeMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<ProposeMeetingTimeMutation>({
            document: ProposeMeetingTimeDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        "ProposeMeetingTime",
        "mutation",
        variables
      );
    },
    UpdateMeetingToProposedTime(
      variables: UpdateMeetingToProposedTimeMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit["signal"]
    ): Promise<UpdateMeetingToProposedTimeMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<UpdateMeetingToProposedTimeMutation>({
            document: UpdateMeetingToProposedTimeDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        "UpdateMeetingToProposedTime",
        "mutation",
        variables
      );
    },
    CancelMeeting(
      variables: CancelMeetingMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit["signal"]
    ): Promise<CancelMeetingMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<CancelMeetingMutation>({
            document: CancelMeetingDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        "CancelMeeting",
        "mutation",
        variables
      );
    },
    GetCalendarEventsForUser(
      variables: GetCalendarEventsForUserQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit["signal"]
    ): Promise<GetCalendarEventsForUserQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetCalendarEventsForUserQuery>({
            document: GetCalendarEventsForUserDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        "GetCalendarEventsForUser",
        "query",
        variables
      );
    },
    CreateInviteCode(variables?: CreateInviteCodeMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CreateInviteCodeMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateInviteCodeMutation>({ document: CreateInviteCodeDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CreateInviteCode', 'mutation', variables);
    },
    GetOrganizationInvites(variables?: GetOrganizationInvitesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetOrganizationInvitesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetOrganizationInvitesQuery>({ document: GetOrganizationInvitesDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetOrganizationInvites', 'query', variables);
    },
    InviteUserToOrganization(variables: InviteUserToOrganizationMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<InviteUserToOrganizationMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<InviteUserToOrganizationMutation>({ document: InviteUserToOrganizationDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'InviteUserToOrganization', 'mutation', variables);
    },
    MyOrganization(variables?: MyOrganizationQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<MyOrganizationQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<MyOrganizationQuery>({ document: MyOrganizationDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'MyOrganization', 'query', variables);
    },
    OrganizationById(variables: OrganizationByIdQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<OrganizationByIdQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<OrganizationByIdQuery>({ document: OrganizationByIdDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'OrganizationById', 'query', variables);
    },
    Organizations(variables?: OrganizationsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<OrganizationsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<OrganizationsQuery>({ document: OrganizationsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'Organizations', 'query', variables);
    },
    RegisterOrganization(variables: RegisterOrganizationMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<RegisterOrganizationMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<RegisterOrganizationMutation>({ document: RegisterOrganizationDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'RegisterOrganization', 'mutation', variables);
    },
    UpdateOrganization(variables: UpdateOrganizationMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<UpdateOrganizationMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateOrganizationMutation>({ document: UpdateOrganizationDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'UpdateOrganization', 'mutation', variables);
    },
    ValidateInviteCode(variables: ValidateInviteCodeQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<ValidateInviteCodeQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ValidateInviteCodeQuery>({ document: ValidateInviteCodeDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'ValidateInviteCode', 'query', variables);
    },
    ValidateInviteCode(variables: ValidateInviteCodeQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<ValidateInviteCodeQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ValidateInviteCodeQuery>({ document: ValidateInviteCodeDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'ValidateInviteCode', 'query', variables);
    },
    GetAlgorithmSettings(variables: GetAlgorithmSettingsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetAlgorithmSettingsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetAlgorithmSettingsQuery>({ document: GetAlgorithmSettingsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetAlgorithmSettings', 'query', variables);
    },
    UpdateAlgorithmSettings(variables: UpdateAlgorithmSettingsMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<UpdateAlgorithmSettingsMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateAlgorithmSettingsMutation>({ document: UpdateAlgorithmSettingsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'UpdateAlgorithmSettings', 'mutation', variables);
    },
    ExecutePairingAlgorithm(variables: ExecutePairingAlgorithmMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<ExecutePairingAlgorithmMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<ExecutePairingAlgorithmMutation>({ document: ExecutePairingAlgorithmDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'ExecutePairingAlgorithm', 'mutation', variables);
    },
    GetPairingHistory(variables?: GetPairingHistoryQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetPairingHistoryQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetPairingHistoryQuery>({ document: GetPairingHistoryDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetPairingHistory', 'query', variables);
    },
    UpdateUserProfile(variables: UpdateUserProfileMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<UpdateUserProfileMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateUserProfileMutation>({ document: UpdateUserProfileDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'UpdateUserProfile', 'mutation', variables);
    },
    Statistics(variables?: StatisticsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<StatisticsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<StatisticsQuery>({ document: StatisticsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'Statistics', 'query', variables);
    },
    Statistics(
      variables?: StatisticsQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit["signal"]
    ): Promise<StatisticsQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<StatisticsQuery>({
            document: StatisticsDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        "Statistics",
        "query",
        variables
      );
    },
    GetPairedUsers(
      variables?: GetPairedUsersQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit["signal"]
    ): Promise<GetPairedUsersQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetPairedUsersQuery>({
            document: GetPairedUsersDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        "GetPairedUsers",
        "query",
        variables
      );
    },
    UserById(variables: UserByIdQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<UserByIdQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<UserByIdQuery>({ document: UserByIdDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'UserById', 'query', variables);
    },
    Users(variables?: UsersQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<UsersQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<UsersQuery>({ document: UsersDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'Users', 'query', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;