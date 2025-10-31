import { useMemo, type ChangeEvent, type FormEvent } from "react";
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

  const handleChange =
    (key: keyof OrganizationFormData) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (!onChange) return;
      const newValue = event.target.value;

      // Handle number conversion for size field
      if (key === "size") {
        const numValue = newValue === "" ? null : Number(newValue);
        onChange({ ...value, [key]: numValue });
      } else {
        onChange({ ...value, [key]: newValue || null });
      }
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit?.(value);
  };

  const getFieldValue = (key: keyof OrganizationFormData) => {
    const fieldValue = value[key];
    if (fieldValue === undefined || fieldValue === null) {
      return "";
    }
    return String(fieldValue);
  };

  const isFieldReadOnly = (key: string | symbol | number): boolean => {
    return readOnly || readOnlyFields.has(String(key));
  };

  return (
    <form onSubmit={handleSubmit}>
      <FieldSet>
        <FieldLegend>Organization Information</FieldLegend>
        <FieldGroup>
          {fields.map((field) => (
            <Field key={String(field.key)}>
              <FieldLabel>{field.label}</FieldLabel>
              <FieldContent>
                {field.type === "textarea" ? (
                  <Textarea
                    value={getFieldValue(field.key)}
                    onChange={handleChange(field.key)}
                    readOnly={isFieldReadOnly(field.key)}
                    rows={3}
                  />
                ) : (
                  <Input
                    type={field.type}
                    value={getFieldValue(field.key)}
                    onChange={handleChange(field.key)}
                    readOnly={isFieldReadOnly(field.key)}
                  />
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
