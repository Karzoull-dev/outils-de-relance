-- Lien public unique par facture (utilisé pour la page publique /f/[token])
alter table public.invoices
  add column if not exists public_token uuid not null default gen_random_uuid() unique;

-- Messages laissés par le client sur la page publique
create table if not exists public.invoice_messages (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists invoice_messages_invoice_id_idx on public.invoice_messages (invoice_id);

alter table public.invoice_messages enable row level security;

-- Seul le propriétaire de la facture peut voir les messages associés
create policy "Les utilisateurs voient les messages de leurs factures"
  on public.invoice_messages for select
  using (
    exists (
      select 1 from public.invoices
      where invoices.id = invoice_messages.invoice_id
      and invoices.user_id = auth.uid()
    )
  );

-- Pas de policy insert/update/delete : l'écriture se fait uniquement via
-- la clé secrète (admin), utilisée côté serveur sur la page publique.
