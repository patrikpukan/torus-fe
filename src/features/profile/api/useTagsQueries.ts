import { apiGet } from "@/lib/restClient";
import { useQuery } from "@tanstack/react-query";

export type TagObject = {
  id: string;
  name: string;
  category: "HOBBY" | "INTEREST";
};

/**
 * Fetch all tags. Returns the same `{ getAllTags }` shape the old Apollo query
 * exposed so consumers stay unchanged.
 */
export const useAllTagsQuery = () => {
  const query = useQuery({
    queryKey: ["tags", "all"],
    queryFn: () => apiGet<TagObject[]>("/tags"),
  });

  return {
    data: query.data ? { getAllTags: query.data } : undefined,
    loading: query.isLoading,
    error: query.error ?? undefined,
  };
};

/**
 * Fetch tags filtered by category. Returns `{ getTagsByCategory }` to mirror the
 * old Apollo query shape.
 */
export const useTagsByCategoryQuery = (category: "HOBBY" | "INTEREST") => {
  const query = useQuery({
    queryKey: ["tags", "category", category],
    queryFn: () => apiGet<TagObject[]>("/tags", { category }),
  });

  return {
    data: query.data ? { getTagsByCategory: query.data } : undefined,
    loading: query.isLoading,
    error: query.error ?? undefined,
  };
};
