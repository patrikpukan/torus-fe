import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/features/pairings/utils/displayName";
import type { PairingContact } from "@/mocks/mockPairings";

type PairingActiveStateProps = {
  pairing: PairingContact;
  pairName: string | null;
};

export const PairingActiveState = ({
  pairing,
  pairName,
}: PairingActiveStateProps) => {
  const meta =
    pairing.profile?.position ||
    pairing.profile?.location ||
    pairing.profile?.email ||
    "Your current colleague";

  return (
    <>
      <div className="flex items-center gap-5">
        <Avatar className="h-20 w-20 ring-2 ring-primary/20 ring-offset-2 ring-offset-card">
          <AvatarImage
            alt={pairName ?? "Paired colleague"}
            src={pairing.profile?.profileImageUrl || undefined}
          />
          <AvatarFallback className="bg-primary/10 text-2xl font-semibold text-primary">
            {pairing.profile ? getInitials(pairing.profile) : "?"}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-1.5">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Currently paired with
          </span>
          <h2 className="font-heading text-2xl font-bold leading-tight">
            {pairName}
          </h2>
          <p className="text-sm text-muted-foreground">{meta}</p>
        </div>
      </div>
      <div className="flex flex-col items-start gap-2 md:items-end">
        <Button asChild>
          <Link to="/pairings" aria-label="Message your pairing">
            <MessageCircle className="mr-2 h-4 w-4" />
            Message now
          </Link>
        </Button>
        <span className="text-xs text-muted-foreground">
          Keep the conversation going
        </span>
      </div>
    </>
  );
};
