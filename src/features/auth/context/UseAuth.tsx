import { createContext, useContext } from "react";
import type { AuthContextValue } from "@/features/auth/context/AuthProvider.tsx";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
