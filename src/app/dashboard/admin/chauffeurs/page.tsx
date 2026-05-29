export default function AdminChauffeursPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8">
        <p className="text-sm uppercase tracking-[0.2em] text-blue-400">Chauffeurs</p>
        <h1 className="mt-3 text-3xl font-bold text-white">Gestion des chauffeurs</h1>
        <p className="mt-3 text-sm text-slate-400">
          Suivez le statut d&apos;abonnement des chauffeurs, validez leurs documents d&apos;identité et gérez leur visibilité sur la plateforme.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
        <h2 className="text-xl font-bold text-white">Statuts d&apos;abonnement</h2>
        <p className="mt-3 text-slate-300">Actif, inactif ou en attente : gérez les profils pour que seuls les chauffeurs abonnés soient visibles des clients.</p>
      </div>
    </div>
  );
}
