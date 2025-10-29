import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";

export type RegisterOrganizationInput = {
  adminEmail: string;
  organizationName: string;
  organizationSize: string;
  organizationAddress: string;
};

export type RegisterOrganizationResponse = {
  registerOrganization: {
    organization: {
      id: string;
      name: string;
      code: string;
      size?: number | null;
      address?: string | null;
      createdAt: string;
      updatedAt: string;
    };
    adminEmail: string;
    message: string;
  };
};

export const REGISTER_ORGANIZATION_MUTATION = gql`
  mutation RegisterOrganization($input: RegisterOrganizationInputType!) {
    registerOrganization(input: $input) {
      organization {
        id
        name
        code
        size
        address
        createdAt
        updatedAt
      }
      adminEmail
      message
    }
  }
`;

export const useRegisterOrganization = () => {
  return useMutation<
    RegisterOrganizationResponse,
    { input: RegisterOrganizationInput }
  >(REGISTER_ORGANIZATION_MUTATION);
};
