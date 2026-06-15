import { MessageCircleHeart } from "lucide-react";

import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { useGetCurrentUserQuery } from "@/features/auth/api/useGetCurrentUserQuery";
import type { PairingContact } from "@/features/pairings/types";

type Tag = { id?: string; name: string };

const tagNames = (tags?: ReadonlyArray<Tag> | null): string[] =>
  (tags ?? [])
    .map((t) => (t?.name ?? "").trim())
    .filter((name) => name.length > 0);

/**
 * Compute starter prompts from the tags the current user and their pairing
 * share. Falls back to generic-but-useful prompts when there is no overlap.
 */
const buildStarters = (shared: string[]): string[] => {
  if (shared.length > 0) {
    return shared
      .slice(0, 3)
      .map((tag) => `You both like ${tag} — swap recommendations.`);
  }

  return [
    "Ask what they're working on this week — and share what's on your plate.",
    "Compare how you each like to take a break: coffee, a walk, or a quick chat?",
  ];
};

type ConversationStartersProps = {
  pairing: PairingContact;
};

/**
 * "Break the ice" card for the regular-user dashboard. Surfaces 2–3 starter
 * prompts derived from hobbies/interests shared with the current pairing.
 */
export const ConversationStarters = ({ pairing }: ConversationStartersProps) => {
  const { data } = useGetCurrentUserQuery();
  const currentUser = data?.getCurrentUser;

  const mine = new Set(
    [...tagNames(currentUser?.hobbies), ...tagNames(currentUser?.interests)].map(
      (name) => name.toLowerCase()
    )
  );

  const theirs = [
    ...tagNames(pairing.profile.hobbies),
    ...tagNames(pairing.profile.interests),
  ];

  const seen = new Set<string>();
  const shared: string[] = [];
  for (const name of theirs) {
    const key = name.toLowerCase();
    if (mine.has(key) && !seen.has(key)) {
      seen.add(key);
      shared.push(name);
    }
  }

  const starters = buildStarters(shared);

  return (
    <Card className="border-0 p-6 shadow-elevated">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <MessageCircleHeart className="h-5 w-5" aria-hidden />
        </div>
        <div>
          <CardTitle className="text-base font-semibold">
            Break the ice
          </CardTitle>
          <CardDescription className="text-sm">
            {shared.length > 0
              ? "A few things you have in common."
              : "Ideas to get the conversation started."}
          </CardDescription>
        </div>
      </div>
      <ul className="space-y-3">
        {starters.map((starter, index) => (
          <li
            key={index}
            className="flex items-start gap-3 rounded-lg bg-muted/50 px-4 py-3 text-sm text-foreground"
          >
            <span
              className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
              aria-hidden
            />
            <span>{starter}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
};
