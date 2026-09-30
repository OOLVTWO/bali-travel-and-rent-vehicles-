-- Ulasan tamu (disalin dari Google / TripAdvisor / chat, dengan izin tamu) + rating Google di header.

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  guest_name text not null check (char_length(guest_name) between 1 and 80),
  country text check (char_length(country) <= 60),
  rating smallint not null default 5 check (rating between 1 and 5),
  quote text not null check (char_length(quote) between 1 and 600),
  source text not null default 'google' check (source in ('google', 'tripadvisor', 'instagram', 'whatsapp', 'direct')),
  service text check (char_length(service) <= 120),
  review_date date,
  published boolean not null default true,
  sort integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index reviews_published_sort_idx on public.reviews (published, sort);

create trigger reviews_updated_at before update on public.reviews
  for each row execute function public.set_updated_at();

-- Satu baris pengaturan website (rating Google, dll.)
create table public.site_settings (
  id smallint primary key default 1 check (id = 1),
  google_rating numeric(2, 1) check (google_rating between 1 and 5),
  google_review_count integer check (google_review_count >= 0),
  google_reviews_url text check (google_reviews_url ~ '^https://'),
  updated_at timestamptz not null default now()
);

insert into public.site_settings (id) values (1);

create trigger site_settings_updated_at before update on public.site_settings
  for each row execute function public.set_updated_at();

alter table public.reviews enable row level security;
alter table public.site_settings enable row level security;

-- reviews: publik baca yang tampil, admin kelola semua
create policy "reviews_select" on public.reviews for select to anon, authenticated
  using (published or (select private.is_admin()));
create policy "reviews_insert" on public.reviews for insert to authenticated
  with check ((select private.is_admin()));
create policy "reviews_update" on public.reviews for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "reviews_delete" on public.reviews for delete to authenticated
  using ((select private.is_admin()));

-- site_settings: publik baca, cuma admin yang boleh ubah (gak ada insert/delete: barisnya tetap satu)
create policy "site_settings_select" on public.site_settings for select to anon, authenticated
  using (true);
create policy "site_settings_update" on public.site_settings for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
