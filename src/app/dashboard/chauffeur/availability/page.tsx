export default function ChauffeurAvailabilityPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8">
        <p className="text-sm uppercase tracking-[0.2em] text-blue-400">Disponibilité</p>
        <h1 className="mt-3 text-3xl font-bold text-white">Calendrier de disponibilité</h1>
        <p className="mt-3 text-sm text-slate-400">
          Définissez les jours et horaires où vous acceptez des courses afin d&apos;être visible uniquement lorsque vous êtes disponible.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
        <h2 className="text-xl font-bold text-white">Planning</h2>
        <p className="mt-3 text-slate-300">Semaine actuelle : aucun créneau défini. Activez vos jours de service pour recevoir des demandes.</p>
      </div>
    </div>
  );
}
