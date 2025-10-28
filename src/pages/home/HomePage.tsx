import { Handshake, User } from "lucide-react";
import { Link } from "react-router-dom";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import useHomeData from "@/features/home/useHomeData";

const formatDate = (iso: string | null) => {
  if (!iso) return "—";
  const date = new Date(iso);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const getInitials = (name?: string, surname?: string) => {
  const first = name?.charAt(0) ?? "";
  const last = surname?.charAt(0) ?? "";
  return `${first}${last}`.toUpperCase() || "?";
};

const HomeSkeleton = () => (
  <div className="space-y-6">
    <div className="space-y-2">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-48" />
    </div>
    <Skeleton className="h-48 w-full" />
    <div className="grid gap-3 md:grid-cols-2">
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
    </div>
    <div className="space-y-3">
      <Skeleton className="h-6 w-36" />
      <div className="grid gap-4 sm:grid-cols-2">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  </div>
);

const HomePage = () => {
  const { firstName, currentPairing, stats, isLoading, isEmpty } =
    useHomeData();

  if (isLoading) {
    return <HomeSkeleton />;
  }

  const activeSince = formatDate(stats.activeSince);
  const pairName = currentPairing
    ? `${currentPairing.profile.name} ${currentPairing.profile.surname}`.trim()
    : null;

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">
          Welcome back, {firstName}!
        </h1>
        <p className="text-sm text-muted-foreground">
          See what&#39;s happening with your colleagues.
        </p>
      </header>

      <section>
        <Card className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between">
          {isEmpty ? (
            <div className="flex flex-1 flex-col items-start gap-4">
              <div>
                <h2 className="text-xl font-semibold">
                  No active pairings yet
                </h2>
                <p className="text-sm text-muted-foreground">
                  Once you&#39;re paired with a colleague, their details will
                  show up here.
                </p>
              </div>
              <Button asChild>
                <Link to="/pairings">Browse pairings</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 border">
                  <AvatarImage
                    alt={pairName ?? "Paired colleague"}
                    src={undefined}
                  />
                  <AvatarFallback className="text-2xl">
                    {getInitials(
                      currentPairing?.profile.name,
                      currentPairing?.profile.surname
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Currently you are paired with
                  </p>
                  <h2 className="text-2xl font-semibold leading-tight">
                    {pairName}
                  </h2>
                </div>
              </div>
              <div className="flex flex-col items-start gap-2 md:items-end">
                <CardDescription>
                  Stay in touch and keep collaborating.
                </CardDescription>
                <Button asChild variant="outline">
                  <Link
                    to={`/pairings/${currentPairing?.id}`}
                    aria-label="Open pairing conversation"
                  >
                    Message Now
                  </Link>
                </Button>
              </div>
            </>
          )}
        </Card>
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-base font-medium">
              A new pairing has been running since
            </CardTitle>
            <CardDescription className="text-lg font-semibold text-foreground">
              {activeSince}
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-base font-medium">
              This year you’ve been paired {stats.pairingsThisYear} times
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
            <Card className="flex h-full items-center gap-4 p-6 transition hover:bg-muted/40">
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
            <Card className="flex h-full items-center gap-4 p-6 transition hover:bg-muted/40">
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
