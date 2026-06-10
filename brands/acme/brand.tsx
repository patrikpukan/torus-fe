import type { BrandConfig } from "@/branding/types";
import { Logo } from "./Logo";
import { LogoText } from "./LogoText";
import heroImage from "./hero.svg";

/**
 * Demo brand proving the whitelabel system end-to-end.
 * Emerald/teal palette over the same ink-dark mode.
 */
const brand: BrandConfig = {
  id: "acme",
  productName: "Acme Connect",
  companyName: "Acme Corp",
  Logo,
  LogoText,
  heroImage,
  theme: {
    light: {
      primary: "166 76% 32%",
      primaryForeground: "0 0% 100%",
      ring: "166 76% 32%",
      accent: "172 60% 92%",
      accentForeground: "170 70% 22%",
      sidebarPrimary: "166 76% 32%",
      sidebarPrimaryForeground: "0 0% 100%",
      sidebarRing: "166 76% 32%",
      gradientFrom: "166 76% 32%",
      gradientTo: "173 70% 40%",
      textGradientFrom: "166 76% 30%",
      textGradientTo: "152 65% 45%",
    },
    dark: {
      primary: "168 70% 58%",
      primaryForeground: "170 60% 10%",
      ring: "168 70% 58%",
      accent: "170 45% 20%",
      accentForeground: "168 75% 78%",
      sidebarPrimary: "168 70% 58%",
      sidebarPrimaryForeground: "170 60% 10%",
      sidebarRing: "168 70% 58%",
      gradientFrom: "168 70% 58%",
      gradientTo: "166 76% 38%",
      textGradientFrom: "168 75% 62%",
      textGradientTo: "152 70% 55%",
    },
  },
  landing: {
    heroTitle: "Acme Connect",
    heroBadge: "People-First Pairing",
    heroSubtitle:
      "Bring your teams closer with curated 1:1 connections. Acme Connect pairs colleagues across departments to build culture that lasts.",
    featuresHeading: "Why Acme Connect?",
    features: [
      {
        title: "Curated Matches",
        description:
          "Smart pairing across teams so every introduction is a meaningful one",
      },
      {
        title: "Private by Design",
        description:
          "Your people data stays yours — deployed on infrastructure you control",
      },
      {
        title: "Built for Scale",
        description:
          "Departments, analytics, and role-based access for organizations of any size",
      },
    ],
    howItWorksHeading: "How Acme Connect Works",
  },
};

export default brand;
