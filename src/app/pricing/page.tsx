"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Check, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

const plans = [
  {
    key: "FREE" as const,
    name: "Free",
    price: "$0",
    period: "",
    description: "Get started with basic QR codes",
    features: [
      { name: "5 QR codes per day", included: true },
      { name: "Basic color customization", included: true },
      { name: "PNG download", included: true },
      { name: "URL & text QR types", included: true },
      { name: "AI artistic styles", included: false },
      { name: "Logo overlay", included: false },
      { name: "SVG & PDF export", included: false },
      { name: "Scan analytics", included: false },
      { name: "API access", included: false },
      { name: "Bulk generation", included: false },
    ],
    cta: "Get Started",
    highlighted: false,
    priceId: null,
  },
  {
    key: "PRO" as const,
    name: "Pro",
    price: "$9",
    period: "/mo",
    description: "Unlimited QR codes with AI styles",
    features: [
      { name: "Unlimited QR codes", included: true },
      { name: "Full color & shape customization", included: true },
      { name: "PNG, SVG & PDF download", included: true },
      { name: "All QR types", included: true },
      { name: "AI artistic styles", included: true },
      { name: "Logo overlay", included: true },
      { name: "SVG & PDF export", included: true },
      { name: "Scan analytics", included: true },
      { name: "API access", included: false },
      { name: "Bulk generation", included: false },
    ],
    cta: "Upgrade to Pro",
    highlighted: true,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || null,
  },
  {
    key: "BUSINESS" as const,
    name: "Business",
    price: "$29",
    period: "/mo",
    description: "Everything for teams & enterprises",
    features: [
      { name: "Unlimited QR codes", included: true },
      { name: "Full color & shape customization", included: true },
      { name: "PNG, SVG & PDF download", included: true },
      { name: "All QR types", included: true },
      { name: "AI artistic styles", included: true },
      { name: "Logo overlay", included: true },
      { name: "SVG & PDF export", included: true },
      { name: "Scan analytics", included: true },
      { name: "API access", included: true },
      { name: "Bulk generation", included: true },
    ],
    cta: "Upgrade to Business",
    highlighted: false,
    priceId: process.env.NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID || null,
  },
];

export default function PricingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  async function handleUpgrade(plan: (typeof plans)[number]) {
    if (plan.key === "FREE") {
      router.push("/auth/signup");
      return;
    }

    if (!session) {
      router.push("/auth/signin");
      return;
    }

    if (!plan.priceId) {
      toast.error("This plan is not yet available for purchase. Please contact support.");
      return;
    }

    setLoadingPlan(plan.key);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: plan.priceId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error || "Failed to start checkout");
      }
    } catch {
      toast.error("Failed to start checkout");
    } finally {
      setLoadingPlan(null);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Simple, transparent pricing
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Start free. Upgrade when you need more power. No hidden fees.
        </p>
      </div>

      <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.key}
            className={`relative flex flex-col rounded-2xl border p-8 ${
              plan.highlighted
                ? "border-blue-500 bg-card shadow-xl shadow-blue-500/10"
                : "bg-card"
            }`}
          >
            {plan.highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-1 text-xs font-semibold text-white">
                  Most Popular
                </span>
              </div>
            )}
            <div>
              <h3 className="text-xl font-semibold">{plan.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
              <div className="mt-6">
                <span className="text-5xl font-bold">{plan.price}</span>
                {plan.period && (
                  <span className="text-lg text-muted-foreground">{plan.period}</span>
                )}
              </div>
            </div>

            <ul className="mt-8 flex-1 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature.name} className="flex items-center gap-3 text-sm">
                  {feature.included ? (
                    <Check className="h-4 w-4 shrink-0 text-blue-500" />
                  ) : (
                    <X className="h-4 w-4 shrink-0 text-muted-foreground/40" />
                  )}
                  <span className={feature.included ? "" : "text-muted-foreground/60"}>
                    {feature.name}
                  </span>
                </li>
              ))}
            </ul>

            <Button
              className={`mt-8 w-full ${
                plan.highlighted
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
                  : ""
              }`}
              variant={plan.highlighted ? "default" : "outline"}
              size="lg"
              onClick={() => handleUpgrade(plan)}
              disabled={loadingPlan === plan.key}
            >
              {loadingPlan === plan.key ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                plan.cta
              )}
            </Button>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="mx-auto mt-24 max-w-3xl">
        <h2 className="text-center text-2xl font-bold">Frequently Asked Questions</h2>
        <div className="mt-8 space-y-6">
          {[
            {
              q: "Can I try QRForge for free?",
              a: "Yes! The Free plan lets you create up to 5 QR codes per day with basic customization. No credit card required.",
            },
            {
              q: "What payment methods do you accept?",
              a: "We accept all major credit and debit cards through Stripe, including Visa, Mastercard, and American Express.",
            },
            {
              q: "Can I cancel my subscription anytime?",
              a: "Absolutely. You can cancel your subscription at any time from your dashboard. You'll continue to have access until the end of your billing period.",
            },
            {
              q: "What are AI artistic styles?",
              a: "AI styles transform your QR codes into beautiful artwork using AI-generated designs. Choose from styles like galaxy, ocean, neon, watercolor, and more.",
            },
            {
              q: "Do the QR codes expire?",
              a: "No. QR codes generated with QRForge never expire. They'll work as long as the destination URL is active.",
            },
          ].map((faq) => (
            <div key={faq.q} className="rounded-xl border bg-card p-6">
              <h3 className="font-medium">{faq.q}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-16 text-center">
        <p className="text-muted-foreground">
          Ready to get started?{" "}
          <Link href="/generator" className="font-medium text-blue-500 hover:text-blue-600">
            Create your first QR code free
          </Link>
        </p>
      </div>
    </div>
  );
}
