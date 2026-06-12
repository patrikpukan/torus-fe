import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const CTASection = () => {
  const navigate = useNavigate();

  return (
    <Card className="gradient-primary border-0 p-8 text-white shadow-elevated-lg sm:p-12">
      <div className="space-y-6 text-center">
        <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Ready to strengthen your workplace culture?
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-white/90">
          Start connecting your employees with meaningful 1:1 meetings today.
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button
            size="lg"
            onClick={() => navigate("/contact")}
            className="bg-white text-gray-900 hover:bg-white/90"
          >
            Start Free Trial
          </Button>
        </div>
      </div>
    </Card>
  );
};
