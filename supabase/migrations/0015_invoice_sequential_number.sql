-- Numérotation séquentielle des factures, sans trou, par utilisateur.
-- Obligation légale française : les factures doivent suivre une numérotation
-- chronologique continue (art. A441-1 et suivants du Code de commerce).

-- 1. Table de compteur par utilisateur
create table if not exists public.invoice_number_counters (
  user_id uuid primary key references auth.users(id) on delete cascade,
  last_number integer not null default 0
);

alter table public.invoice_number_counters enable row level security;
-- Pas de policy : seule la fonction trigger (security definer) y accède.

-- 2. Colonne number sur invoices
alter table public.invoices add column if not exists number integer;

-- 3. Backfill des factures existantes (numérotation par ordre de création)
with ranked as (
  select id, user_id,
         row_number() over (partition by user_id order by created_at, id) as rn
  from public.invoices
  where number is null
)
update public.invoices i
set number = r.rn
from ranked r
where i.id = r.id;

-- 4. Initialise les compteurs à partir du backfill
insert into public.invoice_number_counters (user_id, last_number)
select user_id, max(number)
from public.invoices
group by user_id
on conflict (user_id) do update set last_number = excluded.last_number;

-- 5. Contraintes : number obligatoire et unique par utilisateur
alter table public.invoices alter column number set not null;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'invoices_user_number_unique'
  ) then
    alter table public.invoices
      add constraint invoices_user_number_unique unique (user_id, number);
  end if;
end $$;

-- 6. Fonction + trigger : assigne le prochain numéro à l'insertion
create or replace function public.assign_invoice_number()
returns trigger as $$
declare
  next_number integer;
begin
  insert into public.invoice_number_counters (user_id, last_number)
  values (new.user_id, 1)
  on conflict (user_id) do update
    set last_number = invoice_number_counters.last_number + 1
  returning last_number into next_number;

  new.number := next_number;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists set_invoice_number on public.invoices;

create trigger set_invoice_number
  before insert on public.invoices
  for each row
  when (new.number is null)
  execute function public.assign_invoice_number();
