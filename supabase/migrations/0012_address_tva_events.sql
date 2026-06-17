-- Ajoute l'adresse et le numéro de TVA du client sur les factures
alter table public.invoices
  add column if not exists client_address text,
  add column if not exists client_tva text;

-- Table d'historique des événements d'une facture (modifications, paiement, épinglage…)
create table if not exists public.invoice_events (
  id          uuid        primary key default gen_random_uuid(),
  invoice_id  uuid        not null references public.invoices(id) on delete cascade,
  event_type  text        not null, -- 'updated' | 'paid' | 'pinned' | 'unpinned'
  description text        not null default '',
  created_at  timestamptz not null default now()
);

create index if not exists invoice_events_invoice_id_idx
  on public.invoice_events (invoice_id);

alter table public.invoice_events enable row level security;

create policy "select_events_own_invoices"
  on public.invoice_events for select
  using (
    exists (
      select 1 from public.invoices
      where id = invoice_id and user_id = auth.uid()
    )
  );

create policy "insert_events_own_invoices"
  on public.invoice_events for insert
  with check (
    exists (
      select 1 from public.invoices
      where id = invoice_id and user_id = auth.uid()
    )
  );
