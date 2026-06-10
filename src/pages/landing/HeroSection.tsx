import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { useBrand } from "@/branding";

export const HeroSection = () => {
  const navigate = useNavigate();
  const { Logo, heroImage, landing } = useBrand();

  return (
    <div
      className="w-screen h-screen relative left-1/2 right-1/2 -mx-[50vw] mb-0 flex items-center justify-center"
      style={{
        backgroundImage: `url("${heroImage}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="flex items-center justify-center gap-4">
          <div className="h-16 w-16 sm:h-20 sm:w-20">
            <Logo />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl drop-shadow-lg">
            {landing.heroTitle}
          </h1>
        </div>
        <Badge
          variant="outline"
          className="mx-auto bg-white/20 backdrop-blur-sm border-white/40 text-white"
        >
          {landing.heroBadge}
        </Badge>
        <p className="mx-auto max-w-2xl text-lg text-white/90 sm:text-xl drop-shadow-md">
          {landing.heroSubtitle}
        </p>
        <Button
          onClick={() => navigate("/login")}
          size="lg"
          className="mt-4 bg-white/20 hover:bg-white/30 border border-white/40 text-white"
        >
          Log in <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
