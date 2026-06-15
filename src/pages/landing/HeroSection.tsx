import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { useBrand } from "@/branding";
import { InteractiveDemo } from "./InteractiveDemo";

export const HeroSection = () => {
  const navigate = useNavigate();
  const { Logo, productName, landing } = useBrand();

  return (
    <div className="bg-atmosphere relative w-screen left-1/2 right-1/2 -mx-[50vw] flex flex-col overflow-hidden">
      {/* Soft brand glow behind the demo */}
      <div className="pointer-events-none absolute -right-40 top-0 h-[480px] w-[480px] rounded-full bg-primary/15 blur-3xl" />

      {/* Top nav */}
      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-5 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8">
            <Logo />
          </div>
          <span className="font-heading text-lg font-bold">{productName}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => navigate("/login")}>
            Log in
          </Button>
          <Button onClick={() => navigate("/contact")}>Let&apos;s talk</Button>
        </div>
      </header>

      {/* Hero content: copy + interactive demo */}
      <div className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:py-20">
        <div className="flex flex-col items-start gap-6">
          <Badge
            variant="outline"
            className="border-primary/30 bg-primary/10 text-primary"
          >
            {landing.heroBadge}
          </Badge>
          <h1 className="font-heading text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl">
            {landing.heroSubtitle}
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            {productName} pairs colleagues for meaningful 1:1s — try the live
            demo on the right, then let&apos;s talk about your team.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" onClick={() => navigate("/contact")}>
              Let&apos;s talk <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/login")}
            >
              Log in
            </Button>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <InteractiveDemo />
        </div>
      </div>
    </div>
  );
};
