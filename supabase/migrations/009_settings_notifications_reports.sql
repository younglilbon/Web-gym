alter table public.notifications add column if not exists event_key text;
create unique index if not exists notifications_event_key_idx on public.notifications(recipient_id, event_key) where event_key is not null;
create table if not exists public.studio_settings (
  id boolean primary key default true check (id), studio_name text not null default 'FitManager', email text, phone text,
  address text, default_locale text not null default 'vi' check (default_locale in ('vi','en')),
  date_format text not null default 'DD/MM/YYYY', timezone text not null default 'Asia/Ho_Chi_Minh',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
insert into public.studio_settings default values on conflict (id) do nothing;
alter table public.studio_settings enable row level security;
drop policy if exists "staff can read studio settings" on public.studio_settings;
create policy "staff can read studio settings" on public.studio_settings for select to authenticated using (public.has_any_role(array['owner','manager','trainer','staff']));
drop policy if exists "owners can update studio settings" on public.studio_settings;
create policy "owners can update studio settings" on public.studio_settings for update to authenticated using (public.has_any_role(array['owner','manager'])) with check (public.has_any_role(array['owner','manager']));
drop trigger if exists studio_settings_set_updated_at on public.studio_settings;
create trigger studio_settings_set_updated_at before update on public.studio_settings for each row execute function public.set_updated_at();
