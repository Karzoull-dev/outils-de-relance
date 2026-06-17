-- Distinguer qui a écrit le message : le client ou vous (propriétaire de la facture)
alter table public.invoice_messages
  add column if not exists sender text not null default 'client' check (sender in ('client', 'owner'));

-- Suivi de lecture : un message du client reste "non lu" jusqu'à ce que vous ouvriez la conversation
alter table public.invoice_messages
  add column if not exists read_at timestamptz;

-- Vous pouvez répondre à un client sur vos propres factures
create policy "Les utilisateurs peuvent répondre sur leurs factures"
  on public.invoice_messages for insert
  with check (
    sender = 'owner'
    and exists (
      select 1 from public.invoices
      where invoices.id = invoice_messages.invoice_id
      and invoices.user_id = auth.uid()
    )
  );

-- Vous pouvez marquer les messages de vos factures comme lus
create policy "Les utilisateurs peuvent marquer les messages comme lus"
  on public.invoice_messages for update
  using (
    exists (
      select 1 from public.invoices
      where invoices.id = invoice_messages.invoice_id
      and invoices.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.invoices
      where invoices.id = invoice_messages.invoice_id
      and invoices.user_id = auth.uid()
    )
  );
