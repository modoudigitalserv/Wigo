export default function ClientHistoryPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8">
        <p className="text-sm uppercase tracking-[0.2em] text-blue-400">Historique</p>
        <h1 className="mt-3 text-3xl font-bold text-white">Avis et notes</h1>
        <p className="mt-3 text-sm text-slate-400">
          Consultez vos locations passées, laissez des avis et retrouvez les notes laissées aux chauffeurs et aux véhicules.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
        <h2 className="text-xl font-bold text-white">Vos avis</h2>
        <p className="mt-3 text-slate-300">Aucune location passée pour le moment. Les avis s&apos;afficheront ici après vos premières réservations.</p>
      </div>
    </div>
  );
}
