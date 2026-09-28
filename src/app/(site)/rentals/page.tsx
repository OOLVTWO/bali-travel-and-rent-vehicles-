import type { Metadata } from "next";
import { FleetBrowser } from "@/components/rentals/FleetBrowser";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Rent a scooter or car",
  description: "Scooters and cars delivered to your villa in Bali, or a private car with an English-speaking driver.",
};

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function RentalsPage({ searchParams }: PageProps<"/rentals">) {
  const sp = await searchParams;
  const typeParam = one(sp.type);
  const type = typeParam === "scooter" || typeParam === "car" ? typeParam : "all";
  const mode = one(sp.mode) === "driver" ? "driver" : "self";

  return (
    <>
      <PageHeader
        eyebrow={mode === "driver" ? "Car with driver" : "Rent a vehicle"}
        title={mode === "driver" ? "A private car and a local driver, for the whole day." : "Scooters and cars, delivered to your villa."}
        text="Helmets, rain ponchos and basic insurance included. No passport hold, just a photo ID and a small deposit."
      />
      <section className="px-4 py-12 sm:px-6 lg:px-16 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <FleetBrowser key={`${type}-${mode}`} initialType={type} initialMode={mode} from={one(sp.from)} to={one(sp.to)} area={one(sp.area)} />
        </div>
      </section>
    </>
  );
}
