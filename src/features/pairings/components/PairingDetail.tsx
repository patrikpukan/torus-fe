import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import ReadOnlyUserCalendar from "@/features/calendar/ReadOnlyUserCalendar";
import ProfileForm from "@/features/profile/ProfileForm";
import { cn } from "@/lib/utils";
import type { PairingContact } from "@/mocks/mockPairings";
import { getDisplayName } from "@/features/pairings/utils/displayName";

export type PairingDetailProps = {
  contact: PairingContact | undefined;
  drafts?: Record<string, string>;
  onChangeDraft?: (id: string, value: string) => void;
  onSend?: (contact: PairingContact | undefined) => void;
  onBack?: () => void; // for mobile
};

const formatDateTime = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleString([], {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";
const formatMessageTime = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export default function PairingDetail({
  contact,
  drafts = {},
  onChangeDraft,
  onSend,
  onBack,
}: PairingDetailProps) {
  const currentDraft = contact ? (drafts[contact.id] ?? "") : "";
  const messages = contact?.messages ?? [];

  return (
    <Card className="flex h-full flex-col">
      {contact ? (
        <>
          <CardHeader className="flex flex-row items-start justify-between gap-2 border-b pb-4">
            <div>
              <CardTitle className="text-xl">
                {getDisplayName(contact.profile)}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {contact.profile.organization} · Last message{" "}
                {formatDateTime(contact.lastMessageAt)}
              </p>
            </div>
            {onBack && (
              <Button variant="outline" size="sm" onClick={onBack}>
                Back
              </Button>
            )}
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

              <TabsContent value="chat" className="mt-0 flex-1 px-6 py-4">
                <div className="flex h-full flex-col gap-4">
                  <div className="flex-1 space-y-3 overflow-y-auto rounded-lg bg-muted/20 p-4">
                    {messages.length ? (
                      messages.map((m) => {
                        const isSelf = m.author === "self";
                        return (
                          <div
                            key={m.id}
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
                              <p>{m.content}</p>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {formatMessageTime(m.timestamp)}
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
                      onChange={(e) =>
                        contact && onChangeDraft?.(contact.id, e.target.value)
                      }
                      rows={3}
                    />
                    <div className="mt-3 flex justify-end">
                      <Button
                        type="button"
                        onClick={() => onSend?.(contact)}
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
                <ProfileForm value={contact.profile} readOnly />
              </TabsContent>

              <TabsContent
                value="calendar"
                className="mt-0 flex-1 overflow-y-auto px-6 py-4"
              >
                <ReadOnlyUserCalendar userId={contact?.id} />
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
  );
}
