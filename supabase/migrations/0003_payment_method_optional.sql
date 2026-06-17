-- Le moyen de paiement devient optionnel : une facture peut n'avoir
-- aucun moyen de paiement (juste des relances sans infos de paiement)
alter table public.invoices
  alter column payment_method drop not null,
  alter column payment_method drop default,
  alter column payment_value drop not null,
  alter column payment_value drop default;
