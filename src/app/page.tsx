import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  QrCode,
  Palette,
  BarChart3,
  Download,
  Sparkles,
  Zap,
  Shield,
  Globe,
  ArrowRight,
  Check,
} from "lucide-react";

const features = [
  {
    icon: QrCode,
    title: "Multiple QR Types",
    description: "URL, WiFi, vCard, email, phone, SMS — generate any type of QR code instantly.",
  },
  {
    icon: Palette,
    title: "Full Customization",
    description: "Custom colors, shapes, gradients, and logo overlays to match your brand.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Art",
    description: "Transform QR codes into stunning artwork with AI-generated artistic styles.",
  },
  {
    icon: BarChart3,
    title: "Scan Analytics",
    description: "Track scans in real-time with device, location, and time-based insights.",
  },
  {
    icon: Download,
    title: "Multiple Formats",
    description: "Download as PNG, SVG, or PDF. Perfect for print, web, or any medium.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Generate QR codes in milliseconds. No waiting, no loading screens.",
  },
];

const stats = [
  { value: "10M+", label: "QR Codes Generated" },
  { value: "99.9%", label: "Scan Success Rate" },
  { value: "150+", label: "Countries Served" },
  { value: "50K+", label: "Happy Users" },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent" />
        <div className="mx-auto max-w-7xl px-4 pb-24 pt-20 sm:px-6 sm:pb-32 sm:pt-28 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/80 px-4 py-1.5 text-sm backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-purple-500" />
              <span>Now with AI-powered artistic QR codes</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Forge stunning QR codes{" "}
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                with AI
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">
              Create beautiful, fully customizable QR codes in seconds. Add your brand colors,
              logos, and even AI-generated art. Track every scan with powerful analytics.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/generator">
                <Button
                  size="lg"
                  className="h-12 bg-gradient-to-r from-blue-500 to-purple-600 px-8 text-base text-white hover:from-blue-600 hover:to-purple-700"
                >
                  Create QR Code Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>

          {/* QR Preview Mockup */}
          <div className="mx-auto mt-16 flex max-w-lg items-center justify-center">
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-blue-500/20 to-purple-600/20 blur-2xl" />
              <div className="relative grid grid-cols-3 gap-4 rounded-2xl border bg-card p-6 shadow-2xl">
                {[
                  "from-blue-500 to-cyan-400",
                  "from-purple-500 to-pink-400",
                  "from-green-500 to-emerald-400",
                  "from-orange-500 to-red-400",
                  "from-indigo-500 to-violet-400",
                  "from-rose-500 to-amber-400",
                ].map((gradient, i) => (
                  <div
                    key={i}
                    className={`flex h-24 w-24 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} sm:h-28 sm:w-28`}
                  >
                    <QrCode className="h-12 w-12 text-white/90 sm:h-14 sm:w-14" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need for QR codes
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              From simple URLs to AI-powered art, QRForge has you covered.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border bg-card p-6 transition-all hover:border-blue-500/50 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-600/10">
                  <feature.icon className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="border-t bg-muted/30 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Start free. Upgrade when you need more power.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                name: "Free",
                price: "$0",
                description: "Get started with basic QR codes",
                features: ["5 QR codes per day", "Basic customization", "PNG download", "URL & text QR types"],
                cta: "Get Started",
                href: "/auth/signup",
                highlighted: false,
              },
              {
                name: "Pro",
                price: "$9",
                period: "/mo",
                description: "Unlimited QR codes with AI styles",
                features: [
                  "Unlimited QR codes",
                  "AI artistic styles",
                  "Logo overlay",
                  "SVG & PDF export",
                  "Scan analytics",
                  "All QR types",
                ],
                cta: "Start Pro Trial",
                href: "/auth/signup",
                highlighted: true,
              },
              {
                name: "Business",
                price: "$29",
                period: "/mo",
                description: "Everything for teams & enterprises",
                features: [
                  "Everything in Pro",
                  "API access",
                  "Bulk generation",
                  "Team accounts",
                  "Custom domains",
                  "Priority support",
                ],
                cta: "Start Business Trial",
                href: "/auth/signup",
                highlighted: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border p-8 ${
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
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className="text-muted-foreground">{plan.period}</span>
                  )}
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-blue-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href} className="mt-8 block">
                  <Button
                    className={`w-full ${
                      plan.highlighted
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
                        : ""
                    }`}
                    variant={plan.highlighted ? "default" : "outline"}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground">
              Compare all features <ArrowRight className="ml-1 inline h-3 w-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="flex justify-center gap-8">
              <div className="flex flex-col items-center gap-2">
                <Shield className="h-8 w-8 text-blue-500" />
                <p className="text-sm font-medium">Enterprise Security</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Globe className="h-8 w-8 text-blue-500" />
                <p className="text-sm font-medium">99.9% Uptime</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Zap className="h-8 w-8 text-blue-500" />
                <p className="text-sm font-medium">Lightning Fast</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to forge your first QR code?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join thousands of creators and businesses using QRForge.
            </p>
            <div className="mt-8">
              <Link href="/generator">
                <Button
                  size="lg"
                  className="h-12 bg-gradient-to-r from-blue-500 to-purple-600 px-8 text-base text-white hover:from-blue-600 hover:to-purple-700"
                >
                  Create QR Code Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
