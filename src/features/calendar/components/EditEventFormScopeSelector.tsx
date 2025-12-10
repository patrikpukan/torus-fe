import React from "react";
import { Label } from "@/components/ui/label";

interface EditEventFormScopeSelectorProps {
  scope: "this" | "following" | "all";
  onScopeChange: (scope: "this" | "following" | "all") => void;
  disabled?: boolean;
}

export const EditEventFormScopeSelector: React.FC<
  EditEventFormScopeSelectorProps
> = ({ scope, onScopeChange, disabled = false }) => {
  return (
    <div className="space-y-3 border-y py-4">
      <Label>Update scope</Label>
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <input
            type="radio"
            id="scope-this"
            value="this"
            checked={scope === "this"}
            onChange={(e) =>
              onScopeChange(e.target.value as "this" | "following" | "all")
            }
            disabled={disabled}
          />
          <Label htmlFor="scope-this" className="cursor-pointer font-normal">
            This event only
          </Label>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="radio"
            id="scope-following"
            value="following"
            checked={scope === "following"}
            onChange={(e) =>
              onScopeChange(e.target.value as "this" | "following" | "all")
            }
            disabled={disabled}
          />
          <Label
            htmlFor="scope-following"
            className="cursor-pointer font-normal"
          >
            This and following events
          </Label>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="radio"
            id="scope-all"
            value="all"
            checked={scope === "all"}
            onChange={(e) =>
              onScopeChange(e.target.value as "this" | "following" | "all")
            }
            disabled={disabled}
          />
          <Label htmlFor="scope-all" className="cursor-pointer font-normal">
            All events in series
          </Label>
        </div>
      </div>
      {scope === "all" && (
        <p className="mt-2 text-xs text-muted-foreground">
          When updating all events, date and time changes are not applied (only
          title and type). To change the time of all events, delete and recreate
          the recurring event.
        </p>
      )}
    </div>
  );
};
