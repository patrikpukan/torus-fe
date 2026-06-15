import { useMemo, useState } from "react";
import { Handshake, MessageSquare, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { PairingContact } from "@/features/pairings/types";
import { formatDateTime } from "@/features/pairings/components/dateUtils";
import {
  getDisplayName,
  getInitials,
} from "@/features/pairings/utils/displayName";

export type SortMode = "paired" | "message";

export type PairingsListProps = {
  contacts: PairingContact[];
  sortMode: SortMode;
  onChangeSortMode?: (mode: SortMode) => void;
  selectedId?: string;
  onSelect?: (id: string) => void;
  className?: string;
};

const ALL_STATUSES = "__all__";

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
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(ALL_STATUSES);

  const statuses = useMemo(() => {
    const distinct = new Set<string>();
    contacts.forEach((c) => {
      const status = c.profile.pairingStatus;
      if (status) distinct.add(status);
    });
    return Array.from(distinct);
  }, [contacts]);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return contacts.filter((contact) => {
      if (
        statusFilter !== ALL_STATUSES &&
        contact.profile.pairingStatus !== statusFilter
      ) {
        return false;
      }
      if (!normalizedQuery) return true;
      const name = getDisplayName(contact.profile).toLowerCase();
      const email = (contact.profile.email ?? "").toLowerCase();
      return (
        name.includes(normalizedQuery) || email.includes(normalizedQuery)
      );
    });
  }, [contacts, query, statusFilter]);

  const byPaired = [...filtered].sort(
    (a, b) => new Date(b.pairedAt).getTime() - new Date(a.pairedAt).getTime()
  );
  const byMessage = [...filtered].sort(
    (a, b) =>
      new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
  );

  const renderList = (list: PairingContact[]) => {
    if (list.length === 0) {
      return (
        <div className="px-4 py-8 text-center text-sm text-muted-foreground">
          No matches
        </div>
      );
    }
    return (
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
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={contact.profile.profileImageUrl || undefined}
                  />
                  <AvatarFallback>{getInitials(contact.profile)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium">
                      {getDisplayName(contact.profile)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {sortMode === "message"
                        ? formatDateTime(contact.lastMessageAt)
                        : formatDateTime(contact.pairedAt)}
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
  };

  return (
    <div className={className}>
      <Tabs
        value={sortMode}
        onValueChange={(v) => onChangeSortMode?.(v as SortMode)}
        className="flex h-full flex-col"
      >
        <div className="space-y-3 border-b px-4 py-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or email"
              className="pl-9"
              aria-label="Search pairings"
            />
          </div>
          {statuses.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant={statusFilter === ALL_STATUSES ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setStatusFilter(ALL_STATUSES)}
              >
                All
              </Button>
              {statuses.map((status) => (
                <Button
                  key={status}
                  type="button"
                  variant={statusFilter === status ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                >
                  {status}
                </Button>
              ))}
            </div>
          )}
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
