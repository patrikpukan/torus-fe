import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { CircleUser, Pencil, Upload, User } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TagObject, UserProfile } from "@/types/User.ts";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabaseClient } from "@/lib/supabaseClient";
import { normalizeAssetUrl } from "@/lib/assetUrl";
import { useGetDepartmentsByOrganizationQuery } from "@/features/organization/api/useGetDepartmentsByOrganizationQuery";
import { useQuery as useApolloQuery } from "@apollo/client/react";
import { GET_ALL_TAGS } from "./api/useTagsQueries";
import {
  Tags,
  TagsContent,
  TagsGroup,
  TagsInput,
  TagsItem,
  TagsList,
  TagsTrigger,
  TagsValue,
} from "@/components/ui/shadcn-io/tags";

export type ProfileFormProps = {
  value: UserProfile;
  onChange?: (next: UserProfile) => void;
  readOnly?: boolean;
  onSubmit?: (profile: UserProfile) => void;
  submitLabel?: string;
  onEditClick?: () => void;
};

type ProfileFormValues = UserProfile & {
  preferredActivity?: string | null;
  profileImageUrl?: string | null;
  about?: string | null;
  location?: string | null;
  position?: string | null;
};

const normalizeProfile = (profile: UserProfile): ProfileFormValues => ({
  ...profile,
  firstName: profile.firstName ?? "",
  lastName: profile.lastName ?? "",
  about: profile.about ?? "",
  location: profile.location ?? "",
  position: profile.position ?? "",
  preferredActivity: profile.preferredActivity ?? "",
  profileImageUrl: profile.profileImageUrl ?? "",
  organization: profile.organization ?? "",
  accountStatus: profile.accountStatus ?? "",
  pairingStatus: profile.pairingStatus ?? "",
  hobbies: Array.isArray(profile.hobbies) ? profile.hobbies : [],
  interests: Array.isArray(profile.interests) ? profile.interests : [],
  departmentId: profile.departmentId ?? null,
});

const buildProfilePayload = (
  values: ProfileFormValues,
  prev: UserProfile
): UserProfile => ({
  ...prev,
  ...values,
  firstName: values.firstName?.trim() || undefined,
  lastName: values.lastName?.trim() || undefined,
  about: values.about?.trim() || undefined,
  location: values.location?.trim() || undefined,
  position: values.position?.trim() || undefined,
  preferredActivity: values.preferredActivity?.trim() || undefined,
  profileImageUrl: values.profileImageUrl || undefined,
  hobbies: Array.isArray(values.hobbies) ? values.hobbies : [],
  interests: Array.isArray(values.interests) ? values.interests : [],
  departmentId: values.departmentId ?? null,
});

const TagSelector = ({
  tags,
  category,
  onChange,
}: {
  tags: TagObject[];
  category: "HOBBY" | "INTEREST";
  onChange: (tags: TagObject[]) => void;
}) => {
  const { data: tagsData, loading } = useApolloQuery(GET_ALL_TAGS);
  const [searchValue, setSearchValue] = useState("");

  const availableTags =
    (tagsData as { getAllTags?: TagObject[] })?.getAllTags?.filter(
      (tag: TagObject) => tag.category === category
    ) || [];

  const selectedIds = new Set(tags.map((t) => t.id));

  const handleToggleTag = (tag: TagObject) => {
    if (selectedIds.has(tag.id)) {
      onChange(tags.filter((t) => t.id !== tag.id));
    } else {
      onChange([...tags, tag]);
    }
  };

  const filteredTags = availableTags.filter((tag: TagObject) =>
    tag.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading tags...</div>;
  }

  return (
    <Tags>
      <TagsTrigger className="h-auto min-h-10 justify-start">
        {tags.length > 0 ? (
          tags.map((tag) => (
            <TagsValue
              key={tag.id}
              variant="secondary"
              onRemove={() => onChange(tags.filter((t) => t.id !== tag.id))}
            >
              {tag.name}
            </TagsValue>
          ))
        ) : (
          <span className="text-muted-foreground">Select a tag...</span>
        )}
      </TagsTrigger>
      <TagsContent>
        <TagsInput
          placeholder={`Search ${category.toLowerCase()}s...`}
          value={searchValue}
          onValueChange={setSearchValue}
        />
        <TagsList>
          {filteredTags.length > 0 ? (
            <TagsGroup>
              {filteredTags.map((tag: TagObject) => (
                <TagsItem
                  key={tag.id}
                  value={tag.id}
                  onSelect={() => handleToggleTag(tag)}
                  className="justify-start"
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.has(tag.id)}
                    onChange={() => handleToggleTag(tag)}
                    className="mr-2"
                  />
                  {tag.name}
                </TagsItem>
              ))}
            </TagsGroup>
          ) : (
            <div className="p-2 text-center text-sm text-muted-foreground">
              No {category.toLowerCase()}s found
            </div>
          )}
        </TagsList>
      </TagsContent>
    </Tags>
  );
};

const ProfileForm = ({
  value,
  onChange,
  readOnly = true,
  onSubmit,
  submitLabel = "Save",
  onEditClick,
}: ProfileFormProps) => {
  const { appRole, organizationId, user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { data: departmentsData, loading: departmentsLoading } =
    useGetDepartmentsByOrganizationQuery(organizationId || "");

  const departments = departmentsData?.getDepartmentsByOrganization ?? [];

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

  const fields = useMemo(() => {
    const baseFields: Array<{ key: keyof UserProfile; label: string }> = [
      { key: "organization", label: "Organization" },
      { key: "email", label: "Email" },
      { key: "firstName", label: "Name" },
      { key: "lastName", label: "Surname" },
      { key: "accountStatus", label: "Account status" },
    ];

    if (appRole !== "org_admin" && appRole !== "super_admin") {
      baseFields.push({ key: "pairingStatus", label: "Pairing status" });
    }

    baseFields.push(
      { key: "location", label: "Location" },
      { key: "position", label: "Position" },
      { key: "preferredActivity", label: "Preferred Activity" }
    );

    return baseFields;
  }, [appRole]);

  const form = useForm<ProfileFormValues>({
    mode: "onChange",
    defaultValues: normalizeProfile(value),
  });

  useEffect(() => {
    if (readOnly) {
      form.reset(normalizeProfile(value));
      setPreviewUrl(null);
    }
  }, [form, readOnly, value]);

  useEffect(() => {
    if (!onChange || readOnly) return;
    const subscription = form.watch((nextValues) => {
      onChange(buildProfilePayload(nextValues as ProfileFormValues, value));
    });
    return () => subscription.unsubscribe();
  }, [form, onChange, readOnly, value]);

  const isFieldReadOnly = (key: string | symbol | number): boolean => {
    return readOnly || readOnlyFields.has(String(key));
  };

  const currentAvatarSrc =
    previewUrl || normalizeAssetUrl(form.watch("profileImageUrl") ?? "") || "";

  const handlePickFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onChange) return;

    try {
      setUploading(true);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

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
        return;
      }

      const { data } = supabaseClient.storage
        .from("profile-pictures")
        .getPublicUrl(path);
      const publicUrl = data.publicUrl;

      form.setValue("profileImageUrl", publicUrl, { shouldDirty: true });
      onChange(buildProfilePayload(form.getValues(), value));
      setPreviewUrl(null);
    } catch (err) {
      console.error("Failed to upload avatar:", err);
      setPreviewUrl(null);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const hobbies = (form.watch("hobbies") as TagObject[]) ?? [];
  const interests = (form.watch("interests") as TagObject[]) ?? [];

  const handleSubmit = form.handleSubmit((vals) => {
    if (!onSubmit) return;
    onSubmit(buildProfilePayload(vals, value));
  });

  return (
    <form
      onSubmit={onSubmit ? handleSubmit : undefined}
      className="mx-auto flex w-full max-w-4xl flex-col gap-8"
      noValidate
    >
      <div className="flex flex-col items-center gap-3">
        <h1 className="flex items-center gap-3 text-3xl font-semibold">
          <User aria-hidden className="h-8 w-8 text-primary" />
          <span>Profile</span>
        </h1>
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
                {uploading ? "Uploading..." : "Upload new photo"}
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {fields.map(({ key, label }) => {
          const fieldId = `profile-${key}`;
          const isReadonly = isFieldReadOnly(key);

          if (key === "preferredActivity") {
            return (
              <Field key={key}>
                <FieldLabel htmlFor={fieldId}>{label}</FieldLabel>
                <FieldContent className="bg-card">
                  <Select
                    value={form.watch("preferredActivity") || ""}
                    onValueChange={(newValue) => {
                      form.setValue("preferredActivity", newValue, {
                        shouldDirty: true,
                      });
                      onChange?.(buildProfilePayload(form.getValues(), value));
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
                  placeholder={
                    key === "location"
                      ? "e.g., Prague, Czech Republic"
                      : undefined
                  }
                  {...form.register(key as keyof ProfileFormValues)}
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
                {...form.register("about")}
                readOnly={readOnly}
                disabled={readOnly}
                rows={4}
              />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Hobbies</FieldLabel>
            <FieldContent>
              {readOnly ? (
                <div className="min-h-10 flex items-center">
                  {hobbies.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {hobbies.map((hobby: TagObject) => (
                        <Badge key={hobby.id} variant="secondary">
                          {hobby.name}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      No hobbies added
                    </span>
                  )}
                </div>
              ) : (
                <TagSelector
                  tags={hobbies}
                  category="HOBBY"
                  onChange={(tags) => {
                    form.setValue("hobbies", tags, { shouldDirty: true });
                    onChange?.(buildProfilePayload(form.getValues(), value));
                  }}
                />
              )}
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Interests</FieldLabel>
            <FieldContent>
              {readOnly ? (
                <div className="min-h-10 flex items-center">
                  {interests.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {interests.map((interest: TagObject) => (
                        <Badge key={interest.id} variant="secondary">
                          {interest.name}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      No interests added
                    </span>
                  )}
                </div>
              ) : (
                <TagSelector
                  tags={interests}
                  category="INTEREST"
                  onChange={(tags) => {
                    form.setValue("interests", tags, { shouldDirty: true });
                    onChange?.(buildProfilePayload(form.getValues(), value));
                  }}
                />
              )}
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
                value={form.watch("departmentId") || "none"}
                onValueChange={(newValue) => {
                  form.setValue(
                    "departmentId",
                    newValue === "none" ? null : newValue,
                    { shouldDirty: true }
                  );
                  onChange?.(buildProfilePayload(form.getValues(), value));
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
