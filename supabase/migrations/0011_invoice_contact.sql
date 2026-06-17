-- Ajoute les informations du contact à qui la facture est destinée
alter table public.invoices
  add column if not exists client_contact_name text,
  add column if not exists client_contact_role text;
