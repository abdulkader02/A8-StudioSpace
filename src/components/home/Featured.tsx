import Link from "next/link";
import {
  ArrowRight,
  Camera,
  Clapperboard,
  LayoutGrid,
  Mic,
  MonitorPlay,
  Music2,
} from "lucide-react";

type Category = {
  name: string;
  slug: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
};

const categories: Category[] = [
  {
    name: "Photography Studios",
    slug: "photography",
    description:
      "Natural-light lofts, cyclorama bays, and fully equipped still-life stages.",
    icon: Camera,
  },
  {
    name: "Video & Film Studios",
    slug: "film",
    description:
      "Soundstages, grip packages, and drive-in cyc walls built for production.",
    icon: Clapperboard,
  },
  {
    name: "Podcast & Recording Studios",
    slug: "podcast",
    description:
      "Acoustically treated rooms with broadcast microphones and multitrack setups.",
    icon: Mic,
  },
  {
    name: "Music Production Studios",
    slug: "music",
    description:
      "Control rooms, live rooms, and Dolby Atmos mixing suites for artists.",
    icon: Music2,
  },
  {
    name: "Content Creation Studios",
    slug: "content",
    description:
      "Plug-and-play sets, lighting grids, and creator-friendly vertical-video spaces.",
    icon: MonitorPlay,
  },
];

export default function Categories() {
  return (
    <section
      id="categories"
      aria-labelledby="categories-heading"
      className="relative overflow-hidden bg-brand-ivory-dark py-20 sm:py-24 lg:py-28"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-40 top-16 h-96 w-96 rounded-full bg-brand-bronze-light/70 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-brand-bronze/10 blur-3xl" />

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="mx-auto mb-14 max-w-3xl text-center sm:mb-16">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-border bg-white px-4 py-2 shadow-sm">
            <LayoutGrid className="h-4 w-4 text-brand-bronze" />
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-brand-bronze">
              Explore by Category
            </span>
          </div>

          <h2
            id="categories-heading"
            className="text-3xl font-bold leading-tight tracking-tight text-brand-charcoal sm:text-4xl lg:text-5xl"
          >
            Studios Built for,
            <span className="mt-2 block text-brand-bronze">
              Every Creative Discipline.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-brand-stone sm:text-lg">
            From still photography to full-scale film production, browse
            verified workspaces tailored to the way you create.
          </p>
        </div>

        {/* Category Cards */}
        <ul className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <li key={category.slug} className="h-full">
                <Link
                  href={`/studios?category=${category.slug}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-brand-border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-bronze/40 hover:shadow-xl hover:shadow-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-bronze focus-visible:ring-offset-2 focus-visible:ring-offset-brand-ivory-dark sm:p-7"
                >
                  {/* Hover decoration */}
                  <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-brand-bronze-light transition-transform duration-500 group-hover:scale-150" />

                  <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-brand-bronze-light text-brand-bronze transition-all duration-300 group-hover:bg-brand-bronze group-hover:text-brand-dark">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="relative mt-6 text-lg font-bold leading-snug text-brand-charcoal transition-colors duration-300 group-hover:text-brand-bronze">
                    {category.name}
                  </h3>

                  <p className="relative mt-3 flex-1 text-sm leading-7 text-brand-stone">
                    {category.description}
                  </p>

                  <span className="relative mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-bronze">
                    Explore Studios
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

      </div>
    </section>
  );
}
