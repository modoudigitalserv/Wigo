export default function CompanyFleetPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8">
        <p className="text-sm uppercase tracking-[0.2em] text-blue-400">Ma flotte</p>
        <h1 className="mt-3 text-3xl font-bold text-white">Gestion des véhicules</h1>
        <p className="mt-3 text-sm text-slate-400">
          Ajoutez, modifiez et masquez vos véhicules. Gérez les photos, les tarifs, la disponibilité et les documents d&apos;assurance.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Véhicules publiés</p>
          <p className="mt-4 text-3xl font-bold text-white">12</p>
          <p className="mt-2 text-sm text-slate-500">Disponible à la réservation</p>
        </div>
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">En maintenance</p>
          <p className="mt-4 text-3xl font-bold text-white">2</p>
          <p className="mt-2 text-sm text-slate-500">En cours de vérification ou réparation</p>
        </div>
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Photos manquantes</p>
          <p className="mt-4 text-3xl font-bold text-white">3</p>
          <p className="mt-2 text-sm text-slate-500">Complétez les fiches pour optimiser les demandes</p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
        <h2 className="text-xl font-bold text-white">Actions rapides</h2>
        <ul className="mt-4 space-y-3 text-slate-300">
          <li>• Ajouter un nouveau véhicule</li>
          <li>• Mettre à jour les tarifs et disponibilités</li>
          <li>• Charger les documents d&apos;assurance et les certificats</li>
        </ul>
      </div>
    </div>
  );
}
