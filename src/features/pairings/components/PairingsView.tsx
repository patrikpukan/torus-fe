import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import ProfileCalendar from "@/features/calendar/ProfileCalendar";
import ProfileForm from "@/features/profile/ProfileForm";
import { cn } from "@/lib/utils";
import type { PairingContact } from "@/mocks/mockPairings";
import { pairingContacts } from "@/mocks/mockPairings";
import { useIsMobile } from "@/hooks/use-mobile";
import PairingsList from "./PairingsList";

type SortMode = "paired" | "message";

type ContactsState = PairingContact[];

type ChatDrafts = Record<string, string>;


const formatDateTime = (iso: string | undefined) => {
  if (!iso) return "";
  const date = new Date(iso);
  return date.toLocaleString(undefined, {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatMessageTime = (iso: string) => {
  const date = new Date(iso);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const PairingsView = () => {
  const [contacts, setContacts] = useState<ContactsState>(pairingContacts);
  const [sortMode, setSortMode] = useState<SortMode>("paired");
  const [selectedId, setSelectedId] = useState<string>(
    pairingContacts[0]?.id ?? ""
  );
  const [drafts, setDrafts] = useState<ChatDrafts>({});

  const isMobile = useIsMobile();

  // Sorting now handled in PairingsList

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

  const handleDraftChange = (id: string, value: string) => {
    setDrafts((prev) => ({ ...prev, [id]: value }));
  };

  const handleSendMessage = (contact: PairingContact | undefined) => {
    if (!contact) return;
    const draft = drafts[contact.id]?.trim();
    if (!draft) return;

    const timestamp = new Date().toISOString();

    setContacts((prev) =>
      prev.map((item) => {
        if (item.id !== contact.id) {
          return item;
        }

        return {
          ...item,
          lastMessageAt: timestamp,
          messages: [
            ...item.messages,
            {
              id: `local-${Date.now()}`,
              author: "self",
              content: draft,
              timestamp,
            },
          ],
        };
      })
    );

    setDrafts((prev) => ({ ...prev, [contact.id]: "" }));
  };

  // List rendering moved to PairingsList

  const currentMessages = selectedContact?.messages ?? [];
  const currentDraft = selectedContact ? drafts[selectedContact.id] ?? "" : "";

  if (isMobile) {
    // Let mobile be handled by MobilePairingsRouter at the page level
    return null;
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      <aside className="flex basis-1/4 min-w-[240px] flex-col">
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

      <section className="flex basis-3/4 flex-col">
        <Card className="flex h-full flex-col">
          {selectedContact ? (
            <>
              <CardHeader className="flex flex-col gap-1 border-b pb-4">
                <CardTitle className="text-xl">
                  {selectedContact.profile.name}{" "}
                  {selectedContact.profile.surname}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {selectedContact.profile.organization} ·
                  {" "}
                  Last message {formatDateTime(selectedContact.lastMessageAt)}
                </p>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col overflow-hidden p-0">
                <Tabs defaultValue="chat" className="flex h-full flex-col">
                  <div className="border-b px-6 pt-4">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="chat">Chat</TabsTrigger>
                      <TabsTrigger value="profile">User profile</TabsTrigger>
                      <TabsTrigger value="calendar">User calendar</TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent
                    value="chat"
                    className="mt-0 flex-1 px-6 py-4"
                  >
                    <div className="flex h-full flex-col gap-4">
                      <div className="flex-1 space-y-3 overflow-y-auto rounded-lg bg-muted/20 p-4">
                      {currentMessages.length ? (
                        currentMessages.map((message) => {
                          const isSelf = message.author === "self";
                          return (
                            <div
                              key={message.id}
                              className={cn(
                                "flex flex-col gap-1",
                                isSelf ? "items-end" : "items-start"
                              )}
                            >
                              <div
                                className={cn(
                                  "max-w-[70%] rounded-2xl px-4 py-2 text-sm shadow-sm",
                                  isSelf
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted"
                                )}
                              >
                                <p>{message.content}</p>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {formatMessageTime(message.timestamp)}
                              </span>
                            </div>
                          );
                        })
                      ) : (
                        <div className="flex h-full items-center justify-center rounded-md border border-dashed p-6 text-sm text-muted-foreground">
                          Start the conversation by sending a message.
                        </div>
                      )}
                      </div>

                      <div className="border-t pt-4">
                        <Textarea
                          placeholder="Type your message..."
                          value={currentDraft}
                          onChange={(event) =>
                            selectedContact &&
                            handleDraftChange(selectedContact.id, event.target.value)
                          }
                          rows={3}
                        />
                        <div className="mt-3 flex justify-end">
                          <Button
                            type="button"
                            onClick={() => handleSendMessage(selectedContact)}
                            disabled={!currentDraft.trim()}
                          >
                            Send message
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent
                    value="profile"
                    className="mt-0 flex-1 overflow-y-auto px-6 py-4"
                  >
                    <ProfileForm value={selectedContact.profile} readOnly />
                  </TabsContent>

                  <TabsContent
                    value="calendar"
                    className="mt-0 flex-1 overflow-y-auto px-6 py-4"
                  >
                    <ProfileCalendar />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
              Select a contact to display details.
            </div>
          )}
        </Card>
      </section>

    </div>
  );
};

export default PairingsView;
