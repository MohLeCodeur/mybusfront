/* Liste + pagination 15 trajets | MyBus */
import React, { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import { FiLoader } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

import Navbar     from '../components/Navbar'
import Footer     from '../components/Footer'
import TrajetCard from '../components/TrajetCard'

const normalize = t => ({
  id: t._id, villeDepart: t.villeDepart, villeArrivee: t.villeArrivee,
  compagnie: t.compagnie, dateDepart: t.dateDepart, heureDepart: t.heureDepart,
  prix: t.prix, bus: t.bus, placesDisponibles: t.placesDisponibles
})

const API_URL = 'https://mybusback.onrender.com/api/trajets'
const LIMIT   = 15

export default function SearchPage () {
  /* filtres */
  const [departure, setDeparture] = useState('')
  const [arrival,   setArrival]   = useState('')
  const [date,      setDate]      = useState('')

  /* pagination */
  const [page, setPage]       = useState(1)
  const [pagesMax, setPagesMax] = useState(1)

  /* data */
  const [trajets, setTrajets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  const navigate = useNavigate()

  /* fetch */
  useEffect(() => {
    setLoading(true)
    setTrajets([])              // <<=== vide la liste avant nouveau fetch
    axios.get(API_URL, {
      params: {
        villeDepart:  departure || undefined,
        villeArrivee: arrival   || undefined,
        date:         date      || undefined,
        page,
        limit: LIMIT
      }
    })
    .then(({ data }) => {
      setTrajets(data.docs.map(normalize))
      setPagesMax(data.pages)
      window.scrollTo({ top: 0, behavior: 'smooth' })  // scroll haut
    })
    .catch(err => setError(err.response?.data?.message || err.message))
    .finally(() => setLoading(false))
  }, [departure, arrival, date, page])

  /* villes distinctes */
  const villes = useMemo(() => {
    const s = new Set()
    trajets.forEach(t => { s.add(t.villeDepart); s.add(t.villeArrivee) })
    return Array.from(s).filter(Boolean).sort()
  }, [trajets])

  const reset = () => { setDeparture(''); setArrival(''); setDate(''); setPage(1) }
  const reserve = id => navigate(`/reservation/${id}`)

  /* rendu */
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-indigo-50 text-gray-800">
      <Navbar/>

      {/* Bandeau filtres */}
      <section className="relative bg-[url('/assets/search-bg.webp')] bg-cover bg-center bg-fixed">
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm"/>
        <div className="relative z-10 max-w-5xl mx-auto px-4 py-24">
          <h1 className="text-4xl font-playfair font-bold mb-8">Trouvez votre trajet</h1>

          <form className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-white/5 backdrop-blur-xl
                           p-6 rounded-3xl border border-white/10 shadow-lg"
                onSubmit={e=>e.preventDefault()}>
            <select value={departure}
              onChange={e=>{setDeparture(e.target.value); setPage(1)}}
              className="w-full px-4 py-3 rounded-full bg-white/10 focus:ring-2 focus:ring-pink-500">
              <option value="">Départ</option>{villes.map(v => <option key={v}>{v}</option>)}
            </select>

            <select value={arrival}
              onChange={e=>{setArrival(e.target.value); setPage(1)}}
              className="w-full px-4 py-3 rounded-full bg-white/10 focus:ring-2 focus:ring-pink-500">
              <option value="">Arrivée</option>{villes.map(v => <option key={v}>{v}</option>)}
            </select>

            <input type="date" value={date}
              onChange={e=>{setDate(e.target.value); setPage(1)}}
              className="w-full px-4 py-3 rounded-full bg-white/10 focus:ring-2 focus:ring-pink-500"/>

            <button type="button" onClick={reset}
              className="w-full px-4 py-3 rounded-full text-white font-semibold
                         bg-gradient-to-r from-pink-500 to-blue-600 hover:brightness-110 active:scale-95">
              Réinitialiser
            </button>
          </form>
        </div>
      </section>

      {/* Résultats */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-16">
        {loading && <div className="flex justify-center mt-20">
          <FiLoader className="animate-spin text-4xl text-pink-500"/>
        </div>}

        {error && <div className="text-center space-y-4">
          <p className="text-red-500">{error}</p>
          <button onClick={()=>window.location.reload()}
            className="px-6 py-2 bg-pink-500 rounded-full text-white">Réessayer</button>
        </div>}

        {!loading && !error && trajets.length===0 &&
          <p className="text-center text-gray-500">Aucun trajet trouvé.</p>}

        {/* grille cartes */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {trajets.map(t => (
            <TrajetCard key={t.id} trajet={t} onReserve={()=>reserve(t.id)}/>
          ))}
        </div>

        {/* pagination */}
        {pagesMax > 1 &&
          <nav className="flex justify-center mt-12 gap-2">
            {Array.from({ length: pagesMax }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={()=>setPage(p)}
                className={`px-4 py-2 rounded-full border
                  ${p===page
                    ?'bg-gradient-to-r from-pink-500 to-blue-600 text-white'
                    :'bg-white text-gray-700 hover:bg-gray-100'}`}>
                {p}
              </button>
            ))}
          </nav>}
      </main>

      <Footer/>
    </div>
  )
}
