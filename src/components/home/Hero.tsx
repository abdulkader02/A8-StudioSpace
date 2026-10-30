"use client";

import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  A11y,
  Autoplay,
  EffectFade,
  Keyboard,
  Navigation,
  Pagination,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

type HeroSlide = {
  badge: string;
  titleTop: string;
  titleAccent: string;
  subtitle: string;
  image: string;
};

const slides: HeroSlide[] = [
  {
    badge: "Next-Gen Creative Studios",
    titleTop: "Reserve Production Spaces Built for",
    titleAccent: "Visionary Creators",
    subtitle:
      "Step into pre-rigged cyclorama soundstages, 4K multi-cam podcast lounges, and Dolby Atmos mixing suites across the continent.",
    image:
      "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&w=1920&q=80",
  },
  {
    badge: "Photography & Film",
    titleTop: "Cyclorama Stages Ready for",
    titleAccent: "Your Next Masterpiece",
    subtitle:
      "Drive-in cyc walls, grid-mounted tungsten and LED kits, and grip packages that move as fast as your call sheet.",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1920&q=80",
  },
  {
    badge: "Audio & Post Production",
    titleTop: "Mix in Dolby Atmos",
    titleAccent: "Certified Suites",
    subtitle:
      "Immersive 7.1.4 monitoring, acoustically treated rooms, and seasoned engineers on call — tracking through final deliverables.",
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1920&q=80",
  },
];

export default function Hero() {
  return (
    <section
      aria-label="Featured studios"
      className="relative h-[calc(100svh-64px)] min-h-[540px] w-full overflow-hidden bg-black sm:h-[calc(100svh-72px)]"
    >
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade, Keyboard, A11y]}
        className="hero-swiper h-full w-full"
        slidesPerView={1}
        loop
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={800}
        keyboard={{ enabled: true }}
        autoplay={{ delay: 6000, disableOnInteraction: false, pauseOnMouseEnter: true }}
        navigation={{ nextEl: ".hero-next", prevEl: ".hero-prev" }}
        pagination={{ clickable: true }}
        a11y={{
          prevSlideMessage: "Previous slide",
          nextSlideMessage: "Next slide",
          paginationBulletMessage: "Go to slide {{index}}",
        }}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.titleAccent}>
            <div
              className="hero-slide h-full w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              {/* Dark overlay for readability */}
              <div className="absolute inset-0 bg-black/60" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

              <div className="relative mx-auto flex h-full w-full max-w-7xl flex-col justify-center px-4 sm:px-6 lg:px-8">
                <div className="hero-content max-w-2xl">
                  {/* Badge */}
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#176B9B]/40 bg-[#176B9B]/15 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#4DA3D9]">
                    <Sparkles className="h-3.5 w-3.5" />
                    {slide.badge}
                  </span>

                  {/* Headline */}
                  <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
                    {slide.titleTop}
                    <br />
                    <span className="text-[#4DA3D9]">{slide.titleAccent}</span>
                  </h1>

                  {/* Subtext */}
                  <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
                    {slide.subtitle}
                  </p>

                  {/* CTA Buttons */}
                  <div className="mt-9 flex flex-wrap items-center gap-4">
                    <Link
                      href="/studios"
                      className="inline-flex items-center gap-2 rounded-lg bg-[#176B9B] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#12577F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#176B9B] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                    >
                      Explore Studios
                      <ArrowRight className="h-4 w-4" />
                    </Link>

                    <Link
                      href="/studios"
                      className="inline-flex items-center rounded-lg border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                    >
                      Host Your Space
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation arrows */}
      <button
        type="button"
        className="hero-prev absolute left-4 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 md:flex"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        className="hero-next absolute right-4 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 md:flex"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </section>
  );
}
