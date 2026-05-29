export default function CompanyAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8">
        <p className="text-sm uppercase tracking-[0.2em] text-blue-400">Analytics</p>
        <h1 className="mt-3 text-3xl font-bold text-white">Rapports de performance</h1>
        <p className="mt-3 text-sm text-slate-400">
          Obtenez des insights sur le taux d&apos;occupation, les revenus générés et les véhicules les plus loués.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Taux d&apos;occupation</p>
          <p className="mt-4 text-3xl font-bold text-white">81%</p>
          <p className="mt-2 text-sm text-slate-500">Performance de la flotte</p>
        </div>
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Revenus</p>
          <p className="mt-4 text-3xl font-bold text-white">32 450€</p>
          <p className="mt-2 text-sm text-slate-500">Générés ce mois</p>
        </div>
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Meilleur véhicule</p>
          <p className="mt-4 text-3xl font-bold text-white">Range Rover</p>
          <p className="mt-2 text-sm text-slate-500">Véhicule le plus loué</p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
        <h2 className="text-xl font-bold text-white">Recommandations</h2>
        <ul className="mt-4 space-y-3 text-slate-300">
          <li>• Augmentez les tarifs pendant les périodes à forte demande.</li>
          <li>• Favorisez les véhicules avec les meilleures notes clients.</li>
          <li>• Surveillez la disponibilité pour limiter les jours non réservés.</li>
        </ul>
      </div>
    </div>
  );
}
