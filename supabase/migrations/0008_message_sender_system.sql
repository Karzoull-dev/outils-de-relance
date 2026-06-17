-- Autoriser les messages système (ex: relances automatiques) dans une conversation
alter table public.invoice_messages
  drop constraint if exists invoice_messages_sender_check;

alter table public.invoice_messages
  add constraint invoice_messages_sender_check check (sender in ('client', 'owner', 'system'));
