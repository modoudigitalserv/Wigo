export default function ClientDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8">
        <p className="text-sm uppercase tracking-[0.2em] text-blue-400">Espace locataire</p>
        <h1 className="mt-3 text-3xl font-bold text-white">Bienvenue dans votre tableau de bord</h1>
        <p className="mt-3 text-sm text-slate-400">
          Suivez vos demandes de réservation, consultez l&apos;historique de vos voyages et complétez votre profil pour accéder à toutes les fonctionnalités.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Demandes en attente</p>
          <p className="mt-4 text-3xl font-bold text-white">3</p>
        </div>
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Réservations confirmées</p>
          <p className="mt-4 text-3xl font-bold text-white">7</p>
        </div>
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Documents</p>
          <p className="mt-4 text-3xl font-bold text-white">Permis en attente</p>
        </div>
      </div>
    </div>
  );
}
