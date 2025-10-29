import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
import { useRegisterOrganization } from "../api/useRegisterOrganization";

const employeeSizeOptions = [
  { value: "1-10", label: "1 - 10 employees" },
  { value: "11-50", label: "11 - 50 employees" },
  { value: "51-200", label: "51 - 200 employees" },
  { value: "201-500", label: "201 - 500 employees" },
  { value: "501+", label: "More than 500 employees" },
];

type CreateOrganizationFormData = {
  adminEmail: string;
  organizationName: string;
  organizationSize: string;
  organizationAddress: string;
};

type FormErrors = Partial<Record<keyof CreateOrganizationFormData, string>>;

const neutralFieldClass =
  "flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-base shadow-sm transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm";

const CreateOrganizationForm = () => {
  const navigate = useNavigate();
  const [registerOrganization, { loading: isSubmitting }] =
    useRegisterOrganization();

  const [formValues, setFormValues] = useState<CreateOrganizationFormData>({
    adminEmail: "",
    organizationName: "",
    organizationSize: "",
    organizationAddress: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof CreateOrganizationFormData, boolean>>
  >({});
  const [submitError, setSubmitError] = useState<string>("");
  const [submitSuccess, setSubmitSuccess] = useState<string>("");

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
      case "organizationName": {
        if (!value.trim()) {
          return "Enter the organization name";
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");
    setTouched({
      adminEmail: true,
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
      try {
        const result = await registerOrganization({
          variables: {
            input: {
              adminEmail: formValues.adminEmail,
              organizationName: formValues.organizationName,
              organizationSize: formValues.organizationSize,
              organizationAddress: formValues.organizationAddress,
            },
          },
        });

        if (result.data) {
          setSubmitSuccess(result.data.registerOrganization.message);
          // Optionally redirect after a few seconds
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        }
      } catch (error) {
        if (error instanceof Error) {
          setSubmitError(
            error.message || "Failed to create organization. Please try again."
          );
        } else {
          setSubmitError("An unexpected error occurred. Please try again.");
        }
      }
    }
  };

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Organization registration</CardTitle>
        <CardDescription>
          Fill in the details to create a new organization. The administrator
          will receive an email to set up their password.
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

          {submitError && (
            <div className="rounded-md border border-red-500 bg-red-50 px-4 py-3 text-sm text-red-700">
              {submitError}
            </div>
          )}

          {submitSuccess && (
            <div className="rounded-md border border-green-500 bg-green-50 px-4 py-3 text-sm text-green-700">
              {submitSuccess}
            </div>
          )}
        </CardContent>
        <CardFooter className="justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create organization"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CreateOrganizationForm;
