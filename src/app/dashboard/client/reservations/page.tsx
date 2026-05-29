export default function ClientReservationsPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8">
        <p className="text-sm uppercase tracking-[0.2em] text-blue-400">Réservations</p>
        <h1 className="mt-3 text-3xl font-bold text-white">Historique et statut des demandes</h1>
        <p className="mt-3 text-sm text-slate-400">
          Suivez vos demandes de réservation, consultez les statuts et retrouvez les informations pratiques pour chaque location.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
        <h2 className="text-xl font-bold text-white">Réservations récentes</h2>
        <p className="mt-3 text-slate-300">Aucune réservation récente pour le moment. Lancez une nouvelle demande pour voir votre historique.</p>
      </div>
    </div>
  );
}
