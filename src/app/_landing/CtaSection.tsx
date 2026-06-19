"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";

export function CtaSection() {
  const btnRef = useRef<HTMLAnchorElement>(null);

  function handleEnter() {
    gsap.to(btnRef.current, { scale: 1.04, duration: 0.2, ease: "power2.out" });
  }

  function handleLeave() {
    gsap.to(btnRef.current, { scale: 1, duration: 0.2, ease: "power2.out" });
  }

  return (
    <section className="bg-indigo-600 px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Prêt à être payé
          <br />
          plus vite ?
        </h2>
        <p className="mt-5 text-lg text-indigo-100">
          Rejoignez des freelances qui ont arrêté de relancer à la main.
        </p>
        <Link
          ref={btnRef}
          href="/signup"
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
          className="mt-9 rounded-xl border border-white bg-transparent px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-white/10"
        >
          Commencer gratuitement
        </Link>
        <p className="mt-5 text-sm text-indigo-200">
          Sans carte bancaire · Aucune installation
        </p>
      </div>
    </section>
  );
}
