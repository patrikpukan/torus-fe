import { useState, type FormEvent, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useReportUserMutation } from "../api/useReportUserMutation";
import { GET_PAIRED_USERS_QUERY } from "../api/useGetPairedUsersQuery";

type ReportUserDialogProps = {
  reportedUserId: string;
  reportedUserName?: string;
  children: (props: { openDialog: () => void; loading: boolean }) => ReactNode;
  onReported?: () => void;
};

const ReportUserDialog = ({
  reportedUserId,
  reportedUserName,
  children,
  onReported,
}: ReportUserDialogProps) => {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");

  const { toast } = useToast();
  const [reportUser, { loading }] = useReportUserMutation();

  const resetForm = () => {
    setReason("");
  };

  const safeSetOpen = (next: boolean) => {
    if (!loading) {
      setOpen(next);
      if (!next) {
        resetForm();
      }
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedReason = reason.trim();

    if (!trimmedReason) {
      toast({
        variant: "destructive",
        title: "Reason required",
        description: "Please describe why you are reporting this user.",
      });
      return;
    }

    try {
      await reportUser({
        variables: {
          input: {
            reportedUserId,
            reason: trimmedReason,
          },
        },
        refetchQueries: [{ query: GET_PAIRED_USERS_QUERY }],
      });

      toast({
        title: "Report submitted",
        description: `${reportedUserName ?? "The user"} won't be matched with you again.`,
      });
      safeSetOpen(false);
      onReported?.();
    } catch (error) {
      console.error("Failed to report user", error);
      toast({
        variant: "destructive",
        title: "Unable to submit report",
        description:
          error instanceof Error
            ? error.message
            : "Please try again in a moment.",
      });
    }
  };

  return (
    <>
      {children({ openDialog: () => safeSetOpen(true), loading })}
      <Dialog open={open} onOpenChange={safeSetOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Report {reportedUserName ?? "user"}</DialogTitle>
            <DialogDescription>
              Let the admins know what went wrong so they can review the case.
              Once reported, this user will no longer be matched with you.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="report-reason">Reason *</Label>
              <Textarea
                id="report-reason"
                placeholder="Describe what happened"
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                required
                disabled={loading}
                minLength={5}
              />
              <p className="text-xs text-muted-foreground">
                Be as specific as possible. The team will be notified and may reach out
                if they need more detail.
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => safeSetOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Submit report"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReportUserDialog;

