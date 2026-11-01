import Link from "next/link";
import {
  ArrowUpRight,
  Camera,
  Clapperboard,
  Mic2,
  Music2,
  Sparkles,
  Video,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Category = {
  name: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

const categories: Category[] = [
  {
    name: "Photography Studios",
    description:
      "Natural light, cycloramas, and pro lighting for portraits, products, and editorial work.",
    href: "/studios?category=photography",
    icon: Camera,
  },
  {
    name: "Video & Film Studios",
    description:
      "Production-ready stages and flexible sets built for shoots, cinema, and commercial work.",
    href: "/studios?category=film",
    icon: Clapperboard,
  },
  {
    name: "Podcast Studios",
    description:
      "Acoustically treated rooms with clean audio setups for interviews and shows.",
    href: "/studios?category=podcast",
    icon: Mic2,
  },
  {
    name: "Music Studios",
    description:
      "Recording, mixing, and rehearsal suites for musicians, producers, and engineers.",
    href: "/studios?category=music",
    icon: Music2,
  },
  {
    name: "Content Creation Studios",
    description:
      "Flexible spaces and lighting for streaming, social media, and branded content.",
    href: "/studios?category=content",
    icon: Video,
  },
];

export default function Categories() {
  return (
    <section
      id="categories"
      aria-labelledby="categories-heading"
      className="relative overflow-hidden bg-brand-ivory py-20 sm:py-24 lg:py-28"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-brand-bronze-light/70 blur-3xl" />

      <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-brand-bronze/10 blur-3xl" />

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-14">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-border bg-white px-4 py-2 shadow-sm">
            <Sparkles className="h-4 w-4 text-brand-bronze" />

            <span className="text-xs font-bold uppercase tracking-[0.15em] text-brand-bronze">
              Browse by Category
            </span>
          </div>

          <h2
            id="categories-heading"
            className="text-3xl font-bold leading-tight tracking-tight text-brand-charcoal sm:text-4xl lg:text-5xl"
          >
            Find the right space
            <span className="mt-2 block text-brand-bronze">
              for your kind of creative work.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-brand-stone sm:text-lg">
            From photo shoots to podcast sessions, explore spaces designed
            around the way you create.
          </p>
        </div>

        {/* Category Navigation */}
        <nav aria-label="Studio categories">
          <ul className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-5">
            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <li key={category.href} className="h-full">
                  <Link
                    href={category.href}
                    className="group flex h-full flex-col justify-between rounded-[22px] border border-brand-border bg-white p-5 transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-bronze/40 hover:shadow-xl hover:shadow-brand-charcoal/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-bronze focus-visible:ring-offset-2 sm:p-6"
                  >
                    <div>
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-ivory text-brand-bronze transition-colors duration-300 group-hover:bg-brand-bronze group-hover:text-white">
                        <Icon className="h-5 w-5" />
                      </span>

                      <h3 className="mt-5 text-base font-semibold leading-snug tracking-tight text-brand-charcoal transition-colors group-hover:text-brand-bronze">
                        {category.name}
                      </h3>

                      <p className="mt-3 text-xs leading-6 text-brand-stone">
                        {category.description}
                      </p>
                    </div>

                    <span className="mt-6 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-bronze transition-all group-hover:gap-2.5">
                      Explore
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </section>
  );
}
