import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { usePauseActivityMutation } from "@/features/calendar/graphql/pause-activity.mutations";

interface PauseActivityModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function PauseActivityModal({
  open,
  onClose,
  onSuccess,
}: PauseActivityModalProps) {
  const [durationType, setDurationType] = useState<
    "ONE_PERIOD" | "N_PERIODS" | "UNTIL_DATE" | "INDEFINITE"
  >("ONE_PERIOD");
  const [periodsCount, setPeriodsCount] = useState(2);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const { toast } = useToast();
  const [pauseActivity, { loading }] = usePauseActivityMutation();

  const isSubmitDisabled =
    loading ||
    (durationType === "N_PERIODS" && periodsCount < 1) ||
    (durationType === "UNTIL_DATE" && !selectedDate);

  const handleSubmit = async () => {
    try {
      const input = {
        durationType,
        ...(durationType === "N_PERIODS" && { periodsCount }),
        ...(durationType === "UNTIL_DATE" && { untilDate: selectedDate }),
      };

      await pauseActivity({
        variables: { input },
        refetchQueries: ["GetActivePause"],
      });

      toast({
        title: "Activity Paused",
        description: "You will be excluded from the next pairing period",
      });

      onSuccess?.();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to pause activity",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Pause Activity</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <RadioGroup
            value={durationType}
            onValueChange={(value: string) => {
              setDurationType(
                value as
                  | "ONE_PERIOD"
                  | "N_PERIODS"
                  | "UNTIL_DATE"
                  | "INDEFINITE"
              );
              setSelectedDate(undefined);
            }}
          >
            {/* Option 1: For 1 period */}
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ONE_PERIOD" id="one-period" />
              <Label htmlFor="one-period" className="cursor-pointer">
                For 1 period
              </Label>
            </div>

            {/* Option 2: For N periods */}
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="N_PERIODS" id="n-periods" />
              <Label htmlFor="n-periods" className="cursor-pointer">
                For
              </Label>
              <Input
                type="number"
                min="1"
                value={periodsCount}
                onChange={(e) => setPeriodsCount(parseInt(e.target.value) || 1)}
                disabled={durationType !== "N_PERIODS"}
                className="w-16 h-9"
              />
              <Label className="cursor-default">periods</Label>
            </div>

            {/* Option 3: Until specific date */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="UNTIL_DATE" id="until-date" />
                <Label htmlFor="until-date" className="cursor-pointer">
                  Until specific date
                </Label>
              </div>

              {durationType === "UNTIL_DATE" && (
                <div className="ml-6 p-3 bg-muted rounded-lg">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    className="w-full"
                  />
                </div>
              )}
            </div>

            {/* Option 4: Until I manually reactivate */}
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="INDEFINITE" id="indefinite" />
              <Label htmlFor="indefinite" className="cursor-pointer">
                Until I manually reactivate
              </Label>
            </div>
          </RadioGroup>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitDisabled}>
            {loading ? "Pausing..." : "Pause Activity"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
