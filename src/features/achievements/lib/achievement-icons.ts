import { Sparkles, Users, Network, Calendar, Trophy, Star } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * Mapping of achievement identifiers to lucide-react icons
 * Each achievement has a unique visual representation
 */
export const ACHIEVEMENT_ICON_MAP: Record<string, LucideIcon> = {
  // Newcomer - First meeting achieved
  newcomer: Sparkles,

  // Social Butterfly - Met 10 different people
  "social-butterfly": Users,

  // Bridge Builder - Cross-department connection
  "bridge-builder": Network,

  // Regular Participant - 10 consecutive cycles
  "regular-participant": Calendar,

  // Pairing Legend - 50 meetings total
  "pairing-legend": Trophy,

  // Fallback for unknown identifiers
  default: Star,
};

/**
 * Get the appropriate icon component for an achievement by identifier
 * Returns a fallback icon if identifier not found
 *
 * @param imageIdentifier - The achievement's image identifier
 * @returns LucideIcon component
 *
 * @example
 * const IconComponent = getAchievementIcon("newcomer");
 * return <IconComponent size={24} />;
 */
export function getAchievementIcon(imageIdentifier: string): LucideIcon {
  return ACHIEVEMENT_ICON_MAP[imageIdentifier] ?? ACHIEVEMENT_ICON_MAP.default;
}

/**
 * Get color scheme for achievement type
 * Used for badges and visual differentiation
 */
export const ACHIEVEMENT_TYPE_COLORS: Record<
  string,
  {
    bg: string;
    text: string;
    border: string;
    dark: {
      bg: string;
      text: string;
      border: string;
    };
  }
> = {
  milestone: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    dark: {
      bg: "dark:bg-blue-950",
      text: "dark:text-blue-200",
      border: "dark:border-blue-800",
    },
  },
  social: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
    dark: {
      bg: "dark:bg-purple-950",
      text: "dark:text-purple-200",
      border: "dark:border-purple-800",
    },
  },
  engagement: {
    bg: "bg-cyan-50",
    text: "text-cyan-700",
    border: "border-cyan-200",
    dark: {
      bg: "dark:bg-cyan-950",
      text: "dark:text-cyan-200",
      border: "dark:border-cyan-800",
    },
  },
  consistency: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dark: {
      bg: "dark:bg-amber-950",
      text: "dark:text-amber-200",
      border: "dark:border-amber-800",
    },
  },
  legendary: {
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    border: "border-yellow-200",
    dark: {
      bg: "dark:bg-yellow-950",
      text: "dark:text-yellow-200",
      border: "dark:border-yellow-800",
    },
  },
};

/**
 * Get color scheme for a specific achievement type
 *
 * @param type - Achievement type
 * @returns Color scheme object with bg, text, and border colors
 *
 * @example
 * const colors = getAchievementTypeColors("milestone");
 * return <div className={`${colors.bg} ${colors.text}`}>Badge</div>;
 */
export function getAchievementTypeColors(type: string) {
  return (
    ACHIEVEMENT_TYPE_COLORS[type as keyof typeof ACHIEVEMENT_TYPE_COLORS] ||
    ACHIEVEMENT_TYPE_COLORS.milestone
  );
}

/**
 * Get grayscale filter for locked achievements
 * Used to visually distinguish locked from unlocked achievements
 */
export const LOCKED_ACHIEVEMENT_FILTER =
  "grayscale(100%) opacity-50 hover:opacity-60";
export const UNLOCKED_ACHIEVEMENT_FILTER =
  "opacity-100 hover:opacity-80 transition-opacity";

/**
 * Get filter classes for achievement based on unlock status
 *
 * @param isUnlocked - Whether the achievement is unlocked
 * @returns CSS filter classes
 *
 * @example
 * const filterClass = getAchievementFilter(true);
 * return <div className={filterClass}>Icon</div>;
 */
export function getAchievementFilter(isUnlocked: boolean): string {
  return isUnlocked ? UNLOCKED_ACHIEVEMENT_FILTER : LOCKED_ACHIEVEMENT_FILTER;
}
