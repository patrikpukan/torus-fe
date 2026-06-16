import { useCallback, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  MessageSquareHeart,
  UserPlus,
  Wand2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBrand } from "@/branding";
import { cn } from "@/lib/utils";

const steps = [
  {
    icon: UserPlus,
    title: "Employee Profile Setup",
    description:
      "Employees create profiles with their interests, hobbies, and availability. Share what matters to them.",
  },
  {
    icon: Wand2,
    title: "Smart Matching",
    description:
      "Our algorithm matches employees across departments based on interests and availability for meaningful 1:1 meetings.",
  },
  {
    icon: MessageSquareHeart,
    title: "Meeting & Feedback",
    description:
      "Employees meet and provide feedback. Track ratings and insights to measure culture impact.",
  },
];

export const HowItWorksSection = () => {
  const { landing } = useBrand();
  const [index, setIndex] = useState(0);
  const count = steps.length;

  const go = useCallback(
    (next: number) => setIndex(((next % count) + count) % count),
    [count]
  );

  return (
    <div className="mb-12 space-y-10 sm:mb-16 md:mb-20">
      <h2 className="text-center font-heading text-3xl font-bold tracking-tight sm:text-4xl">
        {landing.howItWorksHeading}
      </h2>

      <div className="relative mx-auto max-w-4xl">
        {/* Carousel viewport */}
        <div className="overflow-hidden rounded-3xl border border-border/60 bg-card shadow-elevated-lg">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="grid w-full shrink-0 items-center gap-8 p-8 sm:p-12 md:grid-cols-[auto_1fr]"
                  aria-hidden={i !== index}
                >
                  <div className="flex h-24 w-24 items-center justify-center rounded-3xl gradient-primary text-white shadow-elevated">
                    <Icon className="h-10 w-10" />
                  </div>
                  <div className="space-y-3">
                    <span className="font-heading text-sm font-bold uppercase tracking-widest text-primary">
                      Step {i + 1} of {count}
                    </span>
                    <h3 className="font-heading text-2xl font-bold sm:text-3xl">
                      {step.title}
                    </h3>
                    <p className="text-base text-muted-foreground sm:text-lg">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Controls */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="icon"
            aria-label="Previous step"
            onClick={() => go(index - 1)}
            className="rounded-full"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-2">
            {steps.map((step, i) => (
              <button
                key={step.title}
                type="button"
                aria-label={`Go to step ${i + 1}`}
                aria-current={i === index}
                onClick={() => go(i)}
                className={cn(
                  "h-2.5 rounded-full transition-all",
                  i === index
                    ? "w-8 bg-primary"
                    : "w-2.5 bg-border hover:bg-muted-foreground/40"
                )}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            aria-label="Next step"
            onClick={() => go(index + 1)}
            className="rounded-full"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
