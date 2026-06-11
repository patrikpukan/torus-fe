import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { useBrand } from "@/branding";

export const HeroSection = () => {
  const navigate = useNavigate();
  const { Logo, productName, heroImage, landing } = useBrand();

  return (
    <div
      className="relative min-h-screen w-screen left-1/2 right-1/2 -mx-[50vw] flex flex-col"
      style={{
        backgroundImage: `url("${heroImage}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Gradient overlay for depth + legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-black/65" />

      {/* Top nav */}
      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-5 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8">
            <Logo />
          </div>
          <span className="font-heading text-lg font-bold text-white">
            {productName}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={() => navigate("/login")}
            className="text-white hover:bg-white/10 hover:text-white"
          >
            Log in
          </Button>
          <Button
            onClick={() => navigate("/register")}
            className="bg-white text-gray-900 hover:bg-white/90"
          >
            Get started
          </Button>
        </div>
      </header>

      {/* Hero content */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-4">
        <div className="flex max-w-3xl flex-col items-center gap-6 pb-16 text-center">
          <Badge
            variant="outline"
            className="border-white/40 bg-white/15 text-white backdrop-blur-sm"
          >
            {landing.heroBadge}
          </Badge>
          <h1 className="font-heading text-4xl font-bold leading-[1.05] tracking-tight text-white drop-shadow-sm sm:text-6xl md:text-7xl">
            {landing.heroTitle}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-white/90 sm:text-xl">
            {landing.heroSubtitle}
          </p>
          <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row">
            <Button
              size="lg"
              onClick={() => navigate("/register")}
              className="bg-white text-gray-900 hover:bg-white/90"
            >
              Get started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/login")}
              className="border-white/40 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
            >
              Log in
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
