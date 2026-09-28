-- Skema awal: armada, unit, tour, foto, booking, admin.
-- Semua tabel pakai RLS. Tamu cuma bisa baca konten aktif & kirim booking lewat fungsi create_booking.

-- ---------------------------------------------------------------------------
-- Admin
-- ---------------------------------------------------------------------------
create table public.admin_emails (
  email text primary key check (email = lower(email)),
  created_at timestamptz not null default now()
);
alter table public.admin_emails enable row level security;
-- Sengaja tanpa policy: tabel ini cuma dibaca lewat fungsi is_admin().

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_emails
    where email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Armada (model kendaraan yang dijual di website)
-- ---------------------------------------------------------------------------
create table public.vehicles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text not null check (category in ('scooter', 'car')),
  subtitle text not null default '',
  seats int not null default 2 check (seats between 1 and 60),
  transmission text not null default 'Automatic' check (transmission in ('Automatic', 'Manual')),
  image_url text,
  tint text not null default 'bg-mist',
  badge text,
  price_per_day int check (price_per_day >= 0),
  price_with_driver int check (price_with_driver >= 0),
  highlights text[] not null default '{}',
  included text[] not null default '{}',
  sort int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger vehicles_updated_at before update on public.vehicles
  for each row execute function public.set_updated_at();

-- Unit fisik (per plat nomor)
create table public.fleet_units (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references public.vehicles (id) on delete restrict,
  plate text not null unique,
  status text not null default 'tersedia' check (status in ('tersedia', 'servis', 'nonaktif')),
  km int not null default 0 check (km >= 0),
  next_service date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index fleet_units_vehicle_id_idx on public.fleet_units (vehicle_id);
create trigger fleet_units_updated_at before update on public.fleet_units
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Tour
-- ---------------------------------------------------------------------------
create table public.tours (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  area text not null default '',
  categories text[] not null default '{}',
  duration text not null default '',
  pickup text not null default '',
  summary text not null default '',
  summary_id text not null default '',
  facts text[] not null default '{}',
  highlights jsonb not null default '[]'::jsonb,
  itinerary jsonb not null default '[]'::jsonb,
  included text[] not null default '{}',
  excluded text[] not null default '{}',
  price_from int not null default 0 check (price_from >= 0),
  badge text,
  featured boolean not null default false,
  active boolean not null default true,
  sort int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger tours_updated_at before update on public.tours
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Foto (galeri tour & slide header homepage)
-- ---------------------------------------------------------------------------
create table public.photos (
  id uuid primary key default gen_random_uuid(),
  scope text not null check (scope in ('tour', 'hero')),
  tour_id uuid references public.tours (id) on delete cascade,
  url text not null,
  storage_path text,
  alt text not null default '',
  position text,
  sort int not null default 0,
  created_at timestamptz not null default now(),
  constraint photos_scope_tour check ((scope = 'tour') = (tour_id is not null))
);
create index photos_tour_id_idx on public.photos (tour_id);
create index photos_scope_sort_idx on public.photos (scope, sort);

-- ---------------------------------------------------------------------------
-- Booking
-- ---------------------------------------------------------------------------
create sequence public.booking_code_seq start 1001;

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  code text not null unique default ('BK-' || nextval('public.booking_code_seq')::text),
  kind text not null check (kind in ('rental', 'driver', 'tour', 'combo', 'transfer')),
  item_title text not null,
  vehicle_id uuid references public.vehicles (id) on delete set null,
  tour_id uuid references public.tours (id) on delete set null,
  unit_id uuid references public.fleet_units (id) on delete set null,
  start_date date,
  end_date date,
  quantity int not null default 1 check (quantity between 1 and 50),
  guest_name text not null,
  location text,
  notes text,
  estimated_total int check (estimated_total >= 0),
  status text not null default 'baru'
    check (status in ('baru', 'menunggu-dp', 'dikonfirmasi', 'berjalan', 'selesai', 'batal')),
  channel text not null default 'website' check (channel in ('website', 'whatsapp', 'instagram', 'walk-in')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint bookings_dates check (end_date is null or start_date is null or end_date >= start_date)
);
create index bookings_start_date_idx on public.bookings (start_date);
create index bookings_status_idx on public.bookings (status);
create index bookings_vehicle_id_idx on public.bookings (vehicle_id);
create index bookings_tour_id_idx on public.bookings (tour_id);
create index bookings_unit_id_idx on public.bookings (unit_id);
create trigger bookings_updated_at before update on public.bookings
  for each row execute function public.set_updated_at();

grant usage on sequence public.booking_code_seq to authenticated;

-- Booking dari website publik: divalidasi di sini, status selalu 'baru'.
create or replace function public.create_booking(
  p_kind text,
  p_item_title text,
  p_vehicle_slug text,
  p_tour_slug text,
  p_start_date date,
  p_end_date date,
  p_quantity int,
  p_guest_name text,
  p_location text,
  p_notes text,
  p_estimated_total int
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_code text;
  v_vehicle uuid;
  v_tour uuid;
  v_today date := (now() at time zone 'Asia/Makassar')::date;
begin
  if p_kind is null or p_kind not in ('rental', 'driver', 'tour', 'combo', 'transfer') then
    raise exception 'invalid booking kind';
  end if;
  if coalesce(length(trim(p_guest_name)), 0) = 0 or length(p_guest_name) > 120 then
    raise exception 'invalid guest name';
  end if;
  if coalesce(length(trim(p_item_title)), 0) = 0 or length(p_item_title) > 200 then
    raise exception 'invalid item';
  end if;
  if length(coalesce(p_location, '')) > 300 or length(coalesce(p_notes, '')) > 1000 then
    raise exception 'text too long';
  end if;
  if p_quantity is null or p_quantity < 1 or p_quantity > 50 then
    raise exception 'invalid quantity';
  end if;
  if p_start_date is not null and (p_start_date < v_today - 1 or p_start_date > v_today + 730) then
    raise exception 'invalid start date';
  end if;
  if p_end_date is not null and (p_start_date is null or p_end_date < p_start_date or p_end_date > p_start_date + 366) then
    raise exception 'invalid end date';
  end if;
  if p_estimated_total is not null and (p_estimated_total < 0 or p_estimated_total > 1000000000) then
    raise exception 'invalid total';
  end if;

  select id into v_vehicle from public.vehicles where slug = p_vehicle_slug;
  select id into v_tour from public.tours where slug = p_tour_slug;

  insert into public.bookings (
    kind, item_title, vehicle_id, tour_id, start_date, end_date, quantity,
    guest_name, location, notes, estimated_total, status, channel
  ) values (
    p_kind, trim(p_item_title), v_vehicle, v_tour, p_start_date, p_end_date, p_quantity,
    trim(p_guest_name), nullif(trim(coalesce(p_location, '')), ''), nullif(trim(coalesce(p_notes, '')), ''),
    p_estimated_total, 'baru', 'website'
  )
  returning code into v_code;

  return v_code;
end;
$$;
revoke all on function public.create_booking(text, text, text, text, date, date, int, text, text, text, int) from public;
grant execute on function public.create_booking(text, text, text, text, date, date, int, text, text, text, int) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.vehicles enable row level security;
alter table public.fleet_units enable row level security;
alter table public.tours enable row level security;
alter table public.photos enable row level security;
alter table public.bookings enable row level security;

-- vehicles: publik baca yang aktif, admin kelola
create policy "vehicles_select" on public.vehicles for select to anon, authenticated
  using (active or (select public.is_admin()));
create policy "vehicles_insert" on public.vehicles for insert to authenticated
  with check ((select public.is_admin()));
create policy "vehicles_update" on public.vehicles for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "vehicles_delete" on public.vehicles for delete to authenticated
  using ((select public.is_admin()));

-- tours: publik baca yang aktif, admin kelola
create policy "tours_select" on public.tours for select to anon, authenticated
  using (active or (select public.is_admin()));
create policy "tours_insert" on public.tours for insert to authenticated
  with check ((select public.is_admin()));
create policy "tours_update" on public.tours for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "tours_delete" on public.tours for delete to authenticated
  using ((select public.is_admin()));

-- photos: publik baca, admin kelola
create policy "photos_select" on public.photos for select to anon, authenticated
  using (true);
create policy "photos_insert" on public.photos for insert to authenticated
  with check ((select public.is_admin()));
create policy "photos_update" on public.photos for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "photos_delete" on public.photos for delete to authenticated
  using ((select public.is_admin()));

-- fleet_units & bookings: cuma admin
create policy "fleet_units_select" on public.fleet_units for select to authenticated
  using ((select public.is_admin()));
create policy "fleet_units_insert" on public.fleet_units for insert to authenticated
  with check ((select public.is_admin()));
create policy "fleet_units_update" on public.fleet_units for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "fleet_units_delete" on public.fleet_units for delete to authenticated
  using ((select public.is_admin()));

create policy "bookings_select" on public.bookings for select to authenticated
  using ((select public.is_admin()));
create policy "bookings_insert" on public.bookings for insert to authenticated
  with check ((select public.is_admin()));
create policy "bookings_update" on public.bookings for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "bookings_delete" on public.bookings for delete to authenticated
  using ((select public.is_admin()));

-- ---------------------------------------------------------------------------
-- Storage: bucket foto publik, cuma admin yang boleh upload/ubah/hapus
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('photos', 'photos', true, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do nothing;

create policy "photos_bucket_admin_select" on storage.objects for select to authenticated
  using (bucket_id = 'photos' and (select public.is_admin()));
create policy "photos_bucket_admin_insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'photos' and (select public.is_admin()));
create policy "photos_bucket_admin_update" on storage.objects for update to authenticated
  using (bucket_id = 'photos' and (select public.is_admin()))
  with check (bucket_id = 'photos' and (select public.is_admin()));
create policy "photos_bucket_admin_delete" on storage.objects for delete to authenticated
  using (bucket_id = 'photos' and (select public.is_admin()));
