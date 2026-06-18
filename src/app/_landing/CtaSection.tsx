"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function CtaSection() {
  return (
    <section className="bg-indigo-600 px-5 py-20 sm:px-8 sm:py-24">
      <motion.div
        className="mx-auto flex max-w-2xl flex-col items-center text-center"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Prêt à être payé plus vite ?
        </h2>
        <p className="mt-4 text-base text-indigo-100">
          Rejoignez des centaines de freelances qui ont arrêté de relancer à la main.
        </p>
        <Link
          href="/signup"
          className="mt-8 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-indigo-600 transition-colors hover:bg-indigo-50"
        >
          Commencer gratuitement
        </Link>
        <p className="mt-4 text-xs text-indigo-200">
          Sans carte bancaire · Aucune installation
        </p>
      </motion.div>
    </section>
  );
}
