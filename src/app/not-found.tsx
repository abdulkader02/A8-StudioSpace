import Link from "next/link";
import {
  ArrowRight,
  Camera,
  Home,
  Search,
  Sparkles,
} from "lucide-react";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[calc(100svh-64px)] items-center overflow-hidden bg-background px-4 py-16 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-secondary/70 blur-3xl" />

      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-brand-bronze/10 blur-3xl" />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="text-center lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-bronze/25 bg-card px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-bronze shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            404 · Scene not found
          </div>

          <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            This set is still
            <span className="mt-2 block font-serif font-normal italic text-brand-bronze">
              under construction.
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
            The page you were looking for may have moved, been renamed, or
            never made it past pre-production. Let&apos;s get you back to a
            space that&apos;s ready for action.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <Link
              href="/"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-bronze px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-bronze-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-bronze focus-visible:ring-offset-2"
            >
              <Home className="h-4 w-4" />
              Return to Home
            </Link>

            <Link
              href="/studios"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition hover:border-brand-bronze hover:text-brand-bronze focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-bronze focus-visible:ring-offset-2"
            >
              <Search className="h-4 w-4" />
              Explore Studios
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl">
          <div className="relative overflow-hidden rounded-[32px] border border-border bg-brand-charcoal p-4 shadow-2xl shadow-brand-charcoal/20 sm:p-6">
            <div className="mb-4 flex items-center justify-between px-1">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-ivory/60">
                <Camera className="h-4 w-4 text-brand-bronze" />
                StudioSpace backlot
              </div>

              <div className="flex gap-1.5" aria-hidden="true">
                <span className="h-2 w-2 rounded-full bg-brand-bronze" />
                <span className="h-2 w-2 rounded-full bg-brand-ivory/30" />
                <span className="h-2 w-2 rounded-full bg-brand-ivory/30" />
              </div>
            </div>

            <svg
              viewBox="0 0 520 420"
              role="img"
              aria-label="Illustration of an empty photography studio with a camera on a tripod and lighting equipment"
              className="h-auto w-full"
            >
              <defs>
                <linearGradient id="backdrop" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#f3e5d5" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#c58b55" stopOpacity="0.05" />
                </linearGradient>
                <radialGradient id="softbox-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f3e5d5" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#f3e5d5" stopOpacity="0" />
                </radialGradient>
              </defs>

              <rect
                x="1"
                y="1"
                width="518"
                height="418"
                rx="24"
                fill="url(#backdrop)"
                stroke="#f5f0e8"
                strokeOpacity="0.1"
              />

              <text
                x="260"
                y="150"
                textAnchor="middle"
                fill="#f5f0e8"
                fillOpacity="0.05"
                fontSize="150"
                fontWeight="700"
                fontFamily="sans-serif"
              >
                404
              </text>

              <circle
                cx="100"
                cy="105"
                r="72"
                fill="url(#softbox-glow)"
              />

              <path
                d="M72 336V214c0-44 36-80 80-80h216c44 0 80 36 80 80v122"
                fill="none"
                stroke="#f5f0e8"
                strokeOpacity="0.18"
                strokeWidth="3"
              />

              <path
                d="M48 336h424"
                fill="none"
                stroke="#c58b55"
                strokeOpacity="0.45"
                strokeWidth="3"
                strokeLinecap="round"
              />

              <path
                d="M118 336v-96M102 336l16-22 16 22"
                fill="none"
                stroke="#77736d"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <g>
                <rect
                  x="96"
                  y="160"
                  width="44"
                  height="34"
                  rx="4"
                  fill="#292522"
                  stroke="#c58b55"
                  strokeWidth="3"
                />
                <path
                  d="M100 164l36 26"
                  stroke="#c58b55"
                  strokeOpacity="0.35"
                  strokeWidth="2"
                />
                <path
                  d="M136 160l16-16M136 194l16 16"
                  stroke="#c58b55"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </g>

              <g>
                <rect
                  x="208"
                  y="190"
                  width="112"
                  height="72"
                  rx="12"
                  fill="#c58b55"
                />
                <rect
                  x="230"
                  y="176"
                  width="58"
                  height="24"
                  rx="8"
                  fill="#f5f0e8"
                />
                <circle
                  cx="264"
                  cy="226"
                  r="27"
                  fill="#292522"
                  stroke="#f5f0e8"
                  strokeWidth="4"
                />
                <circle
                  cx="264"
                  cy="226"
                  r="14"
                  fill="#c58b55"
                  fillOpacity="0.6"
                />
                <circle cx="300" cy="203" r="6" fill="#f5f0e8" />
                <path
                  d="M208 220h-12v-20h12"
                  fill="#292522"
                  stroke="#f5f0e8"
                  strokeWidth="2"
                />
              </g>

              <g
                stroke="#f5f0e8"
                strokeOpacity="0.55"
                strokeWidth="4"
                strokeLinecap="round"
              >
                <path d="M264 262v58M264 320l-34 20M264 320l34 20" />
              </g>

              <g>
                <path
                  d="M416 336v-98"
                  stroke="#77736d"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <path
                  d="M400 336l16-22 16 22"
                  fill="none"
                  stroke="#77736d"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <rect
                  x="382"
                  y="188"
                  width="68"
                  height="48"
                  rx="5"
                  fill="#f5f0e8"
                  fillOpacity="0.9"
                  transform="rotate(-8 416 212)"
                />
                <path
                  d="M416 238v16"
                  stroke="#c58b55"
                  strokeWidth="4"
                />
              </g>

              <g fill="#c58b55">
                <path d="M176 96l4 12 12 4-12 4-4 12-4-12-12-4 12-4z" />
                <path
                  d="M344 102l3 9 9 3-9 3-3 9-3-9-9-3 9-3z"
                  fillOpacity="0.75"
                />
                <path
                  d="M390 72l2 7 7 2-7 2-2 7-2-7-7-2 7-2z"
                  fillOpacity="0.5"
                />
              </g>

              <rect
                x="88"
                y="354"
                width="344"
                height="1"
                fill="#f5f0e8"
                fillOpacity="0.1"
              />

              <text
                x="260"
                y="384"
                textAnchor="middle"
                fill="#f5f0e8"
                fillOpacity="0.35"
                fontSize="11"
                letterSpacing="3"
                fontFamily="sans-serif"
              >
                THE NEXT TAKE IS WAITING
              </text>
            </svg>
          </div>

          <div className="absolute -bottom-5 -left-3 hidden rounded-2xl border border-border bg-card px-4 py-3 shadow-lg sm:block">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-bronze">
              Director&apos;s note
            </p>
            <p className="mt-1 text-xs font-medium text-foreground">
              Wrong scene? Return to the studio floor.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
