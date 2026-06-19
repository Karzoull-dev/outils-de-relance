const STATS = [
  {
    value: "85%",
    label: "des freelances subissent des retards de paiement",
    color: "text-red-500",
  },
  {
    value: "23j",
    label: "de retard moyen après l'échéance d'une facture",
    color: "text-indigo-600",
  },
  {
    value: "0€",
    label: "pour commencer à utiliser Relancio aujourd'hui",
    color: "text-emerald-500",
  },
];

export function StatsBar() {
  return (
    <div className="border-y border-gray-200 bg-gray-50 px-5 py-16 sm:px-8">
      <div className="mx-auto grid max-w-4xl gap-10 text-center sm:grid-cols-3">
        {STATS.map(({ value, label, color }) => (
          <div key={label}>
            <p className={`text-4xl font-bold tracking-tight sm:text-5xl ${color}`}>{value}</p>
            <p className="mt-2 text-sm text-gray-500">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
