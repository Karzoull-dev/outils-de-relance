"use client";

import { useState } from "react";
import { Loader2, Printer, FileDown } from "lucide-react";

export function PublicPrintBar({
  backUrl,
  locale,
  invoiceNumber,
}: {
  backUrl: string;
  locale: string;
  invoiceNumber: string;
}) {
  const [generatingPdf, setGeneratingPdf] = useState(false);

  async function handleDownloadPDF() {
    const docEl = document.querySelector(".doc") as HTMLElement | null;
    if (!docEl) return;

    setGeneratingPdf(true);
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      const canvas = await html2canvas(docEl, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        logging: false,
      });

      const imgWidth = 210;
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
      <a href={backUrl} className="btn-back">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
        {locale === "fr" ? "Retour" : "Back"}
      </a>

      <div className="action-bar-right">
        <button
          type="button"
          onClick={() => window.print()}
          disabled={generatingPdf}
          className="btn-secondary"
        >
          <Printer size={15} />
          {locale === "fr" ? "Imprimer" : "Print"}
        </button>

        <button
          type="button"
          onClick={handleDownloadPDF}
          disabled={generatingPdf}
          className="btn-print"
        >
          {generatingPdf
            ? <Loader2 size={15} className="spin" />
            : <FileDown size={15} />}
          {generatingPdf
            ? (locale === "fr" ? "Génération…" : "Generating…")
            : (locale === "fr" ? "Télécharger PDF" : "Download PDF")}
        </button>
      </div>
    </div>
  );
}
