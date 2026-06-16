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
    <div className="mb-12 sm:mb-16 md:mb-20">
      <div className="grid items-start gap-10 rounded-3xl border border-border/60 bg-muted/30 p-8 sm:p-12 lg:grid-cols-[0.8fr_1fr] lg:gap-16">
        {/* Intro column */}
        <div className="space-y-4 lg:sticky lg:top-24">
          <span className="font-heading text-sm font-bold uppercase tracking-widest text-primary">
            Why Torus
          </span>
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Benefits for Your Organization
          </h2>
          <p className="text-muted-foreground">
            More than a scheduling tool — Torus turns everyday introductions
            into measurable culture change.
          </p>
        </div>

        {/* Checklist column */}
        <ul className="divide-y divide-border/60">
          {benefits.map((b) => (
            <li
              key={b.title}
              className="flex items-start gap-4 py-5 first:pt-0"
            >
              <span className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check className="h-4 w-4" strokeWidth={3} />
              </span>
              <div className="space-y-1">
                <h3 className="font-heading text-lg font-bold">{b.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {b.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
