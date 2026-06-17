-- Permet d'épingler une facture pour la mettre en avant sur le tableau de bord
alter table public.invoices
  add column if not exists pinned boolean not null default false;
