import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export type OrganizationFormData = {
  id: string;
  name: string;
  code: string;
  size: number | null;
  address?: string | null;
  imageUrl?: string | null;
};

export type OrganizationFormProps = {
  value: OrganizationFormData;
  onChange?: (next: OrganizationFormData) => void;
  readOnly?: boolean;
  onSubmit?: (organization: OrganizationFormData) => void;
  submitLabel?: string;
  onEditClick?: () => void;
};

const OrganizationForm = ({
  value,
  onChange,
  readOnly = true,
  onSubmit,
  submitLabel = "Save",
  onEditClick,
}: OrganizationFormProps) => {
  const orgSchema = useMemo(
    () =>
      z.object({
        id: z.string(),
        code: z.string(),
        name: z.string().min(1, "Organization name is required"),
        size: z.number().positive("Size must be positive").nullable(),
        address: z.string().trim().optional().nullable(),
        imageUrl: z.string().trim().optional().nullable(),
      }),
    []
  );

  type OrgFormValues = z.infer<typeof orgSchema>;

  const form = useForm<OrgFormValues>({
    resolver: zodResolver(orgSchema),
    mode: "onChange",
    defaultValues: {
      ...value,
      size: value.size ?? null,
    },
  });

  useEffect(() => {
    form.reset({
      ...value,
      size: value.size ?? null,
    });
  }, [value, form]);

  useEffect(() => {
    if (!onChange || readOnly) return;
    const subscription = form.watch((nextValues) => {
      onChange({
        id: nextValues.id ?? value.id,
        code: nextValues.code ?? value.code,
        name: nextValues.name ?? value.name,
        size: nextValues.size ?? null,
        address: nextValues.address ?? null,
        imageUrl: nextValues.imageUrl ?? null,
      });
    });
    return () => subscription.unsubscribe();
  }, [form, onChange, readOnly, value]);

  const isFieldReadOnly = (key: keyof OrgFormValues) =>
    key === "id" || key === "code" || readOnly;

  return (
    <form
      onSubmit={form.handleSubmit((values) =>
        onSubmit?.({
          id: values.id ?? value.id,
          code: values.code ?? value.code,
          name: values.name ?? value.name,
          size: values.size ?? null,
          address: values.address ?? null,
          imageUrl: values.imageUrl ?? null,
        })
      )}
      noValidate
    >
      <FieldSet>
        <FieldLegend>Organization Information</FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel>Organization ID</FieldLabel>
            <FieldContent>
              <Input {...form.register("id")} readOnly disabled aria-readonly />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>Organization Code</FieldLabel>
            <FieldContent>
              <Input
                {...form.register("code")}
                readOnly
                disabled
                aria-readonly
              />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>Organization Name</FieldLabel>
            <FieldContent>
              <Input
                {...form.register("name")}
                readOnly={isFieldReadOnly("name")}
                aria-invalid={!!form.formState.errors.name}
              />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.name.message}
                </p>
              )}
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>Size (employees)</FieldLabel>
            <FieldContent>
              <Input
                type="number"
                inputMode="numeric"
                value={form.watch("size") ?? ""}
                onChange={(event) => {
                  const next = event.target.value;
                  const parsed = Number(next);
                  form.setValue(
                    "size",
                    next === "" || Number.isNaN(parsed) ? null : parsed,
                    {
                      shouldDirty: true,
                    }
                  );
                }}
                readOnly={isFieldReadOnly("size")}
                aria-invalid={!!form.formState.errors.size}
              />
              {form.formState.errors.size && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.size.message?.toString?.() ??
                    "Invalid value"}
                </p>
              )}
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>Address</FieldLabel>
            <FieldContent>
              <Textarea
                rows={3}
                {...form.register("address")}
                readOnly={isFieldReadOnly("address")}
                className="text-foreground bg-background"
              />
              {form.formState.errors.address && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.address.message?.toString?.() ??
                    "Invalid value"}
                </p>
              )}
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>Image URL</FieldLabel>
            <FieldContent>
              <Input
                {...form.register("imageUrl")}
                readOnly={isFieldReadOnly("imageUrl")}
              />
              {form.formState.errors.imageUrl && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.imageUrl.message?.toString?.() ??
                    "Invalid value"}
                </p>
              )}
            </FieldContent>
          </Field>
        </FieldGroup>

        <div className="mt-6 flex justify-center gap-2">
          {readOnly && onEditClick && (
            <Button type="button" variant="outline" onClick={onEditClick}>
              Edit Organization
            </Button>
          )}
          {!readOnly && (
            <Button type="submit" disabled={!onChange}>
              {submitLabel}
            </Button>
          )}
        </div>
      </FieldSet>
    </form>
  );
};

export default OrganizationForm;
