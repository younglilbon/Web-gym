-- Booking conflicts are enforced by PostgreSQL, including concurrent requests.
alter table public.training_sessions
  add column if not exists duration_minutes integer;
do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'training_sessions_duration_valid') then
    alter table public.training_sessions add constraint training_sessions_duration_valid check (duration_minutes is null or duration_minutes > 0);
  end if;
end $$;
alter table public.training_sessions drop constraint if exists training_sessions_customer_no_overlap;
alter table public.training_sessions add constraint training_sessions_customer_no_overlap exclude using gist (customer_id with =, tstzrange(starts_at, ends_at, '[)') with &&) where (status = 'scheduled');
create unique index if not exists training_sessions_duplicate_booking_idx on public.training_sessions(customer_id, trainer_id, starts_at) where status = 'scheduled';

create or replace function public.create_training_session(p_customer_id uuid, p_trainer_id uuid, p_starts_at timestamptz, p_duration_minutes integer, p_membership_id uuid default null, p_location text default null, p_internal_notes text default null) returns uuid
language plpgsql security definer set search_path = public as $$
declare session_id uuid; finish_at timestamptz;
begin
  if not (public.has_role('owner') or public.has_role('manager') or public.has_role('staff') or p_trainer_id = auth.uid()) then raise exception 'not_authorized'; end if;
  if p_starts_at < now() - interval '5 minutes' or p_duration_minutes <= 0 then raise exception 'invalid_booking'; end if;
  finish_at := p_starts_at + make_interval(mins => p_duration_minutes);
  insert into public.training_sessions(customer_id, membership_id, trainer_id, starts_at, ends_at, duration_minutes, status, location, internal_notes)
  values (p_customer_id, p_membership_id, p_trainer_id, p_starts_at, finish_at, p_duration_minutes, 'scheduled', p_location, p_internal_notes)
  returning id into session_id;
  return session_id;
exception when exclusion_violation or unique_violation then raise exception 'booking_conflict';
end $$;
revoke all on function public.create_training_session(uuid, uuid, timestamptz, integer, uuid, text, text) from public;
grant execute on function public.create_training_session(uuid, uuid, timestamptz, integer, uuid, text, text) to authenticated;

create or replace function public.complete_training_session(p_session_id uuid, p_summary text, p_internal_notes text default null, p_attendance_status text default 'attended') returns uuid
language plpgsql security definer set search_path = public as $$
declare s public.training_sessions%rowtype; record_id uuid;
begin
  if not (public.has_role('owner') or public.has_role('manager') or public.has_role('staff') or public.has_role('trainer')) then raise exception 'not_authorized'; end if;
  select * into s from public.training_sessions where id = p_session_id for update;
  if not found then raise exception 'session_not_found'; end if;
  if s.status = 'cancelled' or s.status = 'no_show' then raise exception 'session_not_completable'; end if;
  if exists (select 1 from public.session_records where training_session_id = s.id) then select id into record_id from public.session_records where training_session_id = s.id; return record_id; end if;
  insert into public.session_records(training_session_id, customer_id, trainer_id, performed_at, duration_minutes, summary, internal_notes, created_by)
  values (s.id, s.customer_id, s.trainer_id, coalesce(s.starts_at, now()), s.duration_minutes, p_summary, p_internal_notes, auth.uid()) returning id into record_id;
  insert into public.training_session_participants(training_session_id, customer_id, attendance_status) values (s.id, s.customer_id, p_attendance_status) on conflict (training_session_id, customer_id) do update set attendance_status = excluded.attendance_status;
  update public.training_sessions set status = 'completed', internal_notes = coalesce(p_internal_notes, internal_notes) where id = s.id;
  if s.membership_id is not null then perform public.record_membership_usage(s.membership_id, 1); end if;
  return record_id;
end $$;
revoke all on function public.complete_training_session(uuid, text, text, text) from public;
grant execute on function public.complete_training_session(uuid, text, text, text) to authenticated;
