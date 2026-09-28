-- Pindahkan is_admin() ke schema yang tidak diekspos API (policy tetap jalan karena merujuk OID fungsi).
create schema if not exists private;
grant usage on schema private to anon, authenticated;
alter function public.is_admin() set schema private;

-- Admin boleh cek barisnya sendiri (dipakai aplikasi buat tahu apakah user yang login itu admin).
create policy "admin_emails_select_own" on public.admin_emails for select to authenticated
  using (email = lower(coalesce((select auth.jwt()) ->> 'email', '')));
