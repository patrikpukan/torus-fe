import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { useBrand } from "@/branding";

/**
 * Full-screen split layout for auth screens (login / register / reset):
 * a branded value-proposition panel on the left, the form on the right.
 * No app sidebar/chrome — these are pre-authentication surfaces.
 */
export const AuthLayout = ({ children }: { children: ReactNode }) => {
  const { Logo, productName, landing } = useBrand();
  const year = new Date().getFullYear();

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between gradient-primary p-12 text-white lg:flex">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/95 p-1.5">
            <Logo />
          </div>
          <span className="font-heading text-xl font-bold">{productName}</span>
        </div>

        <div className="max-w-md space-y-6">
          <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
            {landing.heroBadge}
          </span>
          <h2 className="font-heading text-3xl font-bold leading-tight">
            {landing.heroSubtitle}
          </h2>
          <ul className="space-y-3">
            {landing.features.map((f) => (
              <li key={f.title} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-white/20">
                  <Check className="h-3 w-3" />
                </span>
                <span className="text-sm text-white/90">{f.title}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-sm text-white/60">
          © {year} {productName}
        </p>
      </div>

      {/* Form side */}
      <div className="bg-atmosphere flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center justify-center gap-2 lg:hidden">
            <div className="h-9 w-9">
              <Logo />
            </div>
            <span className="font-heading text-lg font-bold">
              {productName}
            </span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};
