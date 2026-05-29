export default function ChauffeurProfilePage() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8">
        <p className="text-sm uppercase tracking-[0.2em] text-blue-400">Profil</p>
        <h1 className="mt-3 text-3xl font-bold text-white">Présentation du chauffeur</h1>
        <p className="mt-3 text-sm text-slate-400">
          Complétez votre profil, ajoutez une photo et précisez votre zone géographique pour attirer davantage de clients.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
        <h2 className="text-xl font-bold text-white">Détails personnels</h2>
        <p className="mt-3 text-slate-300">Votre bio, votre zone d&apos;intervention et vos langues parlées apparaîtront dans les résultats de recherche.</p>
      </div>
    </div>
  );
}
