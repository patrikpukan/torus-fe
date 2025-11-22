import { useState } from "react";
import type { ReactNode } from "react";

import { useToast } from "@/hooks/use-toast";
import { useUnbanUserMutation } from "../api/useUnbanUserMutation";
import { USERS_QUERY } from "../api/useUsersQuery";
import { USER_BY_ID_QUERY } from "../api/useUserByIdQuery";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type UnbanUserButtonProps = {
  userId: string;
  userDisplayName?: string;
  children: (props: { openDialog: () => void; loading: boolean }) => ReactNode;
  onCompleted?: () => void;
};

export const UnbanUserButton = ({
  userId,
  userDisplayName,
  children,
  onCompleted,
}: UnbanUserButtonProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
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
      setDialogOpen(false);
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

  return (
    <>
      {children({
        openDialog: () => setDialogOpen(true),
        loading,
      })}
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => !loading && setDialogOpen(open)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unban {userDisplayName ?? "user"}</DialogTitle>
            <DialogDescription>
              This user will be able to sign in immediately after you confirm.
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to restore access for{" "}
            {userDisplayName ?? "this user"}? They will appear in pairing pools
            again.
          </p>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setDialogOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button variant="default" onClick={handleUnban} disabled={loading}>
              {loading ? "Unbanning..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UnbanUserButton;
