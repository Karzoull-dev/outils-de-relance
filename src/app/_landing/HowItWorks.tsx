"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

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
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const circles = gridRef.current?.querySelectorAll<HTMLElement>("[data-step-circle]");
    if (!circles) return;

    const hoverHandlers = Array.from(circles).map((circle) => {
      const onEnter = () => gsap.to(circle, { scale: 1.15, duration: 0.2, ease: "power2.out" });
      const onLeave = () => gsap.to(circle, { scale: 1, duration: 0.2, ease: "power2.out" });
      circle.addEventListener("mouseenter", onEnter);
      circle.addEventListener("mouseleave", onLeave);
      return { circle, onEnter, onLeave };
    });

    return () => {
      hoverHandlers.forEach(({ circle, onEnter, onLeave }) => {
        circle.removeEventListener("mouseenter", onEnter);
        circle.removeEventListener("mouseleave", onLeave);
      });
    };
  }, []);

  return (
    <section className="bg-gray-50 px-5 py-24 sm:px-8 sm:py-36">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-base font-semibold tracking-wide text-indigo-600 uppercase">
          Comment ça marche
        </p>
        <h2 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          En 3 étapes, c&apos;est réglé
        </h2>
      </div>

      <div ref={gridRef} className="mx-auto mt-16 grid max-w-4xl gap-12 sm:grid-cols-3">
        {STEPS.map(({ title, description, done }, i) => (
          <div key={title} className="flex flex-col items-center text-center">
            <span
              data-step-circle
              className={`flex h-16 w-16 items-center justify-center rounded-full text-lg font-semibold text-white ${
                done ? "bg-emerald-500" : "bg-indigo-600"
              }`}
            >
              {done ? <Check className="h-7 w-7" /> : i + 1}
            </span>
            <h3 className="mt-6 text-lg font-semibold text-gray-900">{title}</h3>
            <p className="mt-2 text-base text-gray-500">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
