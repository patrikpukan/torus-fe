import { useState, type FormEvent } from "react";
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
  const [email, setEmail] = useState("");
  const [inviteUser, { loading }] = useInviteUserToOrganizationMutation();
  const { toast } = useToast();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data } = await inviteUser({
        variables: {
          input: {
            email,
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
        setEmail("");
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
  };

  const handleClose = () => {
    if (!loading) {
      setEmail("");
      onOpenChange(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Invite User</SheetTitle>
          <SheetDescription>
            Invite a new user to join <strong>{organizationName}</strong>. They
            will receive an email with instructions to set up their account.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
            <p className="text-sm text-muted-foreground">
              The user will be created with a default 'user' role and will be
              assigned to this organization.
            </p>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Sending Invitation..." : "Send Invitation"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default InviteUserModal;
