"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { DemoModal } from "./DemoModal";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function Hero() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <section className="relative overflow-hidden bg-white px-5 pt-20 pb-16 sm:px-8 sm:pt-28 sm:pb-24">
      <motion.div
        className="mx-auto flex max-w-3xl flex-col items-center text-center"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.span
          variants={item}
          className="mb-6 inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3.5 py-1.5 text-xs font-medium text-indigo-700"
        >
          <Sparkles className="h-3.5 w-3.5" />
          100% gratuit pour démarrer
        </motion.span>

        <motion.h1
          variants={item}
          className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl"
        >
          Fini les factures impayées.
          <br />
          <span className="text-indigo-600">Relancio s&apos;en occupe.</span>
        </motion.h1>

        <motion.p variants={item} className="mt-5 max-w-xl text-base text-gray-500 sm:text-lg">
          Créez vos factures, choisissez votre moyen de paiement, et laissez Relancio relancer
          vos clients automatiquement jusqu&apos;au règlement.
        </motion.p>

        <motion.div variants={item} className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/signup"
            className="btn-glow-pulse inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
          >
            Commencer gratuitement
            <ArrowRight className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={() => setDemoOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            <Play className="h-4 w-4" />
            Voir la démo
          </button>
        </motion.div>

        <motion.p variants={item} className="mt-5 text-xs text-gray-400">
          Sans carte bancaire · Aucune installation
        </motion.p>
      </motion.div>

      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </section>
  );
}
