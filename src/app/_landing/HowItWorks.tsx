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
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const circleRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    const first = circleRefs.current[0];
    const last = circleRefs.current[circleRefs.current.length - 1];
    if (!container || !first || !last) return;

    function positionLine() {
      const containerRect = container!.getBoundingClientRect();
      const firstRect = first!.getBoundingClientRect();
      const lastRect = last!.getBoundingClientRect();
      const top = firstRect.top - containerRect.top + firstRect.height / 2;
      const bottom = lastRect.top - containerRect.top + lastRect.height / 2;
      const height = bottom - top;
      [trackRef.current, lineRef.current].forEach((el) => {
        if (el) {
          el.style.top = `${top}px`;
          el.style.height = `${height}px`;
        }
      });
    }

    positionLine();
    window.addEventListener("resize", positionLine);

    const isMobile = window.innerWidth < 768;

    const tween = gsap.fromTo(
      lineRef.current,
      { scaleY: 0 },
      {
        scaleY: 1,
        duration: isMobile ? 0.5 : 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: container,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      },
    );

    return () => {
      window.removeEventListener("resize", positionLine);
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section className="bg-gray-50 px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold tracking-wide text-indigo-600 uppercase">
          Comment ça marche
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          En 3 étapes, c&apos;est réglé
        </h2>
      </div>

      <div ref={containerRef} className="relative mx-auto mt-16 max-w-xs">
        <div ref={trackRef} className="absolute left-1/2 w-0.5 -translate-x-1/2 bg-gray-200" />
        <div
          ref={lineRef}
          className="absolute left-1/2 w-0.5 origin-top -translate-x-1/2 scale-y-0 bg-indigo-600"
        />

        <div className="relative flex flex-col gap-14">
          {STEPS.map(({ title, description, done }, i) => (
            <div
              key={title}
              className="relative z-10 flex flex-col items-center bg-gray-50 text-center"
            >
              <span
                ref={(el) => {
                  circleRefs.current[i] = el;
                }}
                className={`flex h-12 w-12 items-center justify-center rounded-full text-base font-semibold text-white ring-8 ring-gray-50 ${
                  done ? "bg-emerald-500" : "bg-indigo-600"
                }`}
              >
                {done ? <Check className="h-5 w-5" /> : i + 1}
              </span>
              <h3 className="mt-5 text-base font-semibold text-gray-900">{title}</h3>
              <p className="mt-1.5 text-sm text-gray-500">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
