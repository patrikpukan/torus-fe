import { Handshake, MessageSquare } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { PairingContact } from "@/mocks/mockPairings";
import { formatDate } from "@/features/pairings/components/dateUtils";

export type SortMode = "paired" | "message";

export type PairingsListProps = {
  contacts: PairingContact[];
  sortMode: SortMode;
  onChangeSortMode?: (mode: SortMode) => void;
  selectedId?: string;
  onSelect?: (id: string) => void;
  className?: string;
};

const getInitials = (name: string, surname: string) =>
  `${name?.[0] ?? ""}${surname?.[0] ?? ""}`.toUpperCase();

const getLatestMessagePreview = (contact: PairingContact) =>
  contact.messages.at(-1)?.content ?? "No messages yet";

export default function PairingsList({
  contacts,
  sortMode,
  onChangeSortMode,
  selectedId,
  onSelect,
  className,
}: PairingsListProps) {
  const byPaired = [...contacts].sort(
    (a, b) =>
      new Date(b.lastPairedAt).getTime() - new Date(a.lastPairedAt).getTime()
  );
  const byMessage = [...contacts].sort(
    (a, b) =>
      new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
  );

  const renderList = (list: PairingContact[]) => (
    <ul className="divide-y">
      {list.map((contact) => {
        const isSelected = contact.id === selectedId;
        const preview = getLatestMessagePreview(contact);
        return (
          <li key={contact.id}>
            <button
              type="button"
              onClick={() => onSelect?.(contact.id)}
              className={cn(
                "flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-muted",
                isSelected && "bg-muted"
              )}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                {getInitials(contact.profile.name, contact.profile.surname)}
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium">
                    {contact.profile.name} {contact.profile.surname}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {sortMode === "message"
                      ? formatDate(contact.lastMessageAt)
                      : formatDate(contact.lastPairedAt)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{contact.profile.pairingStatus}</span>
                  {contact.profile.pairingStatus === "Paired" && (
                    <Handshake className="h-3.5 w-3.5" />
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span className="line-clamp-1">{preview}</span>
                </div>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className={className}>
      <Tabs
        value={sortMode}
        onValueChange={(v) => onChangeSortMode?.(v as SortMode)}
        className="flex h-full flex-col"
      >
        <div className="border-b px-4 py-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="paired">Sort by paired</TabsTrigger>
            <TabsTrigger value="message">Sort by message</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent
          value="paired"
          className="mt-0 flex-1 overflow-hidden px-0 pb-4"
        >
          <div className="h-full overflow-y-auto">{renderList(byPaired)}</div>
        </TabsContent>
        <TabsContent
          value="message"
          className="mt-0 flex-1 overflow-hidden px-0 pb-4"
        >
          <div className="h-full overflow-y-auto">{renderList(byMessage)}</div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
