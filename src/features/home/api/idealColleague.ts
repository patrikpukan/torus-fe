import { useMutation } from "@apollo/client/react";
import { graphql } from "gql.tada";

export type FindIdealColleagueData = {
  findIdealColleague: string;
};

export const FIND_IDEAL_COLLEAGUE = graphql(`
  mutation FindIdealColleague {
    findIdealColleague
  }
`);

export const useFindIdealColleague = () =>
  useMutation<FindIdealColleagueData>(FIND_IDEAL_COLLEAGUE);
