import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateInviteCodeMutation } from "@/features/organization/api/useCreateInviteCodeMutation";
import { useToast } from "@/hooks/use-toast";
import { Copy, Loader2 } from "lucide-react";

interface CreateInviteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateInviteDialog = ({
  open,
  onOpenChange,
}: CreateInviteDialogProps) => {
  const [maxUses, setMaxUses] = useState<number | undefined>(50);
  const [expiresInDays, setExpiresInDays] = useState<number>(30);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);

  const { mutate: createInvite, isPending } = useCreateInviteCodeMutation();
  const { toast } = useToast();

  const handleCreate = async () => {
    createInvite(
      {
        maxUses: maxUses || undefined,
        expiresInHours: expiresInDays * 24,
      },
      {
        onSuccess: (result) => {
          if (result?.code && result?.inviteUrl) {
            setGeneratedCode(result.code);
            setGeneratedUrl(result.inviteUrl);
            toast({
              title: "Pozvánka vytvořena",
              description: `Kód: ${result.code}`,
            });
          }
        },
        onError: (error) => {
          toast({
            title: "Chyba",
            description:
              error instanceof Error
                ? error.message
                : "Nepodařilo se vytvořit pozvánku",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleCopyCode = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      toast({
        title: "Zkopírováno",
        description: "Kód pozvánky byl zkopírován do schránky",
      });
    }
  };

  const handleCopyUrl = () => {
    if (generatedUrl) {
      navigator.clipboard.writeText(generatedUrl);
      toast({
        title: "Zkopírováno",
        description: "Odkaz na registraci byl zkopírován do schránky",
      });
    }
  };

  const handleClose = () => {
    // Reset form
    setMaxUses(50);
    setExpiresInDays(30);
    setGeneratedCode(null);
    setGeneratedUrl(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Vytvořit pozvánku</DialogTitle>
          <DialogDescription>
            Vytvořte novou pozvánku pro nové členy organizace
          </DialogDescription>
        </DialogHeader>

        {!generatedCode ? (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="max-uses">Maximální počet použití</Label>
              <Input
                id="max-uses"
                type="number"
                placeholder="Ponechte prázdné pro neomezenou dobu"
                value={maxUses || ""}
                onChange={(e) =>
                  setMaxUses(
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expires-in">Vypršení (dny)</Label>
              <Input
                id="expires-in"
                type="number"
                placeholder="30"
                value={expiresInDays}
                onChange={(e) =>
                  setExpiresInDays(parseInt(e.target.value) || 30)
                }
                min="1"
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleClose()}
              >
                Zrušit
              </Button>
              <Button onClick={handleCreate} disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Vytváření...
                  </>
                ) : (
                  "Vytvořit"
                )}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="mb-2 text-sm text-slate-600">Kód pozvánky:</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 rounded bg-white p-2 font-mono text-lg font-semibold">
                  {generatedCode}
                </code>
                <Button size="sm" variant="outline" onClick={handleCopyCode}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="rounded-lg bg-slate-50 p-4">
              <p className="mb-2 text-sm text-slate-600">
                Odkaz na registraci:
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 truncate rounded bg-white p-2 font-mono text-sm">
                  {generatedUrl}
                </code>
                <Button size="sm" variant="outline" onClick={handleCopyUrl}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleClose}>Zavřít</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
