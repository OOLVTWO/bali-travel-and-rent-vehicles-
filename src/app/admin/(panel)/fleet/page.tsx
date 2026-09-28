import type { Metadata } from "next";
import { UnitsManager, VehiclePricing, type VehicleOption } from "@/components/admin/FleetManager";
import { PageTitle } from "@/components/admin/ui";
import { loadUnits } from "@/lib/admin-data";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Armada" };

export default async function FleetPage() {
  const supabase = await createClient();
  const [units, vehiclesRes] = await Promise.all([loadUnits(supabase), supabase.from("vehicles").select("*").order("sort")]);
  if (vehiclesRes.error) throw new Error(vehiclesRes.error.message);
  const vehicles: VehicleOption[] = vehiclesRes.data.map((v) => ({
    id: v.id,
    name: v.name,
    category: v.category,
    active: v.active,
    pricePerDay: v.price_per_day,
    priceWithDriver: v.price_with_driver,
  }));
  const available = units.filter((u) => u.status === "tersedia").length;

  return (
    <>
      <PageTitle title="Armada" subtitle={`${units.length} unit terdaftar · ${available} siap jalan`} />
      <UnitsManager units={units} vehicles={vehicles} />
      <VehiclePricing vehicles={vehicles} />
    </>
  );
}
