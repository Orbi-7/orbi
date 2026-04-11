import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { BrokenCubeLogo } from "@/components/BrokenCubeLogo";
import { CubeStackGame } from "@/components/CubeStackGame";
import { AnimateSection } from "@/components/AnimateSection";
import { APPS } from "@/lib/apps";
import { MessageSquare, Zap, Shield, ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header - short contained nav */}
      <header className="sticky top-0 z-50 px-4 pt-4 pb-2">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--background)]/70 px-6 backdrop-blur-md">
          <BrokenCubeLogo href="/" size="md" />
          <nav className="hidden gap-8 md:flex">
            <a href="#features" className="text-sm font-medium text-[var(--foreground)]/70 transition hover:text-[var(--foreground)]">
              Features
            </a>
            <a href="#use-cases" className="text-sm font-medium text-[var(--foreground)]/70 transition hover:text-[var(--foreground)]">
              Use cases
            </a>
            <Link href="/chat" className="text-sm font-medium text-[var(--foreground)]/70 transition hover:text-[var(--foreground)]">
              Chat
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-[var(--foreground)]/70 transition hover:text-[var(--foreground)]">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <SignedOut>
              <Link
                href="/sign-in"
                className="rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-medium transition hover:bg-[var(--muted)]/50"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-[var(--accent-foreground)] transition hover:opacity-90"
              >
                Get started
              </Link>
            </SignedOut>
            <SignedIn>
              <Link
                href="/chat"
                className="rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-medium transition hover:bg-[var(--muted)]/50"
              >
                Open Chat
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="mx-auto max-w-3xl rounded-3xl border border-[var(--border)]/50 bg-[var(--card)]/40 p-8 shadow-xl shadow-black/5 backdrop-blur-sm md:p-12">
          <h1 className="font-serif text-center text-4xl font-semibold tracking-tight text-[var(--foreground)] drop-shadow-sm md:text-5xl lg:text-6xl">
            AI insights from your{" "}
            <span className="text-[var(--accent)]">productivity apps</span>
          </h1>
          <p className="mt-6 text-center text-lg text-[var(--foreground)]/70 md:text-xl">
            Connect calendar, email, Slack, Jira, and more. Ask in plain
            language—ORBI fetches the data and answers.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-8 py-4 font-medium text-[var(--accent-foreground)] shadow-lg shadow-[var(--accent)]/20 transition hover:opacity-90"
            >
              Get started free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--background)]/60 px-8 py-4 font-medium backdrop-blur-sm transition hover:bg-[var(--muted)]/50"
            >
              <MessageSquare className="h-4 w-4" />
              Try Chat
            </Link>
          </div>
          <p className="mt-4 text-center text-sm text-[var(--muted-foreground)]">
            No credit card required · Connect apps in minutes
          </p>
        </div>
        <div className="mt-16 rounded-2xl border border-[var(--border)]/50 bg-[var(--card)]/30 p-6 shadow-lg shadow-black/5 backdrop-blur-sm">
          <CubeStackGame />
        </div>
      </section>

      {/* Features */}
      <AnimateSection>
      <section id="features" className="border-t border-[var(--border)]/70 bg-gradient-to-b from-[var(--card)]/20 to-[var(--card)]/40 py-20 scroll-mt-20 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="font-serif text-2xl font-semibold tracking-tight text-[var(--foreground)] md:text-3xl">
            Why ORBI
          </h2>
          <p className="mt-2 text-[var(--foreground)]/70">
            One assistant, all your tools.
          </p>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-[var(--border)]/70 bg-[var(--card)]/60 p-6 shadow-md shadow-black/5 backdrop-blur-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent)]/15 text-[var(--accent)]">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-semibold text-[var(--foreground)]">
                Natural language
              </h3>
              <p className="mt-2 text-sm text-[var(--foreground)]/70">
                Ask &quot;What&apos;s on my calendar?&quot; or &quot;Summarize
                my emails.&quot; No filters or menus.
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--border)]/70 bg-[var(--card)]/60 p-6 shadow-md shadow-black/5 backdrop-blur-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent)]/15 text-[var(--accent)]">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-semibold text-[var(--foreground)]">
                Real data, real answers
              </h3>
              <p className="mt-2 text-sm text-[var(--foreground)]/70">
                ORBI fetches from your connected apps and returns actionable
                insights—not placeholders.
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--border)]/70 bg-[var(--card)]/60 p-6 shadow-md shadow-black/5 backdrop-blur-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent)]/15 text-[var(--accent)]">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-semibold text-[var(--foreground)]">
                Your data stays yours
              </h3>
              <p className="mt-2 text-sm text-[var(--foreground)]/70">
                Connect only what you need. OAuth-based; you can disconnect
                anytime.
              </p>
            </div>
          </div>
        </div>
      </section>
      </AnimateSection>

      {/* Use cases */}
      <AnimateSection delay={100}>
      <section id="use-cases" className="border-t border-[var(--border)]/70 bg-gradient-to-b from-[var(--card)]/20 to-[var(--card)]/35 py-20 scroll-mt-20 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="font-serif text-2xl font-semibold tracking-tight text-[var(--foreground)] md:text-3xl">
            What you can do
          </h2>
          <p className="mt-2 text-[var(--foreground)]/70">
            Sign in, connect your apps, then ask in plain language.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-[var(--border)]/70 bg-[var(--card)]/60 p-6 shadow-md shadow-black/5 backdrop-blur-sm">
              <p className="font-medium text-[var(--foreground)]">
                &quot;What&apos;s on my calendar today?&quot;
              </p>
              <p className="mt-2 text-sm text-[var(--foreground)]/70">
                Get a quick overview of meetings and events from Google Calendar.
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--border)]/70 bg-[var(--card)]/60 p-6 shadow-md shadow-black/5 backdrop-blur-sm">
              <p className="font-medium text-[var(--foreground)]">
                &quot;Summarize my unread emails&quot;
              </p>
              <p className="mt-2 text-sm text-[var(--foreground)]/70">
                Let ORBI scan Gmail and surface what needs your attention.
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--border)]/70 bg-[var(--card)]/60 p-6 shadow-md shadow-black/5 backdrop-blur-sm">
              <p className="font-medium text-[var(--foreground)]">
                &quot;What are my open Jira issues?&quot;
              </p>
              <p className="mt-2 text-sm text-[var(--foreground)]/70">
                Pull tasks and sprints from Jira without leaving chat.
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--border)]/70 bg-[var(--card)]/60 p-6 shadow-md shadow-black/5 backdrop-blur-sm">
              <p className="font-medium text-[var(--foreground)]">
                &quot;Check my Slack DMs from this week&quot;
              </p>
              <p className="mt-2 text-sm text-[var(--foreground)]/70">
                Search channels and direct messages for what you missed.
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--border)]/70 bg-[var(--card)]/60 p-6 shadow-md shadow-black/5 backdrop-blur-sm">
              <p className="font-medium text-[var(--foreground)]">
                &quot;List my GitHub PRs in review&quot;
              </p>
              <p className="mt-2 text-sm text-[var(--foreground)]/70">
                Track pull requests and code reviews across your repos.
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--border)]/70 bg-[var(--card)]/60 p-6 shadow-md shadow-black/5 backdrop-blur-sm">
              <p className="font-medium text-[var(--foreground)]">
                &quot;What tasks are due in Notion?&quot;
              </p>
              <p className="mt-2 text-sm text-[var(--foreground)]/70">
                Surface deadlines and to-dos from your Notion workspace.
              </p>
            </div>
          </div>
        </div>
      </section>
      </AnimateSection>

      {/* Integrations */}
      <AnimateSection delay={150}>
      <section id="integrations" className="py-20 scroll-mt-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="font-serif text-2xl font-semibold tracking-tight text-[var(--foreground)] md:text-3xl">
            Connect your apps
          </h2>
          <p className="mt-2 text-[var(--foreground)]/70">
            Sign in to connect. One-time setup, then use in chat instantly.
          </p>
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {APPS.map((app) => (
              <Link
                key={app.id}
                href="/sign-in?redirect_url=/connectors"
                className="flex flex-col items-center gap-3 rounded-2xl border border-[var(--border)]/70 bg-[var(--card)]/60 p-6 shadow-md shadow-black/5 backdrop-blur-sm transition hover:border-[var(--accent)]/50 hover:shadow-lg"
              >
                <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-[var(--muted)] p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={app.logo}
                    alt={app.name}
                    className="h-full w-full object-contain"
                  />
                </div>
                <span className="text-center text-sm font-medium text-[var(--foreground)]/80">
                  {app.name}
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/sign-in?redirect_url=/connectors"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-6 py-3 font-medium transition hover:bg-[var(--muted)]/50"
            >
              Sign in to connect apps
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
      </AnimateSection>

      {/* CTA */}
      <AnimateSection delay={200}>
      <section className="bg-gradient-to-b from-transparent via-[var(--card)]/20 to-[var(--card)]/40 py-20 backdrop-blur-sm">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="font-serif text-2xl font-semibold tracking-tight text-[var(--foreground)] md:text-3xl">
            Ready to get insights?
          </h2>
          <p className="mt-4 text-[var(--foreground)]/70">
            Sign up, connect your apps, and start asking.
          </p>
          <SignedOut>
            <Link
              href="/sign-up"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-8 py-4 font-medium text-[var(--accent-foreground)] transition hover:opacity-90"
            >
              Get started free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </SignedOut>
          <SignedIn>
            <Link
              href="/chat"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-8 py-4 font-medium text-[var(--accent-foreground)] transition hover:opacity-90"
            >
              Open Chat
              <ArrowRight className="h-4 w-4" />
            </Link>
          </SignedIn>
        </div>
      </section>
      </AnimateSection>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-[var(--card)]/30 via-[var(--card)]/25 to-[var(--background)]/60 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <BrokenCubeLogo href="/" size="sm" />
              <p className="mt-4 max-w-sm text-sm text-[var(--foreground)]/70">
                AI insights from your productivity apps. Connect calendar,
                email, Slack, and more—ask in plain language.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[var(--foreground)]">
                Product
              </h4>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link href="/chat" className="text-sm text-[var(--muted-foreground)] transition hover:text-[var(--foreground)]">
                    Chat
                  </Link>
                </li>
                <li>
                  <Link href="/sign-up" className="text-sm text-[var(--muted-foreground)] transition hover:text-[var(--foreground)]">
                    Get started
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[var(--foreground)]">
                Company
              </h4>
              <ul className="mt-4 space-y-3">
                <li>
                  <a href="#features" className="text-sm text-[var(--muted-foreground)] transition hover:text-[var(--foreground)]">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#use-cases" className="text-sm text-[var(--muted-foreground)] transition hover:text-[var(--foreground)]">
                    Use cases
                  </a>
                </li>
                <li>
                  <a href="#integrations" className="text-sm text-[var(--muted-foreground)] transition hover:text-[var(--foreground)]">
                    Integrations
                  </a>
                </li>
                <li>
                  <Link href="/pricing" className="text-sm text-[var(--muted-foreground)] transition hover:text-[var(--foreground)]">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/sign-in" className="text-sm text-[var(--muted-foreground)] transition hover:text-[var(--foreground)]">
                    Sign in
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[var(--border)] pt-8 sm:flex-row">
            <p className="text-sm text-[var(--muted-foreground)]">
              © {new Date().getFullYear()} ORBI. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-[var(--muted-foreground)]">
              <Link href="/chat" className="transition hover:text-[var(--foreground)]">
                Chat
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
