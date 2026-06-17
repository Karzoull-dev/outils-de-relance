-- Permet d'épingler une facture pour la mettre en avant sur le tableau de bord
alter table public.invoices
  add column if not exists pinned boolean not null default false;

-- Ajoute les informations du contact à qui la facture est destinée
alter table public.invoices
  add column if not exists client_contact_name text,
  add column if not exists client_contact_role text;
