import type { Locale } from "./i18n/config";
import { getDictionary } from "./i18n/dictionaries";

export type PaymentMethod = "iban" | "paypal" | "lydia" | "other";

export const PAYMENT_METHOD_KEYS: PaymentMethod[] = ["iban", "paypal", "lydia", "other"];

export function getPaymentMethods(
  locale: Locale,
): Record<PaymentMethod, { label: string; placeholder: string; helper: string }> {
  return getDictionary(locale).paymentMethods;
}
