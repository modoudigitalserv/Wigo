export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8">
        <p className="text-sm uppercase tracking-[0.2em] text-blue-400">Espace super-administrateur</p>
        <h1 className="mt-3 text-3xl font-bold text-white">Administration centrale</h1>
        <p className="mt-3 text-sm text-slate-400">
          Supervisez les comptes, validez les documents KYC et maîtrisez les revenus du SaaS en un point unique.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Comptes actifs</p>
          <p className="mt-4 text-3xl font-bold text-white">1 245</p>
        </div>
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Documents en attente</p>
          <p className="mt-4 text-3xl font-bold text-white">18</p>
        </div>
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Revenus SaaS</p>
          <p className="mt-4 text-3xl font-bold text-white">57 400€</p>
        </div>
      </div>
    </div>
  );
}
