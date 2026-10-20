create extension if not exists "btree_gist";
create extension if not exists "pgcrypto";

create table if not exists public.profiles (id uuid primary key references auth.users(id) on delete cascade, full_name text not null, phone text, locale text not null default 'vi', is_active boolean not null default true, created_at timestamptz not null default now());
create table if not exists public.user_roles (user_id uuid references public.profiles(id) on delete cascade, role text not null check (role in ('owner','manager','trainer','staff','content_editor')), primary key (user_id, role));
create table if not exists public.leads (id uuid primary key default gen_random_uuid(), full_name text not null, phone text not null, email text, preferred_locale text not null default 'vi', source text not null default 'website', status text not null default 'new' check (status in ('new','contacted','qualified','converted','lost')), goals text, notes text, assigned_to uuid references public.profiles(id), created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table if not exists public.consultation_requests (id uuid primary key default gen_random_uuid(), lead_id uuid not null references public.leads(id), preferred_date date, preferred_time text, message text, status text not null default 'pending', created_at timestamptz not null default now());
create table if not exists public.customers (id uuid primary key default gen_random_uuid(), lead_id uuid references public.leads(id), full_name text not null, phone text not null, email text, health_notes text, status text not null default 'active', created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table if not exists public.membership_plans (id uuid primary key default gen_random_uuid(), name text not null, description text, session_count integer not null check (session_count > 0), duration_days integer not null check (duration_days > 0), price numeric(12,2) not null check (price >= 0), currency text not null default 'VND', status text not null default 'active', created_at timestamptz not null default now());
create table if not exists public.customer_memberships (id uuid primary key default gen_random_uuid(), customer_id uuid not null references public.customers(id), plan_id uuid references public.membership_plans(id), plan_name_snapshot text not null, price_snapshot numeric(12,2) not null, currency_snapshot text not null default 'VND', total_sessions integer not null, used_sessions integer not null default 0, starts_on date not null, expires_on date not null, status text not null default 'active', created_at timestamptz not null default now());
create table if not exists public.training_sessions (id uuid primary key default gen_random_uuid(), customer_id uuid not null references public.customers(id), membership_id uuid references public.customer_memberships(id), trainer_id uuid not null references public.profiles(id), starts_at timestamptz not null, ends_at timestamptz not null, status text not null default 'scheduled', location text, internal_notes text, created_at timestamptz not null default now(), check (ends_at > starts_at));
alter table public.training_sessions add constraint training_sessions_trainer_no_overlap exclude using gist (trainer_id with =, tstzrange(starts_at, ends_at, '[)') with &&) where (status = 'scheduled');
create table if not exists public.payments (id uuid primary key default gen_random_uuid(), customer_id uuid not null references public.customers(id), membership_id uuid references public.customer_memberships(id), amount numeric(12,2) not null check (amount > 0), currency text not null default 'VND', payment_method text not null default 'cash', status text not null default 'paid', paid_at timestamptz, reference_code text, recorded_by uuid references public.profiles(id), created_at timestamptz not null default now());
create index if not exists leads_status_idx on public.leads(status);
create index if not exists sessions_starts_at_idx on public.training_sessions(starts_at);

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.leads enable row level security;
alter table public.customers enable row level security;
alter table public.payments enable row level security;
alter table public.training_sessions enable row level security;
alter table public.consultation_requests enable row level security;
alter table public.membership_plans enable row level security;
alter table public.customer_memberships enable row level security;

create or replace function public.has_role(required_role text) returns boolean language sql stable security definer set search_path = public as $$ select exists (select 1 from public.user_roles where user_id = auth.uid() and role = required_role); $$;
revoke all on function public.has_role(text) from public;
grant execute on function public.has_role(text) to authenticated;
create or replace function public.submit_consultation(payload jsonb) returns uuid language plpgsql security definer set search_path = public as $$
declare new_lead_id uuid;
begin
  insert into public.leads(full_name, phone, email, preferred_locale, source, goals)
  values (payload->>'full_name', payload->>'phone', nullif(payload->>'email', ''), coalesce(payload->>'preferred_locale', 'vi'), 'website', coalesce(payload->>'goals', ''))
  returning id into new_lead_id;
  insert into public.consultation_requests(lead_id, message) values (new_lead_id, nullif(payload->>'goals', ''));
  return new_lead_id;
end; $$;
revoke all on function public.submit_consultation(jsonb) from public;
grant execute on function public.submit_consultation(jsonb) to anon, authenticated;
revoke insert, update, delete on public.leads, public.consultation_requests from anon;
create policy "staff can read leads" on public.leads for select to authenticated using (public.has_role('owner') or public.has_role('manager') or public.has_role('staff') or assigned_to = auth.uid());
create policy "staff can manage leads" on public.leads for all to authenticated using (public.has_role('owner') or public.has_role('manager') or public.has_role('staff')) with check (public.has_role('owner') or public.has_role('manager') or public.has_role('staff'));
create policy "staff can read consultation requests" on public.consultation_requests for select to authenticated using (public.has_role('owner') or public.has_role('manager') or public.has_role('staff'));
create policy "staff can update consultation requests" on public.consultation_requests for update to authenticated using (public.has_role('owner') or public.has_role('manager') or public.has_role('staff')) with check (public.has_role('owner') or public.has_role('manager') or public.has_role('staff'));
create policy "staff can read membership plans" on public.membership_plans for select to authenticated using (public.has_role('owner') or public.has_role('manager') or public.has_role('staff') or public.has_role('trainer'));
create policy "managers can manage membership plans" on public.membership_plans for all to authenticated using (public.has_role('owner') or public.has_role('manager')) with check (public.has_role('owner') or public.has_role('manager'));
create policy "staff can read customer memberships" on public.customer_memberships for select to authenticated using (public.has_role('owner') or public.has_role('manager') or public.has_role('staff') or public.has_role('trainer'));
create policy "staff can manage customer memberships" on public.customer_memberships for all to authenticated using (public.has_role('owner') or public.has_role('manager') or public.has_role('staff')) with check (public.has_role('owner') or public.has_role('manager') or public.has_role('staff'));
create policy "staff can manage customers" on public.customers for all to authenticated using (public.has_role('owner') or public.has_role('manager') or public.has_role('staff') or public.has_role('trainer')) with check (public.has_role('owner') or public.has_role('manager') or public.has_role('staff') or public.has_role('trainer'));
create policy "staff can manage sessions" on public.training_sessions for all to authenticated using (public.has_role('owner') or public.has_role('manager') or trainer_id = auth.uid()) with check (public.has_role('owner') or public.has_role('manager') or trainer_id = auth.uid());
create policy "managers can manage payments" on public.payments for all to authenticated using (public.has_role('owner') or public.has_role('manager') or public.has_role('staff')) with check (public.has_role('owner') or public.has_role('manager') or public.has_role('staff'));
