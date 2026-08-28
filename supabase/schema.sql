create extension if not exists pg_trgm;

create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  tagline text not null default '',
  description text not null default '',
  logo_url text,
  website_url text not null,
  partner_url text,
  category text not null,
  opportunity_type text not null,
  geography text[] not null default '{}',
  startup_cost text,
  revenue_model text,
  typical_margin text,
  time_to_launch text,
  requirements text[] not null default '{}',
  highlights text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft','pending','published','archived')),
  featured boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists listings_slug_idx on public.listings(slug);
create index if not exists listings_status_idx on public.listings(status);
create index if not exists listings_category_idx on public.listings(category);
create index if not exists listings_name_trgm_idx on public.listings using gin (name gin_trgm_ops);

alter table public.listings enable row level security;

create policy "Publika listings kan läsas"
on public.listings for select
using (status = 'published');

create policy "Inloggade användare kan skapa listings"
on public.listings for insert
to authenticated
with check (auth.uid() = created_by);

create policy "Ägare kan läsa sina listings"
on public.listings for select
to authenticated
using (auth.uid() = created_by);

create policy "Ägare kan uppdatera sina listings"
on public.listings for update
to authenticated
using (auth.uid() = created_by)
with check (auth.uid() = created_by);
