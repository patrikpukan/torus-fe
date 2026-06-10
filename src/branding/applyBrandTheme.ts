import { brand } from "./index";
import type { BrandThemeOverrides } from "./types";

const TOKEN_MAP: Record<keyof BrandThemeOverrides, string> = {
  primary: "--primary",
  primaryForeground: "--primary-foreground",
  ring: "--ring",
  accent: "--accent",
  accentForeground: "--accent-foreground",
  sidebarPrimary: "--sidebar-primary",
  sidebarPrimaryForeground: "--sidebar-primary-foreground",
  sidebarRing: "--sidebar-ring",
  gradientFrom: "--gradient-from",
  gradientTo: "--gradient-to",
  textGradientFrom: "--text-gradient-from",
  textGradientTo: "--text-gradient-to",
};

const block = (overrides: BrandThemeOverrides): string =>
  (Object.entries(overrides) as [keyof BrandThemeOverrides, string][])
    .map(([key, value]) => `${TOKEN_MAP[key]}: ${value};`)
    .join("\n");

/**
 * Injects the brand's CSS variable overrides as a <style> tag. Must run
 * before the first render (called at the top of main.tsx) — #root is empty
 * until React mounts, so the default theme never paints.
 */
export function applyBrandTheme(): void {
  const { light, dark } = brand.theme;
  if (!Object.keys(light).length && !Object.keys(dark).length) {
    return;
  }
  const style = document.createElement("style");
  style.id = "brand-theme";
  style.textContent = `:root{${block(light)}}\n.dark{${block(dark)}}`;
  document.head.appendChild(style);
}
