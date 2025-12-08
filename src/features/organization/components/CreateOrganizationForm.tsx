import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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

const neutralFieldClass =
  "flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-base shadow-sm transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm";

const createOrgSchema = z.object({
  adminEmail: z.email("Enter a valid email"),
  organizationName: z
    .string()
    .trim()
    .min(3, "The name must have at least 3 characters"),
  organizationSize: z.string().min(1, "Select the organization size"),
  organizationAddress: z
    .string()
    .trim()
    .min(10, "The address must have at least 10 characters"),
});

type CreateOrganizationFormData = z.infer<typeof createOrgSchema>;

const CreateOrganizationForm = () => {
  const navigate = useNavigate();
  const [registerOrganization, { loading: isSubmitting }] =
    useRegisterOrganization();

  const [submitError, setSubmitError] = useState<string>("");
  const [submitSuccess, setSubmitSuccess] = useState<string>("");

  const form = useForm<CreateOrganizationFormData>({
    resolver: zodResolver(createOrgSchema),
    mode: "onChange",
    defaultValues: {
      adminEmail: "",
      organizationName: "",
      organizationSize: "",
      organizationAddress: "",
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    setSubmitError("");
    setSubmitSuccess("");

    try {
      const result = await registerOrganization({
        variables: {
          input: {
            adminEmail: values.adminEmail.trim(),
            organizationName: values.organizationName.trim(),
            organizationSize: values.organizationSize,
            organizationAddress: values.organizationAddress.trim(),
          },
        },
      });

      if (result.data) {
        setSubmitSuccess(result.data.registerOrganization.message);
        form.reset();
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
  });

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
              type="email"
              autoComplete="email"
              {...form.register("adminEmail")}
              aria-invalid={Boolean(form.formState.errors.adminEmail)}
              aria-describedby="adminEmail-error"
            />
            {form.formState.errors.adminEmail && (
              <p id="adminEmail-error" className="text-sm text-destructive">
                {form.formState.errors.adminEmail.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="organizationName">
              Organization name
            </label>
            <Input
              id="organizationName"
              {...form.register("organizationName")}
              aria-invalid={Boolean(form.formState.errors.organizationName)}
              aria-describedby="organizationName-error"
            />
            {form.formState.errors.organizationName && (
              <p
                id="organizationName-error"
                className="text-sm text-destructive"
              >
                {form.formState.errors.organizationName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="organizationSize">
              Organization size
            </label>
            <select
              id="organizationSize"
              {...form.register("organizationSize")}
              className={
                form.formState.errors.organizationSize
                  ? `${neutralFieldClass} border-destructive focus-visible:ring-destructive`
                  : neutralFieldClass
              }
              aria-invalid={Boolean(form.formState.errors.organizationSize)}
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
            {form.formState.errors.organizationSize && (
              <p
                id="organizationSize-error"
                className="text-sm text-destructive"
              >
                {form.formState.errors.organizationSize.message}
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
              rows={3}
              {...form.register("organizationAddress")}
              className={
                form.formState.errors.organizationAddress
                  ? `${neutralFieldClass} border-destructive focus-visible:ring-destructive`
                  : neutralFieldClass
              }
              aria-invalid={Boolean(form.formState.errors.organizationAddress)}
              aria-describedby="organizationAddress-error"
            />
            {form.formState.errors.organizationAddress && (
              <p
                id="organizationAddress-error"
                className="text-sm text-destructive"
              >
                {form.formState.errors.organizationAddress.message}
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
