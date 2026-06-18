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
    q: "Comment fonctionne la relance automatique ?",
    a: "Dès qu'une facture est créée, Relancio envoie des emails selon un calendrier : J-3, J0, J+7, J+14, J+30. Les relances s'arrêtent dès que vous marquez la facture comme payée.",
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
    q: "Mes données sont-elles sécurisées ?",
    a: "Chaque facture possède un lien unique et imprévisible. Vos données ne sont jamais partagées. Chaque utilisateur n'accède qu'à ses propres données.",
  },
  {
    q: "Les factures sont-elles conformes à la loi française ?",
    a: "Oui. Numéro séquentiel, SIRET, TVA, et mention légale des pénalités de retard (art. L441-10 C. com.) — tout y est.",
  },
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="scroll-mt-20 bg-white px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold tracking-wide text-indigo-600 uppercase">FAQ</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Questions fréquentes
        </h2>
        <p className="mt-4 text-base text-gray-500">
          Tout ce que vous devez savoir avant de commencer.
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-2xl divide-y divide-gray-200 border-y border-gray-200">
        {QUESTIONS.map(({ q, a }, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={q}>
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left"
              >
                <span className="text-sm font-medium text-gray-900">{q}</span>
                <motion.span
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0 text-gray-400"
                >
                  <Plus className="h-4 w-4" />
                </motion.span>
              </button>
              <motion.div
                initial={false}
                animate={{ height: isOpen ? "auto" : 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <p className="pb-5 text-sm leading-relaxed text-gray-500">{a}</p>
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
