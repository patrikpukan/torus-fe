import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import type { UserProfile } from "@/types/User";
import { formatDate } from "@/features/pairings/components/dateUtils";
import { getInitials } from "@/features/pairings/utils/displayName";

export type PairingProfileCardProps = {
  profile: UserProfile;
  pairingStatus?: string;
  pairingDate?: string;
  isCurrentlyMatched?: boolean;
};

/**
 * Component that displays paired user's profile with pairing information.
 * Shows profile picture, pairing info, and then profile form fields.
 * These three features are shown directly below the profile picture.
 */
export default function PairingProfileCard({
  profile,
  pairingStatus = "planned",
  pairingDate,
  isCurrentlyMatched = false,
}: PairingProfileCardProps) {
  const statusColors: Record<string, string> = {
    planned: "bg-blue-100 text-blue-800",
    matched: "bg-green-100 text-green-800",
    met: "bg-purple-100 text-purple-800",
    not_met: "bg-red-100 text-red-800",
    cancelled: "bg-gray-100 text-gray-800",
  };

  const getStatusLabel = (status: string): string => {
    const labels: Record<string, string> = {
      planned: "Planned",
      matched: "Matched",
      met: "Met",
      not_met: "Not Met",
      cancelled: "Cancelled",
    };
    return labels[status] || status;
  };

  const getFieldValue = (key: keyof UserProfile) => {
    const fieldValue = profile[key];
    if (fieldValue === undefined || fieldValue === null) {
      return "";
    }
    if (Array.isArray(fieldValue)) {
      return fieldValue.join(", ");
    }
    return String(fieldValue);
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

  const currentAvatarSrc = normalizeUrl(profile.profileImageUrl) || "";

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
      {/* Profile picture section */}
      <div className="flex flex-col items-center gap-3">
        <h1 className="text-3xl font-semibold">Profile</h1>
        <div className="flex flex-col items-center gap-2">
          <Avatar className="h-24 w-24">
            {currentAvatarSrc ? (
              <AvatarImage src={currentAvatarSrc} alt="Profile picture" />
            ) : (
              <AvatarFallback className="bg-muted text-xl font-semibold">
                {getInitials(profile)}
              </AvatarFallback>
            )}
          </Avatar>
        </div>
      </div>

      {/* Pairing Information Section - displayed between picture and form */}
      <div className="border-t border-b py-6">
        <h3 className="mb-4 text-center text-sm font-semibold text-foreground">
          Pairing Information
        </h3>

        <div className="flex flex-col items-center gap-4">
          {/* Status of pairing */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              Pairing Status
            </span>
            <Badge
              className={statusColors[pairingStatus] || statusColors.planned}
            >
              {getStatusLabel(pairingStatus)}
            </Badge>
          </div>

          {/* Date of pairing */}
          {pairingDate && (
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">
                Paired Date
              </span>
              <p className="text-sm text-foreground">{formatDate(pairingDate)}</p>
            </div>
          )}

          {/* Currently matched indicator */}
          {isCurrentlyMatched && (
            <div className="flex items-center justify-center gap-2 rounded-md bg-green-50 p-3">
              <div className="h-2 w-2 rounded-full bg-green-600" />
              <span className="text-sm font-medium text-green-900">
                Currently Matched
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Profile form fields */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="profile-organization">Organization</FieldLabel>
          <FieldContent>
            <Input
              id="profile-organization"
              value={getFieldValue("organization")}
              readOnly
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="profile-email">Email</FieldLabel>
          <FieldContent>
            <Input id="profile-email" value={getFieldValue("email")} readOnly />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="profile-name">Name</FieldLabel>
          <FieldContent>
            <Input id="profile-name" value={getFieldValue("name")} readOnly />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="profile-surname">Surname</FieldLabel>
          <FieldContent>
            <Input
              id="profile-surname"
              value={getFieldValue("surname")}
              readOnly
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="profile-account-status">Account status</FieldLabel>
          <FieldContent>
            <Input
              id="profile-account-status"
              value={getFieldValue("accountStatus")}
              readOnly
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="profile-pairing-status">Pairing status</FieldLabel>
          <FieldContent>
            <Input
              id="profile-pairing-status"
              value={getFieldValue("pairingStatus")}
              readOnly
            />
          </FieldContent>
        </Field>
      </div>

      <FieldSet>
        <FieldLegend>Get to know me:</FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="profile-about">About me</FieldLabel>
            <FieldContent>
              <Textarea
                id="profile-about"
                value={profile.about || ""}
                readOnly
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
                readOnly
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
                value={profile.meetingActivity || ""}
                readOnly
              />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel htmlFor="profile-interests">Interests</FieldLabel>
            <FieldContent>
              <Input
                id="profile-interests"
                value={profile.interests || ""}
                readOnly
              />
            </FieldContent>
          </Field>
        </FieldGroup>
      </FieldSet>
    </div>
  );
}
