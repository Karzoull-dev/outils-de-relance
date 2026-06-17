-- Remplace l'option "stripe" par "lydia" dans les moyens de paiement disponibles
update public.invoices set payment_method = 'other' where payment_method = 'stripe';

alter table public.invoices
  drop constraint if exists invoices_payment_method_check;

alter table public.invoices
  add constraint invoices_payment_method_check
    check (payment_method in ('iban', 'paypal', 'lydia', 'other'));
