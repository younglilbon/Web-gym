alter table public.payments add column if not exists payment_kind text not null default 'charge';
alter table public.payments add column if not exists notes text;
alter table public.payments add column if not exists idempotency_key text;
alter table public.payments add column if not exists reversal_of uuid references public.payments(id) on delete restrict;
alter table public.payments drop constraint if exists payments_status_valid;
alter table public.payments add constraint payments_status_valid check (status in ('pending', 'paid', 'failed', 'cancelled', 'refunded'));
alter table public.payments add constraint payments_kind_valid check (payment_kind in ('charge', 'refund', 'correction'));
create unique index if not exists payments_idempotency_idx on public.payments(idempotency_key) where idempotency_key is not null;
create index if not exists payments_status_paid_at_idx on public.payments(status, paid_at desc);

drop policy if exists "managers can manage payments" on public.payments;
create policy "managers can manage payments" on public.payments for all to authenticated using (public.has_role('owner') or public.has_role('manager') or public.has_role('staff')) with check (public.has_role('owner') or public.has_role('manager') or public.has_role('staff'));

create or replace function public.record_manual_payment(p_customer_id uuid, p_membership_id uuid, p_amount numeric, p_paid_at timestamptz, p_payment_method text, p_status text, p_reference_code text, p_notes text, p_idempotency_key text) returns uuid
language plpgsql security definer set search_path = public as $$
declare payment_id uuid;
begin
  if not (public.has_role('owner') or public.has_role('manager') or public.has_role('staff')) then raise exception 'not_authorized'; end if;
  if p_amount <= 0 or p_status not in ('pending','paid','failed','cancelled') then raise exception 'invalid_payment'; end if;
  if p_idempotency_key is not null then select id into payment_id from public.payments where idempotency_key = p_idempotency_key; if payment_id is not null then return payment_id; end if; end if;
  insert into public.payments(customer_id, membership_id, amount, currency, paid_at, payment_method, status, reference_code, notes, recorded_by, idempotency_key, payment_kind)
  values (p_customer_id, p_membership_id, p_amount, 'VND', p_paid_at, p_payment_method, p_status, p_reference_code, p_notes, auth.uid(), p_idempotency_key, 'charge') returning id into payment_id;
  return payment_id;
exception when unique_violation then select id into payment_id from public.payments where idempotency_key = p_idempotency_key; return payment_id;
end $$;
revoke all on function public.record_manual_payment(uuid, uuid, numeric, timestamptz, text, text, text, text, text) from public;
grant execute on function public.record_manual_payment(uuid, uuid, numeric, timestamptz, text, text, text, text, text) to authenticated;

create or replace function public.record_payment_refund(p_payment_id uuid, p_amount numeric, p_reason text, p_idempotency_key text) returns uuid
language plpgsql security definer set search_path = public as $$
declare original public.payments%rowtype; refund_id uuid;
begin
  if not (public.has_role('owner') or public.has_role('manager')) then raise exception 'not_authorized'; end if;
  select * into original from public.payments where id = p_payment_id for update;
  if not found or original.status <> 'paid' or p_amount <= 0 or p_amount > original.amount then raise exception 'invalid_refund'; end if;
  if p_idempotency_key is not null then select id into refund_id from public.payments where idempotency_key = p_idempotency_key; if refund_id is not null then return refund_id; end if; end if;
  insert into public.payments(customer_id, membership_id, amount, currency, paid_at, payment_method, status, reference_code, notes, recorded_by, idempotency_key, payment_kind, reversal_of)
  values (original.customer_id, original.membership_id, p_amount, original.currency, now(), original.payment_method, 'refunded', original.reference_code, p_reason, auth.uid(), p_idempotency_key, 'refund', original.id) returning id into refund_id;
  return refund_id;
end $$;
revoke all on function public.record_payment_refund(uuid, numeric, text, text) from public;
grant execute on function public.record_payment_refund(uuid, numeric, text, text) to authenticated;
