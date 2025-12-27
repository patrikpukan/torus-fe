import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Achievement } from "../graphql/achievement.types";
import {
  getAchievementIcon,
  getAchievementTypeColors,
  getAchievementFilter,
} from "../lib/achievement-icons";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export type AchievementCardProps = {
  achievement: Achievement;
  onClick?: () => void;
  /**
   * Whether to show progress indicator for locked achievements
   * @default true
   */
  showProgress?: boolean;
};

/**
 * AchievementCard Component
 *
 * Displays a single achievement with unlock status, description, and optional progress.
 * Features:
 * - Shows achievement icon from lucide-react
 * - Visual distinction between locked (grayscale, lower opacity) and unlocked states
 * - Displays unlock date for unlocked achievements
 * - Color-coded by achievement type
 * - Hover animation for interactive feedback
 * - Supports click handler for detail views
 *
 * @example
 * <AchievementCard
 *   achievement={achievementData}
 *   onClick={() => openDetailModal(achievementData)}
 * />
 */
export default function AchievementCard({
  achievement,
  onClick,
  showProgress = true,
}: AchievementCardProps) {
  const isLocked = !achievement.isUnlocked;
  const unlockedDate = achievement.unlockedAt
    ? format(new Date(achievement.unlockedAt), "MMM d, yyyy")
    : null;

  // Get icon component and colors
  const IconComponent = getAchievementIcon(achievement.imageIdentifier);
  const typeColors = getAchievementTypeColors(achievement.type);
  const filterClass = getAchievementFilter(achievement.isUnlocked);

  return (
    <Card
      onClick={onClick}
      className={cn(
        "h-full transition-all duration-200 flex flex-col",
        onClick && "cursor-pointer hover:shadow-lg hover:scale-105",
        isLocked && "opacity-50 grayscale"
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start gap-3">
          {/* Achievement Icon */}
          <div
            className={cn(
              "h-12 w-12 shrink-0 rounded-lg flex items-center justify-center transition-all",
              `${typeColors.bg} ${typeColors.text}`,
              filterClass
            )}
          >
            <IconComponent size={24} className="drop-shadow-sm" />
          </div>

          {/* Title, Type Badge, and Status */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm mb-2">{achievement.name}</h3>
            <Badge
              variant="secondary"
              className={cn(
                "text-xs font-medium",
                `${typeColors.bg} ${typeColors.text}`
              )}
            >
              {achievement.type}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 flex-1 flex flex-col">
        {/* Description */}
        <p className="text-sm text-muted-foreground">
          {achievement.description}
        </p>

        {/* Progress or Unlock Date */}
        {achievement.isUnlocked && unlockedDate ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full" />
              Unlocked on {unlockedDate}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Earned:</span>
              <span className="font-semibold text-sm text-green-600 dark:text-green-400">
                +{achievement.pointValue} points
              </span>
            </div>
          </div>
        ) : showProgress ? (
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">
                {achievement.currentProgress}/{achievement.targetProgress}
              </span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
                style={{
                  width: `${achievement.percentComplete}%`,
                }}
              />
            </div>
            <div className="text-xs text-muted-foreground">
              {achievement.percentComplete}% complete
            </div>
          </div>
        ) : null}

        {/* Points Value - shown only for locked achievements */}
        {isLocked && (
          <div className="flex items-center justify-between pt-2 border-t border-border mt-auto">
            <span className="text-xs text-muted-foreground">
              Available Points
            </span>
            <span className="font-semibold text-sm text-blue-600 dark:text-blue-400">
              +{achievement.pointValue}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
