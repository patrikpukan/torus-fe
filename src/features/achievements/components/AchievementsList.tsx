import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import AchievementCard from "./AchievementCard";
import {
  useUserAchievements,
  useAchievementStats,
} from "../hooks/useAchievements";
import type { Achievement } from "../graphql/achievement.types";

export type AchievementsListProps = {
  showSectionHeaders?: boolean;
  onAchievementClick?: (achievement: Achievement) => void;
};

/**
 * AchievementsList Component
 *
 * Displays user's achievements in a responsive grid with:
 * - Sorting: newest unlocked first, then all locked achievements
 * - Responsive layout: 1 column mobile, 2-3 columns on larger screens
 * - Loading skeleton states for async data
 * - Empty state when no achievements exist
 * - Optional section headers for "Unlocked" and "Locked"
 *
 * @example
 * <AchievementsList
 *   showSectionHeaders
 *   onAchievementClick={(achievement) => openDetailModal(achievement)}
 * />
 */
export default function AchievementsList({
  showSectionHeaders = false,
  onAchievementClick,
}: AchievementsListProps) {
  const { achievements, loading, error } = useUserAchievements();
  const stats = useAchievementStats(achievements);

  // Sort achievements: newest unlocked first, then locked
  const sortedAchievements = useMemo(() => {
    if (!achievements.length) return [];

    const unlocked = achievements
      .filter((a) => a.isUnlocked)
      .sort((a, b) => {
        if (!a.unlockedAt || !b.unlockedAt) return 0;
        return (
          new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime()
        );
      });

    const locked = achievements
      .filter((a) => !a.isUnlocked)
      .sort((a, b) => b.currentProgress - a.currentProgress);

    return [...unlocked, ...locked];
  }, [achievements]);

  // Group for section headers
  const { unlockedAchievements, lockedAchievements } = useMemo(() => {
    return {
      unlockedAchievements: sortedAchievements.filter((a) => a.isUnlocked),
      lockedAchievements: sortedAchievements.filter((a) => !a.isUnlocked),
    };
  }, [sortedAchievements]);

  // Loading state
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array(6)
          .fill(null)
          .map((_, i) => (
            <Skeleton
              key={i}
              className="h-64 rounded-lg"
              data-testid="achievement-skeleton"
            />
          ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
        <p className="text-sm text-destructive">
          Failed to load achievements. Please try again.
        </p>
      </div>
    );
  }

  // Empty state
  if (!achievements.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-muted-foreground/25 p-8 text-center">
        <div className="text-4xl mb-3">🏆</div>
        <h3 className="font-semibold text-lg mb-1">No Achievements Yet</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Complete meetings and activities to unlock your first achievement!
        </p>
      </div>
    );
  }

  // Main content with optional sections
  if (showSectionHeaders) {
    return (
      <div className="space-y-6">
        {/* Stats summary */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="rounded-lg bg-muted/50 p-3">
            <div className="text-xs text-muted-foreground">Unlocked</div>
            <div className="text-2xl font-bold">{stats.unlockedCount}</div>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <div className="text-xs text-muted-foreground">Total</div>
            <div className="text-2xl font-bold">{stats.totalAchievements}</div>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <div className="text-xs text-muted-foreground">Points</div>
            <div className="text-2xl font-bold">{stats.earnedPoints}</div>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <div className="text-xs text-muted-foreground">Complete</div>
            <div className="text-2xl font-bold">
              {stats.completionPercentage}%
            </div>
          </div>
        </div>

        {/* Unlocked Section */}
        {unlockedAchievements.length > 0 && (
          <div>
            <h3 className="font-semibold text-base mb-3 flex items-center gap-2">
              <span>✨ Unlocked</span>
              <span className="text-xs text-muted-foreground font-normal">
                ({unlockedAchievements.length})
              </span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {unlockedAchievements.map((achievement) => (
                <AchievementCard
                  key={achievement.achievementId}
                  achievement={achievement}
                  onClick={() => onAchievementClick?.(achievement)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Locked Section */}
        {lockedAchievements.length > 0 && (
          <div>
            <h3 className="font-semibold text-base mb-3 flex items-center gap-2">
              <span>🔒 Locked</span>
              <span className="text-xs text-muted-foreground font-normal">
                ({lockedAchievements.length})
              </span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lockedAchievements.map((achievement) => (
                <AchievementCard
                  key={achievement.achievementId}
                  achievement={achievement}
                  onClick={() => onAchievementClick?.(achievement)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Simple grid layout (default)
  return (
    <div>
      {stats.unlockedCount > 0 && (
        <p className="mb-4 text-sm text-muted-foreground">
          {stats.completionPercentage}% complete • {stats.earnedPoints}/
          {stats.totalPoints} points
        </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedAchievements.map((achievement) => (
          <AchievementCard
            key={achievement.achievementId}
            achievement={achievement}
            onClick={() => onAchievementClick?.(achievement)}
          />
        ))}
      </div>
    </div>
  );
}
