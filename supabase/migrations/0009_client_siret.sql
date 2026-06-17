-- Ajoute le numéro de SIRET du client sur les factures
alter table public.invoices
  add column if not exists client_siret text;
