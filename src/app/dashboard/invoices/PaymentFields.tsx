"use client";

import { useState } from "react";
import {
  ChevronDown,
  Landmark,
  Wallet,
  Smartphone,
  MoreHorizontal,
} from "lucide-react";
import { PAYMENT_METHOD_KEYS, getPaymentMethods, type PaymentMethod } from "@/lib/payment-methods";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

const METHOD_ICONS: Record<PaymentMethod, typeof Landmark> = {
  iban: Landmark,
  paypal: Wallet,
  lydia: Smartphone,
  other: MoreHorizontal,
};

export function PaymentFields({
  locale,
  defaultMethod = null,
  defaultValue = "",
}: {
  locale: Locale;
  defaultMethod?: PaymentMethod | null;
  defaultValue?: string;
}) {
  const [expanded, setExpanded] = useState(!!defaultMethod);
  const [method, setMethod] = useState<PaymentMethod | null>(defaultMethod);
  const t = getDictionary(locale);
  const paymentMethods = getPaymentMethods(locale);
  const config = method ? paymentMethods[method] : null;

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-canvas p-3">
      <input
        type="checkbox"
        name="payment_enabled"
        checked={method !== null}
        readOnly
        aria-hidden="true"
        aria-label={t.paymentFields.enabledAriaLabel}
        className="hidden"
      />
      <input type="hidden" name="payment_method" value={method ?? ""} />

      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-muted"
      >
        {t.paymentFields.sectionLabel}
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-300 ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        inert={!expanded}
        className={`grid overflow-hidden transition-all duration-300 ease-in-out ${
          expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="flex min-h-0 flex-col gap-3">
          <div className="grid grid-cols-2 gap-2">
            {PAYMENT_METHOD_KEYS.map((key) => {
              const Icon = METHOD_ICONS[key];
              const isSelected = method === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setMethod(isSelected ? null : key)}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                    isSelected
                      ? "border-2 border-accent text-accent"
                      : "border-border text-muted hover:bg-surface-hover"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {t.paymentFields.short[key]}
                </button>
              );
            })}
          </div>

          <div
            inert={!config}
            className={`grid overflow-hidden transition-all duration-300 ease-in-out ${
              config ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="flex min-h-0 flex-col gap-1">
              <label
                htmlFor="payment_value"
                className="text-xs font-semibold uppercase tracking-wide text-muted"
              >
                {config?.label}
              </label>
              <input
                id="payment_value"
                name="payment_value"
                type="text"
                required={!!config}
                defaultValue={defaultValue}
                placeholder={config?.placeholder}
                className="w-full min-w-0 rounded-lg border border-border bg-surface px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <p className="text-xs text-muted">{config?.helper}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
