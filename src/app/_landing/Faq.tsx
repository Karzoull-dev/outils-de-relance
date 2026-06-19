"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

const QUESTIONS = [
  {
    q: "Est-ce vraiment gratuit ?",
    a: "Oui, Relancio est entièrement gratuit pour démarrer. Aucune carte bancaire requise, aucune limite de durée.",
  },
  {
    q: "Mon client doit-il créer un compte ?",
    a: "Non. Il reçoit un email avec un lien unique sécurisé. En un clic, il peut voir la facture, la télécharger, et vous envoyer un message.",
  },
  {
    q: "Quels moyens de paiement puis-je proposer ?",
    a: "IBAN, PayPal, Lydia, ou n'importe quel autre moyen en texte libre. Votre client voit clairement comment vous régler dans l'email.",
  },
  {
    q: "Les factures sont-elles conformes à la loi française ?",
    a: "Oui. Numéro séquentiel, SIRET, TVA, et mention légale des pénalités de retard (art. L441-10 C. com.) — tout y est.",
  },
  {
    q: "Mes données sont-elles sécurisées ?",
    a: "Chaque facture possède un lien unique et imprévisible. Vos données ne sont jamais partagées. Chaque utilisateur n'accède qu'à ses propres données.",
  },
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="scroll-mt-20 bg-white px-5 py-24 sm:px-8 sm:py-36">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-base font-semibold tracking-wide text-indigo-600 uppercase">FAQ</p>
        <h2 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Questions fréquentes
        </h2>
        <p className="mt-5 text-lg text-gray-500">
          Tout ce que vous devez savoir avant de commencer.
        </p>
      </div>

      <div className="mx-auto mt-14 max-w-3xl divide-y divide-gray-200 border-y border-gray-200">
        {QUESTIONS.map(({ q, a }, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={q}>
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 py-6 text-left"
              >
                <span className="text-base font-medium text-gray-900">{q}</span>
                <motion.span
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0 text-gray-400"
                >
                  <Plus className="h-5 w-5" />
                </motion.span>
              </button>
              <motion.div
                initial={false}
                animate={{ height: isOpen ? "auto" : 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <p className="pb-6 text-base leading-relaxed text-gray-500">{a}</p>
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
