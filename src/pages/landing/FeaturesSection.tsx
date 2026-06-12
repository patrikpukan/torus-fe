import { Card } from "@/components/ui/card";
import { useBrand } from "@/branding";

export const FeaturesSection = () => {
  const { landing } = useBrand();

  return (
    <div className="mb-12 space-y-10 sm:mb-16 md:mb-20">
      <h2 className="text-center font-heading text-3xl font-bold tracking-tight sm:text-4xl">
        {landing.featuresHeading}
      </h2>
      <div className="grid gap-6 md:grid-cols-3">
        {landing.features.map((f, i) => (
          <Card
            key={f.title}
            className="border-0 p-6 shadow-elevated transition hover:-translate-y-0.5 hover:shadow-elevated-lg"
          >
            <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 font-heading text-lg font-bold text-primary">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mb-2 font-heading text-lg font-bold">{f.title}</h3>
            <p className="text-sm text-muted-foreground">{f.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};
