import { Card } from "@/components/ui/card";
import { useBrand } from "@/branding";

const steps = [
  {
    title: "Employee Profile Setup",
    description:
      "Employees create profiles with their interests, hobbies, and availability. Share what matters to them.",
  },
  {
    title: "Smart Matching",
    description:
      "Our algorithm matches employees across departments based on interests and availability for meaningful 1:1 meetings.",
  },
  {
    title: "Meeting & Feedback",
    description:
      "Employees meet and provide feedback. Track ratings and insights to measure culture impact.",
  },
];

export const HowItWorksSection = () => {
  const { landing } = useBrand();

  return (
    <div className="mb-12 space-y-10 sm:mb-16 md:mb-20">
      <h2 className="text-center font-heading text-3xl font-bold tracking-tight sm:text-4xl">
        {landing.howItWorksHeading}
      </h2>
      <div className="grid gap-6 md:grid-cols-3">
        {steps.map((step, i) => (
          <Card
            key={step.title}
            className="border-0 p-6 shadow-elevated transition hover:shadow-elevated-lg"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <span className="font-heading text-xl font-bold text-primary">
                {i + 1}
              </span>
            </div>
            <h3 className="mb-2 font-heading text-lg font-bold">{step.title}</h3>
            <p className="text-sm text-muted-foreground">{step.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};
