import { Handshake, Home, User } from "lucide-react";
import { Link } from "react-router-dom";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useHomeData from "@/features/home/useHomeData";
import { formatDate } from "@/features/pairings/components/dateUtils.ts";
import { HomeSkeleton } from "./components/HomeSkeleton";
import { PairingActiveState } from "./components/PairingActiveState";
import { PairingEmptyState } from "./components/PairingEmptyState";

const HomePage = () => {
  const { firstName, currentPairing, stats, isLoading, isEmpty } =
    useHomeData();

  if (isLoading) {
    return <HomeSkeleton />;
  }

  const activeSince = formatDate(stats.activeSince);
  const pairName = currentPairing?.profile
    ? `${currentPairing.profile.firstName || currentPairing.profile.email} ${currentPairing.profile.lastName || ""}`.trim()
    : null;

  const welcomeMessage = firstName
    ? `Welcome back, ${firstName}!`
    : "Welcome back!";

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="flex items-center gap-3 text-3xl font-semibold tracking-tight text-foreground">
          <Home aria-hidden className="h-8 w-8 text-primary" />
          <span>{welcomeMessage}</span>
        </h1>
        <p className="text-sm text-muted-foreground">
          See what&#39;s happening with your colleagues.
        </p>
      </header>

      <section>
        <Card className="flex flex-col gap-6 bg-card p-6 md:flex-row md:items-center md:justify-between">
          {isEmpty || !currentPairing ? (
            <PairingEmptyState />
          ) : (
            <PairingActiveState pairing={currentPairing} pairName={pairName} />
          )}
        </Card>
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        <Card className="bg-card">
          <CardHeader className="space-y-1">
            <CardTitle className="text-base font-medium">
              A new pairing has been running since
            </CardTitle>
            <CardDescription className="text-lg font-semibold text-foreground">
              {activeSince || "—"}
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="bg-card">
          <CardHeader className="space-y-1">
            <CardTitle className="text-base font-medium">
              This year you&apos;ve been paired {stats.pairingsThisYear} times
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              {stats.successfulPairingsThisYear} of them were successful.
            </CardDescription>
          </CardHeader>
        </Card>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            to="/profile"
            className="block transition hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2"
            aria-label="Go to your profile"
          >
            <Card className="flex h-full items-center gap-4 bg-card p-6 transition hover:bg-muted/40">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-muted text-2xl text-muted-foreground">
                <User />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">
                  Profile
                </CardTitle>
                <CardDescription>
                  Review your details and availability.
                </CardDescription>
              </div>
            </Card>
          </Link>

          <Link
            to="/pairings"
            className="block transition hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2"
            aria-label="Browse pairings"
          >
            <Card className="flex h-full items-center gap-4 bg-card p-6 transition hover:bg-muted/40">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-muted text-2xl text-muted-foreground">
                <Handshake />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">
                  Pairings
                </CardTitle>
                <CardDescription>
                  Catch up with colleagues and start sessions.
                </CardDescription>
              </div>
            </Card>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
