alter table public.membership_plans add column if not exists public_visible boolean not null default false;
alter table public.membership_plans add column if not exists description_vi text;
alter table public.membership_plans add column if not exists description_en text;
create index if not exists membership_plans_public_idx on public.membership_plans(status, public_visible);

drop policy if exists "public can read visible membership plans" on public.membership_plans;
create policy "public can read visible membership plans" on public.membership_plans for select to anon, authenticated using (status = 'active' and public_visible = true);
drop policy if exists "staff can manage customer memberships" on public.customer_memberships;
create policy "staff can manage customer memberships" on public.customer_memberships for all to authenticated using (public.has_role('owner') or public.has_role('manager') or public.has_role('staff') or public.has_role('trainer')) with check (public.has_role('owner') or public.has_role('manager') or public.has_role('staff') or public.has_role('trainer'));

do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'customer_memberships_dates_valid') then
    alter table public.customer_memberships add constraint customer_memberships_dates_valid check (expires_on >= starts_on);
  end if;
end $$;

create or replace function public.assign_customer_membership(p_customer_id uuid, p_plan_id uuid, p_agreed_price numeric, p_starts_on date, p_expires_on date default null) returns uuid
language plpgsql security definer set search_path = public as $$
declare plan_row public.membership_plans%rowtype; new_id uuid; expiry date;
begin
  if not (public.has_role('owner') or public.has_role('manager') or public.has_role('staff') or public.has_role('trainer')) then raise exception 'not_authorized'; end if;
  select * into plan_row from public.membership_plans where id = p_plan_id and status = 'active' for share;
  if not found then raise exception 'plan_not_active'; end if;
  if p_agreed_price < 0 then raise exception 'invalid_price'; end if;
  expiry := coalesce(p_expires_on, p_starts_on + plan_row.duration_days);
  if expiry < p_starts_on then raise exception 'invalid_dates'; end if;
  insert into public.customer_memberships (customer_id, plan_id, plan_name_snapshot, session_count_snapshot, duration_days_snapshot, price_snapshot, currency_snapshot, total_sessions, used_sessions, starts_on, expires_on, status)
  values (p_customer_id, p_plan_id, plan_row.name, plan_row.session_count, plan_row.duration_days, p_agreed_price, plan_row.currency, plan_row.session_count, 0, p_starts_on, expiry, 'active') returning id into new_id;
  return new_id;
end $$;
revoke all on function public.assign_customer_membership(uuid, uuid, numeric, date, date) from public;
grant execute on function public.assign_customer_membership(uuid, uuid, numeric, date, date) to authenticated;

create or replace function public.record_membership_usage(p_membership_id uuid, p_amount integer default 1) returns integer
language plpgsql security definer set search_path = public as $$
declare used integer; total integer;
begin
  if not (public.has_role('owner') or public.has_role('manager') or public.has_role('staff') or public.has_role('trainer')) then raise exception 'not_authorized'; end if;
  if p_amount <= 0 then raise exception 'invalid_usage'; end if;
  update public.customer_memberships set used_sessions = used_sessions + p_amount where id = p_membership_id and status = 'active' and used_sessions + p_amount <= total_sessions returning used_sessions, total_sessions into used, total;
  if used is null then raise exception 'usage_exceeds_allowance'; end if;
  return used;
end $$;
revoke all on function public.record_membership_usage(uuid, integer) from public;
grant execute on function public.record_membership_usage(uuid, integer) to authenticated;
