/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { GraphQLClient, RequestOptions } from "graphql-request";
import gql from "graphql-tag";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
type GraphQLClientRequestHeaders = RequestOptions["requestHeaders"];
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: string; output: string };
  /** The `Upload` scalar type represents a file upload. */
  Upload: { input: any; output: any };
};

export type AlgorithmSettings = {
  __typename?: "AlgorithmSettings";
  createdAt: Scalars["DateTime"]["output"];
  id: Scalars["String"]["output"];
  organizationId: Scalars["String"]["output"];
  periodLengthDays: Scalars["Int"]["output"];
  randomSeed: Scalars["Int"]["output"];
  updatedAt: Scalars["DateTime"]["output"];
};

export type AlgorithmSettingsResponse = {
  __typename?: "AlgorithmSettingsResponse";
  createdAt: Scalars["DateTime"]["output"];
  id: Scalars["String"]["output"];
  organizationId: Scalars["String"]["output"];
  periodLengthDays: Scalars["Int"]["output"];
  randomSeed: Scalars["Int"]["output"];
  updatedAt: Scalars["DateTime"]["output"];
  warning: Maybe<Scalars["String"]["output"]>;
};

export type CurrentUser = {
  __typename?: "CurrentUser";
  about: Maybe<Scalars["String"]["output"]>;
  email: Scalars["String"]["output"];
  firstName: Maybe<Scalars["String"]["output"]>;
  hobbies: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  interests: Maybe<Scalars["String"]["output"]>;
  isActive: Scalars["Boolean"]["output"];
  lastName: Maybe<Scalars["String"]["output"]>;
  organization: Organization;
  organizationId: Scalars["ID"]["output"];
  preferredActivity: Maybe<Scalars["String"]["output"]>;
  profileImageUrl: Maybe<Scalars["String"]["output"]>;
  profileStatus: ProfileStatusEnum;
  role: UserRoleEnum;
  supabaseUserId: Maybe<Scalars["String"]["output"]>;
};

export type InviteUserInputType = {
  email: Scalars["String"]["input"];
  organizationId: Scalars["String"]["input"];
};

export type InviteUserResponseType = {
  __typename?: "InviteUserResponseType";
  message: Scalars["String"]["output"];
  success: Scalars["Boolean"]["output"];
  userId: Maybe<Scalars["String"]["output"]>;
};

export type Mutation = {
  __typename?: "Mutation";
  deleteUser: User;
  executePairingAlgorithm: PairingExecutionResult;
  inviteUserToOrganization: InviteUserResponseType;
  registerOrganization: RegisterOrganizationResponseType;
  signUp: User;
  updateAlgorithmSettings: AlgorithmSettingsResponse;
  updateCurrentUserProfile: CurrentUser;
  updateOrganization: OrganizationType;
  updateUser: User;
};

export type MutationDeleteUserArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationExecutePairingAlgorithmArgs = {
  organizationId: Scalars["String"]["input"];
};

export type MutationInviteUserToOrganizationArgs = {
  input: InviteUserInputType;
};

export type MutationRegisterOrganizationArgs = {
  input: RegisterOrganizationInputType;
};

export type MutationSignUpArgs = {
  data: SignUpInputType;
};

export type MutationUpdateAlgorithmSettingsArgs = {
  input: UpdateAlgorithmSettingsInput;
};

export type MutationUpdateCurrentUserProfileArgs = {
  input: UpdateCurrentUserProfileInputType;
};

export type MutationUpdateOrganizationArgs = {
  input: UpdateOrganizationInputType;
};

export type MutationUpdateUserArgs = {
  data: UpdateUserInputType;
};

export type Organization = {
  __typename?: "Organization";
  code: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  imageUrl: Maybe<Scalars["String"]["output"]>;
  name: Scalars["String"]["output"];
};

export type OrganizationType = {
  __typename?: "OrganizationType";
  address: Maybe<Scalars["String"]["output"]>;
  code: Scalars["String"]["output"];
  createdAt: Scalars["DateTime"]["output"];
  id: Scalars["ID"]["output"];
  imageUrl: Maybe<Scalars["String"]["output"]>;
  name: Scalars["String"]["output"];
  size: Maybe<Scalars["Float"]["output"]>;
  updatedAt: Scalars["DateTime"]["output"];
};

export type PairingExecutionResult = {
  __typename?: "PairingExecutionResult";
  message: Scalars["String"]["output"];
  pairingsCreated: Scalars["Int"]["output"];
  success: Scalars["Boolean"]["output"];
  unpairedUsers: Maybe<Scalars["Int"]["output"]>;
};

export type PairingHistory = {
  __typename?: "PairingHistory";
  createdAt: Scalars["DateTime"]["output"];
  id: Scalars["ID"]["output"];
  status: PairingStatusEnum;
  userA: User;
  userAId: Scalars["ID"]["output"];
  userB: User;
  userBId: Scalars["ID"]["output"];
};

/** Pairing status */
export type PairingStatusEnum =
  | "cancelled"
  | "matched"
  | "met"
  | "not_met"
  | "planned";

/** Profile onboarding status */
export type ProfileStatusEnum = "active" | "pending" | "suspended";

export type Query = {
  __typename?: "Query";
  getAlgorithmSettings: AlgorithmSettings;
  getCurrentUser: Maybe<CurrentUser>;
  getPairedUsers: Array<User>;
  getPairingHistory: Array<PairingHistory>;
  myOrganization: Maybe<OrganizationType>;
  organizationById: Maybe<OrganizationType>;
  organizations: Array<OrganizationType>;
  user: Maybe<User>;
  userById: Maybe<User>;
  users: Array<User>;
};

export type QueryGetAlgorithmSettingsArgs = {
  organizationId: Scalars["String"]["input"];
};

export type QueryOrganizationByIdArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryUserByIdArgs = {
  id: Scalars["ID"]["input"];
};

export type RegisterOrganizationInputType = {
  adminEmail: Scalars["String"]["input"];
  organizationAddress: Scalars["String"]["input"];
  organizationName: Scalars["String"]["input"];
  organizationSize: Scalars["String"]["input"];
};

export type RegisterOrganizationResponseType = {
  __typename?: "RegisterOrganizationResponseType";
  adminEmail: Scalars["String"]["output"];
  message: Scalars["String"]["output"];
  organization: OrganizationType;
};

export type SignUpInputType = {
  email: Scalars["String"]["input"];
  firstName?: InputMaybe<Scalars["String"]["input"]>;
  lastName?: InputMaybe<Scalars["String"]["input"]>;
  password: Scalars["String"]["input"];
  profilePicture?: InputMaybe<Scalars["Upload"]["input"]>;
};

export type UpdateAlgorithmSettingsInput = {
  organizationId: Scalars["String"]["input"];
  periodLengthDays?: InputMaybe<Scalars["Int"]["input"]>;
  randomSeed?: InputMaybe<Scalars["Int"]["input"]>;
};

export type UpdateCurrentUserProfileInputType = {
  about?: InputMaybe<Scalars["String"]["input"]>;
  avatarUrl?: InputMaybe<Scalars["String"]["input"]>;
  firstName?: InputMaybe<Scalars["String"]["input"]>;
  hobbies?: InputMaybe<Scalars["String"]["input"]>;
  interests?: InputMaybe<Scalars["String"]["input"]>;
  lastName?: InputMaybe<Scalars["String"]["input"]>;
  preferredActivity?: InputMaybe<Scalars["String"]["input"]>;
};

export type UpdateOrganizationInputType = {
  address?: InputMaybe<Scalars["String"]["input"]>;
  id: Scalars["ID"]["input"];
  imageUrl?: InputMaybe<Scalars["String"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  size?: InputMaybe<Scalars["Float"]["input"]>;
};

export type UpdateUserInputType = {
  about?: InputMaybe<Scalars["String"]["input"]>;
  email?: InputMaybe<Scalars["String"]["input"]>;
  firstName?: InputMaybe<Scalars["String"]["input"]>;
  hobbies?: InputMaybe<Scalars["String"]["input"]>;
  id: Scalars["ID"]["input"];
  interests?: InputMaybe<Scalars["String"]["input"]>;
  lastName?: InputMaybe<Scalars["String"]["input"]>;
  preferredActivity?: InputMaybe<Scalars["String"]["input"]>;
  profileImageUrl?: InputMaybe<Scalars["String"]["input"]>;
  role?: InputMaybe<UserRoleEnum>;
};

export type User = {
  __typename?: "User";
  email: Scalars["String"]["output"];
  firstName: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  lastName: Maybe<Scalars["String"]["output"]>;
  profileImageUrl: Maybe<Scalars["String"]["output"]>;
  profileStatus: ProfileStatusEnum;
  role: UserRoleEnum;
};

/** User role */
export type UserRoleEnum = "org_admin" | "super_admin" | "user";

export type GetCurrentUserQueryVariables = Exact<{ [key: string]: never }>;

export type GetCurrentUserQuery = {
  __typename?: "Query";
  getCurrentUser: {
    __typename?: "CurrentUser";
    id: string;
    email: string;
    organizationId: string;
    role: UserRoleEnum;
    firstName: string | null;
    lastName: string | null;
    about: string | null;
    hobbies: string | null;
    preferredActivity: string | null;
    interests: string | null;
    profileImageUrl: string | null;
    profileStatus: ProfileStatusEnum;
    isActive: boolean;
    organization: {
      __typename?: "Organization";
      id: string;
      name: string;
      code: string;
      imageUrl: string | null;
    };
  } | null;
};

export type MyOrganizationQueryVariables = Exact<{ [key: string]: never }>;

export type MyOrganizationQuery = {
  __typename?: "Query";
  myOrganization: {
    __typename?: "OrganizationType";
    id: string;
    name: string;
    code: string;
    size: number | null;
    address: string | null;
    imageUrl: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type OrganizationByIdQueryVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type OrganizationByIdQuery = {
  __typename?: "Query";
  organizationById: {
    __typename?: "OrganizationType";
    id: string;
    name: string;
    code: string;
    size: number | null;
    address: string | null;
    imageUrl: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type OrganizationsQueryVariables = Exact<{ [key: string]: never }>;

export type OrganizationsQuery = {
  __typename?: "Query";
  organizations: Array<{
    __typename?: "OrganizationType";
    id: string;
    name: string;
    code: string;
    size: number | null;
    address: string | null;
    imageUrl: string | null;
    createdAt: string;
    updatedAt: string;
  }>;
};

export type RegisterOrganizationMutationVariables = Exact<{
  input: RegisterOrganizationInputType;
}>;

export type RegisterOrganizationMutation = {
  __typename?: "Mutation";
  registerOrganization: {
    __typename?: "RegisterOrganizationResponseType";
    adminEmail: string;
    message: string;
    organization: {
      __typename?: "OrganizationType";
      id: string;
      name: string;
      code: string;
      size: number | null;
      address: string | null;
      createdAt: string;
      updatedAt: string;
    };
  };
};

export type UpdateOrganizationMutationVariables = Exact<{
  input: UpdateOrganizationInputType;
}>;

export type UpdateOrganizationMutation = {
  __typename?: "Mutation";
  updateOrganization: {
    __typename?: "OrganizationType";
    id: string;
    name: string;
    code: string;
    size: number | null;
    address: string | null;
    imageUrl: string | null;
    createdAt: string;
    updatedAt: string;
  };
};

export type GetAlgorithmSettingsQueryVariables = Exact<{
  organizationId: Scalars["String"]["input"];
}>;

export type GetAlgorithmSettingsQuery = {
  __typename?: "Query";
  getAlgorithmSettings: {
    __typename?: "AlgorithmSettings";
    id: string;
    organizationId: string;
    periodLengthDays: number;
    randomSeed: number;
    createdAt: string;
    updatedAt: string;
  };
};

export type UpdateAlgorithmSettingsMutationVariables = Exact<{
  input: UpdateAlgorithmSettingsInput;
}>;

export type UpdateAlgorithmSettingsMutation = {
  __typename?: "Mutation";
  updateAlgorithmSettings: {
    __typename?: "AlgorithmSettingsResponse";
    id: string;
    organizationId: string;
    periodLengthDays: number;
    randomSeed: number;
    warning: string | null;
    updatedAt: string;
  };
};

export type ExecutePairingAlgorithmMutationVariables = Exact<{
  organizationId: Scalars["String"]["input"];
}>;

export type ExecutePairingAlgorithmMutation = {
  __typename?: "Mutation";
  executePairingAlgorithm: {
    __typename?: "PairingExecutionResult";
    success: boolean;
    pairingsCreated: number;
    message: string;
    unpairedUsers: number | null;
  };
};

export type GetPairingHistoryQueryVariables = Exact<{ [key: string]: never }>;

export type GetPairingHistoryQuery = {
  __typename?: "Query";
  getPairingHistory: Array<{
    __typename?: "PairingHistory";
    id: string;
    userAId: string;
    userBId: string;
    status: PairingStatusEnum;
    createdAt: string;
    userA: {
      __typename?: "User";
      id: string;
      email: string;
      firstName: string | null;
      lastName: string | null;
      profileImageUrl: string | null;
      profileStatus: ProfileStatusEnum;
    };
    userB: {
      __typename?: "User";
      id: string;
      email: string;
      firstName: string | null;
      lastName: string | null;
      profileImageUrl: string | null;
      profileStatus: ProfileStatusEnum;
    };
  }>;
};

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
    preferredActivity: string | null;
    interests: string | null;
    profileImageUrl: string | null;
    profileStatus: ProfileStatusEnum;
    isActive: boolean;
  };
};

export type GetPairedUsersQueryVariables = Exact<{ [key: string]: never }>;

export type GetPairedUsersQuery = {
  __typename?: "Query";
  getPairedUsers: Array<{
    __typename?: "User";
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    profileStatus: ProfileStatusEnum;
    role: UserRoleEnum;
  }>;
};

export type UserByIdQueryVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type UserByIdQuery = {
  __typename?: "Query";
  userById: {
    __typename?: "User";
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    profileStatus: ProfileStatusEnum;
    role: UserRoleEnum;
  } | null;
};

export type UsersQueryVariables = Exact<{ [key: string]: never }>;

export type UsersQuery = {
  __typename?: "Query";
  users: Array<{
    __typename?: "User";
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    profileStatus: ProfileStatusEnum;
    role: UserRoleEnum;
  }>;
};

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
      preferredActivity
      interests
      profileImageUrl
      profileStatus
      isActive
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

export type SdkFunctionWrapper = <T>(
  action: (requestHeaders?: Record<string, string>) => Promise<T>,
  operationName: string,
  operationType?: string,
  variables?: any
) => Promise<T>;

const defaultWrapper: SdkFunctionWrapper = (
  action,
  _operationName,
  _operationType,
  _variables
) => action();

export function getSdk(
  client: GraphQLClient,
  withWrapper: SdkFunctionWrapper = defaultWrapper
) {
  return {
    GetCurrentUser(
      variables?: GetCurrentUserQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit["signal"]
    ): Promise<GetCurrentUserQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetCurrentUserQuery>({
            document: GetCurrentUserDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        "GetCurrentUser",
        "query",
        variables
      );
    },
    MyOrganization(
      variables?: MyOrganizationQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit["signal"]
    ): Promise<MyOrganizationQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<MyOrganizationQuery>({
            document: MyOrganizationDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        "MyOrganization",
        "query",
        variables
      );
    },
    OrganizationById(
      variables: OrganizationByIdQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit["signal"]
    ): Promise<OrganizationByIdQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<OrganizationByIdQuery>({
            document: OrganizationByIdDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        "OrganizationById",
        "query",
        variables
      );
    },
    Organizations(
      variables?: OrganizationsQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit["signal"]
    ): Promise<OrganizationsQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<OrganizationsQuery>({
            document: OrganizationsDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        "Organizations",
        "query",
        variables
      );
    },
    RegisterOrganization(
      variables: RegisterOrganizationMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit["signal"]
    ): Promise<RegisterOrganizationMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<RegisterOrganizationMutation>({
            document: RegisterOrganizationDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        "RegisterOrganization",
        "mutation",
        variables
      );
    },
    UpdateOrganization(
      variables: UpdateOrganizationMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit["signal"]
    ): Promise<UpdateOrganizationMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<UpdateOrganizationMutation>({
            document: UpdateOrganizationDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        "UpdateOrganization",
        "mutation",
        variables
      );
    },
    GetAlgorithmSettings(
      variables: GetAlgorithmSettingsQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit["signal"]
    ): Promise<GetAlgorithmSettingsQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetAlgorithmSettingsQuery>({
            document: GetAlgorithmSettingsDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        "GetAlgorithmSettings",
        "query",
        variables
      );
    },
    UpdateAlgorithmSettings(
      variables: UpdateAlgorithmSettingsMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit["signal"]
    ): Promise<UpdateAlgorithmSettingsMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<UpdateAlgorithmSettingsMutation>({
            document: UpdateAlgorithmSettingsDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        "UpdateAlgorithmSettings",
        "mutation",
        variables
      );
    },
    ExecutePairingAlgorithm(
      variables: ExecutePairingAlgorithmMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit["signal"]
    ): Promise<ExecutePairingAlgorithmMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<ExecutePairingAlgorithmMutation>({
            document: ExecutePairingAlgorithmDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        "ExecutePairingAlgorithm",
        "mutation",
        variables
      );
    },
    GetPairingHistory(
      variables?: GetPairingHistoryQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit["signal"]
    ): Promise<GetPairingHistoryQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetPairingHistoryQuery>({
            document: GetPairingHistoryDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        "GetPairingHistory",
        "query",
        variables
      );
    },
    UpdateUserProfile(
      variables: UpdateUserProfileMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit["signal"]
    ): Promise<UpdateUserProfileMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<UpdateUserProfileMutation>({
            document: UpdateUserProfileDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        "UpdateUserProfile",
        "mutation",
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
    UserById(
      variables: UserByIdQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit["signal"]
    ): Promise<UserByIdQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<UserByIdQuery>({
            document: UserByIdDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        "UserById",
        "query",
        variables
      );
    },
    Users(
      variables?: UsersQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit["signal"]
    ): Promise<UsersQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<UsersQuery>({
            document: UsersDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        "Users",
        "query",
        variables
      );
    },
  };
}
export type Sdk = ReturnType<typeof getSdk>;
