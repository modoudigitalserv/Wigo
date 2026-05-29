export default function AdminCompaniesPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8">
        <p className="text-sm uppercase tracking-[0.2em] text-blue-400">Entreprises</p>
        <h1 className="mt-3 text-3xl font-bold text-white">Gestion des propriétaires</h1>
        <p className="mt-3 text-sm text-slate-400">
          Contrôlez les comptes des agences de location, suspendez des entreprises et surveillez leurs performances globales.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
        <h2 className="text-xl font-bold text-white">Surveillance</h2>
        <p className="mt-3 text-slate-300">Vérifiez les flottes publiées, les véhicules actifs et les historiques de conformité des propriétaires.</p>
      </div>
    </div>
  );
}
