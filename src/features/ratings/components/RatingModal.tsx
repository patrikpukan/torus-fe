import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { StarRating } from "./StarRating";
import { useCreateRatingMutation } from "../api/useCreateRatingMutation";
import type { UnratedMeeting } from "../api/useUnratedMeetingsQuery";
import { format } from "date-fns";

const ratingSchema = z.object({
  stars: z.number().min(1).max(5),
  feedback: z.string().max(2000).optional(),
});

type RatingFormValues = z.infer<typeof ratingSchema>;

type RatingModalProps = {
  meeting: UnratedMeeting | null;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

const formatUserName = (user: {
  firstName?: string | null;
  lastName?: string | null;
}) => {
  const parts = [user.firstName, user.lastName].filter((v): v is string =>
    Boolean(v?.trim())
  );
  return parts.length ? parts.join(" ") : "your colleague";
};

export const RatingModal = ({
  meeting,
  open,
  onClose,
  onSuccess,
}: RatingModalProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [createRating, { loading }] = useCreateRatingMutation();
  const [submitted, setSubmitted] = useState<"rated" | "not_met" | null>(null);

  const form = useForm<RatingFormValues>({
    resolver: zodResolver(ratingSchema),
    mode: "onChange",
    defaultValues: { stars: 0, feedback: "" },
  });

  const finish = useCallback(
    (kind: "rated" | "not_met") => {
      setSubmitted(kind);
      setTimeout(() => {
        setSubmitted(null);
        form.reset({ stars: 0, feedback: "" });
        onClose();
        onSuccess?.();
      }, 1500);
    },
    [form, onClose, onSuccess]
  );

  const handleSubmit = useCallback(
    async (values: RatingFormValues) => {
      if (!meeting) return;

      try {
        await createRating({
          variables: {
            input: {
              meetingEventId: meeting.id,
              stars: values.stars,
              feedback: values.feedback || undefined,
            },
          },
        });

        toast({
          title: "Rating submitted",
          description: "Thank you for rating this meeting.",
        });
        finish("rated");
      } catch (error) {
        toast({
          title: "Error",
          description:
            error instanceof Error ? error.message : "Failed to submit rating",
          variant: "destructive",
        });
      }
    },
    [meeting, createRating, toast, finish]
  );

  // 0 stars is the backend's "this meeting didn't happen" signal: it stops
  // the re-prompting and excludes the meeting from completion statistics.
  const handleDidNotMeet = useCallback(async () => {
    if (!meeting) return;

    try {
      await createRating({
        variables: {
          input: {
            meetingEventId: meeting.id,
            stars: 0,
            feedback: form.getValues("feedback") || undefined,
          },
        },
      });

      toast({
        title: "Thanks for letting us know",
        description: "We've noted that this meeting didn't take place.",
      });
      finish("not_met");
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to submit",
        variant: "destructive",
      });
    }
  }, [meeting, createRating, form, toast, finish]);

  if (!meeting) return null;

  const otherUser =
    meeting.userAId === user?.id ? meeting.userB : meeting.userA;
  const meetingDate = format(
    new Date(meeting.startDateTime),
    "MMM d, yyyy 'at' h:mm a"
  );
  const meetingEndTime = format(new Date(meeting.endDateTime), "h:mm a");

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[480px]">
        {submitted ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="mb-4 text-4xl">✓</div>
            <p className="text-lg font-semibold">
              {submitted === "rated" ? "Thank you!" : "Got it"}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {submitted === "rated"
                ? "Your rating has been submitted."
                : "We've recorded that this meeting didn't happen."}
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>How did your meeting go?</DialogTitle>
              <DialogDescription>
                Meeting with {formatUserName(otherUser)} · {meetingDate} –{" "}
                {meetingEndTime}
              </DialogDescription>
            </DialogHeader>

            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6 py-2"
            >
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Rate the meeting
                </label>
                <StarRating
                  value={form.watch("stars")}
                  onChange={(stars) => form.setValue("stars", stars)}
                  disabled={loading}
                />
                {form.formState.errors.stars && (
                  <p className="text-sm text-destructive">
                    Please rate the meeting
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="feedback" className="block text-sm font-medium">
                  Additional feedback (optional)
                </label>
                <Textarea
                  id="feedback"
                  placeholder="Share your thoughts about the meeting..."
                  disabled={loading}
                  maxLength={2000}
                  className="resize-none"
                  rows={4}
                  {...form.register("feedback")}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  type="submit"
                  disabled={!form.watch("stars") || loading}
                  className="w-full"
                >
                  {loading ? "Submitting…" : "Submit rating"}
                </Button>
                <div className="flex w-full gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={handleDidNotMeet}
                    disabled={loading}
                  >
                    We didn&apos;t meet
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="flex-1"
                    onClick={onClose}
                    disabled={loading}
                  >
                    Remind me later
                  </Button>
                </div>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
