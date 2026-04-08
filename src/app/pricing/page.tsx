"use client";

import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { BrokenCubeLogo } from "@/components/BrokenCubeLogo";
import { Check, ArrowRight, HelpCircle } from "lucide-react";
import { useState } from "react";

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  const plans: Record<string, {
    monthly: number;
    annual: number;
    name: string;
    desc: string;
    features: string[];
    cta: string;
    ctaPrimary: boolean;
    popular: boolean;
    badge?: string;
    comingSoon?: boolean;
  }> = {
    free: {
      monthly: 0,
      annual: 0,
      name: "Free",
      desc: "Try ORBI with no commitment.",
      features: ["Chat with ORBI (no app data)", "Connect up to 2 apps", "10 messages per day", "Community support"],
      cta: "Get started free",
      ctaPrimary: false,
      popular: false,
      badge: "No credit card required",
    },
    pro: {
      monthly: 12,
      annual: 99,
      name: "Pro",
      desc: "For professionals who need real insights.",
      features: ["Unlimited chat", "Connect all 9 apps", "Unlimited messages", "Priority support"],
      cta: "Start Pro trial",
      ctaPrimary: true,
      popular: true,
      badge: "14-day free trial",
    },
    team: {
      monthly: 29,
      annual: 290,
      name: "Team",
      desc: "For teams that need shared context.",
      features: ["Everything in Pro", "Shared team workspace", "Admin controls", "SSO & audit logs"],
      cta: "Coming soon",
      ctaPrimary: false,
      popular: false,
      badge: "Coming soon",
      comingSoon: true,
    },
  };

  const faqs = [
    { q: "Can I switch plans later?", a: "Yes. Upgrade or downgrade anytime. Changes apply at the start of your next billing cycle." },
    { q: "What payment methods do you accept?", a: "We accept all major credit cards, debit cards, and PayPal." },
    { q: "Is there a free trial for Pro?", a: "Yes. Start a 14-day free trial—no credit card required. Cancel before it ends and you won't be charged." },
    { q: "What happens when I hit the Free plan limits?", a: "You'll be prompted to upgrade to Pro to unlock more apps and messages. Your existing data stays intact." },
  ];

  return (
    <div className="min-h-screen">
      {/* Header - short contained nav */}
      <header className="sticky top-0 z-50 px-4 pt-4 pb-2">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--background)]/70 px-6 backdrop-blur-md">
          <BrokenCubeLogo href="/" size="md" />
          <nav className="hidden gap-8 md:flex">
            <a href="/#features" className="text-sm font-medium text-[var(--foreground)]/70 transition hover:text-[var(--foreground)]">
              Features
            </a>
            <a href="/#use-cases" className="text-sm font-medium text-[var(--foreground)]/70 transition hover:text-[var(--foreground)]">
              Use cases
            </a>
            <Link href="/chat" className="text-sm font-medium text-[var(--foreground)]/70 transition hover:text-[var(--foreground)]">
              Chat
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-[var(--accent)]">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <SignedOut>
              <Link href="/sign-in" className="rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-medium transition hover:bg-[var(--muted)]/50">
                Sign in
              </Link>
              <Link href="/sign-up" className="rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-[var(--accent-foreground)] transition hover:opacity-90">
                Get started
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/chat" className="rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-medium transition hover:bg-[var(--muted)]/50">
                Open Chat
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-[var(--foreground)] md:text-5xl">
            Simple, transparent pricing
          </h1>
          <p className="mt-4 text-lg text-[var(--foreground)]/70">
            Start free. Upgrade when you need more.
          </p>
          {/* Billing toggle */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <span className={`text-sm font-medium transition-colors ${!annual ? "text-[var(--foreground)]" : "text-[var(--muted-foreground)]"}`}>
              Monthly
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={annual}
              onClick={() => setAnnual(!annual)}
              className="relative h-7 w-12 rounded-full transition-colors"
              style={{ backgroundColor: annual ? "var(--accent)" : "var(--muted)" }}
            >
              <span
                className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200"
                style={{ transform: annual ? "translateX(1.5rem)" : "translateX(0)" }}
              />
            </button>
            <span className={`text-sm font-medium transition-colors ${annual ? "text-[var(--foreground)]" : "text-[var(--muted-foreground)]"}`}>
              Annual
            </span>
            <span className="rounded-full bg-[var(--accent)]/15 px-2.5 py-0.5 text-xs font-medium text-[var(--accent)]">
              Save 17%
            </span>
          </div>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-6 md:gap-8 lg:grid-cols-3">
          {(["free", "pro", "team"] as const).map((key) => {
            const plan = plans[key];
            const price = annual ? plan.annual : plan.monthly;
            const isPro = key === "pro";
            return (
              <div
                key={key}
                className={`relative flex flex-col rounded-2xl border-2 bg-[var(--card)] p-6 shadow-sm transition-all md:p-8 ${
                  isPro
                    ? "border-[var(--accent)] shadow-lg md:-mt-2 md:mb-2 md:scale-[1.02]"
                    : "border-[var(--border)] hover:border-[var(--border)]/80"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-medium text-[var(--accent-foreground)]">
                      Most popular
                    </span>
                  </div>
                )}
                <h2 className="font-serif text-xl font-semibold text-[var(--foreground)]">{plan.name}</h2>
                {plan.badge && (
                  <p className={`mt-1 text-xs font-medium ${plan.comingSoon ? "text-[var(--muted-foreground)]" : "text-[var(--accent)]"}`}>
                    {plan.badge}
                  </p>
                )}
                <div className="mt-4 flex flex-wrap items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight text-[var(--foreground)]">
                    ${price}
                  </span>
                  <span className="text-[var(--muted-foreground)]">
                    /{price === 0 ? "month" : annual ? "year" : key === "team" ? "user/mo" : "month"}
                  </span>
                  {annual && plan.monthly > 0 && (
                    <span className="ml-1 text-xs text-[var(--muted-foreground)]">
                      (${Math.round(plan.annual / 12)}/mo)
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-[var(--foreground)]/70">{plan.desc}</p>
                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                {plan.comingSoon ? (
                  <span className="mt-8 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-full border border-[var(--border)] py-3.5 font-medium text-[var(--muted-foreground)]">
                    Coming soon
                  </span>
                ) : (
                  <Link
                    href={key === "team" ? "mailto:sales@orbi.app" : "/sign-up"}
                    className={`mt-8 flex w-full items-center justify-center gap-2 rounded-full py-3.5 font-medium transition ${
                      plan.ctaPrimary
                        ? "bg-[var(--accent)] text-[var(--accent-foreground)] hover:opacity-90"
                        : "border border-[var(--border)] hover:bg-[var(--muted)]/50"
                    }`}
                  >
                    {plan.cta}
                    {plan.ctaPrimary && <ArrowRight className="h-4 w-4" />}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gradient-to-b from-transparent via-[var(--card)]/20 to-[var(--card)]/35 py-16 backdrop-blur-sm">
        <div className="mx-auto max-w-3xl px-6">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-[var(--accent)]" />
            <h2 className="font-serif text-2xl font-semibold text-[var(--foreground)]">
              Frequently asked questions
            </h2>
          </div>
          <dl className="mt-8 space-y-6">
            {faqs.map(({ q, a }) => (
              <div key={q}>
                <dt className="font-medium text-[var(--foreground)]">{q}</dt>
                <dd className="mt-2 text-sm text-[var(--foreground)]/70">{a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-[var(--card)]/25 to-[var(--background)]/60 py-8 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <BrokenCubeLogo href="/" size="sm" />
          <div className="flex gap-6 text-sm text-[var(--muted-foreground)]">
            <Link href="/" className="transition hover:text-[var(--foreground)]">
              Home
            </Link>
            <Link href="/chat" className="transition hover:text-[var(--foreground)]">
              Chat
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
