-- Table des factures suivies par chaque utilisateur
create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  client_name text not null,
  client_email text not null,
  amount numeric(12, 2) not null check (amount > 0),
  currency text not null default 'EUR' check (currency in ('EUR', 'USD', 'GBP')),
  due_date date not null,
  payment_details text,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists invoices_user_id_idx on public.invoices (user_id);

-- Active la sécurité au niveau des lignes : chaque utilisateur ne voit/modifie que ses factures
alter table public.invoices enable row level security;

create policy "Les utilisateurs voient leurs propres factures"
  on public.invoices for select
  using (auth.uid() = user_id);

create policy "Les utilisateurs créent leurs propres factures"
  on public.invoices for insert
  with check (auth.uid() = user_id);

create policy "Les utilisateurs modifient leurs propres factures"
  on public.invoices for update
  using (auth.uid() = user_id);

create policy "Les utilisateurs suppriment leurs propres factures"
  on public.invoices for delete
  using (auth.uid() = user_id);
