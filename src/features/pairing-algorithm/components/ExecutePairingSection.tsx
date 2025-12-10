import React from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ExecutionResult {
  success: boolean;
  message: string;
  pairingsCreated?: number;
  unpairedUsers?: number;
}

interface ExecutePairingSectionProps {
  onExecute: () => void;
  executing: boolean;
  loading: boolean;
  executionResult: ExecutionResult | null;
}

export const ExecutePairingSection: React.FC<ExecutePairingSectionProps> = ({
  onExecute,
  executing,
  loading,
  executionResult,
}) => {
  return (
    <div className="mb-12 bg-card rounded-lg border border-gray-200 p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-900">
            Execute Pairing Algorithm
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Run the pairing algorithm now to create new pairings for the current
            period. This will use the current settings configured below.
          </p>
        </div>
        <Button
          type="button"
          onClick={onExecute}
          disabled={executing || loading}
          className="ml-6 bg-muted-foreground hover:bg-muted-foreground/90"
        >
          {executing ? "Executing..." : "Execute Now"}
        </Button>
      </div>

      {/* Execution Result */}
      {executionResult && (
        <Alert
          className={
            executionResult.success
              ? "mt-4 border-green-500 bg-green-50 text-green-900"
              : "mt-4 border-red-500 bg-red-50 text-red-900"
          }
        >
          <AlertDescription className="text-sm">
            <div className="font-medium">{executionResult.message}</div>
            {executionResult.success &&
              executionResult.pairingsCreated !== undefined && (
                <div className="mt-2 space-y-1">
                  <div>
                    ✓ Pairings created: {executionResult.pairingsCreated}
                  </div>
                  {executionResult.unpairedUsers !== undefined &&
                    executionResult.unpairedUsers > 0 && (
                      <div>
                        ⚠ Unpaired users: {executionResult.unpairedUsers}
                      </div>
                    )}
                </div>
              )}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

