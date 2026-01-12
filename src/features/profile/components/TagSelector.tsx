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
import { GET_ALL_TAGS } from "@/features/profile/api/useTagsQueries";
import type { TagObject } from "@/types/User.ts";
import { useQuery as useApolloQuery } from "@apollo/client/react";
import { useState } from "react";

export const TagSelector = ({
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
