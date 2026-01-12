import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { useCreateInviteCodeMutation } from "@/features/organization/api/useCreateInviteCodeMutation";
import { useToast } from "@/hooks/use-toast";
import { Download, Loader2, QrCode } from "lucide-react";
import { useState } from "react";
import QRCodeCanvas from "react-qr-code";
import { InviteConfiguration } from "./InviteConfiguration";

interface InviteQrGeneratorProps {
  maxUses: number;
  setMaxUses: (value: number) => void;
  expirationDays: number;
  setExpirationDays: (value: number) => void;
  isAdvancedOpen: boolean;
  setIsAdvancedOpen: (value: boolean) => void;
}

export const InviteQrGenerator = ({
  maxUses,
  setMaxUses,
  expirationDays,
  setExpirationDays,
  isAdvancedOpen,
  setIsAdvancedOpen,
}: InviteQrGeneratorProps) => {
  const { toast } = useToast();
  const createInviteMutation = useCreateInviteCodeMutation();

  const [qrGeneratedCode, setQrGeneratedCode] = useState<string | null>(null);
  const [qrGeneratedUrl, setQrGeneratedUrl] = useState<string | null>(null);

  const handleGenerateQrInvite = async () => {
    try {
      const result = await createInviteMutation.mutateAsync({
        maxUses,
        expiresInHours: expirationDays * 24,
      });

      if (result) {
        setQrGeneratedCode(result.code);
        setQrGeneratedUrl(result.inviteUrl);

        toast({
          title: "QR Invite Created",
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

  const downloadQRCode = () => {
    const svg = document
      .getElementById("qr-code-container")
      ?.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");

      const downloadLink = document.createElement("a");
      downloadLink.download = `torus-invite-${qrGeneratedCode}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();

      toast({
        description: "QR code downloaded!",
      });
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const handleResetQrInvite = () => {
    setQrGeneratedCode(null);
    setQrGeneratedUrl(null);
    setMaxUses(50);
    setExpirationDays(30);
    setIsAdvancedOpen(false);
  };

  return (
    <TabsContent value="qr" className="mt-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>QR Code Invitation</CardTitle>
          <CardDescription>
            Generate a QR code that users can scan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {!qrGeneratedCode ? (
              // INITIAL STATE: Before generation
              <div className="flex flex-col items-center justify-center py-12 space-y-6">
                {/* QR Placeholder: QR Code icon */}
                <QrCode className="w-20 h-20 text-muted-foreground" />

                <InviteConfiguration
                  maxUses={maxUses}
                  setMaxUses={setMaxUses}
                  expirationDays={expirationDays}
                  setExpirationDays={setExpirationDays}
                  isAdvancedOpen={isAdvancedOpen}
                  setIsAdvancedOpen={setIsAdvancedOpen}
                  idPrefix="qr"
                />

                <Button
                  onClick={handleGenerateQrInvite}
                  disabled={createInviteMutation.isPending}
                  size="lg"
                >
                  {createInviteMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate QR Code"
                  )}
                </Button>
              </div>
            ) : (
              // GENERATED STATE: After successful generation
              <div className="space-y-6">
                {/* QR Code Display */}
                <div
                  id="qr-code-container"
                  className="flex justify-center p-8 bg-white dark:bg-gray-900 rounded-lg border-2 shadow-sm"
                >
                  <QRCodeCanvas
                    value={qrGeneratedUrl || ""}
                    size={256}
                    level="H"
                    style={{
                      height: "auto",
                      maxWidth: "100%",
                      width: "256px",
                    }}
                  />
                </div>

                {/* Download Button */}
                <Button
                  onClick={downloadQRCode}
                  className="w-full"
                  variant="default"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download QR Code
                </Button>

                {/* How to Share Section */}
                <Alert>
                  <AlertTitle>How to share</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc list-inside space-y-1 mt-2">
                      <li>Printed materials</li>
                      <li>Email attachment</li>
                      <li>Company intranet</li>
                      <li>Office poster</li>
                    </ul>
                  </AlertDescription>
                </Alert>

                {/* Generate New Button */}
                <Button
                  variant="outline"
                  onClick={handleResetQrInvite}
                  className="w-full"
                >
                  Generate New QR Code
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};
