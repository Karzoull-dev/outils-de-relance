"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Zap } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 50);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-sm transition-all ${
        scrolled ? "border-gray-200 bg-white/95 shadow-sm" : "border-transparent bg-white/70"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
            <Zap className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
          </span>
          <span className="text-[15px] font-semibold text-gray-900">Relancio</span>
        </Link>

        <div className="flex items-center gap-6 sm:gap-8">
          <nav className="hidden items-center gap-8 text-sm font-medium text-gray-600 md:flex">
            <a href="#features" className="transition-colors hover:text-gray-900">
              Fonctionnalités
            </a>
            <a href="#faq" className="transition-colors hover:text-gray-900">
              FAQ
            </a>
          </nav>

          <Link
            href="/login"
            className="hidden text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 sm:inline"
          >
            Se connecter
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            Essayer gratuitement
          </Link>
        </div>
      </div>
    </header>
  );
}
