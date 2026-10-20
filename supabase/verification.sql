-- Run after all migrations in Supabase SQL Editor.
-- These checks should return rows/counts without exposing private data to anon.

select table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in (
    'profiles', 'user_roles', 'leads', 'consultation_requests', 'customers',
    'membership_plans', 'customer_memberships', 'training_sessions',
    'training_session_participants', 'session_records', 'payments',
    'progress_records', 'notifications'
  )
order by table_name;

select relname as table_name, relrowsecurity as rls_enabled
from pg_class
where relnamespace = 'public'::regnamespace
  and relname in (
    'profiles', 'user_roles', 'leads', 'consultation_requests', 'customers',
    'membership_plans', 'customer_memberships', 'training_sessions',
    'training_session_participants', 'session_records', 'payments',
    'progress_records', 'notifications'
  )
order by relname;

select indexname, tablename
from pg_indexes
where schemaname = 'public'
  and tablename in ('training_sessions', 'session_records', 'progress_records', 'notifications', 'payments')
order by tablename, indexname;

-- Consultation submissions are stored in leads/consultation_requests and have
-- no payment foreign key. Verify the separate payment ownership path instead:
-- payments.customer_id -> customers.id and payments.membership_id ->
-- customer_memberships.id. A payment can only be recorded after a customer
-- and (when applicable) a membership exist; the consultation RPC itself does
-- not insert either table.
select count(*) as orphan_payment_count
from public.payments p
left join public.customers c on c.id = p.customer_id
where c.id is null;
