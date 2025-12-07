import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import PairingsList, {
  type SortMode,
} from "@/features/pairings/components/PairingsList";
import ChatPairingDetail from "@/features/chat/components/ChatPairingDetail";
import { usePairingsQuery } from "@/features/pairings/api/usePairingsQuery";

export default function MobilePairingsRouter() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const params = useParams();
  const [sortMode, setSortMode] = useState<SortMode>("paired");

  const { pairingContacts } = usePairingsQuery();

  const selectedId = params.id ?? undefined;
  const selected = useMemo(
    () => pairingContacts.find((c) => c.id === selectedId),
    [selectedId, pairingContacts]
  );

  const handleSelect = (id: string) => {
    if (isMobile) navigate(`/pairings/${id}`);
  };

  const handleBack = () => navigate(`/pairings`);

  if (!isMobile) {
    // On desktop we keep the existing split view page (PairingsPage renders PairingsView)
    return null;
  }

  // Mobile: list-only or detail-only layers
  if (!selected) {
    return (
      <PairingsList
        contacts={pairingContacts}
        sortMode={sortMode}
        onChangeSortMode={setSortMode}
        onSelect={handleSelect}
      />
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)]">
      <ChatPairingDetail contact={selected} onBack={handleBack} />
    </div>
  );
}
