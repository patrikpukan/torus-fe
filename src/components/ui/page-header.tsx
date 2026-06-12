import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  icon?: LucideIcon;
  title: string;
  description?: string;
  /** Right-aligned slot for actions (buttons, status pills). */
  actions?: ReactNode;
  className?: string;
};

/**
 * Standard page header: icon + display-font title, optional description
 * and a right-aligned actions slot. Keeps page tops consistent app-wide.
 */
export const PageHeader = ({
  icon: Icon,
  title,
  description,
  actions,
  className,
}: PageHeaderProps) => (
  <header
    className={cn(
      "flex flex-wrap items-start justify-between gap-3",
      className
    )}
  >
    <div className="space-y-2">
      <h1 className="flex items-center gap-3 font-heading text-3xl font-bold tracking-tight text-foreground">
        {Icon && <Icon aria-hidden className="h-8 w-8 text-primary" />}
        <span>{title}</span>
      </h1>
      {description && (
        <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>
      )}
    </div>
    {actions && <div className="flex items-center gap-2">{actions}</div>}
  </header>
);
