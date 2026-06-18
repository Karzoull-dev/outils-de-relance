"use client";

import { motion } from "framer-motion";
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
    <div className="border-y border-gray-200 bg-gray-50 px-5 py-5 sm:px-8">
      <motion.div
        className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-8 gap-y-3"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.5 }}
      >
        {ITEMS.map((label) => (
          <span key={label} className="flex items-center gap-2 text-sm text-gray-600">
            <Check className="h-4 w-4 shrink-0 text-emerald-500" />
            {label}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
