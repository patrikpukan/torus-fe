import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

export const BenefitsSection = () => {
  return (
    <div className="mb-12 space-y-8 sm:mb-16 md:mb-20">
      <h2 className="text-center text-3xl font-bold sm:text-4xl">
        Benefits for Your Organization
      </h2>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
        <Card className="p-8">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center h-14 w-14 rounded-lg bg-green-100 flex-shrink-0">
              <Check className="h-7 w-7 text-green-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Break Down Silos</h3>
              <p className="text-muted-foreground">
                Foster cross-department connections and knowledge sharing across
                your organization
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-8">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center h-14 w-14 rounded-lg bg-green-100 flex-shrink-0">
              <Check className="h-7 w-7 text-green-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">
                Improve Employee Retention
              </h3>
              <p className="text-muted-foreground">
                Meaningful connections increase engagement, loyalty, and job
                satisfaction
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-8">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center h-14 w-14 rounded-lg bg-green-100 flex-shrink-0">
              <Check className="h-7 w-7 text-green-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Measurable Impact</h3>
              <p className="text-muted-foreground">
                Analytics, ratings, and feedback reveal real culture
                improvements
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-8">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center h-14 w-14 rounded-lg bg-green-100 flex-shrink-0">
              <Check className="h-7 w-7 text-green-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Data Privacy Focused</h3>
              <p className="text-muted-foreground">
                Complete control with self-hosted deployment and zero vendor
                lock-in
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
