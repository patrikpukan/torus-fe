import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiSend } from "@/lib/restClient";
import {
  GET_CURRENT_USER,
  type CurrentUserData,
} from "@/features/auth/api/useGetCurrentUserQuery";

/**
 * Input for the profile update. Mirrors the GraphQL
 * UpdateCurrentUserProfileInputType (hobbyIds/interestIds tag arrays,
 * hiddenFromDirectory, departmentId, avatarUrl, etc.).
 */
export type UpdateCurrentUserProfileInput = {
  firstName?: string | null;
  lastName?: string | null;
  about?: string | null;
  location?: string | null;
  position?: string | null;
  hobbyIds?: string[];
  interestIds?: string[];
  preferredActivity?: string | null;
  avatarUrl?: string | null;
  departmentId?: string | null;
  hiddenFromDirectory?: boolean;
};

export type UpdateUserProfileData = {
  updateCurrentUserProfile: CurrentUserData;
};

/**
 * React-query mutation key. Previously the GraphQL document
 * `UPDATE_USER_PROFILE` (consumed via Apollo `useMutation(UPDATE_USER_PROFILE)`);
 * kept exported under the same name (now a key) for any references.
 */
export const UPDATE_USER_PROFILE = ["users", "me", "update-profile"] as const;

type UpdateProfileArgs = {
  variables: { input: UpdateCurrentUserProfileInput };
  // Accepted for call-site compatibility with the old Apollo signature
  // (refetchQueries: ["GetCurrentUser"], awaitRefetchQueries). The current-user
  // query is invalidated and awaited internally.
  refetchQueries?: unknown;
  awaitRefetchQueries?: boolean;
};

/**
 * Migrated from Apollo to react-query (GraphQL -> REST strangler).
 * PATCH /api/users/me. Returns the Apollo `useMutation` tuple consumers
 * (ProfileView, ProfileEditPage) expect: `[mutateFn, { loading }]`, where
 * `mutateFn({ variables: { input } })` resolves to
 * `{ data: { updateCurrentUserProfile } }`. On success the current-user query
 * is invalidated and refetched so the UI reflects the new profile.
 */
export const useUpdateUserProfileMutation = (): [
  (args: UpdateProfileArgs) => Promise<{ data: UpdateUserProfileData }>,
  { loading: boolean }
] => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (input: UpdateCurrentUserProfileInput) =>
      apiSend<CurrentUserData>("PATCH", "/users/me", input),
  });

  const mutate = async ({
    variables,
    awaitRefetchQueries,
  }: UpdateProfileArgs) => {
    const result = await mutation.mutateAsync(variables.input);
    const invalidation = queryClient.invalidateQueries({
      queryKey: GET_CURRENT_USER,
    });
    if (awaitRefetchQueries) {
      await invalidation;
    } else {
      void invalidation;
    }
    return { data: { updateCurrentUserProfile: result } };
  };

  return [mutate, { loading: mutation.isPending }];
};
