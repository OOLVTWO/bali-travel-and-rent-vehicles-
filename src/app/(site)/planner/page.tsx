import type { Metadata } from "next";
import { TripPlanner } from "@/components/home/TripPlanner";
import { getTours, getVehicles } from "@/lib/content";

export const metadata: Metadata = {
  title: "Trip planner",
  description: "Compare riding yourself, hiring a driver or joining a tour for your Bali day trip.",
};

export default async function PlannerPage() {
  const [tours, vehicles] = await Promise.all([getTours(), getVehicles()]);
  return (
    <section className="px-4 py-12 sm:px-6 lg:px-16 lg:py-16">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <TripPlanner tours={tours} vehicles={vehicles} headingLevel="h1" />
        <p className="text-sm text-muted">Prices are estimates for one day. We confirm the final price and availability on WhatsApp before you pay.</p>
      </div>
    </section>
  );
}
