-- Practical duplicate prevention for active customer records.
create unique index if not exists customers_phone_unique_idx on public.customers(phone) where status <> 'archived';
create unique index if not exists customers_email_unique_idx on public.customers(lower(email)) where email is not null and status <> 'archived';
