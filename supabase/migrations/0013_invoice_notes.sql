-- Ajoute un champ notes libres sur chaque facture
alter table public.invoices
  add column if not exists notes text;
