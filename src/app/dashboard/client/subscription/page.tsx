export default function ClientSubscriptionPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8">
        <p className="text-sm uppercase tracking-[0.2em] text-blue-400">Documents & Paiements</p>
        <h1 className="mt-3 text-3xl font-bold text-white">Gestion des documents</h1>
        <p className="mt-3 text-sm text-slate-400">
          Téléchargez votre permis de conduire et consultez l&apos;historique des documents envoyés pour vos réservations.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
        <h2 className="text-xl font-bold text-white">Permis de conduire</h2>
        <p className="mt-3 text-slate-300">Aucun document téléchargé pour le moment. Ajoutez-le pour pouvoir réserver avec chauffeur.</p>
      </div>
    </div>
  );
}
