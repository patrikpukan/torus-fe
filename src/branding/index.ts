import brandConfig from "@brand/brand";
import type { BrandConfig } from "./types";

/**
 * The active brand, resolved at build time via the Vite `@brand` alias
 * (VITE_BRAND env var selects the folder under brands/; defaults to torus).
 */
export const brand: BrandConfig = brandConfig;

/** Hook-shaped accessor for API consistency in components. */
export const useBrand = (): BrandConfig => brand;
