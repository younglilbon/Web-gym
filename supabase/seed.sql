-- Development-only sample data. Run after 001_initial_schema.sql and
-- 002_core_completion.sql. No auth.users/profile rows are fabricated here.
insert into public.membership_plans (id, name, description, session_count, duration_days, price, currency)
values
  ('10000000-0000-0000-0000-000000000001', '12 buổi Personal Training', 'Lộ trình 1:1 trong 8 tuần', 12, 56, 4800000, 'VND'),
  ('10000000-0000-0000-0000-000000000002', '8 buổi Small Group', 'Tập nhóm nhỏ tối đa 4 người', 8, 45, 2400000, 'VND')
on conflict (id) do nothing;

insert into public.leads (id, full_name, phone, email, preferred_locale, source, status, goals)
values
  ('20000000-0000-0000-0000-000000000001', 'Nguyễn Minh Anh', '0901234567', 'minhanh@example.com', 'vi', 'website', 'qualified', 'Tăng sức mạnh và cải thiện tư thế'),
  ('20000000-0000-0000-0000-000000000002', 'Trần Quốc Bảo', '0912345678', 'quocbao@example.com', 'vi', 'referral', 'contacted', 'Giảm mỡ và duy trì thói quen tập luyện')
on conflict (id) do nothing;

insert into public.customers (id, lead_id, full_name, phone, email, status)
values
  ('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'Nguyễn Minh Anh', '0901234567', 'minhanh@example.com', 'active'),
  ('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', 'Trần Quốc Bảo', '0912345678', 'quocbao@example.com', 'active')
on conflict (id) do nothing;

insert into public.customer_memberships
  (id, customer_id, plan_id, plan_name_snapshot, session_count_snapshot,
   duration_days_snapshot, price_snapshot, currency_snapshot, starts_on,
   expires_on, total_sessions, used_sessions, status)
values
  ('40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001',
   '10000000-0000-0000-0000-000000000001', '12 buổi Personal Training', 12,
   56, 4800000, 'VND', date '2026-09-01', date '2026-10-27', 12, 8, 'active'),
  ('40000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000002',
   '10000000-0000-0000-0000-000000000002', '8 buổi Small Group', 8,
   45, 2400000, 'VND', date '2026-09-20', date '2026-11-03', 8, 4, 'active')
on conflict (id) do nothing;

insert into public.payments
  (id, customer_id, membership_id, amount, currency, paid_at, payment_method,
   status, reference_code)
values
  ('50000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001',
   '40000000-0000-0000-0000-000000000001', 4800000, 'VND',
   timestamptz '2026-09-01 09:00:00+07', 'bank_transfer', 'paid',
   'FM-DEMO-0001'),
  ('50000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000002',
   '40000000-0000-0000-0000-000000000002', 2400000, 'VND',
   timestamptz '2026-09-20 09:00:00+07', 'cash', 'paid',
   'FM-DEMO-0002')
on conflict (id) do nothing;

insert into public.progress_records
  (id, customer_id, measured_on, weight_kg, body_fat_percentage, measurements, notes)
values
  ('60000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001',
   date '2026-09-01', 62.40, 24.50,
   '{"waist_cm": 74, "chest_cm": 88, "hip_cm": 94}'::jsonb,
   'Mốc đo ban đầu'),
  ('60000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000002',
   date '2026-09-20', 78.10, 22.00,
   '{"waist_cm": 86, "chest_cm": 101, "hip_cm": 98}'::jsonb,
   'Mốc đo ban đầu')
on conflict (id) do nothing;

-- Training sessions and session records intentionally require a real
-- authenticated trainer profile, so they are created through the dashboard or
-- a project-specific auth seed after an auth user exists.
