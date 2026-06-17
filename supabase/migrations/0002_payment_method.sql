-- Remplace le champ libre "payment_details" par un type de paiement structuré
alter table public.invoices
  drop column if exists payment_details;

alter table public.invoices
  add column if not exists payment_method text not null default 'iban'
    check (payment_method in ('iban', 'paypal', 'stripe', 'other')),
  add column if not exists payment_value text not null default '';
