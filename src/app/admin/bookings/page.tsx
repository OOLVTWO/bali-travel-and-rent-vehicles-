import type { Metadata } from "next";
import { BookingsTable } from "@/components/admin/BookingsTable";
import { PageTitle } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Booking" };

export default function BookingsPage() {
  return (
    <>
      <PageTitle title="Booking" subtitle="Semua booking dari website, WhatsApp dan Instagram" />
      <BookingsTable />
    </>
  );
}
