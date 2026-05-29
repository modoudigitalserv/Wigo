export default function CompanyMissionsPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8">
        <p className="text-sm uppercase tracking-[0.2em] text-blue-400">Missions</p>
        <h1 className="mt-3 text-3xl font-bold text-white">Toutes les missions</h1>
        <p className="mt-3 text-sm text-slate-400">
          Consultez l&apos;ensemble des missions attribuées à votre entreprise, suivez l&apos;avancement, et gérez les chauffeurs et véhicules associés.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Missions planifiées</p>
          <p className="mt-4 text-3xl font-bold text-white">24</p>
          <p className="mt-2 text-sm text-slate-500">Trajets à venir</p>
        </div>
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">En cours</p>
          <p className="mt-4 text-3xl font-bold text-white">6</p>
          <p className="mt-2 text-sm text-slate-500">Chauffeurs actifs</p>
        </div>
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Demandes ouvertes</p>
          <p className="mt-4 text-3xl font-bold text-white">12</p>
          <p className="mt-2 text-sm text-slate-500">Missions en attente de validation</p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
        <h2 className="text-xl font-bold text-white">Vue des missions</h2>
        <p className="mt-3 text-slate-300">Vous verrez ici la liste complète des trajets, les statuts, les conducteurs assignés et les dates prévues.</p>
      </div>
    </div>
  );
}
