"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Printer, FileDown, X, Loader2 } from "lucide-react";

export function PrintTrigger({ invoiceNumber }: { invoiceNumber: string }) {
  const router = useRouter();
  const [generatingPdf, setGeneratingPdf] = useState(false);

  /* ── Imprimer : window.print() avec beforeprint/afterprint ──
     beforeprint se déclenche juste avant que le navigateur capture
     la page — c'est le seul moment fiable pour modifier le DOM.     */
  function handlePrint() {
    const prepare = () => {
      const bar   = document.querySelector(".action-bar") as HTMLElement | null;
      const outer = document.querySelector(".outer")      as HTMLElement | null;
      if (bar)   bar.style.display   = "none";
      if (outer) {
        outer.style.display   = "block";
        outer.style.padding   = "0";
        outer.style.minHeight = "0";
        outer.style.height    = "auto";
      }
    };

    const restore = () => {
      const bar   = document.querySelector(".action-bar") as HTMLElement | null;
      const outer = document.querySelector(".outer")      as HTMLElement | null;
      if (bar)   bar.style.cssText   = "";
      if (outer) outer.style.cssText = "";
    };

    window.addEventListener("beforeprint", prepare, { once: true });
    window.addEventListener("afterprint",  restore, { once: true });
    window.print();
  }

  /* ── Télécharger PDF : html2canvas + jsPDF → download direct ── */
  async function handleDownloadPDF() {
    const docEl = document.querySelector(".doc") as HTMLElement | null;
    if (!docEl) return;

    setGeneratingPdf(true);
    try {
      const isDark = document.documentElement.classList.contains("dark");

      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      const canvas = await html2canvas(docEl, {
        scale: 2,
        backgroundColor: isDark ? "#1e1e1e" : "#ffffff",
        useCORS: true,
        logging: false,
      });

      const imgWidth  = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`${invoiceNumber}.pdf`);
    } finally {
      setGeneratingPdf(false);
    }
  }

  return (
    <div className="action-bar">
      <button type="button" onClick={() => router.back()} className="btn-ghost">
        <X size={16} />
        <span>Fermer</span>
      </button>

      <div className="action-bar-right">
        <button
          type="button"
          onClick={handlePrint}
          disabled={generatingPdf}
          className="btn-secondary"
        >
          <Printer size={16} />
          <span>Imprimer</span>
        </button>

        <button
          type="button"
          onClick={handleDownloadPDF}
          disabled={generatingPdf}
          className="btn-primary"
        >
          {generatingPdf
            ? <Loader2 size={16} className="spin" />
            : <FileDown size={16} />}
          <span>{generatingPdf ? "Génération…" : "Télécharger en PDF"}</span>
        </button>
      </div>
    </div>
  );
}
