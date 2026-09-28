import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { getAdminSession } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { signOut } from "@/app/admin/auth-actions";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured) redirect("/admin/login");
  const { supabase, email, isAdmin } = await getAdminSession();
  if (!email) redirect("/admin/login");

  if (!isAdmin) {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="flex max-w-md flex-col gap-4 rounded-3xl bg-white p-8 text-center">
          <h1 className="font-display text-2xl font-semibold">Belum ada akses admin</h1>
          <p className="text-sm text-muted">
            Akun <strong className="text-ink">{email}</strong> belum terdaftar sebagai admin. Minta pemilik bisnis menambahkan email ini di tabel <code>admin_emails</code> Supabase.
          </p>
          <form action={signOut}>
            <button type="submit" className="h-11 rounded-xl border border-ink px-5 text-sm font-bold">Keluar</button>
          </form>
        </div>
      </main>
    );
  }

  const { count } = await supabase.from("bookings").select("id", { count: "exact", head: true }).in("status", ["baru", "menunggu-dp"]);

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <AdminSidebar email={email} pending={count ?? 0} />
      <main className="flex min-w-0 flex-1 flex-col gap-6 px-4 py-6 sm:px-8 sm:py-7">{children}</main>
    </div>
  );
}
