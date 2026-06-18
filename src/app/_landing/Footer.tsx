import Link from "next/link";
import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white px-5 py-10 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 sm:flex-row">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600">
            <Zap className="h-4 w-4 text-white" strokeWidth={2.5} />
          </span>
          <span className="text-base text-gray-500">© 2026 Relancio</span>
        </div>

        <div className="flex gap-7 text-base text-gray-500">
          <Link href="/mentions-legales" className="transition-colors hover:text-gray-900">
            Mentions légales
          </Link>
          <Link href="/cgu" className="transition-colors hover:text-gray-900">
            CGU
          </Link>
          <Link href="/confidentialite" className="transition-colors hover:text-gray-900">
            Confidentialité
          </Link>
          <Link href="/confidentialite" className="transition-colors hover:text-gray-900">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
