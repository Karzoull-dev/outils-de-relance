import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export function PaymentInfo({
  method,
  value,
  locale,
}: {
  method: string;
  value: string;
  locale: Locale;
}) {
  const t = getDictionary(locale);

  if (method === "iban") {
    return (
      <p>
        {t.paymentInfo.iban} <span className="font-mono">{value}</span>
      </p>
    );
  }

  if (method === "lydia") {
    return (
      <p>
        {t.paymentInfo.lydia} <span className="font-mono">{value}</span>
      </p>
    );
  }

  const paymentLinkLabels: Record<string, string> = {
    paypal: t.paymentInfo.payViaPaypal,
    other: t.paymentInfo.paymentLink,
  };

  return (
    <a
      href={value}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block max-w-50 rounded-lg bg-accent px-4 py-2 text-center font-medium text-accent-foreground transition-colors hover:bg-accent-hover"
    >
      {paymentLinkLabels[method] ?? t.paymentInfo.paymentLink}
    </a>
  );
}
