import { Experiences } from "@/components/home/Experiences";
import { FleetSection } from "@/components/home/FleetSection";
import { TripPlanner } from "@/components/home/TripPlanner";
import { BaliGuide, ComboDeals, CtaBand, GuestMoments, Hero, HowItWorks, ThreeWays, TrustStrip } from "@/components/home/sections";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <ThreeWays />
      <Experiences />
      <FleetSection />
      <section aria-label="Trip planner" className="px-4 py-20 sm:px-6 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <TripPlanner />
        </div>
      </section>
      <ComboDeals />
      <HowItWorks />
      <GuestMoments />
      <BaliGuide />
      <CtaBand />
    </>
  );
}
