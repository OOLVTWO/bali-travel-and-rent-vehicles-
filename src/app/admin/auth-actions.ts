"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { error?: string; message?: string };

function readCredentials(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Email-nya belum bener." } as const;
  if (password.length < 8) return { error: "Password minimal 8 karakter." } as const;
  return { email, password } as const;
}

export async function signIn(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const creds = readCredentials(formData);
  if ("error" in creds) return { error: creds.error };
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(creds);
  if (error) {
    if (error.code === "email_not_confirmed") return { error: "Email belum dikonfirmasi. Cek inbox (dan folder spam) lalu klik link konfirmasi." };
    return { error: "Email atau password salah." };
  }
  redirect("/admin");
}

export async function signUp(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const creds = readCredentials(formData);
  if ("error" in creds) return { error: creds.error };
  const origin = (await headers()).get("origin") ?? "";
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    ...creds,
    options: { emailRedirectTo: origin ? `${origin}/admin/login?confirmed=1` : undefined },
  });
  if (error) {
    if (error.code === "user_already_exists") return { error: "Email ini sudah terdaftar. Silakan masuk." };
    if (error.code === "weak_password") return { error: "Password terlalu lemah. Pakai kombinasi huruf & angka yang lebih panjang." };
    return { error: "Gagal bikin akun. Coba lagi sebentar lagi." };
  }
  if (data.session) redirect("/admin");
  return { message: "Akun dibuat. Cek email lo dan klik link konfirmasi, lalu masuk di sini." };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
