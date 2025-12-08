import type { ReactNode } from "react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useBanUserMutation } from "../api/useBanUserMutation";
import { useToast } from "@/hooks/use-toast";
import { USERS_QUERY } from "../api/useUsersQuery";
import { USER_BY_ID_QUERY } from "../api/useUserByIdQuery";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, startOfDay, startOfToday } from "date-fns";

const banUserSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(5, "Please explain why you are banning this user."),
  expiresAt: z.date().optional().nullable(),
});

type BanUserFormValues = z.infer<typeof banUserSchema>;

type BanUserDialogProps = {
  userId: string;
  userDisplayName?: string;
  children: (props: { openDialog: () => void; loading: boolean }) => ReactNode;
  onCompleted?: () => void;
};

export const BanUserDialog = ({
  userId,
  userDisplayName,
  children,
  onCompleted,
}: BanUserDialogProps) => {
  const [open, setOpen] = useState(false);
  const today = startOfToday();

  const [banUser, { loading }] = useBanUserMutation();
  const { toast } = useToast();

  const form = useForm<BanUserFormValues>({
    resolver: zodResolver(banUserSchema),
    mode: "onChange",
    defaultValues: {
      reason: "",
      expiresAt: null,
    },
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
      const expiresAtIso = values.expiresAt
        ? startOfDay(values.expiresAt).toISOString()
        : null;

      await banUser({
        variables: {
          input: {
            userId,
            reason: values.reason.trim(),
            expiresAt: expiresAtIso,
          },
        },
        refetchQueries: [
          { query: USERS_QUERY },
          { query: USER_BY_ID_QUERY, variables: { id: userId } },
        ],
      });

      toast({
        title: "User banned",
        description: `${userDisplayName ?? "The user"} can no longer sign in.`,
      });

      safeSetOpen(false);
      onCompleted?.();
    } catch (error) {
      console.error("Failed to ban user", error);
      toast({
        variant: "destructive",
        title: "Unable to ban user",
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
            <DialogTitle>Ban {userDisplayName ?? "user"}</DialogTitle>
            <DialogDescription>
              Once banned, the user will not be able to sign in. You can provide
              a reason and optionally schedule when the ban should expire.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <div className="space-y-2">
              <Label htmlFor="ban-reason">Reason *</Label>
              <Textarea
                id="ban-reason"
                placeholder="Explain why you need to ban this user"
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
                This will be stored for audit purposes and helps other admins
                understand the context.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Optional expiry</Label>
              <Controller
                control={form.control}
                name="expiresAt"
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                        disabled={loading}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value
                          ? format(field.value, "PPP")
                          : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ?? undefined}
                        onSelect={(date) => field.onChange(date ?? null)}
                        disabled={(date) => date < today}
                        autoFocus={true}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to ban indefinitely. If set, the ban will lift at
                the start of the selected day.
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
              <Button type="submit" variant="destructive" disabled={loading}>
                {loading ? "Saving..." : "Ban user"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BanUserDialog;
