import { createClient } from "@/lib/supabase/server";

/** Siapa yang login & apakah dia admin (email ada di tabel admin_emails). */
export async function getAdminSession() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const email = typeof data?.claims?.email === "string" ? data.claims.email.toLowerCase() : null;
  if (!email) return { supabase, email: null, isAdmin: false } as const;
  const { data: row } = await supabase.from("admin_emails").select("email").eq("email", email).maybeSingle();
  return { supabase, email, isAdmin: Boolean(row) } as const;
}

/** Dipanggil di awal setiap server action admin. Database (RLS) tetap jadi pengaman terakhir. */
export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session.isAdmin) throw new Error("Kamu tidak punya akses admin.");
  return session;
}
