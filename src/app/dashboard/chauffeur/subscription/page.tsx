export default function ChauffeurSubscriptionPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8">
        <p className="text-sm uppercase tracking-[0.2em] text-blue-400">Abonnement</p>
        <h1 className="mt-3 text-3xl font-bold text-white">Statut de l&apos;abonnement</h1>
        <p className="mt-3 text-sm text-slate-400">
          Consultez votre statut d&apos;abonnement SaaS, gérez les paiements et renouvelez votre accès pour rester visible auprès des clients.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
        <h2 className="text-xl font-bold text-white">Statut actuel</h2>
        <p className="mt-3 text-slate-300">Actif. Votre profil est visible dans les résultats de recherche des clients.</p>
      </div>
    </div>
  );
}
