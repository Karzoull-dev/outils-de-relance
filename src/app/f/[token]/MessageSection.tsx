"use client";

import { useState } from "react";
import { sendMessage } from "./actions";

export function MessageSection({
  token,
  locale,
  clientSentMessage,
  sent,
}: {
  token: string;
  locale: string;
  clientSentMessage: boolean;
  sent: boolean;
}) {
  /* Auto-ouvre si le client a déjà envoyé un message ou vient d'en envoyer un */
  const [isOpen, setIsOpen] = useState(clientSentMessage || sent);

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        style={{
          width: "100%",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          background: "#fff", color: "#374151",
          border: "1.5px solid #d1d5db",
          borderRadius: 12, padding: "14px 20px",
          fontWeight: 700, fontSize: 15,
          cursor: "pointer",
        }}
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        {locale === "fr" ? "Envoyer un message" : "Send a message"}
      </button>
    );
  }

  return (
    <>
    <style>{`
      @keyframes msgReveal {
        from { opacity: 0; transform: translateY(-10px); }
        to   { opacity: 1; transform: translateY(0); }
      }
    `}</style>
    <div style={{ background: "#fff", border: "1px solid #eaecf0", borderRadius: 16, padding: "24px 24px 28px", animation: "msgReveal 0.22s ease-out" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 6 }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: "#111827", margin: 0 }}>
          {locale === "fr" ? "Une question sur cette facture ?" : "A question about this invoice?"}
        </h2>
        {!(clientSentMessage || sent) && (
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Fermer"
            style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 4, lineHeight: 1, flexShrink: 0 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        )}
      </div>

      <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 20px 0" }}>
        {locale === "fr"
          ? "Votre message sera transmis directement à l'émetteur."
          : "Your message will be sent directly to the invoice issuer."}
      </p>

      {sent || clientSentMessage ? (
        <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 10, padding: "12px 16px" }}>
          <p style={{ fontSize: 14, color: "#15803d", fontWeight: 500, margin: 0 }}>
            {locale === "fr"
              ? "✓ Votre message a bien été envoyé."
              : "✓ Your message was sent successfully."}
          </p>
        </div>
      ) : (
        <form action={sendMessage} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input type="hidden" name="token" value={token} />
          <textarea
            name="message"
            required
            maxLength={500}
            rows={4}
            placeholder={locale === "fr" ? "Votre message…" : "Your message…"}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "10px 14px",
              borderRadius: 10,
              border: "1.5px solid #d1d5db",
              fontSize: 14,
              resize: "vertical",
              color: "#111827",
              outline: "none",
              fontFamily: "inherit",
              background: "#fff",
            }}
          />
          <button
            type="submit"
            style={{
              alignSelf: "flex-start",
              background: "#111827",
              color: "#fff",
              borderRadius: 10,
              padding: "10px 22px",
              fontWeight: 600,
              fontSize: 14,
              border: "none",
              cursor: "pointer",
            }}
          >
            {locale === "fr" ? "Envoyer" : "Send"}
          </button>
        </form>
      )}
    </div>
    </>
  );
}
