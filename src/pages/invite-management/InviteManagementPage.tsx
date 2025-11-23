import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCreateInviteCodeMutation } from "@/features/organization/api/useCreateInviteCodeMutation";
import { useInviteCodesQuery } from "@/features/organization/api/useInviteCodesQuery";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import {
  Check,
  ChevronDown,
  Copy,
  Download,
  Info,
  Link,
  Loader2,
  QrCode,
  Mail,
} from "lucide-react";
import { useState } from "react";
import QRCodeCanvas from "react-qr-code";

const InviteManagementPage = () => {
  const { appRole, loading: authLoading } = useAuth();
  const { data: inviteCodes, isLoading } = useInviteCodesQuery();
  const createInviteMutation = useCreateInviteCodeMutation();
  const { toast } = useToast();

  // URL Invite State
  const [urlGeneratedCode, setUrlGeneratedCode] = useState<string | null>(null);
  const [urlGeneratedUrl, setUrlGeneratedUrl] = useState<string | null>(null);
  const [urlCopiedCode, setUrlCopiedCode] = useState(false);
  const [urlCopiedUrl, setUrlCopiedUrl] = useState(false);

  // QR Invite State
  const [qrGeneratedCode, setQrGeneratedCode] = useState<string | null>(null);
  const [qrGeneratedUrl, setQrGeneratedUrl] = useState<string | null>(null);

  // Configuration State (shared by both)
  const [maxUses, setMaxUses] = useState<number>(50);
  const [expirationDays, setExpirationDays] = useState<number>(30);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  // Copy state for table
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  // URL Invite Handlers
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

  // QR Invite Handlers
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

  // Table Copy Handlers
  const copyInviteCode = async (code: string, id: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
    toast({
      description: "Code copied!",
    });
  };

  const copyInviteUrl = async (code: string) => {
    const url = `${window.location.origin}/register?invite=${code}`;
    await navigator.clipboard.writeText(url);
    toast({
      description: "URL copied!",
    });
  };

  // Check authorization
  const isAdmin = appRole === "org_admin" || appRole === "super_admin";

  if (authLoading) {
    return (
      <div className="flex min-h-[240px] items-center justify-center">
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container py-8">
        <div className="rounded-lg bg-red-50 p-4">
          <p className="text-sm text-red-800">
            You do not have permission to access this page
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="flex items-center gap-3 text-3xl font-bold">
          <Mail className="h-8 w-8 text-primary" />
          <span>Create Invitations</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Generate invitation links or QR codes for new users
        </p>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="url" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="url" className="flex items-center gap-2">
            <Link className="h-4 w-4" />
            <span>URL</span>
          </TabsTrigger>
          <TabsTrigger value="qr" className="flex items-center gap-2">
            <QrCode className="h-4 w-4" />
            <span>QR Code</span>
          </TabsTrigger>
        </TabsList>

        {/* Info Box */}
        <Alert className="mt-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertTitle className="text-blue-900 dark:text-blue-100">
            How it works
          </AlertTitle>
          <AlertDescription className="text-blue-800 dark:text-blue-200 space-y-1 mt-2">
            <div>
              • <strong>URL:</strong> Click and send the link
            </div>
            <div>
              • <strong>QR:</strong> Click and generate scannable code
            </div>
            <div>• Valid for up to 30 days</div>
            <div>• Available whenever needed</div>
          </AlertDescription>
        </Alert>

        {/* URL Tab Content */}
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

                    {/* Advanced Options */}
                    <div className="w-full max-w-md space-y-4">
                      <button
                        onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                        className="flex items-center gap-2 w-full justify-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            isAdvancedOpen ? "rotate-180" : ""
                          }`}
                        />
                        <span>Advanced Options</span>
                      </button>

                      {isAdvancedOpen && (
                        <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                          <div className="space-y-2">
                            <Label htmlFor="url-maxUses">Maximum uses</Label>
                            <Input
                              id="url-maxUses"
                              type="number"
                              min={1}
                              max={1000}
                              value={maxUses}
                              onChange={(e) =>
                                setMaxUses(Number(e.target.value))
                              }
                            />
                            <p className="text-xs text-muted-foreground">
                              How many times this invite can be used (1-1000)
                            </p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="url-expiration">
                              Expiration (days)
                            </Label>
                            <Input
                              id="url-expiration"
                              type="number"
                              min={1}
                              max={365}
                              value={expirationDays}
                              onChange={(e) =>
                                setExpirationDays(Number(e.target.value))
                              }
                            />
                            <p className="text-xs text-muted-foreground">
                              How long the invite is valid (1-365 days)
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

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

        {/* QR Tab Content */}
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

                    {/* Advanced Options */}
                    <div className="w-full max-w-md space-y-4">
                      <button
                        onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                        className="flex items-center gap-2 w-full justify-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            isAdvancedOpen ? "rotate-180" : ""
                          }`}
                        />
                        <span>Advanced Options</span>
                      </button>

                      {isAdvancedOpen && (
                        <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                          <div className="space-y-2">
                            <Label htmlFor="qr-maxUses">Maximum uses</Label>
                            <Input
                              id="qr-maxUses"
                              type="number"
                              min={1}
                              max={1000}
                              value={maxUses}
                              onChange={(e) =>
                                setMaxUses(Number(e.target.value))
                              }
                            />
                            <p className="text-xs text-muted-foreground">
                              How many times this invite can be used (1-1000)
                            </p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="qr-expiration">
                              Expiration (days)
                            </Label>
                            <Input
                              id="qr-expiration"
                              type="number"
                              min={1}
                              max={365}
                              value={expirationDays}
                              onChange={(e) =>
                                setExpirationDays(Number(e.target.value))
                              }
                            />
                            <p className="text-xs text-muted-foreground">
                              How long the invite is valid (1-365 days)
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

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
      </Tabs>

      {/* Invite History Table Section */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Invite History</h2>
          <p className="text-sm text-muted-foreground">
            {inviteCodes?.length || 0} total invites
          </p>
        </div>

        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  // Loading skeleton
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : inviteCodes && inviteCodes.length > 0 ? (
                  inviteCodes.map((code) => {
                    const isExpired =
                      code.expiresAt && new Date(code.expiresAt) < new Date();
                    const isMaxed =
                      code.maxUses && code.usedCount >= code.maxUses;
                    const isInvalid = !code.isActive || isExpired || isMaxed;

                    return (
                      <TableRow
                        key={code.id}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <TableCell className="font-mono">
                          <div className="flex items-center gap-2">
                            <span>{code.code}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => copyInviteCode(code.code, code.id)}
                            >
                              {copiedCodeId === code.id ? (
                                <Check className="h-3 w-3" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          {format(new Date(code.createdAt), "d MMM yyyy", {
                            locale: enUS,
                          })}
                        </TableCell>
                        <TableCell>
                          {code.expiresAt ? (
                            <span className={isExpired ? "text-red-600" : ""}>
                              {format(new Date(code.expiresAt), "d MMM yyyy", {
                                locale: enUS,
                              })}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">Never</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span>
                            {code.usedCount}
                            {code.maxUses && ` / ${code.maxUses}`}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={isInvalid ? "destructive" : "default"}
                          >
                            {isExpired
                              ? "Expired"
                              : isMaxed
                                ? "Exhausted"
                                : !code.isActive
                                  ? "Deactivated"
                                  : "Active"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyInviteUrl(code.code)}
                          >
                            Copy URL
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <p className="text-sm text-muted-foreground">
                        No invites. Create your first invite using the tabs
                        above.
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default InviteManagementPage;
