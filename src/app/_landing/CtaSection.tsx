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
    <section className="bg-indigo-600 px-5 py-20 sm:px-8 sm:py-24">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Prêt à être payé plus vite ?
        </h2>
        <p className="mt-4 text-base text-indigo-100">
          Rejoignez des centaines de freelances qui ont arrêté de relancer à la main.
        </p>
        <Link
          ref={btnRef}
          href="/signup"
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
          className="mt-8 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-indigo-600 transition-colors hover:bg-indigo-50"
        >
          Commencer gratuitement
        </Link>
        <p className="mt-4 text-xs text-indigo-200">
          Sans carte bancaire · Aucune installation
        </p>
      </div>
    </section>
  );
}
