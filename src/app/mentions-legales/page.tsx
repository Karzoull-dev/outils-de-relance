import Link from "next/link";

const h2 = "mt-8 text-lg font-semibold text-ink";
const p = "mt-2 text-sm leading-relaxed text-muted";
const placeholder = "rounded bg-warning-surface px-1 py-0.5 font-mono text-xs text-warning";

export default function MentionsLegalesPage() {
  return (
    <div className="flex flex-1 justify-center p-8">
      <div className="w-full max-w-2xl">
        <Link href="/" className="text-sm text-muted underline">
          ← Retour
        </Link>

        <h1 className="mt-4 text-2xl font-bold text-ink">Mentions légales</h1>
        <p className={p}>
          Dernière mise à jour : <span className={placeholder}>[DATE]</span>
        </p>

        <h2 className={h2}>Éditeur du site</h2>
        <p className={p}>
          Le site Outils de relance est édité par :<br />
          <span className={placeholder}>[Nom et prénom / raison sociale]</span><br />
          Statut : <span className={placeholder}>[ex. Auto-entrepreneur / EI / SASU…]</span><br />
          SIRET : <span className={placeholder}>[Numéro SIRET]</span><br />
          Adresse : <span className={placeholder}>[Adresse postale]</span><br />
          Email de contact : <span className={placeholder}>[email@exemple.fr]</span>
        </p>

        <h2 className={h2}>Directeur de la publication</h2>
        <p className={p}>
          <span className={placeholder}>[Nom et prénom]</span>
        </p>

        <h2 className={h2}>Hébergement</h2>
        <p className={p}>
          Le site est hébergé par Vercel Inc.<br />
          340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis<br />
          La base de données est hébergée par Supabase Inc.
        </p>

        <h2 className={h2}>Propriété intellectuelle</h2>
        <p className={p}>
          L&apos;ensemble des éléments du site (textes, logo, charte graphique, code) est
          protégé par le droit d&apos;auteur. Toute reproduction, même partielle, est
          interdite sans autorisation préalable.
        </p>

        <h2 className={h2}>Limitation de responsabilité</h2>
        <p className={p}>
          Outils de relance est un outil d&apos;aide à la gestion et au suivi de factures.
          L&apos;utilisateur reste seul responsable de l&apos;exactitude des informations
          saisies, du respect des obligations légales et comptables liées à
          l&apos;émission de ses factures, et des relations commerciales avec ses propres
          clients.
        </p>

        <h2 className={h2}>Contact</h2>
        <p className={p}>
          Pour toute question : <span className={placeholder}>[email@exemple.fr]</span>
        </p>
      </div>
    </div>
  );
}
