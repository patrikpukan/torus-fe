import PairingsView from "@/features/pairings/components/PairingsView";
import { Handshake } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";

const PairingsPage = () => {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={Handshake}
        title="Pairings"
        description="Review the colleagues you're paired with, continue conversations, or revisit their profile and availability without leaving the workspace."
      />
      <PairingsView />
    </div>
  );
};

export default PairingsPage;
