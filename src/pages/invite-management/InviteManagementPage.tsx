import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInviteCodesQuery } from "@/features/organization/api/useInviteCodesQuery";
import { useAuth } from "@/hooks/useAuth";
import { Info, Link, Mail, QrCode } from "lucide-react";
import { useState } from "react";
import { InviteHistoryTable } from "./components/InviteHistoryTable";
import { InviteQrGenerator } from "./components/InviteQrGenerator";
import { InviteUrlGenerator } from "./components/InviteUrlGenerator";

const InviteManagementPage = () => {
  const { appRole, loading: authLoading } = useAuth();
  const { data: inviteCodes, isLoading } = useInviteCodesQuery();

  // Configuration State (shared by both)
  const [maxUses, setMaxUses] = useState<number>(50);
  const [expirationDays, setExpirationDays] = useState<number>(30);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

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
      <PageHeader
        icon={Mail}
        title="Create Invitations"
        description="Generate invitation links or QR codes for new users"
      />

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

        <InviteUrlGenerator
          maxUses={maxUses}
          setMaxUses={setMaxUses}
          expirationDays={expirationDays}
          setExpirationDays={setExpirationDays}
          isAdvancedOpen={isAdvancedOpen}
          setIsAdvancedOpen={setIsAdvancedOpen}
        />

        <InviteQrGenerator
          maxUses={maxUses}
          setMaxUses={setMaxUses}
          expirationDays={expirationDays}
          setExpirationDays={setExpirationDays}
          isAdvancedOpen={isAdvancedOpen}
          setIsAdvancedOpen={setIsAdvancedOpen}
        />
      </Tabs>

      <InviteHistoryTable inviteCodes={inviteCodes} isLoading={isLoading} />
    </div>
  );
};

export default InviteManagementPage;
