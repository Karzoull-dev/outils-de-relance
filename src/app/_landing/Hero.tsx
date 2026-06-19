"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { DemoModal } from "./DemoModal";

const TITLE_LINE_1 = "Arrêtez de courir";
const TITLE_LINE_2 = "après vos paiements.";

const restContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const restItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function Words({ text, dataAttr }: { text: string; dataAttr: string }) {
  return (
    <>
      {text.split(" ").map((word, i) => (
        <span
          key={i}
          data-word={dataAttr}
          className="mr-[0.25em] inline-block opacity-0"
        >
          {word}
        </span>
      ))}
    </>
  );
}

export function Hero() {
  const [demoOpen, setDemoOpen] = useState(false);
  const [restReady, setRestReady] = useState(false);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const words = titleRef.current?.querySelectorAll<HTMLElement>("[data-word]");

    const tl = gsap.timeline({
      onComplete: () => setRestReady(true),
    });

    tl.fromTo(
      badgeRef.current,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" },
    ).fromTo(
      words ?? [],
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" },
      "-=0.1",
    );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-white px-5 pt-24 pb-20 sm:px-8 sm:pt-36 sm:pb-24">
      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <span
          ref={badgeRef}
          className="mb-7 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 opacity-0"
        >
          <Sparkles className="h-4 w-4" />
          Relances automatiques · 100% gratuit pour démarrer
        </span>

        <h1
          ref={titleRef}
          className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl"
        >
          <span className="block">
            <Words text={TITLE_LINE_1} dataAttr="l1" />
          </span>
          <span className="block text-indigo-600">
            <Words text={TITLE_LINE_2} dataAttr="l2" />
          </span>
        </h1>

        <motion.div
          variants={restContainer}
          initial="hidden"
          animate={restReady ? "show" : "hidden"}
          className="contents"
        >
          <motion.p variants={restItem} className="mt-7 max-w-2xl text-lg text-gray-500 sm:text-xl">
            Relancio envoie automatiquement vos emails de relance jusqu&apos;au règlement.
            Vous créez la facture, on s&apos;occupe du reste.
          </motion.p>

          <motion.div variants={restItem} className="mt-11 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/signup"
              className="btn-glow-pulse inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-indigo-700"
            >
              Commencer gratuitement
              <ArrowRight className="h-5 w-5" />
            </Link>
            <button
              type="button"
              onClick={() => setDemoOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-8 py-4 text-base font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              <Play className="h-5 w-5" />
              Voir la démo
            </button>
          </motion.div>

          <motion.p variants={restItem} className="mt-6 text-sm text-gray-400">
            Sans carte bancaire · Aucune installation · Conforme droit français
          </motion.p>

          <motion.div
            variants={restItem}
            className="mt-16 w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-gray-200/60"
          >
            <div className="flex items-center gap-3 border-b border-gray-200 bg-gray-50 px-4 py-3">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-red-400" />
                <span className="h-3 w-3 rounded-full bg-yellow-400" />
                <span className="h-3 w-3 rounded-full bg-green-400" />
              </div>
              <span className="mx-auto rounded-md bg-white px-4 py-1 text-xs text-gray-400">
                app.relancio.fr/dashboard
              </span>
            </div>
            <Image
              src="/landing/dashboard-preview.png"
              alt="Aperçu du tableau de bord Relancio"
              width={1280}
              height={420}
              className="w-full"
              priority
            />
          </motion.div>
        </motion.div>
      </div>

      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </section>
  );
}
