-- FitManager core database completion
-- Apply after 001_initial_schema.sql.

create extension if not exists "pgcrypto";

-- Backfill lifecycle timestamps for tables created by 001. These columns are
-- intentionally additive so existing historical rows remain untouched.
alter table public.profiles
  add column if not exists updated_at timestamptz not null default now();
alter table public.membership_plans
  add column if not exists updated_at timestamptz not null default now();
alter table public.customer_memberships
  add column if not exists updated_at timestamptz not null default now();
alter table public.customer_memberships
  add column if not exists session_count_snapshot integer;
alter table public.customer_memberships
  add column if not exists duration_days_snapshot integer;
alter table public.training_sessions
  add column if not exists updated_at timestamptz not null default now();
alter table public.payments
  add column if not exists updated_at timestamptz not null default now();

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'customer_memberships_used_sessions_valid'
  ) then
    alter table public.customer_memberships
      add constraint customer_memberships_used_sessions_valid
      check (used_sessions >= 0 and used_sessions <= total_sessions);
  end if;
end;
$$;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'customer_memberships_status_valid') then
    alter table public.customer_memberships
      add constraint customer_memberships_status_valid
      check (status in ('active', 'paused', 'completed', 'expired', 'cancelled'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'training_sessions_status_valid') then
    alter table public.training_sessions
      add constraint training_sessions_status_valid
      check (status in ('scheduled', 'completed', 'cancelled', 'no_show'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'payments_status_valid') then
    alter table public.payments
      add constraint payments_status_valid
      check (status in ('pending', 'paid', 'failed', 'refunded'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'payments_method_valid') then
    alter table public.payments
      add constraint payments_method_valid
      check (payment_method in ('cash', 'bank_transfer', 'card', 'online', 'other'));
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'customer_memberships_snapshot_counts_valid'
  ) then
    alter table public.customer_memberships
      add constraint customer_memberships_snapshot_counts_valid
      check (
        (session_count_snapshot is null or session_count_snapshot > 0)
        and (duration_days_snapshot is null or duration_days_snapshot > 0)
      );
  end if;
end;
$$;

-- A session may start as one-to-one through training_sessions.customer_id and
-- can additionally support small groups through this participant table.
create table if not exists public.training_session_participants (
  id uuid primary key default gen_random_uuid(),
  training_session_id uuid not null references public.training_sessions(id) on delete restrict,
  customer_id uuid not null references public.customers(id) on delete restrict,
  attendance_status text not null default 'scheduled'
    check (attendance_status in ('scheduled', 'attended', 'no_show', 'cancelled')),
  created_at timestamptz not null default now(),
  unique (training_session_id, customer_id)
);

create table if not exists public.session_records (
  id uuid primary key default gen_random_uuid(),
  training_session_id uuid not null unique references public.training_sessions(id) on delete restrict,
  customer_id uuid not null references public.customers(id) on delete restrict,
  trainer_id uuid not null references public.profiles(id) on delete restrict,
  performed_at timestamptz not null,
  duration_minutes integer check (duration_minutes is null or duration_minutes > 0),
  summary text,
  exercises jsonb not null default '[]'::jsonb,
  customer_feedback text,
  internal_notes text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (jsonb_typeof(exercises) = 'array')
);

create table if not exists public.progress_records (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete restrict,
  recorded_by uuid references public.profiles(id) on delete set null,
  measured_on date not null,
  weight_kg numeric(6,2) check (weight_kg is null or weight_kg >= 0),
  body_fat_percentage numeric(5,2) check (body_fat_percentage is null or body_fat_percentage between 0 and 100),
  measurements jsonb not null default '{}'::jsonb,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (jsonb_typeof(measurements) = 'object')
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  notification_type text not null default 'system',
  title text not null,
  body text not null,
  action_url text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

-- Historical and operational indexes.
create index if not exists training_session_participants_customer_idx
  on public.training_session_participants(customer_id, created_at desc);
create index if not exists training_session_participants_session_idx
  on public.training_session_participants(training_session_id);
create index if not exists session_records_customer_date_idx
  on public.session_records(customer_id, performed_at desc);
create index if not exists session_records_trainer_date_idx
  on public.session_records(trainer_id, performed_at desc);
create index if not exists progress_records_customer_date_idx
  on public.progress_records(customer_id, measured_on desc);
create index if not exists notifications_recipient_unread_idx
  on public.notifications(recipient_id, read_at, created_at desc);
create index if not exists customer_memberships_customer_status_idx
  on public.customer_memberships(customer_id, status, expires_on desc);
create index if not exists payments_customer_date_idx
  on public.payments(customer_id, paid_at desc nulls last);
create index if not exists training_sessions_customer_starts_idx
  on public.training_sessions(customer_id, starts_at);
create index if not exists training_sessions_trainer_starts_idx
  on public.training_sessions(trainer_id, starts_at);

-- Shared updated_at trigger. The function is deliberately schema-qualified and
-- uses a fixed search_path so it is safe to call from RLS-protected tables.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at before update on public.leads
for each row execute function public.set_updated_at();
drop trigger if exists customers_set_updated_at on public.customers;
create trigger customers_set_updated_at before update on public.customers
for each row execute function public.set_updated_at();
drop trigger if exists membership_plans_set_updated_at on public.membership_plans;
create trigger membership_plans_set_updated_at before update on public.membership_plans
for each row execute function public.set_updated_at();
drop trigger if exists customer_memberships_set_updated_at on public.customer_memberships;
create trigger customer_memberships_set_updated_at before update on public.customer_memberships
for each row execute function public.set_updated_at();
drop trigger if exists training_sessions_set_updated_at on public.training_sessions;
create trigger training_sessions_set_updated_at before update on public.training_sessions
for each row execute function public.set_updated_at();
drop trigger if exists payments_set_updated_at on public.payments;
create trigger payments_set_updated_at before update on public.payments
for each row execute function public.set_updated_at();
drop trigger if exists session_records_set_updated_at on public.session_records;
create trigger session_records_set_updated_at before update on public.session_records
for each row execute function public.set_updated_at();
drop trigger if exists progress_records_set_updated_at on public.progress_records;
create trigger progress_records_set_updated_at before update on public.progress_records
for each row execute function public.set_updated_at();

alter table public.training_session_participants enable row level security;
alter table public.session_records enable row level security;
alter table public.progress_records enable row level security;
alter table public.notifications enable row level security;

-- Role helpers are evaluated on the server/database, never from client input.
create or replace function public.has_any_role(required_roles text[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role = any(required_roles)
  );
$$;

revoke all on function public.has_any_role(text[]) from public;
grant execute on function public.has_any_role(text[]) to authenticated;

-- Profile and role visibility.
drop policy if exists "users can read their profile" on public.profiles;
create policy "users can read their profile" on public.profiles
for select to authenticated
using (id = auth.uid() or public.has_any_role(array['owner', 'manager']));

drop policy if exists "users can update their profile" on public.profiles;
create policy "users can update their profile" on public.profiles
for update to authenticated
using (id = auth.uid() or public.has_any_role(array['owner', 'manager']))
with check (id = auth.uid() or public.has_any_role(array['owner', 'manager']));

drop policy if exists "users can read their roles" on public.user_roles;
create policy "users can read their roles" on public.user_roles
for select to authenticated
using (user_id = auth.uid() or public.has_any_role(array['owner', 'manager']));

drop policy if exists "owners can manage roles" on public.user_roles;
create policy "owners can manage roles" on public.user_roles
for all to authenticated
using (public.has_any_role(array['owner']))
with check (public.has_any_role(array['owner']));

-- Session participants and records follow the trainer/staff boundary.
drop policy if exists "staff can read session participants" on public.training_session_participants;
create policy "staff can read session participants" on public.training_session_participants
for select to authenticated
using (
  public.has_any_role(array['owner', 'manager', 'staff'])
  or exists (
    select 1 from public.training_sessions ts
    where ts.id = training_session_id and ts.trainer_id = auth.uid()
  )
);

drop policy if exists "staff can manage session participants" on public.training_session_participants;
create policy "staff can manage session participants" on public.training_session_participants
for all to authenticated
using (public.has_any_role(array['owner', 'manager', 'staff']))
with check (public.has_any_role(array['owner', 'manager', 'staff']));

drop policy if exists "staff can read session records" on public.session_records;
create policy "staff can read session records" on public.session_records
for select to authenticated
using (public.has_any_role(array['owner', 'manager', 'staff']) or trainer_id = auth.uid());

drop policy if exists "staff can manage session records" on public.session_records;
create policy "staff can manage session records" on public.session_records
for all to authenticated
using (public.has_any_role(array['owner', 'manager', 'staff']) or trainer_id = auth.uid())
with check (public.has_any_role(array['owner', 'manager', 'staff']) or trainer_id = auth.uid());

drop policy if exists "staff can read progress records" on public.progress_records;
create policy "staff can read progress records" on public.progress_records
for select to authenticated
using (public.has_any_role(array['owner', 'manager', 'staff', 'trainer']));

drop policy if exists "staff can manage progress records" on public.progress_records;
create policy "staff can manage progress records" on public.progress_records
for all to authenticated
using (public.has_any_role(array['owner', 'manager', 'staff', 'trainer']))
with check (public.has_any_role(array['owner', 'manager', 'staff', 'trainer']));

-- Notifications are private to the recipient, with owner/manager visibility
-- for operational support. Inserts are normally performed by trusted server code.
drop policy if exists "users can read their notifications" on public.notifications;
create policy "users can read their notifications" on public.notifications
for select to authenticated
using (recipient_id = auth.uid() or public.has_any_role(array['owner', 'manager']));

drop policy if exists "users can update their notifications" on public.notifications;
create policy "users can update their notifications" on public.notifications
for update to authenticated
using (recipient_id = auth.uid() or public.has_any_role(array['owner', 'manager']))
with check (recipient_id = auth.uid() or public.has_any_role(array['owner', 'manager']));

drop policy if exists "managers can create notifications" on public.notifications;
create policy "managers can create notifications" on public.notifications
for insert to authenticated
with check (public.has_any_role(array['owner', 'manager']));
