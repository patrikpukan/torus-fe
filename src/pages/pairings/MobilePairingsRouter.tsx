import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import PairingsList, { type SortMode } from "@/features/pairings/components/PairingsList";
import PairingDetail from "@/features/pairings/components/PairingDetail";
import { pairingContacts } from "@/mocks/mockPairings";

export default function MobilePairingsRouter() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const params = useParams();
  const [sortMode, setSortMode] = useState<SortMode>("paired");
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const selectedId = params.id ?? undefined;
  const selected = useMemo(
    () => pairingContacts.find((c) => c.id === selectedId),
    [selectedId]
  );

  const handleSelect = (id: string) => {
    if (isMobile) navigate(`/pairings/${id}`);
  };

  const handleBack = () => navigate(`/pairings`);

  const handleDraftChange = (id: string, value: string) =>
    setDrafts((prev) => ({ ...prev, [id]: value }));

  const handleSend = () => {
    // In mobile router we don’t mutate the mock data; detail component shows UI only
    const id = selected?.id;
    if (!id) return;
    setDrafts((prev) => ({ ...prev, [id]: "" }));
  };

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
      <PairingDetail
        contact={selected}
        drafts={drafts}
        onChangeDraft={handleDraftChange}
        onSend={handleSend}
        onBack={handleBack}
      />
    </div>
  );
}
