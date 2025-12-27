import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const ContactHeader = () => {
  return (
    <div className="text-center space-y-2 mb-6">
      <h1 className="text-3xl font-bold">Contact Sales</h1>
      <p className="text-muted-foreground">
        Tell us about your organization and we'll be in touch
      </p>
    </div>
  );
};

export const ContactFooter = () => {
  const navigate = useNavigate();

  return (
    <div className="mt-4 space-y-2">
      <Button onClick={() => navigate("/")} variant="ghost" className="w-full">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        We typically respond within 2 business days.
      </p>
    </div>
  );
};
