import { useEffect, useMemo, useState } from "react";

import { Card } from "@/components/ui/card";
import type { PairingContact } from "@/mocks/mockPairings";
import { useIsMobile } from "@/hooks/use-mobile";
import PairingsList from "./PairingsList";
import { usePairingsQuery } from "@/features/pairings/api/usePairingsQuery";
import ChatPairingDetail from "@/features/chat/components/ChatPairingDetail";

type SortMode = "paired" | "message";

type ContactsState = PairingContact[];

const PairingsView = () => {
  // Fetch real pairing data from GraphQL backend
  const { pairingContacts: realContacts } = usePairingsQuery();

  const [contacts, setContacts] = useState<ContactsState>([]);
  const [sortMode, setSortMode] = useState<SortMode>("paired");
  const [selectedId, setSelectedId] = useState<string>("");

  const isMobile = useIsMobile();

  // Update contacts when real data is loaded
  useEffect(() => {
    if (realContacts && realContacts.length > 0) {
      setContacts(realContacts);
      if (!selectedId) {
        setSelectedId(realContacts[0]?.id ?? "");
      }
    }
  }, [realContacts, selectedId]);

  const selectedContact = useMemo(() => {
    return contacts.find((contact) => contact.id === selectedId);
  }, [contacts, selectedId]);

  useEffect(() => {
    if (!selectedContact) {
      const fallback = contacts[0];
      if (fallback) {
        setSelectedId(fallback.id);
      }
    }
  }, [contacts, selectedContact]);

  const handleSelectContact = (id: string) => {
    setSelectedId(id);
  };

  if (isMobile) {
    // Let mobile be handled by MobilePairingsRouter at the page level
    return null;
  }

  return (
    <div className="flex min-h-[480px] h-[calc(100vh-8rem)] gap-6">
      <aside className="flex basis-2/6 min-w-[240px] flex-col">
        <Card className="flex h-full flex-col">
          <PairingsList
            contacts={contacts}
            sortMode={sortMode}
            onChangeSortMode={(m) => setSortMode(m)}
            selectedId={selectedId}
            onSelect={handleSelectContact}
            className="flex h-full flex-col"
          />
        </Card>
      </aside>

      <section className="flex basis-4/6 flex-col">
        <ChatPairingDetail contact={selectedContact} />
      </section>
    </div>
  );
};

export default PairingsView;
