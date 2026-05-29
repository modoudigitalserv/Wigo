export default function ChauffeurHistoryPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8">
        <p className="text-sm uppercase tracking-[0.2em] text-blue-400">Historique</p>
        <h1 className="mt-3 text-3xl font-bold text-white">Courses effectuées</h1>
        <p className="mt-3 text-sm text-slate-400">
          Retrouvez votre nombre de courses, votre notation moyenne et les détails des trajets réalisés.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
        <h2 className="text-xl font-bold text-white">Performances</h2>
        <p className="mt-3 text-slate-300">Aucune course enregistrée pour le moment. Votre premier trajet apparaîtra ici dès qu&apos;il sera terminé.</p>
      </div>
    </div>
  );
}
