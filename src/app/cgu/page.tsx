import Link from "next/link";

const h2 = "mt-8 text-lg font-semibold text-ink";
const p = "mt-2 text-sm leading-relaxed text-muted";
const placeholder = "rounded bg-warning-surface px-1 py-0.5 font-mono text-xs text-warning";

export default function CGUPage() {
  return (
    <div className="flex flex-1 justify-center p-8">
      <div className="w-full max-w-2xl">
        <Link href="/" className="text-sm text-muted underline">
          ← Retour
        </Link>

        <h1 className="mt-4 text-2xl font-bold text-ink">
          Conditions générales d&apos;utilisation
        </h1>
        <p className={p}>
          Dernière mise à jour : <span className={placeholder}>[DATE]</span>
        </p>

        <h2 className={h2}>1. Objet</h2>
        <p className={p}>
          Les présentes conditions générales d&apos;utilisation (CGU) régissent l&apos;accès
          et l&apos;utilisation du service Outils de relance, une application permettant
          de créer des factures, d&apos;envoyer des relances automatiques par email et de
          suivre les paiements. L&apos;utilisation du service implique l&apos;acceptation
          pleine et entière des présentes CGU.
        </p>

        <h2 className={h2}>2. Création de compte</h2>
        <p className={p}>
          L&apos;accès aux fonctionnalités nécessite la création d&apos;un compte avec une
          adresse email et un mot de passe. L&apos;utilisateur est responsable de la
          confidentialité de ses identifiants et de toute activité réalisée depuis son
          compte.
        </p>

        <h2 className={h2}>3. Description du service</h2>
        <p className={p}>
          Le service permet à l&apos;utilisateur de saisir des informations de facturation,
          de générer des documents de facture, de configurer des moyens de paiement à
          afficher à ses clients, et d&apos;envoyer des emails de relance automatiques selon
          un calendrier prédéfini. Le service ne traite ni n&apos;encaisse aucun paiement :
          les règlements s&apos;effectuent directement entre l&apos;utilisateur et son client,
          par les moyens que l&apos;utilisateur choisit d&apos;afficher.
        </p>

        <h2 className={h2}>4. Obligations de l&apos;utilisateur</h2>
        <p className={p}>
          L&apos;utilisateur s&apos;engage à fournir des informations exactes et à jour, à
          respecter les obligations légales et fiscales applicables à son activité
          (notamment la numérotation et les mentions obligatoires de ses factures), et à
          ne pas utiliser le service à des fins frauduleuses ou illicites.
        </p>

        <h2 className={h2}>5. Disponibilité du service</h2>
        <p className={p}>
          L&apos;éditeur s&apos;efforce d&apos;assurer un accès continu au service, sans
          garantie de disponibilité absolue. Des interruptions peuvent survenir pour
          maintenance, mise à jour ou en cas de force majeure.
        </p>

        <h2 className={h2}>6. Responsabilité</h2>
        <p className={p}>
          L&apos;éditeur n&apos;est pas responsable du contenu des factures émises par
          l&apos;utilisateur, des relations commerciales entre l&apos;utilisateur et ses
          clients, ni des impayés. L&apos;éditeur ne saurait être tenu responsable des
          dommages indirects résultant de l&apos;utilisation du service.
        </p>

        <h2 className={h2}>7. Résiliation</h2>
        <p className={p}>
          L&apos;utilisateur peut supprimer son compte à tout moment depuis les
          paramètres de son compte. L&apos;éditeur se réserve le droit de suspendre ou
          supprimer tout compte en cas de violation des présentes CGU.
        </p>

        <h2 className={h2}>8. Droit applicable</h2>
        <p className={p}>
          Les présentes CGU sont soumises au droit français. Tout litige relève de la
          compétence des tribunaux français.
        </p>

        <h2 className={h2}>9. Contact</h2>
        <p className={p}>
          Pour toute question : <span className={placeholder}>[email@exemple.fr]</span>
        </p>
      </div>
    </div>
  );
}
