import { Card } from "@/components/ui/card";

const features = [
  {
    title: "Smart Pairing",
    description:
      "Algorithm creates cross-department connections for meaningful relationships",
  },
  {
    title: "Self-Hosted",
    description: "Complete data ownership, perfect for regulated industries",
  },
  {
    title: "Enterprise Ready",
    description: "Org management, analytics, RBAC for large teams",
  },
];

export const FeaturesSection = () => {
  return (
    <div className="mb-12 space-y-8 sm:mb-16 md:mb-20">
      <h2 className="text-center text-3xl font-bold sm:text-4xl">
        Why Choose Torus?
      </h2>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3">
        {features.map((f) => (
          <Card key={f.title} className="p-6">
            <h3 className="mb-2 text-lg font-semibold">{f.title}</h3>
            <p className="text-sm text-muted-foreground">{f.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};
