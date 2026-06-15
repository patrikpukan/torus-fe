import { Card, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyEngagementStats } from "../api/useMyEngagementStats";

/**
 * Right-rail panel surfacing the current user's engagement: an active streak,
 * meetings completed, and colleagues connected. Matches the dashboard's
 * compact stat-card pattern.
 */
export const EngagementStatsPanel = () => {
  const { data, loading } = useMyEngagementStats();
  const stats = data?.myEngagementStats;

  const currentStreak = stats?.currentStreak ?? 0;
  const meetingsCompleted = stats?.meetingsCompleted ?? 0;
  const colleaguesConnected = stats?.colleaguesConnected ?? 0;

  // Show the skeleton only on the very first load (no cached data yet).
  if (loading && !stats) {
    return (
      <Card className="border-0 p-5 shadow-elevated">
        <Skeleton className="mb-4 h-4 w-24" />
        <div className="space-y-4">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-7 w-full" />
          <Skeleton className="h-7 w-full" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-0 p-5 shadow-elevated">
      <CardTitle className="mb-4 text-sm font-medium text-muted-foreground">
        Your activity
      </CardTitle>
      <div className="space-y-4">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-muted-foreground">Streak</span>
          <span className="text-lg font-semibold">
            {currentStreak > 0 ? (
              <>
                <span aria-hidden>🔥</span> {currentStreak}-cycle streak
              </>
            ) : (
              <span className="text-base font-normal text-muted-foreground">
                No streak yet
              </span>
            )}
          </span>
        </div>
        <div className="flex items-baseline justify-between border-t border-border/60 pt-3">
          <span className="text-sm text-muted-foreground">Meetings</span>
          <span className="text-2xl font-bold tabular-nums">
            {meetingsCompleted}
          </span>
        </div>
        <div className="flex items-baseline justify-between border-t border-border/60 pt-3">
          <span className="text-sm text-muted-foreground">
            Colleagues connected
          </span>
          <span className="text-2xl font-bold tabular-nums">
            {colleaguesConnected}
          </span>
        </div>
      </div>
    </Card>
  );
};
