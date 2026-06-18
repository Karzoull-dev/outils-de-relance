import { Check } from "lucide-react";

const ITEMS = [
  "Relances automatiques",
  "Messagerie client intégrée",
  "Factures PDF professionnelles",
  "IBAN · PayPal · Lydia",
  "Conforme droit français",
];

export function TrustBar() {
  return (
    <div className="border-y border-gray-200 bg-gray-50 px-5 py-7 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-4">
        {ITEMS.map((label) => (
          <span key={label} className="flex items-center gap-2.5 text-base text-gray-600">
            <Check className="h-5 w-5 shrink-0 text-emerald-500" />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
