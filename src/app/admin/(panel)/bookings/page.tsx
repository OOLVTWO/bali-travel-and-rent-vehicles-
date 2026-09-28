import type { Metadata } from "next";
import { BookingsTable } from "@/components/admin/BookingsTable";
import { ManualBookingForm } from "@/components/admin/ManualBookingForm";
import { PageTitle } from "@/components/admin/ui";
import { loadBookings, loadUnits } from "@/lib/admin-data";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Booking" };

export default async function BookingsPage({ searchParams }: PageProps<"/admin/bookings">) {
  const { baru } = await searchParams;
  const supabase = await createClient();
  const [bookings, units, vehicles, tours] = await Promise.all([
    loadBookings(supabase),
    loadUnits(supabase),
    supabase.from("vehicles").select("name").order("sort"),
    supabase.from("tours").select("title").order("sort"),
  ]);
  const suggestions = [...(vehicles.data ?? []).map((v) => v.name), ...(tours.data ?? []).map((t) => t.title), "Airport transfer"];

  return (
    <>
      <PageTitle title="Booking" subtitle={`${bookings.length} booking dari website, WhatsApp, Instagram & datang langsung`} />
      <ManualBookingForm units={units} suggestions={suggestions} defaultOpen={baru === "1"} />
      <BookingsTable bookings={bookings} units={units} />
    </>
  );
}
