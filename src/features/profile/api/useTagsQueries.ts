import { graphql } from "gql.tada";

export type TagObject = {
  id: string;
  name: string;
  category: "HOBBY" | "INTEREST";
};

export const GET_ALL_TAGS = graphql(`
  query GetAllTags {
    getAllTags {
      id
      name
      category
    }
  }
`);

export const GET_TAGS_BY_CATEGORY = graphql(`
  query GetTagsByCategory($category: TagCategory!) {
    getTagsByCategory(category: $category) {
      id
      name
      category
    }
  }
`);
