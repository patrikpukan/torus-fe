import { Card } from "@/components/ui/card";

export const HowItWorksSection = () => {
  return (
    <div className="mb-12 space-y-8 sm:mb-16 md:mb-20">
      <h2 className="text-center text-3xl font-bold sm:text-4xl">
        How Torus Works
      </h2>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3">
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10">
            <span className="text-xl font-bold text-primary">1</span>
          </div>
          <h3 className="mb-2 text-lg font-semibold">Employee Profile Setup</h3>
          <p className="text-sm text-muted-foreground">
            Employees create profiles with their interests, hobbies, and
            availability. Share what matters to them.
          </p>
        </Card>
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10">
            <span className="text-xl font-bold text-primary">2</span>
          </div>
          <h3 className="mb-2 text-lg font-semibold">Smart Matching</h3>
          <p className="text-sm text-muted-foreground">
            Our algorithm matches employees across departments based on
            interests and availability for meaningful 1:1 meetings.
          </p>
        </Card>
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10">
            <span className="text-xl font-bold text-primary">3</span>
          </div>
          <h3 className="mb-2 text-lg font-semibold">Meeting & Feedback</h3>
          <p className="text-sm text-muted-foreground">
            Employees meet and provide feedback. Track ratings and insights to
            measure culture impact.
          </p>
        </Card>
      </div>
    </div>
  );
};
