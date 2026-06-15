import { useState } from "react";
import {
  Activity,
  BarChart3,
  Handshake,
  LayoutDashboard,
  MessageCircle,
  Sparkles,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Self-contained, clickable product demo for the landing hero.
 * Pure UI with mock data — no backend, no auth. Visitors can switch
 * "screens" to get a feel for the app.
 */

type TabKey = "dashboard" | "pairings" | "stats";

const TABS: { key: TabKey; label: string; icon: typeof LayoutDashboard }[] = [
  { key: "dashboard", label: "Home", icon: LayoutDashboard },
  { key: "pairings", label: "Pairings", icon: Handshake },
  { key: "stats", label: "Stats", icon: BarChart3 },
];

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

const Avatar = ({ name, tone, size = "h-9 w-9" }: { name: string; tone: string; size?: string }) => (
  <span
    className={cn(
      "flex shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white",
      tone,
      size
    )}
  >
    {initials(name)}
  </span>
);

const DashboardPanel = () => (
  <div className="space-y-3">
    <div className="overflow-hidden rounded-lg border border-border/60 bg-card shadow-sm">
      <div className="h-1 w-full gradient-primary" />
      <div className="flex items-center gap-3 p-3">
        <Avatar name={people[0].name} tone={people[0].tone} size="h-11 w-11" />
        <div className="min-w-0">
          <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            Currently paired with
          </p>
          <p className="truncate text-sm font-bold text-foreground">
            {people[0].name}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {people[0].role}
          </p>
        </div>
        <span className="ml-auto flex items-center gap-1 rounded-md bg-primary px-2 py-1 text-[10px] font-medium text-primary-foreground">
          <MessageCircle className="h-3 w-3" /> Message
        </span>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-2">
      <div className="rounded-lg border border-border/60 bg-card p-2.5">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Sparkles className="h-3 w-3" />
          <span className="text-[10px]">Conversation starter</span>
        </div>
        <p className="mt-1 text-[11px] leading-tight text-foreground">
          You both like hiking — ask about favorite trails.
        </p>
      </div>
      <div className="rounded-lg border border-border/60 bg-card p-2.5">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Activity className="h-3 w-3" />
          <span className="text-[10px]">Your streak</span>
        </div>
        <p className="mt-1 text-lg font-bold tabular-nums text-foreground">
          3 cycles
        </p>
      </div>
    </div>
  </div>
);

const PairingsPanel = () => (
  <div className="space-y-1.5">
    {people.map((p, i) => (
      <div
        key={p.name}
        className={cn(
          "flex items-center gap-2.5 rounded-lg border p-2",
          i === 0
            ? "border-primary/40 bg-primary/5"
            : "border-border/60 bg-card"
        )}
      >
        <Avatar name={p.name} tone={p.tone} />
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-foreground">
            {p.name}
          </p>
          <p className="truncate text-[11px] text-muted-foreground">{p.role}</p>
        </div>
        {i === 0 && (
          <span className="ml-auto rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-medium text-success">
            Active
          </span>
        )}
      </div>
    ))}
  </div>
);

const StatsPanel = () => {
  const bars = [40, 65, 55, 80, 72];
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Completion", value: "82%" },
          { label: "Participation", value: "91%" },
          { label: "Avg rating", value: "4.6" },
        ].map((k) => (
          <div
            key={k.label}
            className="rounded-lg border border-border/60 bg-card p-2"
          >
            <p className="text-[10px] text-muted-foreground">{k.label}</p>
            <p className="text-sm font-bold tabular-nums text-foreground">
              {k.value}
            </p>
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-border/60 bg-card p-3">
        <p className="mb-2 text-[10px] text-muted-foreground">
          Meetings per cycle
        </p>
        <div className="flex h-20 items-end gap-2">
          {bars.map((h, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full rounded-t bg-primary/80"
                style={{ height: `${h}%` }}
              />
              <Star
                className={cn(
                  "h-2.5 w-2.5",
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

  return (
    <div className="w-full max-w-md rounded-xl border border-border/60 bg-background shadow-elevated-lg">
      {/* Window chrome */}
      <div className="flex items-center gap-1.5 border-b border-border/60 px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-destructive/50" />
        <span className="h-2.5 w-2.5 rounded-full bg-warning/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-success/60" />
        <span className="ml-3 rounded bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
          app.torus · live demo
        </span>
      </div>

      <div className="flex">
        {/* Mini sidebar */}
        <nav className="flex w-24 flex-col gap-1 border-r border-border/60 p-2">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-[11px] font-medium transition",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {t.label}
              </button>
            );
          })}
        </nav>

        {/* Panel */}
        <div className="min-h-[260px] flex-1 bg-muted/20 p-3">
          {tab === "dashboard" && <DashboardPanel />}
          {tab === "pairings" && <PairingsPanel />}
          {tab === "stats" && <StatsPanel />}
        </div>
      </div>
    </div>
  );
};
