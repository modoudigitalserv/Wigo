export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8">
        <p className="text-sm uppercase tracking-[0.2em] text-blue-400">Clients</p>
        <h1 className="mt-3 text-3xl font-bold text-white">Gestion des clients</h1>
        <p className="mt-3 text-sm text-slate-400">
          Affichez et modifiez les comptes clients, gérez les suspensions et aidez les utilisateurs à récupérer l&apos;accès en cas de besoin.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
        <h2 className="text-xl font-bold text-white">Actions rapides</h2>
        <p className="mt-3 text-slate-300">Suspension, réinitialisation de mot de passe et support client depuis une interface centralisée.</p>
      </div>
    </div>
  );
}
