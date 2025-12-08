import type { UseFormRegisterReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type RegisterTextFieldProps = {
  id: string;
  label: string;
  registration: UseFormRegisterReturn;
  type?: string;
  autoComplete?: string;
  error?: string;
};

export const RegisterTextField = ({
  id,
  label,
  registration,
  type = "text",
  autoComplete,
  error,
}: RegisterTextFieldProps) => (
  <div className="space-y-1.5">
    <Label htmlFor={id} className="text-sm font-semibold">
      {label}
    </Label>
    <Input id={id} type={type} autoComplete={autoComplete} {...registration} />
    {error && <p className="text-xs text-destructive">{error}</p>}
  </div>
);
