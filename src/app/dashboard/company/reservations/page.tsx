export default function CompanyReservationsPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8">
        <p className="text-sm uppercase tracking-[0.2em] text-blue-400">Réservations</p>
        <h1 className="mt-3 text-3xl font-bold text-white">Demandes de location</h1>
        <p className="mt-3 text-sm text-slate-400">
          Consultez les demandes en attente, confirmez ou refusez les réservations et suivez l&apos;historique des locations.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">En attente</p>
          <p className="mt-4 text-3xl font-bold text-white">8</p>
          <p className="mt-2 text-sm text-slate-500">Demandes à traiter</p>
        </div>
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Confirmées</p>
          <p className="mt-4 text-3xl font-bold text-white">14</p>
          <p className="mt-2 text-sm text-slate-500">Réservations validées</p>
        </div>
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Rejetées</p>
          <p className="mt-4 text-3xl font-bold text-white">5</p>
          <p className="mt-2 text-sm text-slate-500">Demandes refusées</p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
        <h2 className="text-xl font-bold text-white">Points d&apos;attention</h2>
        <ul className="mt-4 space-y-3 text-slate-300">
          <li>• Vérifiez les périodes de disponibilité du véhicule.</li>
          <li>• Encouragez les clients à fournir les justificatifs nécessaires.</li>
          <li>• Répondez rapidement pour améliorer votre taux de conversion.</li>
        </ul>
      </div>
    </div>
  );
}
