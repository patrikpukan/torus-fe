import {
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { CircleUser, Pencil, Upload } from "lucide-react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { UserProfile } from "@/types/User.ts";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabaseClient } from "@/lib/supabaseClient";
import { useGetDepartmentsByOrganizationQuery } from "@/features/organization/api/useGetDepartmentsByOrganizationQuery";

export type ProfileFormProps = {
  value: UserProfile;
  onChange?: (next: UserProfile) => void;
  readOnly?: boolean;
  onSubmit?: (profile: UserProfile) => void;
  submitLabel?: string;
  onEditClick?: () => void;
};

const ProfileForm = ({
  value,
  onChange,
  readOnly = true,
  onSubmit,
  submitLabel = "Save",
  onEditClick,
}: ProfileFormProps) => {
  const { user, organizationId } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Fetch departments for the organization
  const { data: departmentsData, loading: departmentsLoading } =
    useGetDepartmentsByOrganizationQuery(organizationId || "");

  const departments = departmentsData?.getDepartmentsByOrganization ?? [];
  // Fields that are always read-only
  const readOnlyFields = useMemo(
    () =>
      new Set<string>([
        "email",
        "accountStatus",
        "organization",
        "pairingStatus",
      ]),
    []
  );

  const fields = useMemo(
    () =>
      [
        { key: "organization", label: "Organization" },
        { key: "email", label: "Email" },
        { key: "firstName", label: "Name" },
        { key: "lastName", label: "Surname" },
        { key: "accountStatus", label: "Account status" },
        { key: "pairingStatus", label: "Pairing status" },
        { key: "preferredActivity", label: "Preferred Activity" },
      ] as const,
    []
  );

  const handleChange =
    (key: keyof UserProfile) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (!onChange) return;
      onChange({ ...value, [key]: event.target.value } as UserProfile);
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit?.(value);
  };

  const getFieldValue = (key: keyof UserProfile) => {
    const fieldValue = value[key];
    if (fieldValue === undefined || fieldValue === null) {
      return "";
    }
    if (Array.isArray(fieldValue)) {
      return fieldValue.join(", ");
    }
    return String(fieldValue);
  };

  const isFieldReadOnly = (key: string | symbol | number): boolean => {
    return readOnly || readOnlyFields.has(String(key));
  };

  const apiBaseFromGraphQL = (() => {
    const gql = import.meta.env.VITE_GRAPHQL_API as string | undefined;
    if (!gql) return undefined;
    try {
      const u = new URL(gql);
      // strip trailing /graphql
      if (u.pathname.endsWith("/graphql")) {
        u.pathname = u.pathname.replace(/\/graphql$/, "");
      }
      return u.toString().replace(/\/$/, "");
    } catch {
      return undefined;
    }
  })();

  const normalizeUrl = (src?: string | null): string => {
    if (!src) return "";
    if (/^blob:/i.test(src)) return ""; // stale local preview persisted in DB; ignore
    if (/^https?:\/\//i.test(src)) return src;
    const base =
      (import.meta.env.VITE_API_BASE as string | undefined) ??
      apiBaseFromGraphQL;
    if (!base) return src; // best effort
    if (src.startsWith("/")) return `${base}${src}`;
    return `${base}/${src}`;
  };

  const normalizedProfileAvatar = normalizeUrl(value.profileImageUrl);
  const currentAvatarSrc = previewUrl || normalizedProfileAvatar || "";

  const handlePickFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!onChange) return;
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      // show immediate local preview
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      // Upload to Supabase Storage (bucket: profile-pictures)
      // The bucket must allow authenticated users to write to their own folder.
      // Set up Supabase Storage policies:
      //   1. Go to Storage → Policies → profile-pictures bucket
      //   2. CREATE NEW POLICY for INSERT (authenticated users upload to their folder)
      //      - Allowed for: (bucket_id = 'profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1])
      //   3. CREATE NEW POLICY for SELECT (public read access)
      //      - Allowed for: (bucket_id = 'profile-pictures')
      const userId = user?.id;
      if (!userId) {
        console.error("User not authenticated; cannot upload avatar");
        setPreviewUrl(null);
        return;
      }
      const path = `${userId}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabaseClient.storage
        .from("profile-pictures")
        .upload(path, file, { upsert: true, cacheControl: "3600" });

      if (uploadError) {
        console.error("Supabase upload error:", uploadError);
        console.error(
          "Hint: Check profile-pictures bucket RLS policies. Ensure authenticated users can INSERT into their own folder."
        );
        // Keep local preview visible but do not persist blob URL into value
        return;
      }

      const { data } = supabaseClient.storage
        .from("profile-pictures")
        .getPublicUrl(path);
      const publicUrl = data.publicUrl;
      onChange({ ...value, profileImageUrl: publicUrl });
      // Clear preview since we have a real public URL now
      setPreviewUrl(null);
    } catch (err) {
      console.error("Failed to upload avatar:", err);
      setPreviewUrl(null);
    } finally {
      setUploading(false);
      // Clear file input so the same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <form
      onSubmit={onSubmit ? handleSubmit : undefined}
      className="mx-auto flex w-full max-w-4xl flex-col gap-8"
    >
      <div className="flex flex-col items-center gap-3">
        <h1 className="text-3xl font-semibold">Profile</h1>
        <div className="flex flex-col items-center gap-2">
          <Avatar className="h-24 w-24">
            <AvatarImage
              src={currentAvatarSrc || undefined}
              alt="Profile picture"
            />
            <AvatarFallback>
              <CircleUser className="h-16 w-16" strokeWidth={1.5} />
            </AvatarFallback>
          </Avatar>

          {readOnly ? (
            onEditClick ? (
              <Button
                type="button"
                size="sm"
                className="mt-4"
                variant="outline"
                onClick={onEditClick}
              >
                <Pencil className="mr-2 h-4 w-4" />
                <span className="text-foreground">Edit profile</span>
              </Button>
            ) : null
          ) : (
            <div className="flex items-center gap-2">
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handlePickFile}
                disabled={uploading}
              >
                <Upload className="mr-2 h-4 w-4" />
                {uploading ? "Uploading…" : "Upload new photo"}
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {fields.map(({ key, label }) => {
          const fieldId = `profile-${key}`;
          const isReadonly = isFieldReadOnly(key);

          // Special handling for preferredActivity (Select component)
          if (key === "preferredActivity") {
            return (
              <Field key={key}>
                <FieldLabel htmlFor={fieldId}>{label}</FieldLabel>
                <FieldContent className="bg-card">
                  <Select
                    value={getFieldValue(key) || ""}
                    onValueChange={(newValue) => {
                      if (!onChange) return;
                      onChange({
                        ...value,
                        [key]: newValue || undefined,
                      } as UserProfile);
                    }}
                    disabled={isReadonly}
                  >
                    <SelectTrigger id={fieldId}>
                      <SelectValue placeholder="Select an activity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Coffee">Coffee</SelectItem>
                      <SelectItem value="Lunch">Lunch</SelectItem>
                      <SelectItem value="Walk">Walk</SelectItem>
                      <SelectItem value="Video Call">Video Call</SelectItem>
                      <SelectItem value="Phone Call">Phone Call</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldContent>
              </Field>
            );
          }

          return (
            <Field key={key}>
              <FieldLabel htmlFor={fieldId}>{label}</FieldLabel>
              <FieldContent className="bg-card">
                <Input
                  id={fieldId}
                  value={getFieldValue(key)}
                  onChange={handleChange(key)}
                  readOnly={isReadonly}
                  disabled={isReadonly}
                />
              </FieldContent>
            </Field>
          );
        })}
      </div>

      <FieldSet>
        <FieldLegend>Get to know me:</FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="profile-about">About me</FieldLabel>
            <FieldContent className="bg-card">
              <Textarea
                id="profile-about"
                value={value.about}
                onChange={handleChange("about")}
                readOnly={readOnly}
                disabled={readOnly}
                rows={4}
              />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel htmlFor="profile-hobbies">Hobbies</FieldLabel>
            <FieldContent className="bg-card">
              <Input
                id="profile-hobbies"
                value={getFieldValue("hobbies")}
                onChange={handleChange("hobbies")}
                readOnly={readOnly}
                disabled={readOnly}
              />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel htmlFor="profile-interests">Interests</FieldLabel>
            <FieldContent className="bg-card">
              <Input
                id="profile-interests"
                value={value.interests}
                onChange={handleChange("interests")}
                readOnly={readOnly}
                disabled={readOnly}
              />
            </FieldContent>
          </Field>
          <Field>
            <div className="space-y-2">
              <FieldLabel htmlFor="profile-department">Department</FieldLabel>
              <p className="text-xs text-muted-foreground">
                Assign yourself to a department within your organization
                (optional)
              </p>
            </div>
            <FieldContent className="bg-card">
              <Select
                value={value.departmentId || "none"}
                onValueChange={(newValue) => {
                  if (!onChange) return;
                  onChange({
                    ...value,
                    departmentId: newValue === "none" ? null : newValue,
                  } as UserProfile);
                }}
                disabled={readOnly || departmentsLoading}
              >
                <SelectTrigger id="profile-department">
                  <SelectValue placeholder="Select a department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none" className="text-muted-foreground">
                    No Department
                  </SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept?.id} value={dept?.id || ""}>
                      {dept?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldContent>
          </Field>
        </FieldGroup>
      </FieldSet>

      {!readOnly && onSubmit && (
        <div className="flex justify-end border-t border-border pt-4">
          <Button type="submit">{submitLabel}</Button>
        </div>
      )}
    </form>
  );
};

export default ProfileForm;
