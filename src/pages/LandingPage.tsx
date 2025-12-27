import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Separator } from "@/components/ui/separator";
import { HeroSection } from "./landing/HeroSection";
import { FeaturesSection } from "./landing/FeaturesSection";
import { HowItWorksSection } from "./landing/HowItWorksSection";
import { BenefitsSection } from "./landing/BenefitsSection";
import { PricingSection } from "./landing/PricingSection";
import { CTASection } from "./landing/CTASection";

const LandingPage = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate("/home");
    }
  }, [user, loading, navigate]);

  if (loading || user) return null;

  return (
    <div className="bg-gradient-to-b from-background to-muted">
      <HeroSection />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12 md:py-16">
        <FeaturesSection />
        <Separator className="my-12 sm:my-16" />
        <HowItWorksSection />
        <Separator className="my-12 sm:my-16" />
        <BenefitsSection />
        <Separator className="my-12 sm:my-16" />
        <PricingSection />
        <Separator className="my-12 sm:my-16" />
        <CTASection />
      </div>
    </div>
  );
};

export default LandingPage;
