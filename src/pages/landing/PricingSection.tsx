import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

const pricingTiers = [
  {
    title: "Free",
    description: "Perfect for small teams",
    price: "€0",
    limit: "Up to 50 users",
    features: [
      "Basic pairing algorithm",
      "Single organization",
      "Community support",
    ],
    popular: false,
  },
  {
    title: "Professional",
    description: "For growing organizations",
    price: "€5K - €15K",
    period: "per year",
    features: [
      "Unlimited users",
      "Advanced matching algorithms",
      "Calendar integration",
      "Basic analytics",
      "Email support",
    ],
    popular: true,
  },
  {
    title: "Enterprise",
    description: "For large organizations",
    price: "€25K - €75K",
    period: "per year",
    features: [
      "Everything in Professional",
      "SOC 2 / ISO 27001 compliance",
      "SAML / SSO support",
      "Advanced analytics & dashboards",
      "White-label branding",
      "Dedicated support & SLA",
    ],
    popular: false,
  },
];

export const PricingSection = () => {
  return (
    <div className="mb-12 space-y-8 sm:mb-16 md:mb-20">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-bold sm:text-4xl">
          Simple, Transparent Pricing
        </h2>
        <p className="text-muted-foreground">
          Subscription-based with pay-per-user model. No hidden fees.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3">
        {pricingTiers.map((tier) => (
          <Card
            key={tier.title}
            className={`relative flex flex-col ${tier.popular ? "border-primary shadow-lg" : ""}`}
          >
            {tier.popular && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                Most Popular
              </Badge>
            )}
            <div className="flex-1 space-y-4 p-6">
              <div>
                <h3 className="text-xl font-bold">{tier.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {tier.description}
                </p>
              </div>
              <div>
                <span className="text-3xl font-bold">{tier.price}</span>
                {tier.period && (
                  <span className="text-sm text-muted-foreground">
                    {" "}
                    {tier.period}
                  </span>
                )}
                {tier.limit && (
                  <p className="text-xs text-muted-foreground">{tier.limit}</p>
                )}
              </div>
              <ul className="space-y-2">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </div>
      <p className="text-center text-sm text-muted-foreground">
        All plans include self-hosted deployment and complete data ownership.
      </p>
    </div>
  );
};
