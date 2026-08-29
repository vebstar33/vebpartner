-- Vebpartner plattform: första datamodellen
-- Tabellen i public-schemat skyddas med RLS.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  account_type text not null default 'member' check (account_type in ('member','company','admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references auth.users(id) on delete set null,
  name text not null,
  slug text not null unique,
  website_url text,
  logo_url text,
  description text,
  country_code text,
  verified boolean not null default false,
  status text not null default 'draft' check (status in ('draft','pending','published','rejected','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  parent_id uuid references public.categories(id) on delete set null,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.opportunities (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete set null,
  submitted_by uuid references auth.users(id) on delete set null,
  title text not null,
  slug text not null unique,
  short_description text,
  description text,
  opportunity_type text not null,
  website_url text,
  application_url text,
  guide_url text,
  logo_url text,
  country_scope text[] not null default '{}',
  languages text[] not null default '{}',
  startup_cost_min numeric(12,2),
  startup_cost_max numeric(12,2),
  currency text default 'SEK',
  revenue_model text,
  requirements text,
  featured boolean not null default false,
  verified boolean not null default false,
  status text not null default 'draft' check (status in ('draft','pending','published','rejected','archived')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.opportunity_categories (
  opportunity_id uuid not null references public.opportunities(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade,
  primary key (opportunity_id, category_id)
);

create table if not exists public.favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  opportunity_id uuid not null references public.opportunities(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, opportunity_id)
);

create table if not exists public.interest_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  opportunity_id uuid not null references public.opportunities(id) on delete cascade,
  message text,
  status text not null default 'new' check (status in ('new','forwarded','contacted','closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  submitted_by uuid references auth.users(id) on delete set null,
  company_name text,
  title text not null,
  website_url text,
  contact_email text,
  description text,
  status text not null default 'new' check (status in ('new','reviewing','accepted','rejected')),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create index if not exists idx_opportunities_status on public.opportunities(status);
create index if not exists idx_opportunities_type on public.opportunities(opportunity_type);
create index if not exists idx_opportunities_company on public.opportunities(company_id);
create index if not exists idx_companies_status on public.companies(status);
create index if not exists idx_interest_requests_opportunity on public.interest_requests(opportunity_id);

alter table public.profiles enable row level security;
alter table public.companies enable row level security;
alter table public.categories enable row level security;
alter table public.opportunities enable row level security;
alter table public.opportunity_categories enable row level security;
alter table public.favorites enable row level security;
alter table public.interest_requests enable row level security;
alter table public.submissions enable row level security;

-- Publik läsning av publicerat innehåll.
create policy "Publika företag kan läsas"
on public.companies for select
to anon, authenticated
using (status = 'published');

create policy "Aktiva kategorier kan läsas"
on public.categories for select
to anon, authenticated
using (active = true);

create policy "Publicerade möjligheter kan läsas"
on public.opportunities for select
to anon, authenticated
using (status = 'published');

create policy "Kategorikopplingar för publicerade möjligheter kan läsas"
on public.opportunity_categories for select
to anon, authenticated
using (
  exists (
    select 1 from public.opportunities o
    where o.id = opportunity_id and o.status = 'published'
  )
);

-- Användarens egen profil.
create policy "Användare kan läsa egen profil"
on public.profiles for select
to authenticated
using ((select auth.uid()) = id);

create policy "Användare kan uppdatera egen profil"
on public.profiles for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

-- Företagsägare kan hantera sina egna företagsutkast.
create policy "Ägare kan läsa eget företag"
on public.companies for select
to authenticated
using ((select auth.uid()) = owner_user_id);

create policy "Ägare kan skapa företag"
on public.companies for insert
to authenticated
with check ((select auth.uid()) = owner_user_id);

create policy "Ägare kan uppdatera eget företag"
on public.companies for update
to authenticated
using ((select auth.uid()) = owner_user_id)
with check ((select auth.uid()) = owner_user_id);

-- Inskickade möjligheter kan hanteras av den användare som skickat in dem.
create policy "Användare kan läsa egna möjligheter"
on public.opportunities for select
to authenticated
using ((select auth.uid()) = submitted_by);

create policy "Användare kan skapa möjligheter"
on public.opportunities for insert
to authenticated
with check ((select auth.uid()) = submitted_by and status in ('draft','pending'));

create policy "Användare kan uppdatera egna opublicerade möjligheter"
on public.opportunities for update
to authenticated
using ((select auth.uid()) = submitted_by and status in ('draft','pending'))
with check ((select auth.uid()) = submitted_by and status in ('draft','pending'));

-- Favoriter är privata per användare.
create policy "Användare kan läsa egna favoriter"
on public.favorites for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Användare kan skapa egna favoriter"
on public.favorites for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Användare kan radera egna favoriter"
on public.favorites for delete
to authenticated
using ((select auth.uid()) = user_id);

-- Intresseanmälningar är privata per användare.
create policy "Användare kan läsa egna intresseanmälningar"
on public.interest_requests for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Användare kan skapa intresseanmälan"
on public.interest_requests for insert
to authenticated
with check ((select auth.uid()) = user_id);

-- Inskick till katalogen kan skapas av både gäster och inloggade.
create policy "Besökare kan skicka förslag"
on public.submissions for insert
to anon, authenticated
with check (status = 'new');

-- Skapa profil automatiskt när en användare registreras.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', new.email));
  return new;
end;
$$;

revoke all on function public.handle_new_user() from public;

create or replace trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
