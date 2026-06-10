import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApolloProvider } from "@apollo/client/react";
import App from "./app/App.tsx";
import "./index.css";
import { apolloClient } from "./lib/apolloClient";
import { applyBrandTheme } from "./branding/applyBrandTheme";
import { validateEnv } from "./lib/validateEnv";
import { ErrorBoundary } from "./components/ErrorBoundary";

validateEnv();
applyBrandTheme();

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ApolloProvider client={apolloClient}>
          <App />
        </ApolloProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>
);
