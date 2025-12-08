import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const PairingEmptyState = () => (
  <div className="flex flex-1 flex-col items-start gap-4">
    <div>
      <h2 className="text-xl font-semibold">No active pairings yet</h2>
      <p className="text-sm text-muted-foreground">
        Once you&apos;re paired with a colleague, their details will show up
        here.
      </p>
    </div>
    <Button className="bg-secondary text-primary" asChild variant="secondary">
      <Link to="/pairings">Browse pairings</Link>
    </Button>
  </div>
);
