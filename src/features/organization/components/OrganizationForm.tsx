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
  size?: number | null;
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
  // Fields that are always read-only
  const readOnlyFields = useMemo(() => new Set<string>(["id", "code"]), []);

  const fields = useMemo(
    () =>
      [
        { key: "id", label: "Organization ID", type: "text" },
        { key: "code", label: "Organization Code", type: "text" },
        { key: "name", label: "Organization Name", type: "text" },
        { key: "size", label: "Size (employees)", type: "number" },
        { key: "address", label: "Address", type: "textarea" },
        { key: "imageUrl", label: "Image URL", type: "text" },
      ] as const,
    []
  );

  const orgSchema = useMemo(
    () =>
      z.object({
        id: z.string(),
        code: z.string(),
        name: z.string().min(1, "Organization name is required"),
        size: z
          .preprocess((val) => {
            if (val === "" || val === null || val === undefined) return null;
            const num = Number(val);
            return Number.isNaN(num) ? null : num;
          }, z.number().nullable())
          .optional()
          .nullable(),
        address: z.string().trim().optional().nullable(),
        imageUrl: z.string().trim().optional().nullable(),
      }),
    []
  );

  const form = useForm<OrganizationFormData>({
    resolver: zodResolver(orgSchema),
    mode: "onChange",
    defaultValues: value,
  });

  useEffect(() => {
    form.reset(value);
  }, [value, form]);

  useEffect(() => {
    if (!onChange || readOnly) return;
    const subscription = form.watch((nextValues) => {
      onChange({
        ...nextValues,
        size:
          nextValues.size === undefined
            ? null
            : (nextValues.size as OrganizationFormData["size"]),
        address: nextValues.address || null,
        imageUrl: nextValues.imageUrl || null,
      });
    });
    return () => subscription.unsubscribe();
  }, [form, onChange, readOnly]);

  const isFieldReadOnly = (key: string | symbol | number): boolean => {
    return readOnly || readOnlyFields.has(String(key));
  };

  return (
    <form
      onSubmit={form.handleSubmit((values) => onSubmit?.(values))}
      noValidate
    >
      <FieldSet>
        <FieldLegend>Organization Information</FieldLegend>
        <FieldGroup>
          {fields.map((field) => (
            <Field key={String(field.key)}>
              <FieldLabel>{field.label}</FieldLabel>
              <FieldContent>
                {field.type === "textarea" ? (
                  <Textarea
                    {...form.register(field.key)}
                    readOnly={isFieldReadOnly(field.key)}
                    rows={3}
                  />
                ) : (
                  <Input
                    type={field.type}
                    inputMode={field.type === "number" ? "numeric" : undefined}
                    {...form.register(field.key)}
                    readOnly={isFieldReadOnly(field.key)}
                  />
                )}
                {form.formState.errors[field.key] && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors[field.key]?.message?.toString?.() ??
                      "Invalid value"}
                  </p>
                )}
              </FieldContent>
            </Field>
          ))}
        </FieldGroup>

        <div className="mt-6 flex justify-center gap-2">
          {readOnly && onEditClick && (
            <Button type="button" variant="outline" onClick={onEditClick}>
              Edit Organization
            </Button>
          )}
          {!readOnly && (
            <>
              <Button type="submit" disabled={!onChange}>
                {submitLabel}
              </Button>
            </>
          )}
        </div>
      </FieldSet>
    </form>
  );
};

export default OrganizationForm;
