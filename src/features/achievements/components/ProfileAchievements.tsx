import AchievementCard from "./AchievementCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useUserAchievements } from "../hooks/useAchievements";
import { useMemo } from "react";

export interface ProfileAchievementsProps {
  /**
   * Whether to show progress indicators for incomplete achievements
   * @default true
   */
  showProgress?: boolean;
}

/**
 * Achievement section for the user's own profile (My Profile Page)
 * Displays all achievements with progress indicators for incomplete ones
 * Positioned below existing profile information
 */
export function ProfileAchievements({
  showProgress = true,
}: ProfileAchievementsProps) {
  const { achievements, loading, error } = useUserAchievements();

  // Sort achievements: unlocked first (newest), then locked by progress
  const sortedAchievements = useMemo(() => {
    const sorted = [...achievements].sort((a, b) => {
      // Unlocked achievements first
      if (a.isUnlocked && !b.isUnlocked) return -1;
      if (!a.isUnlocked && b.isUnlocked) return 1;

      // Among unlocked, sort by unlock date (newest first)
      if (a.isUnlocked && b.isUnlocked) {
        const dateA = a.unlockedAt ? new Date(a.unlockedAt).getTime() : 0;
        const dateB = b.unlockedAt ? new Date(b.unlockedAt).getTime() : 0;
        return dateB - dateA;
      }

      // Among locked, sort by progress (highest first)
      return (b.percentComplete ?? 0) - (a.percentComplete ?? 0);
    });
    return sorted;
  }, [achievements]);

  if (error) {
    return (
      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-4">Achievements</h2>
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load achievements. Please try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-4">Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (achievements.length === 0) {
    return (
      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-4">Achievements</h2>
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <div className="mb-2">🎯</div>
          <p className="font-medium">No achievements yet</p>
          <p className="text-sm text-muted-foreground mt-2">
            Complete meetings and engage with your organization to unlock
            achievements
          </p>
        </div>
      </div>
    );
  }

  // Calculate stats
  const unlockedCount = sortedAchievements.filter((a) => a.isUnlocked).length;
  const totalCount = sortedAchievements.length;
  const completionPercentage = Math.round((unlockedCount / totalCount) * 100);
  const totalPoints = sortedAchievements.reduce(
    (sum, a) => sum + (a.pointValue || 0),
    0
  );
  const earnedPoints = sortedAchievements
    .filter((a) => a.isUnlocked)
    .reduce((sum, a) => sum + (a.pointValue || 0), 0);

  return (
    <div className="mt-6 mb-4">
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Achievements</h2>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div className="rounded-lg border border-border bg-card p-3">
              <p className="text-sm text-muted-foreground">Unlocked</p>
              <p className="text-xl font-semibold">
                {unlockedCount} / {totalCount}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-3">
              <p className="text-sm text-muted-foreground">Points Earned</p>
              <p className="text-xl font-semibold">
                {earnedPoints} / {totalPoints}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-3">
              <p className="text-sm text-muted-foreground">Completion</p>
              <p className="text-xl font-semibold">{completionPercentage}%</p>
            </div>
          </div>
        </div>

        {/* Achievement Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedAchievements.map((achievement) => (
            <AchievementCard
              key={achievement.achievementId}
              achievement={achievement}
              showProgress={showProgress}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
