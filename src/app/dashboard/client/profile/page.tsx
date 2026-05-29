export default function ClientProfilePage() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8">
        <p className="text-sm uppercase tracking-[0.2em] text-blue-400">Profil</p>
        <h1 className="mt-3 text-3xl font-bold text-white">Gestion du profil</h1>
        <p className="mt-3 text-sm text-slate-400">
          Mettez à jour vos informations personnelles, ajoutez votre permis de conduire et gardez votre compte à jour.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
        <h2 className="text-xl font-bold text-white">Informations personnelles</h2>
        <p className="mt-3 text-slate-300">Nom, email, téléphone et informations complémentaires pour faciliter vos réservations.</p>
      </div>
    </div>
  );
}
