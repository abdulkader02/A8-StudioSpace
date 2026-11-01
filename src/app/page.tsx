import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import Featured from "@/components/home/Featured";
import HowItWorks from "@/components/home/HowItWorks";
import AboutUs from "@/components/home/AboutUs";

export default function Home() {
  return (
    <div>
      <Hero />
      <Categories />
      <Featured />
      <HowItWorks />
      <AboutUs/>
    </div>
  );
}
