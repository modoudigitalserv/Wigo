export default function CompanyDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8">
        <p className="text-sm uppercase tracking-[0.2em] text-blue-400">Espace propriétaire</p>
        <h1 className="mt-3 text-3xl font-bold text-white">Gestion de la flotte</h1>
        <p className="mt-3 text-sm text-slate-400">
          Contrôlez vos véhicules, suivez vos demandes de réservation et gérez les documents de conformité depuis votre tableau de bord.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Véhicules actifs</p>
          <p className="mt-4 text-3xl font-bold text-white">18</p>
        </div>
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Demandes en attente</p>
          <p className="mt-4 text-3xl font-bold text-white">6</p>
        </div>
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Revenus estimés</p>
          <p className="mt-4 text-3xl font-bold text-white">24 800€</p>
        </div>
      </div>
    </div>
  );
}
