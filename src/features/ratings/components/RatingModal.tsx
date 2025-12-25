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
  return parts.length ? parts.join(" ") : "User";
};

export const RatingModal = ({
  meeting,
  open,
  onClose,
  onSuccess,
}: RatingModalProps) => {
  const { toast } = useToast();
  const [createRating, { loading }] = useCreateRatingMutation();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<RatingFormValues>({
    resolver: zodResolver(ratingSchema),
    mode: "onChange",
    defaultValues: { stars: 0, feedback: "" },
  });

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

        setSubmitted(true);
        toast({
          title: "Rating submitted",
          description: "Thank you for rating this meeting.",
        });

        setTimeout(() => {
          setSubmitted(false);
          form.reset({ stars: 0, feedback: "" });
          onClose();
          onSuccess?.();
        }, 1500);
      } catch (error) {
        toast({
          title: "Error",
          description:
            error instanceof Error ? error.message : "Failed to submit rating",
          variant: "destructive",
        });
      }
    },
    [meeting, createRating, toast, onClose, onSuccess, form]
  );

  if (!meeting) return null;

  const otherUser =
    meeting.userAId === meeting.userBId ? meeting.userA : meeting.userB;
  const meetingDate = format(
    new Date(meeting.startDateTime),
    "MMM d, yyyy 'at' h:mm a"
  );
  const meetingEndTime = format(new Date(meeting.endDateTime), "h:mm a");

  return (
    <Dialog open={open} onOpenChange={() => null}>
      <DialogContent
        className="sm:max-w-[480px] [&>button]:hidden"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        {submitted ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="text-4xl mb-4">✓</div>
            <p className="text-lg font-semibold">Thank you!</p>
            <p className="text-sm text-gray-500 mt-2">
              Your rating has been submitted.
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Rate this meeting</DialogTitle>
              <DialogDescription>
                Meeting with {formatUserName(otherUser)}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div>
                <p className="text-sm text-gray-600 mb-3">
                  {meetingDate} - {meetingEndTime}
                </p>
              </div>

              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    How was the meeting?
                  </label>
                  <StarRating
                    value={form.watch("stars")}
                    onChange={(stars) => form.setValue("stars", stars)}
                    disabled={loading}
                  />
                  {form.formState.errors.stars && (
                    <p className="text-sm text-red-500">
                      Please rate the meeting
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="feedback"
                    className="block text-sm font-medium"
                  >
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

                <Button
                  type="submit"
                  disabled={!form.watch("stars") || loading}
                  className="w-full"
                >
                  {loading ? "Submitting..." : "Submit Rating"}
                </Button>
              </form>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
