import { Experiences } from "@/components/home/Experiences";
import { FleetSection } from "@/components/home/FleetSection";
import { TripPlanner } from "@/components/home/TripPlanner";
import { BaliGuide, ComboDeals, CtaBand, GuestMoments, Hero, HowItWorks, ThreeWays, TrustStrip } from "@/components/home/sections";
import { getHeroSlides, getReviewSummary, getReviews, getTours, getVehicles } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  description: "Rent a scooter or car, hire a private driver, or join a curated tour in Bali. One booking, one WhatsApp chat, delivered to your villa.",
  path: "/",
});

export default async function HomePage() {
  const [slides, tours, vehicles, reviews, rating] = await Promise.all([getHeroSlides(), getTours(), getVehicles(), getReviews(), getReviewSummary()]);
  return (
    <>
      <Hero slides={slides} rating={rating} />
      <TrustStrip />
      <ThreeWays vehicles={vehicles} tours={tours} />
      <Experiences tours={tours} />
      <FleetSection vehicles={vehicles} />
      <section aria-label="Trip planner" className="px-4 py-20 sm:px-6 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <TripPlanner tours={tours} vehicles={vehicles} />
        </div>
      </section>
      <ComboDeals />
      <HowItWorks />
      <GuestMoments reviews={reviews} rating={rating} />
      <BaliGuide />
      <CtaBand />
    </>
  );
}
