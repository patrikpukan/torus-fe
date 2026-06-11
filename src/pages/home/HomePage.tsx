import { Handshake, Sparkles, User } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useHomeData from "@/features/home/useHomeData";
import { useFindIdealColleague } from "@/features/home/api/idealColleague";
import { formatDate } from "@/features/pairings/components/dateUtils.ts";
import { HomeSkeleton } from "./components/HomeSkeleton";
import { PairingActiveState } from "./components/PairingActiveState";
import { PairingEmptyState } from "./components/PairingEmptyState";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { GET_CURRENT_USER } from "@/features/auth/api/useGetCurrentUserQuery";
import { PAIRINGS_QUERY } from "@/features/pairings/api/pairingsQuery";
import { ACTIVE_PAIRING_PERIOD_QUERY } from "@/features/pairings/api/useActivePairingPeriodQuery";

const todayLabel = new Date().toLocaleDateString(undefined, {
  weekday: "long",
  day: "numeric",
  month: "long",
});

const HomePage = () => {
  const { firstName, currentPairing, stats, isLoading, isEmpty } =
    useHomeData();
  const { currentUserData } = useAuth();
  const { toast } = useToast();
  const [findIdealColleague, { loading: findingMatch }] =
    useFindIdealColleague();
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (isLoading) {
    return <HomeSkeleton />;
  }

  const activeSince = formatDate(stats.activeSince);
  const pairName = currentPairing?.profile
    ? `${currentPairing.profile.firstName || currentPairing.profile.email} ${currentPairing.profile.lastName || ""}`.trim()
    : null;

  const welcomeMessage = firstName
    ? `Good to see you, ${firstName}`
    : "Good to see you";

  const remainingUses = currentUserData?.idealColleagueUsesRemaining ?? 0;
  const hasActivePairing = !isEmpty && !!currentPairing;

  const handleFindIdealColleague = async () => {
    try {
      const { data } = await findIdealColleague({
        refetchQueries: [
          { query: GET_CURRENT_USER },
          { query: PAIRINGS_QUERY },
          { query: ACTIVE_PAIRING_PERIOD_QUERY },
        ],
      });
      const pairingId = data?.findIdealColleague;

      if (pairingId) {
        toast({
          title: "Ideal colleague found",
          description: "We created a new pairing for you.",
        });
        setConfirmOpen(false);
      } else {
        toast({
          variant: "destructive",
          title: "Unable to find a match",
          description: "Please try again later.",
        });
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to find an ideal colleague.";

      toast({
        variant: "destructive",
        title: "Request failed",
        description: message,
      });
    }
  };

  return (
    <div className="space-y-8 px-1 pb-10">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{todayLabel}</p>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">
            {welcomeMessage}
          </h1>
        </div>
        <span
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${
            hasActivePairing
              ? "bg-success/10 text-success"
              : "bg-muted text-muted-foreground"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              hasActivePairing ? "bg-success" : "bg-muted-foreground/60"
            }`}
          />
          {hasActivePairing ? "Active pairing" : "No active pairing"}
        </span>
      </header>

      {/* Command-center layout: primary column + persistent right rail */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_clamp(290px,30%,360px)]">
        {/* Main column */}
        <div className="space-y-6">
          <Card className="overflow-hidden border-0 shadow-elevated-lg">
            <div className="h-1.5 w-full gradient-primary" />
            <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between">
              {hasActivePairing ? (
                <PairingActiveState
                  pairing={currentPairing}
                  pairName={pairName}
                />
              ) : (
                <PairingEmptyState />
              )}
            </div>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              to="/profile"
              className="group rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label="Go to your profile"
            >
              <Card className="flex h-full items-center gap-4 border-0 p-5 shadow-elevated transition group-hover:shadow-elevated-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold">
                    Profile
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Review your details and availability.
                  </CardDescription>
                </div>
              </Card>
            </Link>

            <Link
              to="/pairings"
              className="group rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label="Browse pairings"
            >
              <Card className="flex h-full items-center gap-4 border-0 p-5 shadow-elevated transition group-hover:shadow-elevated-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <Handshake className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold">
                    Pairings
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Catch up with colleagues and start sessions.
                  </CardDescription>
                </div>
              </Card>
            </Link>
          </div>
        </div>

        {/* Right rail */}
        <aside className="space-y-4">
          <Card className="border-0 p-5 shadow-elevated">
            <CardTitle className="mb-4 text-sm font-medium text-muted-foreground">
              Your year so far
            </CardTitle>
            <div className="space-y-4">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted-foreground">Pairings</span>
                <span className="text-2xl font-bold tabular-nums">
                  {stats.pairingsThisYear}
                </span>
              </div>
              <div className="flex items-baseline justify-between border-t border-border/60 pt-3">
                <span className="text-sm text-muted-foreground">Met up</span>
                <span className="text-2xl font-bold tabular-nums">
                  {stats.successfulPairingsThisYear}
                  <span className="text-sm font-normal text-muted-foreground">
                    {" "}
                    / {stats.pairingsThisYear}
                  </span>
                </span>
              </div>
              <div className="flex items-baseline justify-between border-t border-border/60 pt-3">
                <span className="text-sm text-muted-foreground">
                  Active since
                </span>
                <span className="text-base font-semibold">
                  {activeSince || "—"}
                </span>
              </div>
            </div>
          </Card>

          <Card className="border-0 p-5 shadow-elevated">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Sparkles className="h-5 w-5" />
              </div>
              <CardTitle className="text-base font-semibold">
                Find an ideal colleague
              </CardTitle>
            </div>
            <CardDescription className="mb-4 text-sm">
              We&apos;ll match you with someone who shares the most interests.
            </CardDescription>
            <Button
              className="w-full"
              onClick={() => setConfirmOpen(true)}
              disabled={findingMatch || remainingUses < 1}
            >
              {findingMatch ? "Searching…" : "Find a match"}
            </Button>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              {remainingUses} use{remainingUses === 1 ? "" : "s"} remaining
            </p>
          </Card>
        </aside>
      </div>

      <Dialog
        open={confirmOpen}
        onOpenChange={(open) => !findingMatch && setConfirmOpen(open)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Find an ideal colleague?</DialogTitle>
            <DialogDescription>
              This action has limited usage and will create a new pairing.
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            You have {remainingUses} use{remainingUses === 1 ? "" : "s"}{" "}
            remaining.
          </p>
          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              onClick={() => setConfirmOpen(false)}
              disabled={findingMatch}
            >
              No
            </Button>
            <Button
              onClick={handleFindIdealColleague}
              disabled={findingMatch || remainingUses < 1}
            >
              {findingMatch ? "Finding…" : "Yes, continue"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HomePage;
