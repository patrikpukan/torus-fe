import type { ReactNode } from "react";

import { useToast } from "@/hooks/use-toast";
import { useUnbanUserMutation } from "../api/useUnbanUserMutation";
import { USERS_QUERY } from "../api/useUsersQuery";
import { USER_BY_ID_QUERY } from "../api/useUserByIdQuery";

type UnbanUserButtonProps = {
  userId: string;
  userDisplayName?: string;
  children: (props: { onUnban: () => void; loading: boolean }) => ReactNode;
  onCompleted?: () => void;
};

export const UnbanUserButton = ({
  userId,
  userDisplayName,
  children,
  onCompleted,
}: UnbanUserButtonProps) => {
  const [unbanUser, { loading }] = useUnbanUserMutation();
  const { toast } = useToast();

  const handleUnban = async () => {
    try {
      await unbanUser({
        variables: { userId },
        refetchQueries: [
          { query: USERS_QUERY },
          { query: USER_BY_ID_QUERY, variables: { id: userId } },
        ],
      });

      toast({
        title: "User unbanned",
        description: `${userDisplayName ?? "The user"} can access the app again.`,
      });
      onCompleted?.();
    } catch (error) {
      const description =
        error instanceof Error
          ? error.message
          : "Please try again in a moment.";
      toast({
        variant: "destructive",
        title: "Unable to unban user",
        description,
      });
    }
  };

  return <>{children({ onUnban: handleUnban, loading })}</>;
};

export default UnbanUserButton;
