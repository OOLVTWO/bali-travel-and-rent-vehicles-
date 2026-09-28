import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { site } from "@/data/site";
import { LogoMark } from "@/components/icons";
import { LoginForm } from "@/components/admin/LoginForm";
import { getAdminSession } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = { title: "Masuk" };

export default async function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  const sp = await searchParams;
  if (isSupabaseConfigured) {
    const session = await getAdminSession();
    if (session.isAdmin) redirect("/admin");
  }
  const confirmed = sp.confirmed === "1";

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="flex w-full max-w-md flex-col gap-6 rounded-3xl bg-white p-7 shadow-[0_20px_50px_rgb(13_43_62/0.08)] sm:p-9">
        <div className="flex items-center gap-2.5">
          <LogoMark size={30} light={false} />
          <span className="font-display text-2xl font-semibold">{site.shortName}</span>
          <span className="rounded-md bg-sun-soft px-2 py-0.5 text-[11px] font-bold text-warn">ADMIN</span>
        </div>
        {isSupabaseConfigured ? (
          <>
            {confirmed && (
              <p role="status" className="rounded-xl bg-sea-soft px-4 py-3 text-sm font-semibold text-sea-dark">
                Email udah dikonfirmasi. Silakan masuk.
              </p>
            )}
            <LoginForm />
          </>
        ) : (
          <p className="rounded-xl bg-warn-bg px-4 py-3 text-sm text-warn">
            Supabase belum disambungkan. Isi <code>NEXT_PUBLIC_SUPABASE_URL</code> dan <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> di file <code>.env.local</code> (lihat README).
          </p>
        )}
      </div>
    </main>
  );
}
