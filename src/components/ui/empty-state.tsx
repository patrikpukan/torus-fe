import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

/**
 * Consistent, intentional empty/placeholder state: a soft icon medallion,
 * a title, optional supporting line, and an optional action — instead of a
 * lone line of muted text.
 */
export const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) => (
  <div
    className={cn(
      "flex flex-col items-center justify-center gap-3 px-6 py-12 text-center",
      className
    )}
  >
    {Icon && (
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon className="h-7 w-7" />
      </div>
    )}
    <div className="space-y-1">
      <h3 className="font-heading text-base font-semibold">{title}</h3>
      {description && (
        <p className="mx-auto max-w-sm text-sm text-muted-foreground">
          {description}
        </p>
      )}
    </div>
    {action && <div className="pt-1">{action}</div>}
  </div>
);
