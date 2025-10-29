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
import type { UserProfile } from "../../types/User";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabaseClient } from "@/lib/supabaseClient";

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
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
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
        { key: "name", label: "Name" },
        { key: "surname", label: "Surname" },
        { key: "accountStatus", label: "Account status" },
        { key: "pairingStatus", label: "Pairing status" },
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

  type UserMetadata = {
    avatar_url?: string;
    first_name?: string;
    last_name?: string;
    full_name?: string;
  };

  const authAvatar = (user?.user_metadata as UserMetadata | undefined)
    ?.avatar_url;
  const currentAvatarSrc = value.profileImageUrl || authAvatar || "";

  const handlePickFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!onChange) return;
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      // Upload to Supabase Storage (bucket: profile-pictures)
      const userId = user?.id ?? "anonymous";
      const path = `${userId}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabaseClient.storage
        .from("profile-pictures")
        .upload(path, file, { upsert: true, cacheControl: "3600" });

      if (uploadError) {
        console.error("Supabase upload error:", uploadError);
        // Fallback: create a temporary preview URL so at least the user sees it
        const objectUrl = URL.createObjectURL(file);
        onChange({ ...value, profileImageUrl: objectUrl });
        return;
      }

      const { data } = supabaseClient.storage
        .from("profile-pictures")
        .getPublicUrl(path);
      const publicUrl = data.publicUrl;
      onChange({ ...value, profileImageUrl: publicUrl });
    } catch (err) {
      console.error("Failed to upload avatar:", err);
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
            {currentAvatarSrc ? (
              <AvatarImage src={currentAvatarSrc} alt="Profile picture" />
            ) : (
              <AvatarFallback>
                <CircleUser className="h-16 w-16" strokeWidth={1.5} />
              </AvatarFallback>
            )}
          </Avatar>

          {readOnly ? (
            onEditClick ? (
              <Button
                type="button"
                size="sm"
                variant="secondary"
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

          return (
            <Field key={key}>
              <FieldLabel htmlFor={fieldId}>{label}</FieldLabel>
              <FieldContent>
                <Input
                  id={fieldId}
                  value={getFieldValue(key)}
                  onChange={handleChange(key)}
                  readOnly={isFieldReadOnly(key)}
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
            <FieldContent>
              <Textarea
                id="profile-about"
                value={value.about}
                onChange={handleChange("about")}
                readOnly={readOnly}
                rows={4}
              />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel htmlFor="profile-hobbies">Hobbies</FieldLabel>
            <FieldContent>
              <Input
                id="profile-hobbies"
                value={getFieldValue("hobbies")}
                onChange={handleChange("hobbies")}
                readOnly={readOnly}
              />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel htmlFor="profile-meeting-activity">
              Preferred meeting activity
            </FieldLabel>
            <FieldContent>
              <Input
                id="profile-meeting-activity"
                value={value.meetingActivity}
                onChange={handleChange("meetingActivity")}
                readOnly={readOnly}
              />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel htmlFor="profile-interests">Interests</FieldLabel>
            <FieldContent>
              <Input
                id="profile-interests"
                value={value.interests}
                onChange={handleChange("interests")}
                readOnly={readOnly}
              />
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
