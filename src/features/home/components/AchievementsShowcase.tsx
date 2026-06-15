import { Trophy } from "lucide-react";
import { Link } from "react-router-dom";

import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { getAchievementIcon } from "@/features/achievements/lib/achievement-icons";
import { useUserAchievements } from "@/features/achievements/hooks/useAchievements";

/**
 * Compact achievements widget for the regular-user dashboard. Shows up to four
 * unlocked badges plus the closest in-progress achievement with a progress bar.
 * The full grid lives on the profile page, linked via "View all".
 */
export const AchievementsShowcase = () => {
  const { achievements, loading } = useUserAchievements();

  if (loading) {
    return (
      <Card className="border-0 p-6 shadow-elevated">
        <Skeleton className="mb-4 h-5 w-40" />
        <div className="flex gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-12 rounded-lg" />
          ))}
        </div>
        <Skeleton className="mt-5 h-10 w-full rounded-lg" />
      </Card>
    );
  }

  if (achievements.length === 0) {
    return (
      <Card className="border-0 p-2 shadow-elevated">
        <EmptyState
          icon={Trophy}
          title="No achievements yet"
          description="Meet colleagues and stay active to start earning badges."
        />
      </Card>
    );
  }

  const unlocked = achievements.filter((a) => a.isUnlocked).slice(0, 4);

  const nextUp = achievements
    .filter((a) => !a.isUnlocked)
    .reduce<(typeof achievements)[number] | null>((best, a) => {
      if (!best || a.percentComplete > best.percentComplete) return a;
      return best;
    }, null);

  return (
    <Card className="border-0 p-6 shadow-elevated">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Trophy className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <CardTitle className="text-base font-semibold">
              Achievements
            </CardTitle>
            <CardDescription className="text-sm">
              Badges you&apos;ve earned so far.
            </CardDescription>
          </div>
        </div>
        <Link
          to="/profile"
          className="rounded text-sm font-medium text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          View all
        </Link>
      </div>

      {unlocked.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {unlocked.map((achievement) => {
            const Icon = getAchievementIcon(achievement.imageIdentifier);
            return (
              <div
                key={achievement.achievementId}
                className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary"
                title={achievement.name}
                aria-label={achievement.name}
              >
                <Icon className="h-6 w-6" aria-hidden />
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          No badges unlocked yet — keep going!
        </p>
      )}

      {nextUp && (
        <div className="mt-5 space-y-2 border-t border-border/60 pt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">{nextUp.name}</span>
            <span className="text-muted-foreground tabular-nums">
              {nextUp.percentComplete}%
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full gradient-primary transition-all"
              style={{
                width: `${Math.min(100, Math.max(0, nextUp.percentComplete))}%`,
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground">{nextUp.description}</p>
        </div>
      )}
    </Card>
  );
};
