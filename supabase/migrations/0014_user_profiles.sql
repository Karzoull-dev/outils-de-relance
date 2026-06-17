create table if not exists public.user_profiles (
  id          uuid        primary key references auth.users(id) on delete cascade,
  display_name text,
  email        text,
  address      text,
  siret        text,
  tva          text,
  updated_at   timestamptz not null default now()
);

alter table public.user_profiles enable row level security;

create policy "select_own_profile" on public.user_profiles
  for select using (id = auth.uid());

create policy "insert_own_profile" on public.user_profiles
  for insert with check (id = auth.uid());

create policy "update_own_profile" on public.user_profiles
  for update using (id = auth.uid());
