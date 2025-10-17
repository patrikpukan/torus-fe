import PairingsView from "@/features/pairings/components/PairingsView";

const PairingsPage = () => {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Pairings</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Review all colleagues you are paired with, continue conversations, or
          revisit their profile and availability without leaving the workspace.
        </p>
      </div>
      <PairingsView />
    </div>
  );
};

export default PairingsPage;
