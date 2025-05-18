import React from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { motion } from 'framer-motion'

/* -------- 1. Icône bus custom -------- */
const busIcon = new L.DivIcon({
  html: `<div class="relative flex items-center justify-center">
           <div class="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 via-fuchsia-500 to-blue-500 flex items-center justify-center text-white shadow-lg">
             🚌
           </div>
         </div>`,
  className: '',        // on neutralise la classe par défaut
  iconSize: [36, 36],
  iconAnchor: [18, 18]
})

/* -------- 2. Données stations -------- */
const busStations = [
  { id: 1,  name: 'Gare Routière de Bamako', position: [12.65,  -8.0],    status: 'en route', nextDeparture: '14:30' },
  { id: 2,  name: 'Gare de Sikasso',         position: [11.3167,-5.6667], status: 'arrivé',   nextDeparture: '16:45' },
  { id: 3,  name: 'Gare de Kayes',           position: [14.45, -11.4333], status: 'en attente', nextDeparture: '09:15' },
  { id: 4,  name: 'Gare de Mopti',           position: [14.5,  -4.2],    status: 'en route', nextDeparture: '11:30' }
]

/* -------- 3. Animation pulsée -------- */
const Pulse = ({ children }) => (
  <motion.div
    initial={{ scale: 0.9, opacity: 0.6 }}
    animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.6, 0, 0.6] }}
    transition={{ duration: 2.5, repeat: Infinity }}
    className="absolute inset-0 rounded-full bg-pink-400"
  >
    {children}
  </motion.div>
)

/* -------- 4. Fit bounds automatique (optionnel) -------- */
const FitBounds = ({ bounds }) => {
  const map = useMap()
  React.useEffect(() => {
    map.fitBounds(bounds, { padding: [40, 40] })
  }, [bounds])
  return null
}

export default function LiveMap () {
  const mapCenter = [17.57, -4]     // Mali
  const zoomLevel = 6
  const bounds = busStations.map(s => s.position)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
      className="relative rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-white/10 bg-gradient-to-br from-indigo-800 via-indigo-900 to-black/90"
    >
      {/* Légende */}
      <div className="absolute z-[500] top-4 right-4 bg-white/10 backdrop-blur-md rounded-xl px-4 py-2 text-sm text-white space-x-4 flex items-center shadow">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-fuchsia-500" /> En route</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500" /> Arrivé</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-orange-400" /> En attente</span>
      </div>

      <MapContainer
        center={mapCenter}
        zoom={zoomLevel}
        scrollWheelZoom={false}
        className="h-96 w-full z-0 rounded-[2rem]"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='© OpenStreetMap, © CARTO'
        />

        <FitBounds bounds={bounds} />

        {busStations.map(st => (
          <Marker key={st.id} position={st.position} icon={busIcon}>
            {/* halo pulsé */}
            <Pulse />

            {/* popup amélioré */}
            <Popup>
              <div className="font-inter text-sm space-y-1">
                <h3 className="font-bold text-primary mb-1">{st.name}</h3>
                <p>
                  Statut : <span
                    className={
                      st.status === 'en route'
                        ? 'text-fuchsia-500'
                        : st.status === 'arrivé'
                        ? 'text-green-500'
                        : 'text-orange-400'
                    }
                  >
                    {st.status}
                  </span>
                </p>
                <p>Prochain départ : <span className="font-medium">{st.nextDeparture}</span></p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </motion.div>
  )
}
