-- Historique des relances envoyées, pour ne jamais envoyer deux fois la même
create table if not exists public.reminder_logs (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  reminder_type text not null check (reminder_type in ('J-3', 'J0', 'J+7', 'J+14', 'J+30')),
  sent_at timestamptz not null default now(),
  unique (invoice_id, reminder_type)
);

create index if not exists reminder_logs_invoice_id_idx on public.reminder_logs (invoice_id);

alter table public.reminder_logs enable row level security;

-- Les utilisateurs peuvent voir l'historique des relances de leurs propres factures
create policy "Les utilisateurs voient les relances de leurs factures"
  on public.reminder_logs for select
  using (
    exists (
      select 1 from public.invoices
      where invoices.id = reminder_logs.invoice_id
      and invoices.user_id = auth.uid()
    )
  );

-- Pas de policy insert/update/delete : écriture via la clé secrète (admin),
-- utilisée uniquement par la tâche planifiée (cron) côté serveur.
