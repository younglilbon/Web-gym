alter table public.progress_records add column if not exists height_cm numeric(6,2);
do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'progress_height_valid') then
    alter table public.progress_records add constraint progress_height_valid check (height_cm is null or height_cm between 50 and 260);
  end if;
end $$;
create index if not exists progress_records_customer_measured_idx on public.progress_records(customer_id, measured_on desc);
