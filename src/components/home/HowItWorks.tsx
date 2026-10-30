
import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  Check,
  Search,
  Sparkles,
  Zap,
} from "lucide-react";

type Step = {
  number: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
};

const steps: Step[] = [
  {
    number: "01",
    title: "Discover Spaces",
    description:
      "Explore creative studios, podcast lounges, soundstages, and production spaces. Find the right environment for your next project.",
    icon: Search,
  },
  {
    number: "02",
    title: "Choose Your Time",
    description:
      "Explore available booking slots, select your preferred schedule, and review pricing before making a reservation.",
    icon: CalendarCheck,
  },
  {
    number: "03",
    title: "Confirm Your Booking",
    description:
      "Review your booking details and complete the reservation process with clear pricing and confirmation.",
    icon: Zap,
  },
  {
    number: "04",
    title: "Create Something Great",
    description:
      "Show up, set up your equipment, and bring your creative vision to life in a space built for production.",
    icon: Sparkles,
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="relative overflow-hidden bg-brand-ivory py-20 sm:py-24 lg:py-28"
    >
      {/* Background decorations */}
      <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-brand-bronze-light/70 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-brand-bronze/10 blur-3xl" />

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-border bg-white px-4 py-2 shadow-sm">
            <Sparkles className="h-4 w-4 text-brand-bronze" />
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-brand-bronze">
              Simple. Seamless. Creative.
            </span>
          </div>

          <h2
            id="how-it-works-heading"
            className="text-3xl font-bold tracking-tight text-brand-charcoal sm:text-4xl lg:text-5xl"
          >
            Your Creative Journey,
            <span className="mt-2 block text-brand-bronze">
              Made Simple.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-brand-stone sm:text-lg">
            Finding and booking your ideal creative workspace shouldn&apos;t
            be complicated. Four simple steps take you from discovery
            to production.
          </p>
        </div>

        {/* Process Steps */}
        <ol className="relative mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">

          {/* Desktop connecting line */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-[12%] right-[12%] top-[58px] hidden h-px border-t-2 border-dashed border-brand-stone/30 lg:block"
          />

          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <li
                key={step.number}
                className="group relative"
              >
                <article className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-brand-border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-brand-bronze/40 hover:shadow-xl hover:shadow-black/5 sm:p-7">

                  {/* Large background number */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-2 -top-5 text-8xl font-black tracking-tighter text-brand-ivory-dark transition-colors duration-300 group-hover:text-brand-bronze-light"
                  >
                    {step.number}
                  </span>

                  {/* Icon */}
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-bronze-light bg-brand-bronze-light text-brand-bronze transition-all duration-300 group-hover:border-brand-bronze group-hover:bg-brand-bronze group-hover:text-brand-dark">
                      <Icon className="h-6 w-6" />
                    </div>

                    <span className="text-xs font-bold uppercase tracking-widest text-brand-stone">
                      Step {step.number}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="relative z-10 mt-8 flex-1">
                    <h3 className="text-xl font-bold tracking-tight text-brand-charcoal">
                      {step.title}
                    </h3>

                    <p className="mt-4 text-sm leading-7 text-brand-stone">
                      {step.description}
                    </p>
                  </div>

                  {/* Bottom indicator */}
                  <div className="relative z-10 mt-8 flex items-center justify-between border-t border-brand-border pt-5">
                    <span className="text-xs font-semibold text-brand-stone">
                      {index === 3 ? "Ready to create" : "Next step"}
                    </span>

                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-bronze-light text-brand-bronze transition-all duration-300 group-hover:bg-brand-bronze group-hover:text-brand-dark">
                      {index === 3 ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <ArrowRight className="h-4 w-4" />
                      )}
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ol>

        {/* Bottom CTA */}
        <div className="mt-14 flex flex-col items-center justify-center gap-4 text-center sm:mt-16">

          <p className="text-sm text-brand-stone">
            Your next creative project starts with the right space.
          </p>

          <Link
            href="/studios"
            className="group inline-flex items-center justify-center gap-3 rounded-xl bg-brand-bronze px-8 py-4 text-sm font-semibold text-brand-dark shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:bg-brand-bronze-hover hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-bronze focus-visible:ring-offset-2 focus-visible:ring-offset-brand-ivory"
          >
            Explore Creative Spaces

            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

      </div>
    </section>
  );
}
