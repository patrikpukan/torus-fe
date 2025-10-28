import { useContext } from "react";
import { AuthContext } from "@/features/auth/context/AuthContext.ts";
import type { AuthContextValue } from "@/features/auth/context/AuthContext.ts";

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
