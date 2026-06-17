import Link from "next/link";

const h2 = "mt-8 text-lg font-semibold text-ink";
const p = "mt-2 text-sm leading-relaxed text-muted";
const placeholder = "rounded bg-warning-surface px-1 py-0.5 font-mono text-xs text-warning";

export default function ConfidentialitePage() {
  return (
    <div className="flex flex-1 justify-center p-8">
      <div className="w-full max-w-2xl">
        <Link href="/" className="text-sm text-muted underline">
          ← Retour
        </Link>

        <h1 className="mt-4 text-2xl font-bold text-ink">
          Politique de confidentialité
        </h1>
        <p className={p}>
          Dernière mise à jour : <span className={placeholder}>[DATE]</span>
        </p>

        <h2 className={h2}>Responsable du traitement</h2>
        <p className={p}>
          <span className={placeholder}>[Nom et prénom / raison sociale]</span><br />
          Contact : <span className={placeholder}>[email@exemple.fr]</span>
        </p>

        <h2 className={h2}>Données collectées</h2>
        <p className={p}>
          Dans le cadre de l&apos;utilisation du service, les données suivantes sont
          collectées :
        </p>
        <ul className="mt-2 list-disc pl-5 text-sm leading-relaxed text-muted">
          <li>Données de compte : email, mot de passe (stocké chiffré)</li>
          <li>
            Données de profil de facturation : nom/raison sociale, adresse, SIRET, TVA
          </li>
          <li>
            Données saisies sur les factures : nom, email, adresse, SIRET et TVA des
            clients de l&apos;utilisateur
          </li>
          <li>
            Messages échangés via la page publique de facture (entre l&apos;utilisateur
            et son client)
          </li>
        </ul>

        <h2 className={h2}>Finalité du traitement</h2>
        <p className={p}>
          Ces données sont utilisées exclusivement pour fournir le service : générer des
          factures, envoyer des relances par email, et permettre la communication entre
          l&apos;utilisateur et ses clients via la page publique de facture.
        </p>

        <h2 className={h2}>Base légale</h2>
        <p className={p}>
          Le traitement est fondé sur l&apos;exécution du contrat liant l&apos;utilisateur
          au service (conditions générales d&apos;utilisation).
        </p>

        <h2 className={h2}>Destinataires des données</h2>
        <p className={p}>
          Les données sont hébergées par Supabase Inc. (base de données et
          authentification) et transmises à Resend (envoi des emails de relance). Aucune
          donnée n&apos;est vendue ni partagée à des fins publicitaires.
        </p>

        <h2 className={h2}>Durée de conservation</h2>
        <p className={p}>
          Les données sont conservées pendant toute la durée d&apos;utilisation du compte.
          En cas de suppression du compte, les données sont supprimées, sous réserve des
          durées de conservation imposées par la loi (notamment les obligations
          comptables qui incombent à l&apos;utilisateur pour ses propres factures).
        </p>

        <h2 className={h2}>Cookies</h2>
        <p className={p}>
          Le service utilise uniquement des cookies strictement nécessaires à son
          fonctionnement (session de connexion, préférence de thème et de langue). Aucun
          cookie publicitaire ou de mesure d&apos;audience tiers n&apos;est utilisé.
        </p>

        <h2 className={h2}>Sécurité</h2>
        <p className={p}>
          L&apos;accès aux données est protégé par authentification et des règles de
          sécurité au niveau base de données garantissant que chaque utilisateur n&apos;a
          accès qu&apos;à ses propres données. Les échanges sont chiffrés via HTTPS.
        </p>

        <h2 className={h2}>Vos droits</h2>
        <p className={p}>
          Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de
          rectification, d&apos;effacement, de limitation et de portabilité de vos
          données, ainsi que d&apos;un droit d&apos;opposition. Pour exercer ces droits,
          contactez : <span className={placeholder}>[email@exemple.fr]</span>
        </p>
      </div>
    </div>
  );
}
