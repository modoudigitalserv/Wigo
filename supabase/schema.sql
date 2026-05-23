-- ============================================================
-- WIGO SaaS - Schéma de Base de Données Complet
-- À exécuter dans l'éditeur SQL du Dashboard Supabase
-- ============================================================

-- ============================================================
-- EXTENSIONS
-- ============================================================
create extension if not exists "uuid-ossp";

-- ============================================================
-- 1. PROFILS UTILISATEURS (lié à auth.users)
-- ============================================================
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  role text not null default 'client' check (role in ('super_admin', 'company', 'driver', 'client')),
  full_name text,
  email text,
  phone text,
  avatar_url text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.profiles enable row level security;

create policy "Les utilisateurs voient leur propre profil"
  on public.profiles for select
  to authenticated
  using ( (select auth.uid()) = id );

create policy "Les utilisateurs modifient leur propre profil"
  on public.profiles for update
  to authenticated
  using ( (select auth.uid()) = id )
  with check ( (select auth.uid()) = id );

create policy "Les admins voient tous les profils"
  on public.profiles for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and p.role = 'super_admin'
    )
  );

-- ============================================================
-- 2. ENTREPRISES DE LOCATION
-- ============================================================
create table public.companies (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  city text,
  phone text,
  description text,
  logo_url text,
  subscription_plan text default 'basic' check (subscription_plan in ('basic', 'pro', 'premium')),
  stripe_customer_id text,
  stripe_subscription_id text,
  subscription_status text default 'inactive' check (subscription_status in ('active', 'inactive', 'past_due', 'canceled')),
  rating_average numeric(3,2) default 0,
  total_reviews integer default 0,
  is_verified boolean default false,
  created_at timestamptz default now() not null
);

alter table public.companies enable row level security;

create policy "Les entreprises sont publiquement visibles"
  on public.companies for select
  using (true);

create policy "Les propriétaires gèrent leur entreprise"
  on public.companies for all
  to authenticated
  using ( (select auth.uid()) = user_id )
  with check ( (select auth.uid()) = user_id );

-- ============================================================
-- 3. VÉHICULES
-- ============================================================
create table public.cars (
  id uuid default uuid_generate_v4() primary key,
  company_id uuid references public.companies(id) on delete cascade not null,
  brand text not null,
  model text not null,
  year integer,
  fuel text check (fuel in ('essence', 'diesel', 'electrique', 'hybride')),
  transmission text check (transmission in ('manuelle', 'automatique')),
  seats integer default 5,
  price_day numeric(10,2) not null,
  price_week numeric(10,2),
  city text not null,
  description text,
  mileage integer,
  air_conditioning boolean default true,
  deposit numeric(10,2),
  status text default 'disponible' check (status in ('disponible', 'louee', 'maintenance')),
  rating_average numeric(3,2) default 0,
  total_reviews integer default 0,
  created_at timestamptz default now() not null
);

alter table public.cars enable row level security;

create policy "Les voitures disponibles sont publiques"
  on public.cars for select
  using (status = 'disponible');

create policy "Les entreprises gèrent leurs voitures"
  on public.cars for all
  to authenticated
  using (
    company_id in (
      select id from public.companies where user_id = (select auth.uid())
    )
  )
  with check (
    company_id in (
      select id from public.companies where user_id = (select auth.uid())
    )
  );

-- ============================================================
-- 4. IMAGES DES VÉHICULES
-- ============================================================
create table public.car_images (
  id uuid default uuid_generate_v4() primary key,
  car_id uuid references public.cars(id) on delete cascade not null,
  image_url text not null,
  is_primary boolean default false,
  created_at timestamptz default now() not null
);

alter table public.car_images enable row level security;

create policy "Les images de voitures sont publiques"
  on public.car_images for select
  using (true);

create policy "Les entreprises gèrent leurs images"
  on public.car_images for all
  to authenticated
  using (
    car_id in (
      select c.id from public.cars c
      join public.companies co on co.id = c.company_id
      where co.user_id = (select auth.uid())
    )
  );

-- ============================================================
-- 5. CHAUFFEURS
-- ============================================================
create table public.drivers (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  city text not null,
  experience_years integer default 0,
  license_type text default 'B',
  languages text[] default array['Français'],
  hourly_rate numeric(10,2),
  daily_rate numeric(10,2),
  bio text,
  photo_url text,
  rating_average numeric(3,2) default 0,
  total_reviews integer default 0,
  total_missions integer default 0,
  is_verified boolean default false,
  is_available boolean default true,
  subscription_plan text default 'starter' check (subscription_plan in ('starter', 'pro', 'elite')),
  stripe_customer_id text,
  stripe_subscription_id text,
  subscription_status text default 'inactive' check (subscription_status in ('active', 'inactive', 'past_due', 'canceled')),
  created_at timestamptz default now() not null
);

alter table public.drivers enable row level security;

create policy "Les chauffeurs vérifiés et disponibles sont publics"
  on public.drivers for select
  using (is_verified = true and is_available = true);

create policy "Les chauffeurs voient leur propre profil"
  on public.drivers for select
  to authenticated
  using ( (select auth.uid()) = user_id );

create policy "Les chauffeurs modifient leur propre profil"
  on public.drivers for update
  to authenticated
  using ( (select auth.uid()) = user_id )
  with check ( (select auth.uid()) = user_id );

-- ============================================================
-- 6. DOCUMENTS CHAUFFEURS (KYC)
-- ============================================================
create table public.driver_documents (
  id uuid default uuid_generate_v4() primary key,
  driver_id uuid references public.drivers(id) on delete cascade not null,
  license_url text,
  identity_url text,
  selfie_url text,
  validation_status text default 'pending' check (validation_status in ('pending', 'approved', 'rejected')),
  rejection_reason text,
  reviewed_at timestamptz,
  created_at timestamptz default now() not null
);

alter table public.driver_documents enable row level security;

create policy "Les chauffeurs voient leurs propres documents"
  on public.driver_documents for select
  to authenticated
  using (
    driver_id in (
      select id from public.drivers where user_id = (select auth.uid())
    )
  );

create policy "Les chauffeurs créent leurs documents"
  on public.driver_documents for insert
  to authenticated
  with check (
    driver_id in (
      select id from public.drivers where user_id = (select auth.uid())
    )
  );

-- ============================================================
-- 7. RÉSERVATIONS VOITURES
-- ============================================================
create table public.bookings (
  id uuid default uuid_generate_v4() primary key,
  car_id uuid references public.cars(id) on delete set null,
  customer_id uuid references public.profiles(id) on delete set null not null,
  company_id uuid references public.companies(id) on delete set null,
  start_date date not null,
  end_date date not null,
  pickup_location text,
  total_price numeric(10,2) not null,
  deposit_amount numeric(10,2),
  status text default 'pending' check (status in ('pending', 'confirmed', 'active', 'completed', 'cancelled', 'rejected')),
  stripe_payment_intent_id text,
  notes text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.bookings enable row level security;

create policy "Les clients voient leurs réservations"
  on public.bookings for select
  to authenticated
  using ( (select auth.uid()) = customer_id );

create policy "Les entreprises voient leurs réservations"
  on public.bookings for select
  to authenticated
  using (
    company_id in (
      select id from public.companies where user_id = (select auth.uid())
    )
  );

create policy "Les clients créent des réservations"
  on public.bookings for insert
  to authenticated
  with check ( (select auth.uid()) = customer_id );

create policy "Mise à jour statut autorisée"
  on public.bookings for update
  to authenticated
  using (
    (select auth.uid()) = customer_id
    or company_id in (select id from public.companies where user_id = (select auth.uid()))
  );

-- ============================================================
-- 8. RÉSERVATIONS CHAUFFEURS
-- ============================================================
create table public.driver_bookings (
  id uuid default uuid_generate_v4() primary key,
  driver_id uuid references public.drivers(id) on delete set null,
  customer_id uuid references public.profiles(id) on delete set null not null,
  start_date date not null,
  start_time time,
  duration_hours numeric(5,2),
  mission_type text check (mission_type in ('horaire', 'journalier', 'voiture_chauffeur')),
  pickup_location text,
  total_price numeric(10,2) not null,
  status text default 'pending' check (status in ('pending', 'confirmed', 'active', 'completed', 'cancelled', 'rejected')),
  stripe_payment_intent_id text,
  notes text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.driver_bookings enable row level security;

create policy "Les clients voient leurs missions"
  on public.driver_bookings for select
  to authenticated
  using ( (select auth.uid()) = customer_id );

create policy "Les chauffeurs voient leurs missions"
  on public.driver_bookings for select
  to authenticated
  using (
    driver_id in (
      select id from public.drivers where user_id = (select auth.uid())
    )
  );

create policy "Les clients créent des missions"
  on public.driver_bookings for insert
  to authenticated
  with check ( (select auth.uid()) = customer_id );

-- ============================================================
-- 9. AVIS - VOITURES / ENTREPRISES
-- ============================================================
create table public.reviews (
  id uuid default uuid_generate_v4() primary key,
  booking_id uuid references public.bookings(id) on delete cascade unique not null,
  company_id uuid references public.companies(id) on delete cascade,
  car_id uuid references public.cars(id) on delete set null,
  customer_id uuid references public.profiles(id) on delete cascade not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamptz default now() not null
);

alter table public.reviews enable row level security;

create policy "Les avis sont publics"
  on public.reviews for select
  using (true);

create policy "Les clients créent un avis par réservation"
  on public.reviews for insert
  to authenticated
  with check ( (select auth.uid()) = customer_id );

-- ============================================================
-- 10. AVIS - CHAUFFEURS
-- ============================================================
create table public.driver_reviews (
  id uuid default uuid_generate_v4() primary key,
  driver_booking_id uuid references public.driver_bookings(id) on delete cascade unique not null,
  driver_id uuid references public.drivers(id) on delete cascade not null,
  customer_id uuid references public.profiles(id) on delete cascade not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamptz default now() not null
);

alter table public.driver_reviews enable row level security;

create policy "Les avis chauffeurs sont publics"
  on public.driver_reviews for select
  using (true);

create policy "Les clients créent un avis par mission"
  on public.driver_reviews for insert
  to authenticated
  with check ( (select auth.uid()) = customer_id );

-- ============================================================
-- 11. STATISTIQUES D'USAGE CHAUFFEURS (quotas abonnement)
-- ============================================================
create table public.driver_usage_stats (
  id uuid default uuid_generate_v4() primary key,
  driver_id uuid references public.drivers(id) on delete cascade unique not null,
  completed_missions integer default 0,
  current_plan text default 'starter',
  quota_reached boolean default false,
  updated_at timestamptz default now() not null
);

alter table public.driver_usage_stats enable row level security;

create policy "Les chauffeurs voient leurs stats"
  on public.driver_usage_stats for select
  to authenticated
  using (
    driver_id in (
      select id from public.drivers where user_id = (select auth.uid())
    )
  );

-- ============================================================
-- TRIGGER: Créer un profil automatiquement à l'inscription
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    coalesce(new.raw_user_meta_data->>'role', 'client')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- GRANT accès Data API (REST)
-- ============================================================
grant usage on schema public to anon, authenticated;
grant select on public.cars to anon;
grant select on public.car_images to anon;
grant select on public.companies to anon;
grant select on public.drivers to anon;
grant select on public.reviews to anon;
grant select on public.driver_reviews to anon;
grant all on public.profiles to authenticated;
grant all on public.bookings to authenticated;
grant all on public.driver_bookings to authenticated;
grant all on public.reviews to authenticated;
grant all on public.driver_reviews to authenticated;
grant all on public.driver_documents to authenticated;
