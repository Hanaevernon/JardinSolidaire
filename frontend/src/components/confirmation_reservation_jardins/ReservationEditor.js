// ReservationEditor - à compléter
export default function ReservationEditor({ garden, onReserve }) {
  const loading = !garden;

  const displayName = garden?.nom || '—';
  const location =
    garden?.ville ||
    garden?.adresse ||
    (garden?.code_postal ? `CP ${garden.code_postal}` : '') ||
    'Localisation non renseignée';
  const bio = garden?.description || 'Pas encore de description.';
  const photo = garden?.photo || null;

  return (
    <aside className="rounded-2xl border p-4 bg-white text-gray-800">
      <div className="flex items-center gap-4 mb-4">
        <div className="h-16 w-16 rounded bg-gray-100 overflow-hidden border">
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo} alt={displayName} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">
              photo
            </div>
          )}
        </div>
        <div>
          <p className="font-semibold">{loading ? 'Chargement…' : displayName}</p>
          <p className="text-sm text-gray-600">{loading ? '—' : location}</p>
        </div>
      </div>

      <p className="text-sm text-gray-700 mb-4">
        {loading ? 'Chargement…' : bio}
      </p>

      <button
        type="button"
        onClick={onReserve}
        className="w-full rounded-full px-5 py-3 bg-[#e3107d] text-white font-semibold hover:bg-pink-700 transition"
      >
        Confirmer la réservation
      </button>
    </aside>
  );
}
