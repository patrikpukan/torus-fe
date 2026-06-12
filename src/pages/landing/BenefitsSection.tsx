import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

const benefits = [
  {
    title: "Break Down Silos",
    description:
      "Foster cross-department connections and knowledge sharing across your organization.",
  },
  {
    title: "Improve Employee Retention",
    description:
      "Meaningful connections increase engagement, loyalty, and job satisfaction.",
  },
  {
    title: "Measurable Impact",
    description:
      "Analytics, ratings, and feedback reveal real culture improvements.",
  },
  {
    title: "Data Privacy Focused",
    description:
      "Complete control with self-hosted deployment and zero vendor lock-in.",
  },
];

export const BenefitsSection = () => {
  return (
    <div className="mb-12 space-y-10 sm:mb-16 md:mb-20">
      <h2 className="text-center font-heading text-3xl font-bold tracking-tight sm:text-4xl">
        Benefits for Your Organization
      </h2>
      <div className="grid gap-6 md:grid-cols-2">
        {benefits.map((b) => (
          <Card
            key={b.title}
            className="border-0 p-8 shadow-elevated transition hover:shadow-elevated-lg"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Check className="h-6 w-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-heading text-lg font-bold">{b.title}</h3>
                <p className="text-muted-foreground">{b.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
