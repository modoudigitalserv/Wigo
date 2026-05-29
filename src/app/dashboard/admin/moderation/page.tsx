export default function AdminModerationPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8">
        <p className="text-sm uppercase tracking-[0.2em] text-blue-400">Modération</p>
        <h1 className="mt-3 text-3xl font-bold text-white">Validation des documents</h1>
        <p className="mt-3 text-sm text-slate-400">
          Contrôlez les documents d&apos;identité, validez les profils et gérez les litiges entre clients, propriétaires et chauffeurs.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
        <h2 className="text-xl font-bold text-white">Alertes</h2>
        <p className="mt-3 text-slate-300">Suivez les documents soumis récemment et tranchez les dossiers en attente de validation.</p>
      </div>
    </div>
  );
}
