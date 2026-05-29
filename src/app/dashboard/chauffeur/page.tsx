export default function ChauffeurDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8">
        <p className="text-sm uppercase tracking-[0.2em] text-blue-400">Espace chauffeur</p>
        <h1 className="mt-3 text-3xl font-bold text-white">Bienvenue sur votre tableau de bord</h1>
        <p className="mt-3 text-sm text-slate-400">
          Gèrez votre abonnement, mettez à jour votre disponibilité et suivez votre historique de courses.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Statut abonnement</p>
          <p className="mt-4 text-3xl font-bold text-white">Actif</p>
        </div>
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Courses réalisées</p>
          <p className="mt-4 text-3xl font-bold text-white">42</p>
        </div>
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Zone géographique</p>
          <p className="mt-4 text-3xl font-bold text-white">Île-de-France</p>
        </div>
      </div>
    </div>
  );
}
