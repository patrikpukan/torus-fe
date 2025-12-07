import { useMutation, useQuery } from "@apollo/client/react";

import { graphql } from "gql.tada";
import type {
  AlgorithmSettings,
  AlgorithmSettingsResponse,
  PairingExecutionResult,
  UpdateAlgorithmSettingsInput,
} from "../types";

type GetAlgorithmSettingsData = {
  getAlgorithmSettings: AlgorithmSettings;
};

type GetAlgorithmSettingsVariables = {
  organizationId: string;
};

type UpdateAlgorithmSettingsData = {
  updateAlgorithmSettings: AlgorithmSettingsResponse;
};

type UpdateAlgorithmSettingsVariables = {
  input: UpdateAlgorithmSettingsInput;
};

type ExecutePairingAlgorithmData = {
  executePairingAlgorithm: PairingExecutionResult;
};

type ExecutePairingAlgorithmVariables = {
  organizationId: string;
};

export const GET_ALGORITHM_SETTINGS = graphql(`
  query GetAlgorithmSettings($organizationId: ID!) {
    getAlgorithmSettings(organizationId: $organizationId) {
      id
      organizationId
      periodLengthDays
      randomSeed
      createdAt
      updatedAt
    }
  }
`);

export const UPDATE_ALGORITHM_SETTINGS = graphql(`
  mutation UpdateAlgorithmSettings($input: UpdateAlgorithmSettingsInput!) {
    updateAlgorithmSettings(input: $input) {
      id
      organizationId
      periodLengthDays
      randomSeed
      warning
      updatedAt
    }
  }
`);

export const EXECUTE_PAIRING_ALGORITHM = graphql(`
  mutation ExecutePairingAlgorithm($organizationId: String!) {
    executePairingAlgorithm(organizationId: $organizationId) {
      success
      pairingsCreated
      message
      unpairedUsers
    }
  }
`);

export const useGetAlgorithmSettings = (organizationId: string) => {
  return useQuery<GetAlgorithmSettingsData, GetAlgorithmSettingsVariables>(
    GET_ALGORITHM_SETTINGS,
    {
      variables: { organizationId },
      skip: !organizationId,
    }
  );
};

export const useUpdateAlgorithmSettings = () => {
  return useMutation<
    UpdateAlgorithmSettingsData,
    UpdateAlgorithmSettingsVariables
  >(UPDATE_ALGORITHM_SETTINGS);
};

export const useExecutePairingAlgorithm = () => {
  return useMutation<
    ExecutePairingAlgorithmData,
    ExecutePairingAlgorithmVariables
  >(EXECUTE_PAIRING_ALGORITHM);
};
