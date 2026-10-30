import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  Search,
  Sparkles,
  Zap,
} from "lucide-react";

type Step = {
  number: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  iconClassName: string;
};

const steps: Step[] = [
  {
    number: "01",
    title: "Discover Spaces",
    description:
      "Filter verified cyc walls, podcast lounges, soundstages, and mixing suites by location, gear inventory, and creator reviews.",
    icon: Search,
    iconClassName:
      "bg-amber-50 text-amber-500 border border-amber-100",
  },
  {
    number: "02",
    title: "Select Shoot Hours",
    description:
      "Inspect live calendar availability, choose precise hourly blocks, and review transparent breakdown rates with zero surprise fees.",
    icon: CalendarCheck,
    iconClassName:
      "bg-sky-50 text-sky-600 border border-sky-100",
  },
  {
    number: "03",
    title: "Book Instantly",
    description:
      "Lock in your reservation with double-booking collision prevention, instant host confirmation, and downloadable invoice vouchers.",
    icon: Zap,
    iconClassName:
      "bg-emerald-50 text-emerald-500 border border-emerald-100",
  },
  {
    number: "04",
    title: "Create & Produce",
    description:
      "Arrive at the stage with verified access codes, plug into ready-calibrated equipment grids, and bring your vision to life.",
    icon: Sparkles,
    iconClassName:
      "bg-violet-50 text-violet-500 border border-violet-100",
  },
];

function StepConnector() {
  return (
    <div
      aria-hidden="true"
      className="hidden shrink-0 items-center justify-center lg:flex"
    >
      <ArrowRight className="h-5 w-5 text-slate-300" />
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="w-full bg-white py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-[#176B9B]">
            Frictionless Booking
          </p>

          <h2
            id="how-it-works-heading"
            className="mt-3 text-3xl font-bold tracking-tight text-[#102A43] sm:text-4xl"
          >
            How StudioSpace Works
          </h2>

          <p className="mt-4 text-base leading-relaxed text-slate-500">
            Four simple steps from pre-production concept to rolling camera in
            world-class creative facilities.
          </p>
        </div>

        {/* Steps */}
        <ol className="mt-12 flex flex-col gap-6 lg:mt-16 lg:flex-row lg:items-stretch lg:gap-0">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <li
                key={step.number}
                className="flex flex-1 items-center gap-4"
              >
                <div className="flex flex-1 flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                  {/* Icon + Step number */}
                  <div className="flex items-start justify-between">
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${step.iconClassName}`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>

                    <span className="text-2xl font-bold text-slate-200">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-[#102A43]">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-slate-500">
                    {step.description}
                  </p>
                </div>

                {index < steps.length - 1 && <StepConnector />}
              </li>
            );
          })}
        </ol>

        {/* CTA */}
        <div className="mt-12 flex justify-center lg:mt-14">
          <Link
            href="/studios"
            className="inline-flex items-center gap-2 rounded-lg bg-[#176B9B] px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#12577F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#176B9B] focus-visible:ring-offset-2"
          >
            Start Exploring Workspaces
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
