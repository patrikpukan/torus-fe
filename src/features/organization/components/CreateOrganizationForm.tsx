import { useMemo, useState } from "react";
import { Check, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const employeeSizeOptions = [
  { value: "1-10", label: "1 - 10 employees" },
  { value: "11-50", label: "11 - 50 employees" },
  { value: "51-200", label: "51 - 200 employees" },
  { value: "201-500", label: "201 - 500 employees" },
  { value: "501+", label: "More than 500 employees" },
];

const knownOrganizationNames = [
  "Acme Corp",
  "Globex",
  "Initech",
  "Umbrella",
  "Wayne Enterprises",
];

type CreateOrganizationFormData = {
  adminEmail: string;
  adminPassword: string;
  organizationName: string;
  organizationSize: string;
  organizationAddress: string;
};

type FormErrors = Partial<Record<keyof CreateOrganizationFormData, string>>;

const neutralFieldClass =
  "flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-base shadow-sm transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm";

const CreateOrganizationForm = () => {
  const [formValues, setFormValues] = useState<CreateOrganizationFormData>({
    adminEmail: "",
    adminPassword: "",
    organizationName: "",
    organizationSize: "",
    organizationAddress: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof CreateOrganizationFormData, boolean>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const passwordChecks = useMemo(
    () => [
      {
        id: "length",
        label: "At least 12 characters",
        isValid: formValues.adminPassword.length >= 12,
      },
      {
        id: "uppercase",
        label: "Contains an uppercase letter",
        isValid: /[A-Z]/.test(formValues.adminPassword),
      },
      {
        id: "lowercase",
        label: "Contains a lowercase letter",
        isValid: /[a-z]/.test(formValues.adminPassword),
      },
      {
        id: "number",
        label: "Contains a number",
        isValid: /\d/.test(formValues.adminPassword),
      },
      {
        id: "symbol",
        label: "Contains a special character",
        isValid: /[^A-Za-z0-9]/.test(formValues.adminPassword),
      },
    ],
    [formValues.adminPassword]
  );

  const validateField = (
    field: keyof CreateOrganizationFormData,
    value: string
  ): string | undefined => {
    switch (field) {
      case "adminEmail":
        if (!value.trim()) {
          return "Please enter an email";
        }
        if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(value)) {
          return "Enter a valid email";
        }
        return undefined;
      case "adminPassword":
        if (!value) {
          return "Enter a password";
        }
        if (passwordChecks.some((check) => !check.isValid)) {
          return "The password must meet all requirements";
        }
        return undefined;
      case "organizationName": {
        if (!value.trim()) {
          return "Enter the organization name";
        }
        const isKnownName = knownOrganizationNames.some(
          (known) => known.toLowerCase() === value.trim().toLowerCase()
        );
        if (isKnownName) {
          return "This name is already in use";
        }
        if (value.trim().length < 3) {
          return "The name must have at least 3 characters";
        }
        return undefined;
      }
      case "organizationSize":
        if (!value) {
          return "Select the organization size";
        }
        return undefined;
      case "organizationAddress":
        if (!value.trim()) {
          return "Enter the organization address";
        }
        if (value.trim().length < 10) {
          return "The address must have at least 10 characters";
        }
        return undefined;
      default:
        return undefined;
    }
  };

  const handleFieldBlur = (field: keyof CreateOrganizationFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, formValues[field]);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleInputChange = (
    field: keyof CreateOrganizationFormData,
    value: string
  ) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setTouched({
      adminEmail: true,
      adminPassword: true,
      organizationName: true,
      organizationSize: true,
      organizationAddress: true,
    });

    const nextErrors = Object.entries(formValues).reduce<FormErrors>(
      (acc, [key, value]) => {
        const field = key as keyof CreateOrganizationFormData;
        const error = validateField(field, value);
        if (error) {
          acc[field] = error;
        }
        return acc;
      },
      {}
    );

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      setIsSubmitted(true);
    } else {
      setIsSubmitted(false);
    }

    setIsSubmitting(false);
  };

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Organization registration</CardTitle>
        <CardDescription>
          Fill in the details to create a new organization.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit} noValidate>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="adminEmail">
              Administrator email
            </label>
            <Input
              id="adminEmail"
              name="adminEmail"
              type="email"
              autoComplete="email"
              value={formValues.adminEmail}
              onChange={(event) =>
                handleInputChange("adminEmail", event.target.value)
              }
              onBlur={() => handleFieldBlur("adminEmail")}
              aria-invalid={Boolean(errors.adminEmail)}
              aria-describedby="adminEmail-error"
            />
            {errors.adminEmail && (
              <p id="adminEmail-error" className="text-sm text-destructive">
                {errors.adminEmail}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="adminPassword">
                Administrator password
              </label>
              <Input
                id="adminPassword"
                name="adminPassword"
                type="password"
                autoComplete="new-password"
                value={formValues.adminPassword}
                onChange={(event) =>
                  handleInputChange("adminPassword", event.target.value)
                }
                onBlur={() => handleFieldBlur("adminPassword")}
                aria-invalid={Boolean(errors.adminPassword)}
                aria-describedby="adminPassword-error"
              />
              {errors.adminPassword && (
                <p
                  id="adminPassword-error"
                  className="text-sm text-destructive"
                >
                  {errors.adminPassword}
                </p>
              )}
            </div>
            <ul className="space-y-1 rounded-md border bg-muted/40 p-3 text-sm">
              {passwordChecks.map((check) => (
                <li key={check.id} className="flex items-center gap-2 text-sm">
                  {check.isValid ? (
                    <Check className="h-4 w-4 text-green-600" aria-hidden />
                  ) : (
                    <X className="h-4 w-4 text-muted-foreground" aria-hidden />
                  )}
                  <span
                    className={
                      check.isValid
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }
                  >
                    {check.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="organizationName">
              Organization name
            </label>
            <Input
              id="organizationName"
              name="organizationName"
              value={formValues.organizationName}
              onChange={(event) =>
                handleInputChange("organizationName", event.target.value)
              }
              onBlur={() => handleFieldBlur("organizationName")}
              aria-invalid={Boolean(errors.organizationName)}
              aria-describedby="organizationName-error"
            />
            {errors.organizationName && (
              <p
                id="organizationName-error"
                className="text-sm text-destructive"
              >
                {errors.organizationName}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="organizationSize">
              Organization size
            </label>
            <select
              id="organizationSize"
              name="organizationSize"
              value={formValues.organizationSize}
              onChange={(event) =>
                handleInputChange("organizationSize", event.target.value)
              }
              onBlur={() => handleFieldBlur("organizationSize")}
              className={
                errors.organizationSize
                  ? `${neutralFieldClass} border-destructive focus-visible:ring-destructive`
                  : neutralFieldClass
              }
              aria-invalid={Boolean(errors.organizationSize)}
              aria-describedby="organizationSize-error"
            >
              <option value="" disabled>
                Select a range
              </option>
              {employeeSizeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.organizationSize && (
              <p
                id="organizationSize-error"
                className="text-sm text-destructive"
              >
                {errors.organizationSize}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium"
              htmlFor="organizationAddress"
            >
              Organization address
            </label>
            <textarea
              id="organizationAddress"
              name="organizationAddress"
              rows={3}
              value={formValues.organizationAddress}
              onChange={(event) =>
                handleInputChange("organizationAddress", event.target.value)
              }
              onBlur={() => handleFieldBlur("organizationAddress")}
              className={
                errors.organizationAddress
                  ? `${neutralFieldClass} border-destructive focus-visible:ring-destructive`
                  : neutralFieldClass
              }
              aria-invalid={Boolean(errors.organizationAddress)}
              aria-describedby="organizationAddress-error"
            />
            {errors.organizationAddress && (
              <p
                id="organizationAddress-error"
                className="text-sm text-destructive"
              >
                {errors.organizationAddress}
              </p>
            )}
          </div>

          {isSubmitted && (
            <div className="rounded-md border border-green-500 bg-green-50 px-4 py-3 text-sm text-green-700">
              The organization has been successfully prepared for creation.
              Please continue with submitting it to the backend.
            </div>
          )}
        </CardContent>
        <CardFooter className="justify-end">
          <Button type="submit" disabled={isSubmitting}>
            Create organization
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CreateOrganizationForm;
