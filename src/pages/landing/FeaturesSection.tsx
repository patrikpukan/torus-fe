import { Building2, Network, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useBrand } from "@/branding";

/** Icons paired by position to the brand's feature list. */
const FEATURE_ICONS = [Network, ShieldCheck, Building2];

export const FeaturesSection = () => {
  const { landing } = useBrand();

  return (
    <div className="mb-12 space-y-10 sm:mb-16 md:mb-20">
      <h2 className="text-center font-heading text-3xl font-bold tracking-tight sm:text-4xl">
        {landing.featuresHeading}
      </h2>
      <div className="grid gap-6 md:grid-cols-3">
        {landing.features.map((f, i) => {
          const Icon = FEATURE_ICONS[i % FEATURE_ICONS.length];
          return (
            <Card
              key={f.title}
              className="group relative overflow-hidden p-7 transition hover:-translate-y-1 hover:shadow-elevated-lg"
            >
              {/* Accent bar */}
              <span className="absolute inset-x-0 top-0 h-1 gradient-primary opacity-0 transition-opacity group-hover:opacity-100" />
              <span className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15">
                <Icon className="h-7 w-7" />
              </span>
              <h3 className="mb-2 font-heading text-xl font-bold">{f.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {f.description}
              </p>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
