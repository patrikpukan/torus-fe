import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useInviteUserToOrganizationMutation } from "../api/useInviteUserToOrganizationMutation";
import { useToast } from "@/hooks/use-toast";

const inviteUserSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

type InviteUserFormValues = z.infer<typeof inviteUserSchema>;

type InviteUserModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string;
  organizationName: string;
};

const InviteUserModal = ({
  open,
  onOpenChange,
  organizationId,
  organizationName,
}: InviteUserModalProps) => {
  const [inviteUser, { loading }] = useInviteUserToOrganizationMutation();
  const { toast } = useToast();
  const form = useForm<InviteUserFormValues>({
    resolver: zodResolver(inviteUserSchema),
    mode: "onChange",
    defaultValues: { email: "" },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      const { data } = await inviteUser({
        variables: {
          input: {
            email: values.email,
            organizationId,
          },
        },
      });

      const result = data as {
        inviteUserToOrganization?: {
          success: boolean;
          message: string;
          userId?: string;
        };
      };

      if (result?.inviteUserToOrganization?.success) {
        toast({
          title: "Success",
          description: result.inviteUserToOrganization.message,
        });
        form.reset();
        onOpenChange(false);
      } else {
        toast({
          title: "Failed to Invite User",
          description:
            result?.inviteUserToOrganization?.message ||
            "An error occurred while inviting the user.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      console.error("Invite user error:", error);
    }
  });

  const handleOpenChange = (next: boolean) => {
    if (!loading) {
      if (!next) {
        form.reset();
      }
      onOpenChange(next);
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Invite User</SheetTitle>
          <SheetDescription>
            Invite a new user to join <strong>{organizationName}</strong>. They
            will receive an email with instructions to set up their account.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          <div className="grid gap-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              {...form.register("email")}
              aria-invalid={!!form.formState.errors.email}
              disabled={loading}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">
                {form.formState.errors.email.message}
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              The user will be created with a default 'user' role and will be
              assigned to this organization.
            </p>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || form.formState.isSubmitting}
            >
              {loading || form.formState.isSubmitting
                ? "Sending Invitation..."
                : "Send Invitation"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default InviteUserModal;
