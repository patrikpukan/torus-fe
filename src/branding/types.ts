import type { ComponentType } from "react";

/** hsl triplet string, e.g. "244 64% 55%" — matches the index.css token format */
type Hsl = string;

/**
 * Tokens a brand may override. Anything omitted keeps the index.css default,
 * so the default brand ships zero overrides and renders the stock theme.
 */
export interface BrandThemeOverrides {
  primary?: Hsl;
  primaryForeground?: Hsl;
  ring?: Hsl;
  accent?: Hsl;
  accentForeground?: Hsl;
  sidebarPrimary?: Hsl;
  sidebarPrimaryForeground?: Hsl;
  sidebarRing?: Hsl;
  gradientFrom?: Hsl;
  gradientTo?: Hsl;
  textGradientFrom?: Hsl;
  textGradientTo?: Hsl;
}

export interface BrandLanding {
  heroTitle: string;
  heroBadge: string;
  heroSubtitle: string;
  featuresHeading: string;
  features: { title: string; description: string }[];
  howItWorksHeading: string;
}

export interface BrandConfig {
  /** Machine id; must equal the brand folder name. */
  id: string;
  productName: string;
  /** Used in the footer copyright line. */
  companyName: string;
  /** Logo mark only (collapsed sidebar, hero). */
  Logo: ComponentType;
  /** Full wordmark (expanded sidebar). */
  LogoText: ComponentType;
  /** Imported asset URL for the landing hero background. */
  heroImage: string;
  theme: {
    light: BrandThemeOverrides;
    dark: BrandThemeOverrides;
  };
  landing: BrandLanding;
  /**
   * Pre-fills the register form invite field for this deployment.
   * Caveat: invite codes rotate/expire — keep it fresh or leave unset.
   */
  defaultInviteCode?: string;
  /**
   * RESERVED — not implemented. Locking registration to an organization by
   * code requires a backend "resolve org code" feature first.
   */
  orgCode?: string;
}
