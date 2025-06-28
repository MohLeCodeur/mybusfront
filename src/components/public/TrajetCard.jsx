/* src/components/public/TrajetCard.jsx */
import { FiMapPin, FiClock, FiCalendar, FiPackage, FiTruck } from 'react-icons/fi'

export default function TrajetCard ({ trajet, onReserve }) {
  const dateStr = new Date(trajet.dateDepart).toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long'
  })

  return (
    <div className="group bg-white rounded-3xl shadow-xl p-8ring-1 ring-gray-100 hover:ring-pink-400/50 hover:shadow-pink-300/30 transition">
      <div className="p-6 space-y-4">
        {/* Ville + prix */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-1 text-gray-800">
              <FiMapPin className="text-pink-500" />
              {trajet.villeDepart} → {trajet.villeArrivee}
            </h3>
            {/* --- L'affichage de la compagnie est supprimé --- */}
          </div>

          <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-blue-600 bg-clip-text text-transparent">
            {trajet.prix.toLocaleString('fr-FR')} FCFA
          </span>
        </div>

        {/* Détails */}
        <div className="flex flex-wrap gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-1"><FiCalendar /> {dateStr}</div>
          <div className="flex items-center gap-1"><FiClock /> {trajet.heureDepart}</div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            trajet.placesDisponibles < 10
              ? 'bg-amber-100 text-amber-600'
              : 'bg-emerald-100 text-emerald-600'
          }`}>
            {trajet.placesDisponibles} places
          </div>
        </div>

        {/* CTA */}
        <div className="pt-4 flex justify-end">
          <button
            onClick={onReserve}
            disabled={trajet.placesDisponibles <= 0}
            className={`px-6 py-2 rounded-full font-semibold text-white transition
              ${
                trajet.placesDisponibles > 0
                  ? 'bg-gradient-to-r from-pink-500 to-blue-600 hover:brightness-110 active:scale-95'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
          >
            Réserver
          </button>
        </div>
      </div>
    </div>
  )
}