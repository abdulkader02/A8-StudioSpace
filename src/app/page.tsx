import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import HowItWorks from "@/components/home/HowItWorks";
import TrustSafety from "@/components/home/TrustSafety";

export default function Home() {
  return (
    <div>
      <Hero />
      <Categories />
      <HowItWorks />
      <TrustSafety />
    </div>
  );
}
