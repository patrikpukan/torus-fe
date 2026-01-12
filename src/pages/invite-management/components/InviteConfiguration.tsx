import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown } from "lucide-react";

interface InviteConfigurationProps {
  maxUses: number;
  setMaxUses: (value: number) => void;
  expirationDays: number;
  setExpirationDays: (value: number) => void;
  isAdvancedOpen: boolean;
  setIsAdvancedOpen: (value: boolean) => void;
  idPrefix?: string;
}

export const InviteConfiguration = ({
  maxUses,
  setMaxUses,
  expirationDays,
  setExpirationDays,
  isAdvancedOpen,
  setIsAdvancedOpen,
  idPrefix = "invite",
}: InviteConfigurationProps) => {
  return (
    <div className="w-full max-w-md space-y-4">
      <Button
        variant="ghost"
        onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
        className="w-full text-muted-foreground"
      >
        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            isAdvancedOpen ? "rotate-180" : ""
          }`}
        />
        <span>Advanced Options</span>
      </Button>

      {isAdvancedOpen && (
        <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
          <div className="space-y-2">
            <Label htmlFor={`${idPrefix}-maxUses`}>Maximum uses</Label>
            <Input
              id={`${idPrefix}-maxUses`}
              type="number"
              min={1}
              max={1000}
              value={maxUses}
              onChange={(e) => setMaxUses(Number(e.target.value))}
            />
            <p className="text-xs text-muted-foreground">
              How many times this invite can be used (1-1000)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${idPrefix}-expiration`}>Expiration (days)</Label>
            <Input
              id={`${idPrefix}-expiration`}
              type="number"
              min={1}
              max={365}
              value={expirationDays}
              onChange={(e) => setExpirationDays(Number(e.target.value))}
            />
            <p className="text-xs text-muted-foreground">
              How long the invite is valid (1-365 days)
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
