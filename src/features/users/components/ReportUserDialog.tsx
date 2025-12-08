import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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

const reportUserSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(5, "Please describe why you are reporting this user."),
});

type ReportUserFormValues = z.infer<typeof reportUserSchema>;

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
  const { toast } = useToast();
  const [reportUser, { loading }] = useReportUserMutation();

  const form = useForm<ReportUserFormValues>({
    resolver: zodResolver(reportUserSchema),
    mode: "onChange",
    defaultValues: { reason: "" },
  });

  const safeSetOpen = (next: boolean) => {
    if (!loading) {
      setOpen(next);
      if (!next) {
        form.reset();
      }
    }
  };

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      await reportUser({
        variables: {
          input: {
            reportedUserId,
            reason: values.reason.trim(),
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
  });

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
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <div className="space-y-2">
              <Label htmlFor="report-reason">Reason *</Label>
              <Textarea
                id="report-reason"
                placeholder="Describe what happened"
                {...form.register("reason")}
                aria-invalid={!!form.formState.errors.reason}
                disabled={loading}
              />
              {form.formState.errors.reason && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.reason.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Be as specific as possible. The team will be notified and may
                reach out if they need more detail.
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
