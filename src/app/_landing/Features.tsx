"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Bell, MessageCircle, FileText, CreditCard, BarChart3, Lock } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  {
    icon: Bell,
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-600",
    title: "Relances automatiques",
    description: "J-3, J0, J+7, J+14, J+30 — les emails partent tout seuls jusqu'au paiement.",
  },
  {
    icon: MessageCircle,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    title: "Messagerie client",
    description: "Votre client répond depuis l'email. Tout l'historique est centralisé.",
  },
  {
    icon: FileText,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-600",
    title: "Factures PDF",
    description: "Conformes au droit français, téléchargeables par vous et votre client.",
  },
  {
    icon: CreditCard,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
    title: "Votre moyen de paiement",
    description: "IBAN, PayPal, Lydia — affiché clairement dans chaque email de relance.",
  },
  {
    icon: BarChart3,
    iconBg: "bg-red-50",
    iconColor: "text-red-600",
    title: "Tableau de bord",
    description: "En attente, en retard, payée — tout d'un coup d'œil.",
  },
  {
    icon: Lock,
    iconBg: "bg-sky-50",
    iconColor: "text-sky-600",
    title: "Données sécurisées",
    description: "Lien unique par facture. Vos données ne sont jamais partagées.",
  },
];

export function Features() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = gridRef.current?.querySelectorAll<HTMLElement>("[data-feature-card]");
    if (!cards || cards.length === 0) return;

    const isMobile = window.innerWidth < 768;

    const tween = gsap.fromTo(
      cards,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: isMobile ? 0.3 : 0.5,
        stagger: isMobile ? 0.03 : 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      },
    );

    const hoverHandlers = Array.from(cards).map((card) => {
      const onEnter = () => gsap.to(card, { y: -4, duration: 0.2, ease: "power2.out" });
      const onLeave = () => gsap.to(card, { y: 0, duration: 0.2, ease: "power2.out" });
      card.addEventListener("mouseenter", onEnter);
      card.addEventListener("mouseleave", onLeave);
      return { card, onEnter, onLeave };
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      hoverHandlers.forEach(({ card, onEnter, onLeave }) => {
        card.removeEventListener("mouseenter", onEnter);
        card.removeEventListener("mouseleave", onLeave);
      });
    };
  }, []);

  return (
    <section id="features" className="scroll-mt-20 bg-white px-5 py-24 sm:px-8 sm:py-36">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-base font-semibold tracking-wide text-indigo-600 uppercase">
          Fonctionnalités
        </p>
        <h2 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Tout ce qu&apos;il vous faut, rien de superflu
        </h2>
        <p className="mt-5 text-lg text-gray-500">
          Pensé pour les freelances et indépendants qui veulent être payés, pas gérer un
          logiciel.
        </p>
      </div>

      <div
        ref={gridRef}
        className="mx-auto mt-16 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {FEATURES.map(({ icon: Icon, iconBg, iconColor, title, description }) => (
          <div
            key={title}
            data-feature-card
            className="rounded-2xl border border-gray-200 bg-white p-8 transition-colors hover:border-indigo-300"
          >
            <span className={`flex h-13 w-13 items-center justify-center rounded-lg ${iconBg} ${iconColor}`}>
              <Icon className="h-6 w-6" />
            </span>
            <h3 className="mt-5 text-lg font-semibold text-gray-900">{title}</h3>
            <p className="mt-2 text-base text-gray-500">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
