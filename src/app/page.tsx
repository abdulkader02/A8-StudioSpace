import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import Featured from "@/components/home/Featured";
import HowItWorks from "@/components/home/HowItWorks";
import TrustSafety from "@/components/home/TrustSafety";

export default function Home() {
  return (
    <div>
      <Hero />
      <Categories />
      <Featured />
      <HowItWorks />
      <TrustSafety />
    </div>
  );
}
