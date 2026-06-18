"use client";

import { motion } from "framer-motion";
import { Bell, MessageCircle, FileText, CreditCard, BarChart3, Lock } from "lucide-react";

const FEATURES = [
  {
    icon: Bell,
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-600",
    title: "Relances automatiques",
    description: "J-3, J0, J+7, J+14, J+30 — les emails partent seuls jusqu'au paiement.",
  },
  {
    icon: MessageCircle,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    title: "Messagerie client",
    description: "Votre client répond directement depuis l'email. Tout est centralisé.",
  },
  {
    icon: FileText,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-600",
    title: "Factures PDF",
    description: "Factures conformes à la réglementation française, téléchargeables.",
  },
  {
    icon: CreditCard,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
    title: "Votre moyen de paiement",
    description: "IBAN, PayPal, Lydia — votre client sait exactement comment payer.",
  },
  {
    icon: BarChart3,
    iconBg: "bg-red-50",
    iconColor: "text-red-600",
    title: "Tableau de bord",
    description: "En attente, en retard, payée — aperçu clair de toutes vos factures.",
  },
  {
    icon: Lock,
    iconBg: "bg-sky-50",
    iconColor: "text-sky-600",
    title: "Données sécurisées",
    description: "Chaque facture a un lien unique et privé. Vos données restent les vôtres.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const card = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function Features() {
  return (
    <section id="features" className="scroll-mt-20 bg-white px-5 py-20 sm:px-8 sm:py-28">
      <motion.div
        className="mx-auto max-w-2xl text-center"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-sm font-semibold tracking-wide text-indigo-600 uppercase">
          Fonctionnalités
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Tout ce qu&apos;il vous faut, rien de superflu
        </h2>
        <p className="mt-4 text-base text-gray-500">
          Pensé pour les freelances et indépendants qui veulent être payés, pas gérer un
          logiciel.
        </p>
      </motion.div>

      <motion.div
        className="mx-auto mt-14 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        {FEATURES.map(({ icon: Icon, iconBg, iconColor, title, description }) => (
          <motion.div
            key={title}
            variants={card}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border border-gray-200 bg-white p-6 transition-colors hover:border-indigo-300"
          >
            <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconBg} ${iconColor}`}>
              <Icon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 text-base font-semibold text-gray-900">{title}</h3>
            <p className="mt-1.5 text-sm text-gray-500">{description}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
