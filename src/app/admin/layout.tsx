import type { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Alert } from "@/components/icons";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="flex min-h-screen flex-col bg-admin-bg lg:flex-row">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="flex items-center gap-2 border-b border-warn/20 bg-warn-bg px-4 py-2.5 text-[13px] font-semibold text-warn sm:px-8">
          <Alert size={16} className="shrink-0" />
          Mode demo: data masih contoh dan perubahan belum tersimpan. Login & database (Supabase) menyusul di tahap berikutnya.
        </p>
        <main className="flex flex-col gap-6 px-4 py-6 sm:px-8 sm:py-7">{children}</main>
      </div>
    </div>
  );
}
