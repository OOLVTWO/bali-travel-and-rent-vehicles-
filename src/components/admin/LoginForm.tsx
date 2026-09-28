"use client";

import { useActionState, useState } from "react";
import { signIn, signUp, type AuthState } from "@/app/admin/auth-actions";

export function LoginForm() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [inState, inAction, inPending] = useActionState<AuthState, FormData>(signIn, {});
  const [upState, upAction, upPending] = useActionState<AuthState, FormData>(signUp, {});
  const state = mode === "in" ? inState : upState;
  const pending = mode === "in" ? inPending : upPending;

  const field = "h-12 w-full rounded-xl border border-line bg-white px-3.5 text-[15px]";
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-[28px] font-semibold">{mode === "in" ? "Masuk ke panel admin" : "Bikin akun admin"}</h1>
        <p className="text-sm text-muted">
          {mode === "in" ? "Pakai email yang udah didaftarkan sebagai admin." : "Cuma email yang terdaftar sebagai admin yang bisa buka panel."}
        </p>
      </div>
      <form action={mode === "in" ? inAction : upAction} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-[13px] font-bold" htmlFor="login-email">
          Email
          <input id="login-email" name="email" type="email" required autoComplete="email" className={field} />
        </label>
        <label className="flex flex-col gap-1.5 text-[13px] font-bold" htmlFor="login-password">
          Password
          <input id="login-password" name="password" type="password" required minLength={8} autoComplete={mode === "in" ? "current-password" : "new-password"} className={field} />
        </label>
        {state.error && <p role="alert" className="rounded-xl bg-bad-bg px-4 py-3 text-sm font-semibold text-bad">{state.error}</p>}
        {state.message && <p role="status" className="rounded-xl bg-sea-soft px-4 py-3 text-sm font-semibold text-sea-dark">{state.message}</p>}
        <button type="submit" disabled={pending} className="h-12 rounded-xl bg-sun font-bold text-ink disabled:opacity-60">
          {pending ? "Sebentar…" : mode === "in" ? "Masuk" : "Bikin akun"}
        </button>
      </form>
      <button type="button" onClick={() => setMode((m) => (m === "in" ? "up" : "in"))} className="self-center text-sm font-bold text-sea">
        {mode === "in" ? "Belum punya akun? Bikin di sini" : "Udah punya akun? Masuk"}
      </button>
    </div>
  );
}
