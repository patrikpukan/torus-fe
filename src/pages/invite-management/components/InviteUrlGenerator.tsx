import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import { useCreateInviteCodeMutation } from "@/features/organization/api/useCreateInviteCodeMutation";
import { useToast } from "@/hooks/use-toast";
import { Check, Copy, Link, Loader2 } from "lucide-react";
import { useState } from "react";
import { InviteConfiguration } from "./InviteConfiguration";

interface InviteUrlGeneratorProps {
  maxUses: number;
  setMaxUses: (value: number) => void;
  expirationDays: number;
  setExpirationDays: (value: number) => void;
  isAdvancedOpen: boolean;
  setIsAdvancedOpen: (value: boolean) => void;
}

export const InviteUrlGenerator = ({
  maxUses,
  setMaxUses,
  expirationDays,
  setExpirationDays,
  isAdvancedOpen,
  setIsAdvancedOpen,
}: InviteUrlGeneratorProps) => {
  const { toast } = useToast();
  const createInviteMutation = useCreateInviteCodeMutation();

  const [urlGeneratedCode, setUrlGeneratedCode] = useState<string | null>(null);
  const [urlGeneratedUrl, setUrlGeneratedUrl] = useState<string | null>(null);
  const [urlCopiedCode, setUrlCopiedCode] = useState(false);
  const [urlCopiedUrl, setUrlCopiedUrl] = useState(false);

  const handleGenerateUrlInvite = async () => {
    try {
      const result = await createInviteMutation.mutateAsync({
        maxUses,
        expiresInHours: expirationDays * 24,
      });

      if (result) {
        setUrlGeneratedCode(result.code);
        setUrlGeneratedUrl(result.inviteUrl);

        toast({
          title: "URL Invite Created",
          description: `Code: ${result.code}`,
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to create invite code",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = async (
    text: string,
    type: "url-code" | "url-link"
  ) => {
    await navigator.clipboard.writeText(text);

    if (type === "url-code") {
      setUrlCopiedCode(true);
      setTimeout(() => setUrlCopiedCode(false), 2000);
    } else {
      setUrlCopiedUrl(true);
      setTimeout(() => setUrlCopiedUrl(false), 2000);
    }

    toast({
      description: type === "url-code" ? "Code copied!" : "Link copied!",
    });
  };

  const handleResetUrlInvite = () => {
    setUrlGeneratedCode(null);
    setUrlGeneratedUrl(null);
    setUrlCopiedCode(false);
    setUrlCopiedUrl(false);
    setMaxUses(50);
    setExpirationDays(30);
    setIsAdvancedOpen(false);
  };

  return (
    <TabsContent value="url" className="mt-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>URL Invitation</CardTitle>
          <CardDescription>
            Generate a unique invitation link to share
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {!urlGeneratedCode ? (
              // INITIAL STATE: Before generation
              <div className="flex flex-col items-center justify-center py-12 space-y-6">
                <Link className="w-20 h-20 text-muted-foreground" />

                <InviteConfiguration
                  maxUses={maxUses}
                  setMaxUses={setMaxUses}
                  expirationDays={expirationDays}
                  setExpirationDays={setExpirationDays}
                  isAdvancedOpen={isAdvancedOpen}
                  setIsAdvancedOpen={setIsAdvancedOpen}
                  idPrefix="url"
                />

                <Button
                  onClick={handleGenerateUrlInvite}
                  disabled={createInviteMutation.isPending}
                  size="lg"
                >
                  {createInviteMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate URL Invitation"
                  )}
                </Button>
              </div>
            ) : (
              // GENERATED STATE: After successful generation
              <div className="space-y-6">
                {/* Invite Code Section */}
                <div className="space-y-2">
                  <Label>Invite code:</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-mono font-bold">
                      {urlGeneratedCode}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        copyToClipboard(urlGeneratedCode!, "url-code")
                      }
                    >
                      {urlCopiedCode ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Registration Link Section */}
                <div className="space-y-2">
                  <Label>Registration link:</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      readOnly
                      value={urlGeneratedUrl || ""}
                      className="font-mono text-sm"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        copyToClipboard(urlGeneratedUrl!, "url-link")
                      }
                    >
                      {urlCopiedUrl ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* How to Share Section */}
                <Alert>
                  <AlertTitle>How to share</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc list-inside space-y-1 mt-2">
                      <li>Email</li>
                      <li>Slack</li>
                      <li>Teams</li>
                      <li>Direct message</li>
                    </ul>
                  </AlertDescription>
                </Alert>

                {/* Generate New Button */}
                <Button
                  variant="outline"
                  onClick={handleResetUrlInvite}
                  className="w-full"
                >
                  Generate New URL
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};
