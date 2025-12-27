import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const CTASection = () => {
  const navigate = useNavigate();

  return (
    <Card className="bg-primary p-8 text-primary-foreground sm:p-12">
      <div className="space-y-6 text-center">
        <h2 className="text-3xl font-bold sm:text-4xl">
          Ready to strengthen your workplace culture?
        </h2>
        <p className="mx-auto max-w-2xl text-lg opacity-90">
          Start connecting your employees with meaningful 1:1 meetings today.
        </p>
        <div className="flex flex-col gap-3 justify-center sm:flex-row">
          <Button variant="secondary" onClick={() => navigate("/contact")}>
            Start Free Trial
          </Button>
        </div>
      </div>
    </Card>
  );
};
