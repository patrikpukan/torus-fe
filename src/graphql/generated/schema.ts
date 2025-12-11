import type { GraphQLClient, RequestOptions } from 'graphql-request';
import gql from 'graphql-tag';
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

export type AnonUser = {
  __typename?: 'AnonUser';
  email: Maybe<Scalars['String']['output']>;
  firstName: Maybe<Scalars['String']['output']>;
  hobbies: Maybe<Array<Tag>>;
  id: Scalars['ID']['output'];
  interests: Maybe<Array<Tag>>;
  lastName: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['ID']['output'];
  preferredActivity: Maybe<Scalars['String']['output']>;
  profileImageUrl: Maybe<Scalars['String']['output']>;
  role: Maybe<UserRoleEnum>;
};

export type BanUserInput = {
  expiresAt?: InputMaybe<Scalars['DateTime']['input']>;
  reason: Scalars['String']['input'];
  userId: Scalars['ID']['input'];
};

export type CalendarEvent = {
  __typename?: 'CalendarEvent';
  createdAt: Scalars['DateTime']['output'];
  deletedAt: Maybe<Scalars['DateTime']['output']>;
  description: Maybe<Scalars['String']['output']>;
  endDateTime: Scalars['DateTime']['output'];
  exceptionDates: Maybe<Scalars['String']['output']>;
  exceptionRrules: Maybe<Scalars['String']['output']>;
  externalId: Maybe<Scalars['String']['output']>;
  externalSource: Maybe<Scalars['String']['output']>;
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

export type CreateDepartmentInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  organizationId: Scalars['ID']['input'];
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
  activeBan: Maybe<UserBan>;
  department: Maybe<Department>;
  departmentId: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  firstName: Maybe<Scalars['String']['output']>;
  hobbies: Maybe<Array<Tag>>;
  id: Scalars['ID']['output'];
  interests: Maybe<Array<Tag>>;
  isActive: Scalars['Boolean']['output'];
  lastName: Maybe<Scalars['String']['output']>;
  location: Maybe<Scalars['String']['output']>;
  organization: SimpleOrganizationType;
  organizationId: Scalars['ID']['output'];
  position: Maybe<Scalars['String']['output']>;
  preferredActivity: Maybe<Scalars['String']['output']>;
  profileImageUrl: Maybe<Scalars['String']['output']>;
  profileStatus: ProfileStatusEnum;
  role: UserRoleEnum;
  supabaseUserId: Maybe<Scalars['String']['output']>;
  suspendedUntil: Maybe<Scalars['DateTime']['output']>;
};

export type DeleteCalendarEventInput = {
  id: Scalars['ID']['input'];
  occurrenceStart?: InputMaybe<Scalars['DateTime']['input']>;
  scope: Scalars['String']['input'];
};

export type DeleteDepartmentInput = {
  id: Scalars['ID']['input'];
  organizationId: Scalars['ID']['input'];
};

export type Department = {
  __typename?: 'Department';
  createdAt: Scalars['DateTime']['output'];
  description: Maybe<Scalars['String']['output']>;
  employeeCount: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  organizationId: Scalars['ID']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type DepartmentDistributionItemType = {
  __typename?: 'DepartmentDistributionItemType';
  departmentName: Scalars['String']['output'];
  userCount: Scalars['Int']['output'];
};

export type DepartmentDistributionResponseType = {
  __typename?: 'DepartmentDistributionResponseType';
  departments: Array<DepartmentDistributionItemType>;
  totalUsers: Scalars['Int']['output'];
};

export type ExpandedCalendarEventOccurrence = {
  __typename?: 'ExpandedCalendarEventOccurrence';
  id: Scalars['ID']['output'];
  occurrenceEnd: Scalars['DateTime']['output'];
  occurrenceStart: Scalars['DateTime']['output'];
  originalEvent: CalendarEvent;
};

export type GoogleCalendar = {
  __typename?: 'GoogleCalendar';
  backgroundColor: Maybe<Scalars['String']['output']>;
  foregroundColor: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  primary: Maybe<Scalars['Boolean']['output']>;
  summary: Scalars['String']['output'];
};

export type GoogleCalendarImportResult = {
  __typename?: 'GoogleCalendarImportResult';
  importedCount: Scalars['Float']['output'];
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type ImportGoogleCalendarEventsInput = {
  accessToken?: InputMaybe<Scalars['String']['input']>;
  calendarIds: Array<Scalars['String']['input']>;
  endDate: Scalars['DateTime']['input'];
  startDate: Scalars['DateTime']['input'];
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

export type MessageModel = {
  __typename?: 'MessageModel';
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  isRead: Scalars['Boolean']['output'];
  pairingId: Scalars['ID']['output'];
  senderId: Scalars['ID']['output'];
};

export type MessagesReadEvent = {
  __typename?: 'MessagesReadEvent';
  pairingId: Scalars['ID']['output'];
  userId: Scalars['ID']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  banUser: User;
  cancelMeeting: MeetingEvent;
  confirmMeeting: MeetingEvent;
  createCalendarEvent: CalendarEvent;
  createDepartment: Department;
  createInviteCode: CreateInviteCodeResponseType;
  createMeetingEvent: MeetingEvent;
  deleteCalendarEvent: Scalars['Boolean']['output'];
  deleteDepartment: Scalars['Boolean']['output'];
  deleteUser: User;
  executePairingAlgorithm: PairingExecutionResult;
  importGoogleCalendarEvents: GoogleCalendarImportResult;
  inviteUserToOrganization: InviteUserResponseType;
  /** Mark all messages in a pairing as read */
  markMessagesAsRead: Scalars['Boolean']['output'];
  pauseActivity: CalendarEvent;
  proposeMeetingTime: MeetingEvent;
  registerOrganization: RegisterOrganizationResponseType;
  rejectMeeting: MeetingEvent;
  reportUser: UserReport;
  resolveReport: UserReport;
  resumeActivity: Scalars['Boolean']['output'];
  /** Send a message to a user you are paired with */
  sendMessage: MessageModel;
  /** Set typing status for a pairing */
  setTypingStatus: Scalars['Boolean']['output'];
  signUp: User;
  unbanUser: User;
  updateAlgorithmSettings: AlgorithmSettingsResponse;
  updateCalendarEvent: Array<CalendarEvent>;
  updateCurrentUserProfile: CurrentUser;
  updateDepartment: Department;
  updateMeetingToProposedTime: MeetingEvent;
  updateOrganization: OrganizationType;
  updateUser: User;
};


export type MutationBanUserArgs = {
  input: BanUserInput;
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


export type MutationCreateDepartmentArgs = {
  input: CreateDepartmentInput;
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


export type MutationDeleteDepartmentArgs = {
  input: DeleteDepartmentInput;
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationExecutePairingAlgorithmArgs = {
  organizationId: Scalars['String']['input'];
};


export type MutationImportGoogleCalendarEventsArgs = {
  input: ImportGoogleCalendarEventsInput;
};


export type MutationInviteUserToOrganizationArgs = {
  input: InviteUserInputType;
};


export type MutationMarkMessagesAsReadArgs = {
  pairingId: Scalars['ID']['input'];
};


export type MutationPauseActivityArgs = {
  input: PauseActivityInput;
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


export type MutationReportUserArgs = {
  input: ReportUserInput;
};


export type MutationResolveReportArgs = {
  input: ResolveReportInput;
};


export type MutationSendMessageArgs = {
  input: SendMessageInput;
};


export type MutationSetTypingStatusArgs = {
  isTyping: Scalars['Boolean']['input'];
  pairingId: Scalars['ID']['input'];
};


export type MutationSignUpArgs = {
  data: SignUpInputType;
};


export type MutationUnbanUserArgs = {
  userId: Scalars['ID']['input'];
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


export type MutationUpdateDepartmentArgs = {
  input: UpdateDepartmentInput;
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
  departments: Maybe<Array<Department>>;
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

export type PairingPeriod = {
  __typename?: 'PairingPeriod';
  endDate: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  organizationId: Scalars['ID']['output'];
  startDate: Scalars['DateTime']['output'];
  status: PairingPeriodStatusEnum;
};

export type PairingPeriodStatusEnum =
  | 'active'
  | 'closed'
  | 'upcoming';

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

export type PauseActivityInput = {
  durationType: PauseDurationType;
  periodsCount?: InputMaybe<Scalars['Float']['input']>;
  untilDate?: InputMaybe<Scalars['DateTime']['input']>;
};

/** Type of activity pause duration */
export type PauseDurationType =
  | 'INDEFINITE'
  | 'N_PERIODS'
  | 'ONE_PERIOD'
  | 'UNTIL_DATE';

/** Profile onboarding status */
export type ProfileStatusEnum =
  | 'active'
  | 'pending'
  | 'suspended';

export type Query = {
  __typename?: 'Query';
  activePairingPeriod: Maybe<PairingPeriod>;
  allMeetingsForPairing: Array<MeetingEvent>;
  anonUsers: Array<User>;
  calendarEventById: Maybe<CalendarEvent>;
  calendarEventsByDateRange: Array<CalendarEvent>;
  departmentDistribution: DepartmentDistributionResponseType;
  expandedCalendarOccurrences: Array<ExpandedCalendarEventOccurrence>;
  getAlgorithmSettings: AlgorithmSettings;
  getAllTags: Array<Tag>;
  getCurrentUser: Maybe<CurrentUser>;
  getDepartmentById: Maybe<Department>;
  getDepartmentsByOrganization: Array<Department>;
  /** Get all messages for a specific pairing */
  getMessages: Array<MessageModel>;
  getOrganizationInvites: Array<InviteCodeType>;
  getPairedUsers: Array<User>;
  getPairingHistory: Array<PairingHistory>;
  getTagsByCategory: Array<Tag>;
  getUsersByDepartment: Array<AnonUser>;
  googleCalendarList: Array<GoogleCalendar>;
  latestMeetingForPairing: Maybe<MeetingEvent>;
  meetingEventById: Maybe<MeetingEvent>;
  meetingEventsByDateRange: Array<MeetingEvent>;
  myOrganization: Maybe<OrganizationType>;
  organizationById: Maybe<OrganizationType>;
  organizations: Array<OrganizationType>;
  pendingMeetingConfirmations: Array<MeetingEvent>;
  reportById: Maybe<UserReport>;
  reports: Array<UserReport>;
  statistics: StatisticsResponseType;
  upcomingMeetings: Array<MeetingEvent>;
  userById: Maybe<User>;
  users: Array<User>;
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
  organizationId: Scalars['ID']['input'];
};


export type QueryGetDepartmentByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetDepartmentsByOrganizationArgs = {
  organizationId: Scalars['String']['input'];
};


export type QueryGetMessagesArgs = {
  pairingId: Scalars['ID']['input'];
};


export type QueryGetTagsByCategoryArgs = {
  category: TagCategory;
};


export type QueryGetUsersByDepartmentArgs = {
  departmentId: Scalars['String']['input'];
};


export type QueryGoogleCalendarListArgs = {
  accessToken: InputMaybe<Scalars['String']['input']>;
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


export type QueryReportByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryStatisticsArgs = {
  filter: InputMaybe<StatisticsFilterInputType>;
};


export type QueryUserByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUsersArgs = {
  organizationId: InputMaybe<Scalars['ID']['input']>;
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

export type ReportStatusEnum =
  | 'pending'
  | 'resolved';

export type ReportUserInput = {
  reason: Scalars['String']['input'];
  reportedUserId: Scalars['ID']['input'];
};

export type ResolveReportInput = {
  reportId: Scalars['ID']['input'];
  resolutionNote?: InputMaybe<Scalars['String']['input']>;
};

export type SendMessageInput = {
  content: Scalars['String']['input'];
  pairingId: Scalars['ID']['input'];
};

export type SignUpInputType = {
  email: Scalars['String']['input'];
  firstName?: InputMaybe<Scalars['String']['input']>;
  /** Optional invite code for organization assignment */
  inviteCode?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
  profilePicture?: InputMaybe<Scalars['Upload']['input']>;
};

export type SimpleOrganizationType = {
  __typename?: 'SimpleOrganizationType';
  code: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  imageUrl: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
};

export type StatisticsFilterInputType = {
  endDate?: InputMaybe<Scalars['String']['input']>;
  month?: InputMaybe<Scalars['Int']['input']>;
  organizationId?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
  year?: InputMaybe<Scalars['Int']['input']>;
};

export type StatisticsResponseType = {
  __typename?: 'StatisticsResponseType';
  inactiveUsersCount: Scalars['Int']['output'];
  newUsersCount: Scalars['Int']['output'];
  pairingsByStatus: Array<PairingStatusOverviewType>;
  pairingsByStatusAndUser: Array<PairingStatusByUserType>;
  reportsCount: Scalars['Int']['output'];
};

export type Subscription = {
  __typename?: 'Subscription';
  /** Subscribe to new messages in a pairing */
  messageSent: MessageModel;
  /** Subscribe to read receipt events in a pairing */
  messagesRead: MessagesReadEvent;
  /** Subscribe to typing status changes in a pairing */
  typingStatus: TypingStatus;
};


export type SubscriptionMessageSentArgs = {
  pairingId: Scalars['ID']['input'];
};


export type SubscriptionMessagesReadArgs = {
  pairingId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};


export type SubscriptionTypingStatusArgs = {
  pairingId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};

export type Tag = {
  __typename?: 'Tag';
  category: TagCategory;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

/** Category of a tag (hobby or interest) */
export type TagCategory =
  | 'HOBBY'
  | 'INTEREST';

export type TypingStatus = {
  __typename?: 'TypingStatus';
  isTyping: Scalars['Boolean']['output'];
  pairingId: Scalars['ID']['output'];
  userId: Scalars['ID']['output'];
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
  departmentId?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  hobbyIds?: InputMaybe<Array<Scalars['String']['input']>>;
  interestIds?: InputMaybe<Array<Scalars['String']['input']>>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  position?: InputMaybe<Scalars['String']['input']>;
  preferredActivity?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateDepartmentInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
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
  about: Maybe<Scalars['String']['output']>;
  activeBan: Maybe<UserBan>;
  createdAt: Scalars['DateTime']['output'];
  department: Maybe<Department>;
  departmentId: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  firstName: Maybe<Scalars['String']['output']>;
  hobbies: Maybe<Array<Tag>>;
  id: Scalars['ID']['output'];
  interests: Maybe<Array<Tag>>;
  isActive: Scalars['Boolean']['output'];
  lastName: Maybe<Scalars['String']['output']>;
  location: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['ID']['output'];
  position: Maybe<Scalars['String']['output']>;
  preferredActivity: Maybe<Scalars['String']['output']>;
  profileImageUrl: Maybe<Scalars['String']['output']>;
  profileStatus: ProfileStatusEnum;
  role: UserRoleEnum;
  supabaseUserId: Maybe<Scalars['String']['output']>;
  suspendedUntil: Maybe<Scalars['DateTime']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type UserBan = {
  __typename?: 'UserBan';
  bannedById: Scalars['ID']['output'];
  createdAt: Scalars['DateTime']['output'];
  expiresAt: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  organizationId: Scalars['ID']['output'];
  reason: Scalars['String']['output'];
  userId: Scalars['ID']['output'];
};

export type UserReport = {
  __typename?: 'UserReport';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  pairingId: Scalars['ID']['output'];
  reason: Scalars['String']['output'];
  reportedUser: User;
  reportedUserId: Scalars['ID']['output'];
  reporter: User;
  reporterId: Scalars['ID']['output'];
  resolutionNote: Maybe<Scalars['String']['output']>;
  resolvedAt: Maybe<Scalars['DateTime']['output']>;
  resolvedBy: Maybe<User>;
  status: ReportStatusEnum;
};

/** User role */
export type UserRoleEnum =
  | 'org_admin'
  | 'super_admin'
  | 'user';

export type GetCurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentUserQuery = { __typename?: 'Query', getCurrentUser: { __typename?: 'CurrentUser', id: string, email: string, organizationId: string, role: UserRoleEnum, firstName: string | null, lastName: string | null, about: string | null, location: string | null, position: string | null, profileImageUrl: string | null, profileStatus: ProfileStatusEnum, isActive: boolean, preferredActivity: string | null, suspendedUntil: string | null, departmentId: string | null, hobbies: Array<{ __typename?: 'Tag', id: string, name: string, category: TagCategory }> | null, interests: Array<{ __typename?: 'Tag', id: string, name: string, category: TagCategory }> | null, activeBan: { __typename?: 'UserBan', id: string, reason: string, createdAt: string, expiresAt: string | null } | null, organization: { __typename?: 'SimpleOrganizationType', id: string, name: string, code: string, imageUrl: string | null }, department: { __typename?: 'Department', id: string, name: string } | null } | null };

export type GetCalendarEventsQueryVariables = Exact<{
  startDate: Scalars['DateTime']['input'];
  endDate: Scalars['DateTime']['input'];
}>;


export type GetCalendarEventsQuery = { __typename?: 'Query', expandedCalendarOccurrences: Array<{ __typename?: 'ExpandedCalendarEventOccurrence', id: string, occurrenceStart: string, occurrenceEnd: string, originalEvent: { __typename?: 'CalendarEvent', id: string, title: string | null, description: string | null, type: CalendarEventType, startDateTime: string, endDateTime: string, rrule: string | null, exceptionDates: string | null, exceptionRrules: string | null, externalId: string | null, externalSource: string | null, createdAt: string, updatedAt: string, deletedAt: string | null } }> };

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

export type GetGoogleCalendarListQueryVariables = Exact<{
  accessToken: InputMaybe<Scalars['String']['input']>;
}>;


export type GetGoogleCalendarListQuery = { __typename?: 'Query', googleCalendarList: Array<{ __typename?: 'GoogleCalendar', id: string, summary: string, backgroundColor: string | null, foregroundColor: string | null, primary: boolean | null }> };

export type ImportGoogleCalendarEventsMutationVariables = Exact<{
  input: ImportGoogleCalendarEventsInput;
}>;


export type ImportGoogleCalendarEventsMutation = { __typename?: 'Mutation', importGoogleCalendarEvents: { __typename?: 'GoogleCalendarImportResult', success: boolean, importedCount: number, message: string } };

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


export type CreateMeetingMutation = { __typename?: 'Mutation', createMeetingEvent: { __typename?: 'MeetingEvent', id: string, startDateTime: string, endDateTime: string, userAId: string, userBId: string, userAConfirmationStatus: MeetingConfirmationStatus, userBConfirmationStatus: MeetingConfirmationStatus, pairingId: string | null, createdAt: string, createdByUserId: string } };

export type LatestMeetingForPairingQueryVariables = Exact<{
  pairingId: Scalars['ID']['input'];
}>;


export type LatestMeetingForPairingQuery = { __typename?: 'Query', latestMeetingForPairing: { __typename?: 'MeetingEvent', id: string, startDateTime: string, endDateTime: string, userAId: string, userBId: string, userAConfirmationStatus: MeetingConfirmationStatus, userBConfirmationStatus: MeetingConfirmationStatus, userAProposedStartDateTime: string | null, userAProposedEndDateTime: string | null, userBProposedStartDateTime: string | null, userBProposedEndDateTime: string | null, userANote: string | null, userBNote: string | null, pairingId: string | null, createdAt: string, cancelledAt: string | null, createdByUserId: string } | null };

export type ProposeMeetingTimeMutationVariables = Exact<{
  input: UpdateMeetingEventConfirmationInput;
}>;


export type ProposeMeetingTimeMutation = { __typename?: 'Mutation', proposeMeetingTime: { __typename?: 'MeetingEvent', id: string, userAConfirmationStatus: MeetingConfirmationStatus, userBConfirmationStatus: MeetingConfirmationStatus, userAProposedStartDateTime: string | null, userAProposedEndDateTime: string | null, userBProposedStartDateTime: string | null, userBProposedEndDateTime: string | null, userANote: string | null, userBNote: string | null } };

export type UpdateMeetingToProposedTimeMutationVariables = Exact<{
  meetingId: Scalars['ID']['input'];
}>;


export type UpdateMeetingToProposedTimeMutation = { __typename?: 'Mutation', updateMeetingToProposedTime: { __typename?: 'MeetingEvent', id: string, startDateTime: string, endDateTime: string, userAConfirmationStatus: MeetingConfirmationStatus, userBConfirmationStatus: MeetingConfirmationStatus, userAProposedStartDateTime: string | null, userAProposedEndDateTime: string | null, userBProposedStartDateTime: string | null, userBProposedEndDateTime: string | null } };

export type CancelMeetingMutationVariables = Exact<{
  input: CancelMeetingEventInput;
}>;


export type CancelMeetingMutation = { __typename?: 'Mutation', cancelMeeting: { __typename?: 'MeetingEvent', id: string, cancelledAt: string | null } };

export type GetCalendarEventsForUserQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
  startDate: Scalars['DateTime']['input'];
  endDate: Scalars['DateTime']['input'];
}>;


export type GetCalendarEventsForUserQuery = { __typename?: 'Query', expandedCalendarOccurrences: Array<{ __typename?: 'ExpandedCalendarEventOccurrence', id: string, occurrenceStart: string, occurrenceEnd: string, originalEvent: { __typename?: 'CalendarEvent', id: string, title: string | null, description: string | null, type: CalendarEventType, startDateTime: string, endDateTime: string, rrule: string | null, exceptionDates: string | null, exceptionRrules: string | null, createdAt: string, updatedAt: string, deletedAt: string | null } }> };

export type PauseActivityMutationVariables = Exact<{
  input: PauseActivityInput;
}>;


export type PauseActivityMutation = { __typename?: 'Mutation', pauseActivity: { __typename?: 'CalendarEvent', id: string, userId: string, type: CalendarEventType, title: string | null, description: string | null, startDateTime: string, endDateTime: string, createdAt: string } };

export type ResumeActivityMutationVariables = Exact<{ [key: string]: never; }>;


export type ResumeActivityMutation = { __typename?: 'Mutation', resumeActivity: boolean };

export type GetActivePauseQueryVariables = Exact<{
  startDate: Scalars['DateTime']['input'];
  endDate: Scalars['DateTime']['input'];
}>;


export type GetActivePauseQuery = { __typename?: 'Query', expandedCalendarOccurrences: Array<{ __typename?: 'ExpandedCalendarEventOccurrence', id: string, occurrenceStart: string, occurrenceEnd: string, originalEvent: { __typename?: 'CalendarEvent', id: string, type: CalendarEventType, title: string | null, description: string | null, startDateTime: string, endDateTime: string, deletedAt: string | null } }> };

export type GetMessagesQueryVariables = Exact<{
  pairingId: Scalars['ID']['input'];
}>;


export type GetMessagesQuery = { __typename?: 'Query', getMessages: Array<{ __typename?: 'MessageModel', id: string, pairingId: string, senderId: string, content: string, isRead: boolean, createdAt: string }> };

export type SendMessageMutationVariables = Exact<{
  input: SendMessageInput;
}>;


export type SendMessageMutation = { __typename?: 'Mutation', sendMessage: { __typename?: 'MessageModel', id: string, pairingId: string, senderId: string, content: string, isRead: boolean, createdAt: string } };

export type MessageSentSubscriptionVariables = Exact<{
  pairingId: Scalars['ID']['input'];
}>;


export type MessageSentSubscription = { __typename?: 'Subscription', messageSent: { __typename?: 'MessageModel', id: string, pairingId: string, senderId: string, content: string, isRead: boolean, createdAt: string } };

export type TypingStatusSubscriptionVariables = Exact<{
  pairingId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
}>;


export type TypingStatusSubscription = { __typename?: 'Subscription', typingStatus: { __typename?: 'TypingStatus', pairingId: string, userId: string, isTyping: boolean } };

export type SetTypingStatusMutationVariables = Exact<{
  pairingId: Scalars['ID']['input'];
  isTyping: Scalars['Boolean']['input'];
}>;


export type SetTypingStatusMutation = { __typename?: 'Mutation', setTypingStatus: boolean };

export type MessagesReadSubscriptionVariables = Exact<{
  pairingId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
}>;


export type MessagesReadSubscription = { __typename?: 'Subscription', messagesRead: { __typename?: 'MessagesReadEvent', pairingId: string, userId: string } };

export type MarkMessagesAsReadMutationVariables = Exact<{
  pairingId: Scalars['ID']['input'];
}>;


export type MarkMessagesAsReadMutation = { __typename?: 'Mutation', markMessagesAsRead: boolean };

export type CreateDepartmentMutationVariables = Exact<{
  input: CreateDepartmentInput;
}>;


export type CreateDepartmentMutation = { __typename?: 'Mutation', createDepartment: { __typename?: 'Department', id: string, name: string, description: string | null, organizationId: string, employeeCount: number, createdAt: string, updatedAt: string } };

export type CreateInviteCodeMutationVariables = Exact<{
  input: InputMaybe<CreateInviteCodeInputType>;
}>;


export type CreateInviteCodeMutation = { __typename?: 'Mutation', createInviteCode: { __typename?: 'CreateInviteCodeResponseType', success: boolean, message: string, code: string, inviteUrl: string, expiresAt: string | null } };

export type DeleteDepartmentMutationVariables = Exact<{
  input: DeleteDepartmentInput;
}>;


export type DeleteDepartmentMutation = { __typename?: 'Mutation', deleteDepartment: boolean };

export type GetDepartmentsByOrganizationQueryVariables = Exact<{
  organizationId: Scalars['String']['input'];
}>;


export type GetDepartmentsByOrganizationQuery = { __typename?: 'Query', getDepartmentsByOrganization: Array<{ __typename?: 'Department', id: string, name: string, description: string | null, organizationId: string, employeeCount: number, createdAt: string, updatedAt: string }> };

export type GetUsersByDepartmentQueryVariables = Exact<{
  departmentId: Scalars['String']['input'];
}>;


export type GetUsersByDepartmentQuery = { __typename?: 'Query', getUsersByDepartment: Array<{ __typename?: 'AnonUser', id: string, email: string | null, firstName: string | null, lastName: string | null, profileImageUrl: string | null, role: UserRoleEnum | null }> };

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

export type UpdateDepartmentMutationVariables = Exact<{
  input: UpdateDepartmentInput;
}>;


export type UpdateDepartmentMutation = { __typename?: 'Mutation', updateDepartment: { __typename?: 'Department', id: string, name: string, description: string | null, organizationId: string, employeeCount: number, createdAt: string, updatedAt: string } };

export type UpdateOrganizationMutationVariables = Exact<{
  input: UpdateOrganizationInputType;
}>;


export type UpdateOrganizationMutation = { __typename?: 'Mutation', updateOrganization: { __typename?: 'OrganizationType', id: string, name: string, code: string, size: number | null, address: string | null, imageUrl: string | null, createdAt: string, updatedAt: string } };

export type ValidateInviteCodeQueryVariables = Exact<{
  code: Scalars['String']['input'];
}>;


export type ValidateInviteCodeQuery = { __typename?: 'Query', validateInviteCode: { __typename?: 'InviteCodeValidationResponseType', isValid: boolean, message: string, organizationId: string | null, organizationName: string | null, remainingUses: number | null } };

export type GetAlgorithmSettingsQueryVariables = Exact<{
  organizationId: Scalars['ID']['input'];
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

export type ActivePairingPeriodQueryVariables = Exact<{ [key: string]: never; }>;


export type ActivePairingPeriodQuery = { __typename?: 'Query', activePairingPeriod: { __typename?: 'PairingPeriod', id: string, organizationId: string, startDate: string, endDate: string | null, status: PairingPeriodStatusEnum } | null };

export type UpdateUserProfileMutationVariables = Exact<{
  input: UpdateCurrentUserProfileInputType;
}>;


export type UpdateUserProfileMutation = { __typename?: 'Mutation', updateCurrentUserProfile: { __typename?: 'CurrentUser', id: string, email: string, firstName: string | null, lastName: string | null, about: string | null, location: string | null, position: string | null, preferredActivity: string | null, profileImageUrl: string | null, profileStatus: ProfileStatusEnum, isActive: boolean, departmentId: string | null, hobbies: Array<{ __typename?: 'Tag', id: string, name: string, category: TagCategory }> | null, interests: Array<{ __typename?: 'Tag', id: string, name: string, category: TagCategory }> | null, department: { __typename?: 'Department', id: string, name: string } | null } };

export type GetAllTagsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllTagsQuery = { __typename?: 'Query', getAllTags: Array<{ __typename?: 'Tag', id: string, name: string, category: TagCategory }> };

export type GetTagsByCategoryQueryVariables = Exact<{
  category: TagCategory;
}>;


export type GetTagsByCategoryQuery = { __typename?: 'Query', getTagsByCategory: Array<{ __typename?: 'Tag', id: string, name: string, category: TagCategory }> };

export type ReportByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ReportByIdQuery = { __typename?: 'Query', reportById: { __typename?: 'UserReport', id: string, createdAt: string, reason: string, status: ReportStatusEnum, resolvedAt: string | null, resolutionNote: string | null, reporter: { __typename?: 'User', id: string, firstName: string | null, lastName: string | null, email: string }, reportedUser: { __typename?: 'User', id: string, firstName: string | null, lastName: string | null, email: string }, resolvedBy: { __typename?: 'User', id: string, firstName: string | null, lastName: string | null, email: string } | null } | null };

export type ReportsQueryVariables = Exact<{ [key: string]: never; }>;


export type ReportsQuery = { __typename?: 'Query', reports: Array<{ __typename?: 'UserReport', id: string, createdAt: string, reason: string, status: ReportStatusEnum, resolvedAt: string | null, reporter: { __typename?: 'User', id: string, firstName: string | null, lastName: string | null, email: string }, reportedUser: { __typename?: 'User', id: string, firstName: string | null, lastName: string | null, email: string } }> };

export type ResolveReportMutationVariables = Exact<{
  input: ResolveReportInput;
}>;


export type ResolveReportMutation = { __typename?: 'Mutation', resolveReport: { __typename?: 'UserReport', id: string, status: ReportStatusEnum, resolvedBy: { __typename?: 'User', id: string } | null } };

export type DepartmentDistributionQueryVariables = Exact<{ [key: string]: never; }>;


export type DepartmentDistributionQuery = { __typename?: 'Query', departmentDistribution: { __typename?: 'DepartmentDistributionResponseType', totalUsers: number, departments: Array<{ __typename?: 'DepartmentDistributionItemType', departmentName: string, userCount: number }> } };

export type StatisticsQueryVariables = Exact<{
  filter: InputMaybe<StatisticsFilterInputType>;
}>;


export type StatisticsQuery = { __typename?: 'Query', statistics: { __typename?: 'StatisticsResponseType', newUsersCount: number, inactiveUsersCount: number, reportsCount: number, pairingsByStatus: Array<{ __typename?: 'PairingStatusOverviewType', status: string, count: number }>, pairingsByStatusAndUser: Array<{ __typename?: 'PairingStatusByUserType', userId: string, userEmail: string, userName: string | null, status: string, count: number }> } };

export type AnonUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type AnonUsersQuery = { __typename?: 'Query', anonUsers: Array<{ __typename?: 'User', id: string, email: string, firstName: string | null, lastName: string | null, profileImageUrl: string | null, profileStatus: ProfileStatusEnum, role: UserRoleEnum, activeBan: { __typename?: 'UserBan', id: string, reason: string, createdAt: string, expiresAt: string | null } | null }> };

export type BanUserMutationVariables = Exact<{
  input: BanUserInput;
}>;


export type BanUserMutation = { __typename?: 'Mutation', banUser: { __typename?: 'User', id: string, activeBan: { __typename?: 'UserBan', id: string, reason: string, createdAt: string, expiresAt: string | null } | null } };

export type GetPairedUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPairedUsersQuery = { __typename?: 'Query', getPairedUsers: Array<{ __typename?: 'User', id: string, email: string, firstName: string | null, lastName: string | null, profileStatus: ProfileStatusEnum, role: UserRoleEnum }> };

export type ReportUserMutationVariables = Exact<{
  input: ReportUserInput;
}>;


export type ReportUserMutation = { __typename?: 'Mutation', reportUser: { __typename?: 'UserReport', id: string, reporterId: string, reportedUserId: string, pairingId: string, reason: string, createdAt: string } };

export type UnbanUserMutationVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type UnbanUserMutation = { __typename?: 'Mutation', unbanUser: { __typename?: 'User', id: string, activeBan: { __typename?: 'UserBan', id: string } | null } };

export type UserByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type UserByIdQuery = { __typename?: 'Query', userById: { __typename?: 'User', id: string, email: string, firstName: string | null, lastName: string | null, profileStatus: ProfileStatusEnum, role: UserRoleEnum, hobbies: Array<{ __typename?: 'Tag', id: string, name: string, category: TagCategory }> | null, interests: Array<{ __typename?: 'Tag', id: string, name: string, category: TagCategory }> | null, activeBan: { __typename?: 'UserBan', id: string, reason: string, createdAt: string, expiresAt: string | null } | null } | null };

export type UsersQueryVariables = Exact<{
  organizationId: InputMaybe<Scalars['ID']['input']>;
}>;


export type UsersQuery = { __typename?: 'Query', users: Array<{ __typename?: 'User', id: string, email: string, firstName: string | null, lastName: string | null, profileImageUrl: string | null, profileStatus: ProfileStatusEnum, role: UserRoleEnum, activeBan: { __typename?: 'UserBan', id: string, reason: string, createdAt: string, expiresAt: string | null } | null }> };


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
    location
    position
    hobbies {
      id
      name
      category
    }
    interests {
      id
      name
      category
    }
    profileImageUrl
    profileStatus
    isActive
    preferredActivity
    suspendedUntil
    departmentId
    activeBan {
      id
      reason
      createdAt
      expiresAt
    }
    organization {
      id
      name
      code
      imageUrl
    }
    department {
      id
      name
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
      externalId
      externalSource
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
export const GetGoogleCalendarListDocument = gql`
    query GetGoogleCalendarList($accessToken: String) {
  googleCalendarList(accessToken: $accessToken) {
    id
    summary
    backgroundColor
    foregroundColor
    primary
  }
}
    `;
export const ImportGoogleCalendarEventsDocument = gql`
    mutation ImportGoogleCalendarEvents($input: ImportGoogleCalendarEventsInput!) {
  importGoogleCalendarEvents(input: $input) {
    success
    importedCount
    message
  }
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
export const PauseActivityDocument = gql`
    mutation PauseActivity($input: PauseActivityInput!) {
  pauseActivity(input: $input) {
    id
    userId
    type
    title
    description
    startDateTime
    endDateTime
    createdAt
  }
}
    `;
export const ResumeActivityDocument = gql`
    mutation ResumeActivity {
  resumeActivity
}
    `;
export const GetActivePauseDocument = gql`
    query GetActivePause($startDate: DateTime!, $endDate: DateTime!) {
  expandedCalendarOccurrences(startDate: $startDate, endDate: $endDate) {
    id
    occurrenceStart
    occurrenceEnd
    originalEvent {
      id
      type
      title
      description
      startDateTime
      endDateTime
      deletedAt
    }
  }
}
    `;
export const GetMessagesDocument = gql`
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
    `;
export const SendMessageDocument = gql`
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
    `;
export const MessageSentDocument = gql`
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
    `;
export const TypingStatusDocument = gql`
    subscription TypingStatus($pairingId: ID!, $userId: ID!) {
  typingStatus(pairingId: $pairingId, userId: $userId) {
    pairingId
    userId
    isTyping
  }
}
    `;
export const SetTypingStatusDocument = gql`
    mutation SetTypingStatus($pairingId: ID!, $isTyping: Boolean!) {
  setTypingStatus(pairingId: $pairingId, isTyping: $isTyping)
}
    `;
export const MessagesReadDocument = gql`
    subscription MessagesRead($pairingId: ID!, $userId: ID!) {
  messagesRead(pairingId: $pairingId, userId: $userId) {
    pairingId
    userId
  }
}
    `;
export const MarkMessagesAsReadDocument = gql`
    mutation MarkMessagesAsRead($pairingId: ID!) {
  markMessagesAsRead(pairingId: $pairingId)
}
    `;
export const CreateDepartmentDocument = gql`
    mutation CreateDepartment($input: CreateDepartmentInput!) {
  createDepartment(input: $input) {
    id
    name
    description
    organizationId
    employeeCount
    createdAt
    updatedAt
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
export const DeleteDepartmentDocument = gql`
    mutation DeleteDepartment($input: DeleteDepartmentInput!) {
  deleteDepartment(input: $input)
}
    `;
export const GetDepartmentsByOrganizationDocument = gql`
    query GetDepartmentsByOrganization($organizationId: String!) {
  getDepartmentsByOrganization(organizationId: $organizationId) {
    id
    name
    description
    organizationId
    employeeCount
    createdAt
    updatedAt
  }
}
    `;
export const GetUsersByDepartmentDocument = gql`
    query GetUsersByDepartment($departmentId: String!) {
  getUsersByDepartment(departmentId: $departmentId) {
    id
    email
    firstName
    lastName
    profileImageUrl
    role
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
export const UpdateDepartmentDocument = gql`
    mutation UpdateDepartment($input: UpdateDepartmentInput!) {
  updateDepartment(input: $input) {
    id
    name
    description
    organizationId
    employeeCount
    createdAt
    updatedAt
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
export const GetAlgorithmSettingsDocument = gql`
    query GetAlgorithmSettings($organizationId: ID!) {
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
export const ActivePairingPeriodDocument = gql`
    query ActivePairingPeriod {
  activePairingPeriod {
    id
    organizationId
    startDate
    endDate
    status
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
    location
    position
    hobbies {
      id
      name
      category
    }
    interests {
      id
      name
      category
    }
    preferredActivity
    profileImageUrl
    profileStatus
    isActive
    departmentId
    department {
      id
      name
    }
  }
}
    `;
export const GetAllTagsDocument = gql`
    query GetAllTags {
  getAllTags {
    id
    name
    category
  }
}
    `;
export const GetTagsByCategoryDocument = gql`
    query GetTagsByCategory($category: TagCategory!) {
  getTagsByCategory(category: $category) {
    id
    name
    category
  }
}
    `;
export const ReportByIdDocument = gql`
    query ReportById($id: ID!) {
  reportById(id: $id) {
    id
    createdAt
    reason
    status
    resolvedAt
    reporter {
      id
      firstName
      lastName
      email
    }
    reportedUser {
      id
      firstName
      lastName
      email
    }
    resolvedBy {
      id
      firstName
      lastName
      email
    }
    resolutionNote
  }
}
    `;
export const ReportsDocument = gql`
    query Reports {
  reports {
    id
    createdAt
    reason
    status
    resolvedAt
    reporter {
      id
      firstName
      lastName
      email
    }
    reportedUser {
      id
      firstName
      lastName
      email
    }
  }
}
    `;
export const ResolveReportDocument = gql`
    mutation ResolveReport($input: ResolveReportInput!) {
  resolveReport(input: $input) {
    id
    status
    resolvedBy {
      id
    }
  }
}
    `;
export const DepartmentDistributionDocument = gql`
    query DepartmentDistribution {
  departmentDistribution {
    departments {
      departmentName
      userCount
    }
    totalUsers
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
export const AnonUsersDocument = gql`
    query AnonUsers {
  anonUsers {
    id
    email
    firstName
    lastName
    profileImageUrl
    profileStatus
    role
    activeBan {
      id
      reason
      createdAt
      expiresAt
    }
  }
}
    `;
export const BanUserDocument = gql`
    mutation BanUser($input: BanUserInput!) {
  banUser(input: $input) {
    id
    activeBan {
      id
      reason
      createdAt
      expiresAt
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
export const ReportUserDocument = gql`
    mutation ReportUser($input: ReportUserInput!) {
  reportUser(input: $input) {
    id
    reporterId
    reportedUserId
    pairingId
    reason
    createdAt
  }
}
    `;
export const UnbanUserDocument = gql`
    mutation UnbanUser($userId: ID!) {
  unbanUser(userId: $userId) {
    id
    activeBan {
      id
    }
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
    hobbies {
      id
      name
      category
    }
    interests {
      id
      name
      category
    }
    profileStatus
    role
    activeBan {
      id
      reason
      createdAt
      expiresAt
    }
  }
}
    `;
export const UsersDocument = gql`
    query Users($organizationId: ID) {
  users(organizationId: $organizationId) {
    id
    email
    firstName
    lastName
    profileImageUrl
    profileStatus
    role
    activeBan {
      id
      reason
      createdAt
      expiresAt
    }
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
    GetGoogleCalendarList(variables?: GetGoogleCalendarListQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetGoogleCalendarListQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetGoogleCalendarListQuery>({ document: GetGoogleCalendarListDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetGoogleCalendarList', 'query', variables);
    },
    ImportGoogleCalendarEvents(variables: ImportGoogleCalendarEventsMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<ImportGoogleCalendarEventsMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<ImportGoogleCalendarEventsMutation>({ document: ImportGoogleCalendarEventsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'ImportGoogleCalendarEvents', 'mutation', variables);
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
    LatestMeetingForPairing(variables: LatestMeetingForPairingQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<LatestMeetingForPairingQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<LatestMeetingForPairingQuery>({ document: LatestMeetingForPairingDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'LatestMeetingForPairing', 'query', variables);
    },
    ProposeMeetingTime(variables: ProposeMeetingTimeMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<ProposeMeetingTimeMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<ProposeMeetingTimeMutation>({ document: ProposeMeetingTimeDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'ProposeMeetingTime', 'mutation', variables);
    },
    UpdateMeetingToProposedTime(variables: UpdateMeetingToProposedTimeMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<UpdateMeetingToProposedTimeMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateMeetingToProposedTimeMutation>({ document: UpdateMeetingToProposedTimeDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'UpdateMeetingToProposedTime', 'mutation', variables);
    },
    CancelMeeting(variables: CancelMeetingMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CancelMeetingMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CancelMeetingMutation>({ document: CancelMeetingDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CancelMeeting', 'mutation', variables);
    },
    GetCalendarEventsForUser(variables: GetCalendarEventsForUserQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetCalendarEventsForUserQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetCalendarEventsForUserQuery>({ document: GetCalendarEventsForUserDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetCalendarEventsForUser', 'query', variables);
    },
    PauseActivity(variables: PauseActivityMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<PauseActivityMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<PauseActivityMutation>({ document: PauseActivityDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'PauseActivity', 'mutation', variables);
    },
    ResumeActivity(variables?: ResumeActivityMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<ResumeActivityMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<ResumeActivityMutation>({ document: ResumeActivityDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'ResumeActivity', 'mutation', variables);
    },
    GetActivePause(variables: GetActivePauseQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetActivePauseQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetActivePauseQuery>({ document: GetActivePauseDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetActivePause', 'query', variables);
    },
    GetMessages(variables: GetMessagesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetMessagesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetMessagesQuery>({ document: GetMessagesDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetMessages', 'query', variables);
    },
    SendMessage(variables: SendMessageMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<SendMessageMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<SendMessageMutation>({ document: SendMessageDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'SendMessage', 'mutation', variables);
    },
    MessageSent(variables: MessageSentSubscriptionVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<MessageSentSubscription> {
      return withWrapper((wrappedRequestHeaders) => client.request<MessageSentSubscription>({ document: MessageSentDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'MessageSent', 'subscription', variables);
    },
    TypingStatus(variables: TypingStatusSubscriptionVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<TypingStatusSubscription> {
      return withWrapper((wrappedRequestHeaders) => client.request<TypingStatusSubscription>({ document: TypingStatusDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'TypingStatus', 'subscription', variables);
    },
    SetTypingStatus(variables: SetTypingStatusMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<SetTypingStatusMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<SetTypingStatusMutation>({ document: SetTypingStatusDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'SetTypingStatus', 'mutation', variables);
    },
    MessagesRead(variables: MessagesReadSubscriptionVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<MessagesReadSubscription> {
      return withWrapper((wrappedRequestHeaders) => client.request<MessagesReadSubscription>({ document: MessagesReadDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'MessagesRead', 'subscription', variables);
    },
    MarkMessagesAsRead(variables: MarkMessagesAsReadMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<MarkMessagesAsReadMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<MarkMessagesAsReadMutation>({ document: MarkMessagesAsReadDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'MarkMessagesAsRead', 'mutation', variables);
    },
    CreateDepartment(variables: CreateDepartmentMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CreateDepartmentMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateDepartmentMutation>({ document: CreateDepartmentDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CreateDepartment', 'mutation', variables);
    },
    CreateInviteCode(variables?: CreateInviteCodeMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CreateInviteCodeMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateInviteCodeMutation>({ document: CreateInviteCodeDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CreateInviteCode', 'mutation', variables);
    },
    DeleteDepartment(variables: DeleteDepartmentMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DeleteDepartmentMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteDepartmentMutation>({ document: DeleteDepartmentDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'DeleteDepartment', 'mutation', variables);
    },
    GetDepartmentsByOrganization(variables: GetDepartmentsByOrganizationQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetDepartmentsByOrganizationQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetDepartmentsByOrganizationQuery>({ document: GetDepartmentsByOrganizationDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetDepartmentsByOrganization', 'query', variables);
    },
    GetUsersByDepartment(variables: GetUsersByDepartmentQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetUsersByDepartmentQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetUsersByDepartmentQuery>({ document: GetUsersByDepartmentDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetUsersByDepartment', 'query', variables);
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
    UpdateDepartment(variables: UpdateDepartmentMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<UpdateDepartmentMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateDepartmentMutation>({ document: UpdateDepartmentDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'UpdateDepartment', 'mutation', variables);
    },
    UpdateOrganization(variables: UpdateOrganizationMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<UpdateOrganizationMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateOrganizationMutation>({ document: UpdateOrganizationDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'UpdateOrganization', 'mutation', variables);
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
    ActivePairingPeriod(variables?: ActivePairingPeriodQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<ActivePairingPeriodQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ActivePairingPeriodQuery>({ document: ActivePairingPeriodDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'ActivePairingPeriod', 'query', variables);
    },
    UpdateUserProfile(variables: UpdateUserProfileMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<UpdateUserProfileMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateUserProfileMutation>({ document: UpdateUserProfileDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'UpdateUserProfile', 'mutation', variables);
    },
    GetAllTags(variables?: GetAllTagsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetAllTagsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetAllTagsQuery>({ document: GetAllTagsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetAllTags', 'query', variables);
    },
    GetTagsByCategory(variables: GetTagsByCategoryQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetTagsByCategoryQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetTagsByCategoryQuery>({ document: GetTagsByCategoryDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetTagsByCategory', 'query', variables);
    },
    ReportById(variables: ReportByIdQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<ReportByIdQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ReportByIdQuery>({ document: ReportByIdDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'ReportById', 'query', variables);
    },
    Reports(variables?: ReportsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<ReportsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ReportsQuery>({ document: ReportsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'Reports', 'query', variables);
    },
    ResolveReport(variables: ResolveReportMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<ResolveReportMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<ResolveReportMutation>({ document: ResolveReportDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'ResolveReport', 'mutation', variables);
    },
    DepartmentDistribution(variables?: DepartmentDistributionQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DepartmentDistributionQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DepartmentDistributionQuery>({ document: DepartmentDistributionDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'DepartmentDistribution', 'query', variables);
    },
    Statistics(variables?: StatisticsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<StatisticsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<StatisticsQuery>({ document: StatisticsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'Statistics', 'query', variables);
    },
    AnonUsers(variables?: AnonUsersQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<AnonUsersQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<AnonUsersQuery>({ document: AnonUsersDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'AnonUsers', 'query', variables);
    },
    BanUser(variables: BanUserMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<BanUserMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<BanUserMutation>({ document: BanUserDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'BanUser', 'mutation', variables);
    },
    GetPairedUsers(variables?: GetPairedUsersQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetPairedUsersQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetPairedUsersQuery>({ document: GetPairedUsersDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetPairedUsers', 'query', variables);
    },
    ReportUser(variables: ReportUserMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<ReportUserMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<ReportUserMutation>({ document: ReportUserDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'ReportUser', 'mutation', variables);
    },
    UnbanUser(variables: UnbanUserMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<UnbanUserMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UnbanUserMutation>({ document: UnbanUserDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'UnbanUser', 'mutation', variables);
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