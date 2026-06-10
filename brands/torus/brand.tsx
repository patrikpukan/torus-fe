import type { BrandConfig } from "@/branding/types";
import { Logo } from "./Logo";
import { LogoText } from "./LogoText";
import heroImage from "./hero.png";

const brand: BrandConfig = {
  id: "torus",
  productName: "Torus",
  companyName: "Torus",
  Logo,
  LogoText,
  heroImage,
  // Default brand carries no overrides: renders the stock index.css theme.
  theme: {
    light: {},
    dark: {},
  },
  landing: {
    heroTitle: "Torus",
    heroBadge: "Workplace Pairing Platform",
    heroSubtitle:
      "Connect employees through meaningful 1:1 meetings. Build a stronger workplace culture with smart pairing algorithms.",
    featuresHeading: "Why Choose Torus?",
    features: [
      {
        title: "Smart Pairing",
        description:
          "Algorithm creates cross-department connections for meaningful relationships",
      },
      {
        title: "Self-Hosted",
        description:
          "Complete data ownership, perfect for regulated industries",
      },
      {
        title: "Enterprise Ready",
        description: "Org management, analytics, RBAC for large teams",
      },
    ],
    howItWorksHeading: "How Torus Works",
  },
};

export default brand;
