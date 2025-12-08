import PairingsView from "@/features/pairings/components/PairingsView";
import { Handshake } from "lucide-react";

const PairingsPage = () => {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="flex items-center gap-3 text-3xl font-semibold tracking-tight">
          <Handshake aria-hidden className="h-8 w-8 text-primary" />
          <span>Pairings</span>
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Review all Fico's colleagues you are paired with, continue
          conversations, or revisit their profile and availability without
          leaving the workspace.
        </p>
      </div>
      <PairingsView />
    </div>
  );
};

export default PairingsPage;
