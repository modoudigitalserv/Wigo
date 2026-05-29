export default function CompanyCompliancePage() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8">
        <p className="text-sm uppercase tracking-[0.2em] text-blue-400">Conformité</p>
        <h1 className="mt-3 text-3xl font-bold text-white">Documents et assurances</h1>
        <p className="mt-3 text-sm text-slate-400">
          Suivez les documents de conformité de vos véhicules et chargez les assurances, certificats et autres justificatifs.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Assurances valides</p>
          <p className="mt-4 text-3xl font-bold text-white">9</p>
          <p className="mt-2 text-sm text-slate-500">Véhicules couverts</p>
        </div>
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Documents expirant</p>
          <p className="mt-4 text-3xl font-bold text-white">2</p>
          <p className="mt-2 text-sm text-slate-500">À renouveler prochainement</p>
        </div>
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Contrôles KYC</p>
          <p className="mt-4 text-3xl font-bold text-white">17</p>
          <p className="mt-2 text-sm text-slate-500">Profils vérifiés</p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
        <h2 className="text-xl font-bold text-white">Actions recommandées</h2>
        <ul className="mt-4 space-y-3 text-slate-300">
          <li>• Téléchargez les nouvelles polices d&apos;assurance.</li>
          <li>• Vérifiez les dates d&apos;expiration avant chaque location.</li>
          <li>• Gardez un historique centralisé de tous les documents.</li>
        </ul>
      </div>
    </div>
  );
}
