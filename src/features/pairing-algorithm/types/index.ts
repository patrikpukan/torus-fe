// This file defines TypeScript types for the pairing algorithm feature
// DO NOT modify these types - they match the GraphQL schema exactly

export interface AlgorithmSettings {
  id: string;
  organizationId: string;
  periodLengthDays: number;
  randomSeed: number;
  createdAt: string;
  updatedAt: string;
}

export interface AlgorithmSettingsResponse extends AlgorithmSettings {
  warning?: string | null;
}

export interface UpdateAlgorithmSettingsInput {
  organizationId: string;
  periodLengthDays?: number;
  randomSeed?: number;
}

export interface PairingExecutionResult {
  success: boolean;
  pairingsCreated: number;
  message: string;
  unpairedUsers?: number;
}
