"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { Play, X } from "lucide-react";

export function DemoModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Démo Relancio</h3>
              <button
                type="button"
                onClick={onClose}
                aria-label="Fermer"
                className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex aspect-video w-full items-center justify-center rounded-xl bg-gray-100">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
                <Play className="h-6 w-6 text-indigo-600" fill="currentColor" />
              </span>
              <video className="hidden" />
            </div>

            <p className="mt-4 text-center text-sm text-gray-500">
              Vous pouvez aussi{" "}
              <Link href="/signup" className="font-medium text-indigo-600 hover:underline">
                commencer gratuitement
              </Link>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
