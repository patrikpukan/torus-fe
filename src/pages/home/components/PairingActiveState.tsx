import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CardDescription } from "@/components/ui/card";
import { getInitials } from "@/features/pairings/utils/displayName";
import type { PairingContact } from "@/mocks/mockPairings";

type PairingActiveStateProps = {
  pairing: PairingContact;
  pairName: string | null;
};

export const PairingActiveState = ({
  pairing,
  pairName,
}: PairingActiveStateProps) => (
  <>
    <div className="flex items-center gap-4">
      <Avatar className="h-20 w-20 border">
        <AvatarImage
          alt={pairName ?? "Paired colleague"}
          src={pairing.profile?.profileImageUrl || undefined}
        />
        <AvatarFallback className="bg-muted text-2xl font-semibold">
          {pairing.profile ? getInitials(pairing.profile) : "?"}
        </AvatarFallback>
      </Avatar>
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">
          Currently you are paired with
        </p>
        <h2 className="text-2xl font-semibold leading-tight">{pairName}</h2>
      </div>
    </div>
    <div className="flex flex-col items-start gap-2 md:items-end">
      <CardDescription>Stay in touch and keep collaborating.</CardDescription>
      <Button asChild variant="outline">
        <Link to="/pairings" aria-label="Browse pairings">
          Message Now
        </Link>
      </Button>
    </div>
  </>
);
