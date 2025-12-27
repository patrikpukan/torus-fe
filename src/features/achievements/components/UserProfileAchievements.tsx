import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import AchievementCard from "./AchievementCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserProfileAchievements } from "../hooks/useAchievements";
import { useUserAchievementPoints } from "../hooks/useUserAchievementPoints";
import { useMemo } from "react";
import { AlertCircle } from "lucide-react";

export interface UserProfileAchievementsProps {
  /**
   * The ID of the user to display achievements for
   */
  userId: string;
}

/**
 * Achievement section for viewing another user's profile
 * Displays only unlocked achievements
 * Includes authorization checks for org_admins and cross-organization viewing
 */
export function UserProfileAchievements({
  userId,
}: UserProfileAchievementsProps) {
  const { achievements, loading, error } = useUserProfileAchievements(userId);
  const { data: pointsData, isLoading: pointsLoading } =
    useUserAchievementPoints(userId);

  // Filter to show only unlocked achievements and sort by unlock date
  const unlockedAchievements = useMemo(() => {
    return achievements.sort((a, b) => {
      // Sort by unlock date (newest first)
      const dateA = a.unlockedAt ? new Date(a.unlockedAt).getTime() : 0;
      const dateB = b.unlockedAt ? new Date(b.unlockedAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [achievements]);

  if (error) {
    const errorMessage = error?.message || "";
    const isForbiddenError = /forbidden|permission|not authorized/i.test(
      errorMessage
    );

    return (
      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-4">Achievements</h2>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Unable to load achievements</AlertTitle>
          <AlertDescription>
            {isForbiddenError
              ? "You don't have permission to view this user's achievements. You can only view achievements for users in your organization."
              : "Failed to load achievements. Please try again."}
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
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (unlockedAchievements.length === 0) {
    return (
      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-4">Achievements</h2>
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <div className="mb-2">🎯</div>
          <p className="font-medium">No achievements unlocked yet</p>
          <p className="text-sm text-muted-foreground mt-2">
            This user hasn't unlocked any achievements yet
          </p>
        </div>
      </div>
    );
  }

  const earnedPoints = pointsData?.earnedPoints ?? 0;
  const possiblePoints = pointsData?.possiblePoints ?? 0;

  return (
    <div className="mt-6 mb-4">
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Achievements</h2>

          {/* Summary of unlocked achievements and points */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="rounded-lg border border-border bg-card p-3">
              <p className="text-sm text-muted-foreground">
                Achievements Unlocked
              </p>
              <p className="text-xl font-semibold">
                {unlockedAchievements.length}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-3">
              <p className="text-sm text-muted-foreground">Points Earned</p>
              {pointsLoading ? (
                <Skeleton className="h-7 w-20 mt-1" />
              ) : (
                <p className="text-xl font-semibold">
                  {earnedPoints} / {possiblePoints}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Achievement Cards Grid - show only unlocked, no progress bars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {unlockedAchievements.map((achievement) => (
            <AchievementCard
              key={achievement.achievementId}
              achievement={achievement}
              showProgress={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
