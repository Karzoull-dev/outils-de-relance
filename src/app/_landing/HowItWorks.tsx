"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const STEPS = [
  {
    title: "Créez la facture",
    description: "Nom du client, montant, échéance, moyen de paiement. 30 secondes.",
  },
  {
    title: "Relancio relance",
    description: "Les emails partent automatiquement aux bonnes dates sans rien faire.",
  },
  {
    title: "Vous êtes payé",
    description: "Marquez la facture comme réglée. Les relances s'arrêtent.",
    done: true,
  },
];

export function HowItWorks() {
  return (
    <section className="bg-gray-50 px-5 py-20 sm:px-8 sm:py-28">
      <motion.div
        className="mx-auto max-w-2xl text-center"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-sm font-semibold tracking-wide text-indigo-600 uppercase">
          Comment ça marche
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          En 3 étapes, c&apos;est réglé
        </h2>
      </motion.div>

      <div className="mx-auto mt-14 grid max-w-4xl gap-10 sm:grid-cols-3">
        {STEPS.map(({ title, description, done }, i) => (
          <motion.div
            key={title}
            className="flex flex-col items-center text-center"
            initial="rest"
            whileHover="hover"
            animate="rest"
          >
            <motion.span
              variants={{ rest: { scale: 1 }, hover: { scale: 1.15 } }}
              transition={{ duration: 0.2 }}
              className={`flex h-12 w-12 items-center justify-center rounded-full text-base font-semibold text-white ${
                done ? "bg-emerald-500" : "bg-indigo-600"
              }`}
            >
              {done ? <Check className="h-5 w-5" /> : i + 1}
            </motion.span>
            <h3 className="mt-5 text-base font-semibold text-gray-900">{title}</h3>
            <p className="mt-1.5 text-sm text-gray-500">{description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
