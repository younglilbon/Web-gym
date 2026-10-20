-- Lead management and explicit conversion workflow.
alter table public.leads
  add column if not exists preferred_contact_method text not null default 'phone',
  add column if not exists last_contacted_at timestamptz,
  add column if not exists follow_up_at timestamptz,
  add column if not exists consent_at timestamptz;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'leads_contact_method_valid') then
    alter table public.leads add constraint leads_contact_method_valid
      check (preferred_contact_method in ('phone', 'email', 'sms', 'zalo', 'other'));
  end if;
end;
$$;

create index if not exists leads_follow_up_idx on public.leads(follow_up_at, status);
create index if not exists leads_created_at_idx on public.leads(created_at desc);
create unique index if not exists customers_one_conversion_per_lead_idx
  on public.customers(lead_id) where lead_id is not null;

-- Trainers must be able to work their own lead pipeline. RLS remains the final boundary.
drop policy if exists "staff can read leads" on public.leads;
create policy "staff can read leads" on public.leads for select to authenticated
using (public.has_role('owner') or public.has_role('manager') or public.has_role('staff') or public.has_role('trainer') or assigned_to = auth.uid());
drop policy if exists "staff can manage leads" on public.leads;
create policy "staff can manage leads" on public.leads for all to authenticated
using (public.has_role('owner') or public.has_role('manager') or public.has_role('staff') or public.has_role('trainer'))
with check (public.has_role('owner') or public.has_role('manager') or public.has_role('staff') or public.has_role('trainer'));

create or replace function public.convert_lead_to_customer(
  p_lead_id uuid,
  p_full_name text default null,
  p_phone text default null,
  p_email text default null
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  lead_row public.leads%rowtype;
  existing_customer uuid;
  new_customer uuid;
begin
  if not (public.has_role('owner') or public.has_role('manager') or public.has_role('staff') or public.has_role('trainer')) then
    raise exception 'not_authorized';
  end if;
  select * into lead_row from public.leads where id = p_lead_id for update;
  if not found then raise exception 'lead_not_found'; end if;
  select id into existing_customer from public.customers where lead_id = p_lead_id limit 1;
  if existing_customer is not null then return existing_customer; end if;
  if coalesce(nullif(trim(p_full_name), ''), lead_row.full_name) is null
     or coalesce(nullif(trim(p_phone), ''), lead_row.phone) is null then
    raise exception 'customer_details_required';
  end if;
  insert into public.customers (lead_id, full_name, phone, email, status)
  values (p_lead_id, coalesce(nullif(trim(p_full_name), ''), lead_row.full_name), coalesce(nullif(trim(p_phone), ''), lead_row.phone), coalesce(nullif(trim(p_email), ''), lead_row.email), 'active')
  returning id into new_customer;
  update public.leads set status = 'converted', updated_at = now() where id = p_lead_id;
  return new_customer;
end;
$$;
revoke all on function public.convert_lead_to_customer(uuid, text, text, text) from public;
grant execute on function public.convert_lead_to_customer(uuid, text, text, text) to authenticated;

-- Replace the public intake function with validation and consent/honeypot checks.
create or replace function public.submit_consultation(payload jsonb) returns uuid
language plpgsql security definer set search_path = public as $$
declare new_lead_id uuid;
begin
  if coalesce(payload->>'website', '') <> '' then raise exception 'spam_rejected'; end if;
  if coalesce((payload->>'consent')::boolean, false) is not true then raise exception 'consent_required'; end if;
  insert into public.leads(full_name, phone, email, preferred_locale, source, goals, preferred_contact_method, consent_at)
  values (payload->>'full_name', payload->>'phone', nullif(payload->>'email', ''), coalesce(payload->>'preferred_locale', 'vi'), 'website', coalesce(payload->>'goals', ''), coalesce(payload->>'preferred_contact_method', 'phone'), now())
  returning id into new_lead_id;
  insert into public.consultation_requests(lead_id, message) values (new_lead_id, nullif(payload->>'goals', ''));
  return new_lead_id;
end; $$;
revoke all on function public.submit_consultation(jsonb) from public;
grant execute on function public.submit_consultation(jsonb) to anon, authenticated;
