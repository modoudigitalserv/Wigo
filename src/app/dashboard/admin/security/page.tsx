export default function AdminSecurityPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8">
        <p className="text-sm uppercase tracking-[0.2em] text-blue-400">Sécurité</p>
        <h1 className="mt-3 text-3xl font-bold text-white">Gestion des accès</h1>
        <p className="mt-3 text-sm text-slate-400">
          Envoyez des liens de réinitialisation de mot de passe, surveillez les comptes sensibles et garantissez la sécurité de la plateforme.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
        <h2 className="text-xl font-bold text-white">Actions de sécurité</h2>
        <p className="mt-3 text-slate-300">Réinitialisations, suspensions et audits de connexion centralisés.</p>
      </div>
    </div>
  );
}
