import { useState } from "react";
import {
  Activity,
  BarChart3,
  Bell,
  Handshake,
  LayoutDashboard,
  MessageCircle,
  Search,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useBrand } from "@/branding";

/**
 * Self-contained, clickable product demo for the landing hero.
 * Pure UI with mock data — no backend, no auth. Visitors can switch
 * "screens" to get a feel for the real app shell (branded sidebar,
 * top bar, content panels).
 */

type TabKey = "dashboard" | "pairings" | "stats";

const TABS: { key: TabKey; label: string; icon: typeof LayoutDashboard }[] = [
  { key: "dashboard", label: "Home", icon: LayoutDashboard },
  { key: "pairings", label: "Pairings", icon: Handshake },
  { key: "stats", label: "Statistics", icon: BarChart3 },
];

const TAB_TITLES: Record<TabKey, string> = {
  dashboard: "Home",
  pairings: "My Pairings",
  stats: "Statistics",
};

const people = [
  { name: "Andrew Johnson", role: "DevOps Engineer", tone: "bg-indigo-500" },
  { name: "Priya Nair", role: "Product Designer", tone: "bg-rose-500" },
  { name: "Marco Rossi", role: "Data Analyst", tone: "bg-emerald-500" },
  { name: "Lena Vogel", role: "People Ops", tone: "bg-amber-500" },
];

const initials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .join("");

const Avatar = ({
  name,
  tone,
  size = "h-10 w-10",
}: {
  name: string;
  tone: string;
  size?: string;
}) => (
  <span
    className={cn(
      "flex shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white",
      tone,
      size
    )}
  >
    {initials(name)}
  </span>
);

const DashboardPanel = () => (
  <div className="space-y-4">
    <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
      <div className="h-1.5 w-full gradient-primary" />
      <div className="flex items-center gap-4 p-4">
        <Avatar name={people[0].name} tone={people[0].tone} size="h-14 w-14" />
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Currently paired with
          </p>
          <p className="truncate text-base font-bold text-foreground">
            {people[0].name}
          </p>
          <p className="truncate text-sm text-muted-foreground">
            {people[0].role}
          </p>
        </div>
        <span className="ml-auto flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground">
          <MessageCircle className="h-4 w-4" /> Message
        </span>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-xl border border-border/60 bg-card p-3.5">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-xs font-medium">Conversation starter</span>
        </div>
        <p className="mt-2 text-sm leading-snug text-foreground">
          You both like hiking — ask about favorite trails.
        </p>
      </div>
      <div className="rounded-xl border border-border/60 bg-card p-3.5">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Activity className="h-4 w-4 text-primary" />
          <span className="text-xs font-medium">Your streak</span>
        </div>
        <p className="mt-2 text-2xl font-bold tabular-nums text-foreground">
          3{" "}
          <span className="text-sm font-medium text-muted-foreground">
            cycles
          </span>
        </p>
      </div>
    </div>
  </div>
);

const PairingsPanel = () => (
  <div className="space-y-2.5">
    {people.map((p, i) => (
      <div
        key={p.name}
        className={cn(
          "flex items-center gap-3 rounded-xl border p-3",
          i === 0
            ? "border-primary/40 bg-primary/5"
            : "border-border/60 bg-card"
        )}
      >
        <Avatar name={p.name} tone={p.tone} />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">
            {p.name}
          </p>
          <p className="truncate text-xs text-muted-foreground">{p.role}</p>
        </div>
        <span
          className={cn(
            "ml-auto rounded-full px-2.5 py-0.5 text-[11px] font-medium",
            i === 0
              ? "bg-success/15 text-success"
              : "bg-muted text-muted-foreground"
          )}
        >
          {i === 0 ? "Active" : "Past"}
        </span>
      </div>
    ))}
  </div>
);

const StatsPanel = () => {
  const bars = [40, 65, 55, 80, 72, 88];
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Completion", value: "82%" },
          { label: "Participation", value: "91%" },
          { label: "Avg rating", value: "4.6" },
        ].map((k) => (
          <div
            key={k.label}
            className="rounded-xl border border-border/60 bg-card p-3"
          >
            <p className="text-[11px] text-muted-foreground">{k.label}</p>
            <p className="text-lg font-bold tabular-nums text-foreground">
              {k.value}
            </p>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-border/60 bg-card p-4">
        <div className="mb-3 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          <p className="text-xs font-medium text-muted-foreground">
            Meetings per cycle
          </p>
        </div>
        <div className="flex h-28 items-end gap-2.5">
          {bars.map((h, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
              <div
                className="w-full rounded-t-md bg-primary/80"
                style={{ height: `${h}%` }}
              />
              <Star
                className={cn(
                  "h-3 w-3",
                  i >= 3 ? "text-warning" : "text-muted-foreground/40"
                )}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const InteractiveDemo = () => {
  const [tab, setTab] = useState<TabKey>("dashboard");
  const { Logo, productName } = useBrand();

  return (
    <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-border/60 bg-background shadow-elevated-lg">
      {/* Window chrome */}
      <div className="flex items-center gap-1.5 border-b border-border/60 bg-muted/40 px-4 py-2.5">
        <span className="h-3 w-3 rounded-full bg-destructive/50" />
        <span className="h-3 w-3 rounded-full bg-warning/60" />
        <span className="h-3 w-3 rounded-full bg-success/60" />
        <span className="ml-3 rounded-md bg-background px-2.5 py-1 text-[11px] text-muted-foreground">
          app.torus · live demo
        </span>
      </div>

      <div className="flex">
        {/* Sidebar — mirrors the real app shell */}
        <nav className="flex w-40 flex-col border-r border-border/60 bg-card/50 p-3">
          <div className="mb-4 flex items-center gap-2 px-1">
            <div className="h-7 w-7">
              <Logo />
            </div>
            <span className="font-heading text-sm font-bold">
              {productName}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = tab === t.key;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTab(t.key)}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-medium transition",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {t.label}
                </button>
              );
            })}
          </div>
          <div className="mt-auto flex items-center gap-2 border-t border-border/60 px-1 pt-3">
            <Avatar name="You Today" tone="bg-primary" size="h-7 w-7" />
            <span className="text-xs font-medium text-foreground">You</span>
          </div>
        </nav>

        {/* Content area */}
        <div className="min-h-[340px] flex-1 bg-muted/20">
          {/* Top bar */}
          <div className="flex items-center justify-between border-b border-border/60 px-4 py-2.5">
            <span className="font-heading text-sm font-bold text-foreground">
              {TAB_TITLES[tab]}
            </span>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Search className="h-4 w-4" />
              <Bell className="h-4 w-4" />
            </div>
          </div>
          <div className="p-4">
            {tab === "dashboard" && <DashboardPanel />}
            {tab === "pairings" && <PairingsPanel />}
            {tab === "stats" && <StatsPanel />}
          </div>
        </div>
      </div>
    </div>
  );
};
