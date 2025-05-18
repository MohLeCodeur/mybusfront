/* ─────────────────────────────────────────────
 *  src/routes/ReservationPage.jsx
 *  MyBus – multi-billets + infos passagers
 * ────────────────────────────────────────────*/
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'
import { FiLoader, FiInfo } from 'react-icons/fi'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const API_BASE = 'https://mybusback.onrender.com'

export default function ReservationPage() {
  const { id: trajetId } = useParams()
  const navigate = useNavigate()

  /** états principaux **/
  const [trajet, setTrajet] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  /** formulaire contact + billets **/
  const [contact, setContact] = useState({ email: '', telephone: '' })
  const [billets, setBillets] = useState(1)

  /** passagers **/
  const [passagers, setPassagers] = useState([{ nom: '', prenom: '' }])

  /* ajuster tableau passagers quand billets change */
  useEffect(() => {
    setPassagers(prev => 
      Array.from({ length: billets }, (_, i) => prev[i] || { nom: '', prenom: '' })
    )
  }, [billets])

  /* fetch trajet */
  useEffect(() => {
    axios.get(`${API_BASE}/api/trajets/${trajetId}`)
      .then(res => setTrajet(res.data))
      .catch(() => setError('Impossible de charger les détails du trajet'))
      .finally(() => setLoading(false))
  }, [trajetId])

  /* validation du formulaire */
  const validateForm = () => {
    // Vérifier champs de contact
    if (!contact.email.trim() || !contact.telephone.trim()) {
      setError("Email et téléphone sont requis");
      return false;
    }

    // Vérifier champs de passagers
    for (let p of passagers) {
      if (!p.nom.trim() || !p.prenom.trim()) {
        setError("Les informations de tous les passagers sont requises");
        return false;
      }
    }

    return true;
  };

  /* submit */
  const handleSubmit = async e => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    
    if (!validateForm()) {
      setSubmitting(false);
      return;
    }
    
    try {
      // Créer l'objet client correctly formatted pour le backend
      const client = {
        nom: passagers[0].nom,
        prenom: passagers[0].prenom,
        email: contact.email,
        telephone: contact.telephone
      }

      const { data } = await axios.post(`${API_BASE}/api/reservations`, {
        trajetId,
        client, // utiliser l'objet client correctement formaté
        passagers,
        placesReservees: billets
      })

      const redirect = data.checkoutUrl || data.redirectUrl || data.redirect_url || 
                      (typeof data === 'string' ? data : null)

      if (!redirect) throw new Error('Aucune URL de paiement reçue')
      window.location.assign(redirect)
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    } finally {
      setSubmitting(false)
    }
  }

  /* états visuels */
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <FiLoader className="animate-spin text-5xl text-pink-500" />
      </div>
    )

  if (error && !trajet)
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white to-indigo-50 text-gray-800 px-4">
          <p className="text-red-500 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-blue-600 text-white font-semibold"
          >
            Retour à l'accueil
          </button>
        </div>
        <Footer />
      </>
    )

  /* rendu principal */
  const prixUnit = trajet.prix
  const prixTotal = prixUnit * billets

  return (
    <>
      <Navbar />
      <main className="bg-gradient-to-br from-white to-indigo-50 text-gray-800 py-16 px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10">
          {/* ── Carte trajet ───────────────── */}
          <div className="bg-white rounded-3xl shadow-xl p-10 ring-1 ring-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-600">
              Détails du trajet
            </h2>
            <ul className="space-y-3 mb-6 text-lg">
              <li><span className="font-medium">Compagnie :</span> {trajet.compagnie}</li>
              <li><span className="font-medium">Itinéraire :</span> {trajet.villeDepart} → {trajet.villeArrivee}</li>
              <li><span className="font-medium">Date :</span> {new Date(trajet.dateDepart).toLocaleDateString('fr-FR',{ weekday:'long', day:'numeric', month:'long' })}</li>
              <li><span className="font-medium">Heure :</span> {trajet.heureDepart}</li>
              <li><span className="font-medium">Prix unitaire :</span> {prixUnit.toLocaleString('fr-FR')} FCFA</li>
              <li><span className="font-medium">Total :</span> {prixTotal.toLocaleString('fr-FR')} FCFA</li>
            </ul>

            <div className="rounded-xl bg-gradient-to-r from-pink-50 to-blue-50 px-5 py-4 text-pink-700">
              {billets} billet{billets > 1 && 's'} — bus {trajet.bus?.numero}
            </div>
          </div>

          {/* ── Formulaire ─────────────────── */}
          <div className="bg-white rounded-3xl shadow-xl p-10 ring-1 ring-gray-100">
            <h2 className="text-2xl font-bold mb-6">Informations passagers</h2>

            {error && trajet && <p className="mb-4 text-sm text-red-600">{error}</p>}

            {/* Notification UI */}
            <div className="mb-6 p-4 bg-blue-50 rounded-xl text-blue-700 flex gap-3 items-start">
              <FiInfo className="text-xl flex-shrink-0 mt-0.5" />
              <p className="text-sm">
                Le premier passager sera considéré comme le contact principal. 
                Assurez-vous que ses informations sont correctes.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Sélecteur billets */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de billets
                </label>
                <select 
                  value={billets} 
                  onChange={e => setBillets(+e.target.value)}
                  className="w-full rounded-full px-4 py-3 bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-pink-500 outline-none"
                >
                  {Array.from({ length: trajet.placesDisponibles }, (_, i) => i + 1).map(n => (
                    <option key={n} value={n}>{n} billet{n>1 && 's'}</option>
                  ))}
                </select>
              </div>

              {/* Champs passagers */}
              <div className="space-y-4">
                <h3 className="font-semibold">Informations des voyageurs</h3>
                {passagers.map((p, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      {idx === 0 ? "Passager principal" : `Passager ${idx + 1}`}
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <input 
                        placeholder={`Nom`} 
                        value={p.nom}
                        required
                        onChange={e => {
                          const copy = [...passagers]
                          copy[idx].nom = e.target.value
                          setPassagers(copy)
                        }}
                        className="w-full rounded-full px-4 py-3 bg-white border border-gray-300 focus:ring-2 focus:ring-pink-500 outline-none"
                      />
                      <input 
                        placeholder={`Prénom`} 
                        value={p.prenom}
                        required
                        onChange={e => {
                          const copy = [...passagers]
                          copy[idx].prenom = e.target.value
                          setPassagers(copy)
                        }}
                        className="w-full rounded-full px-4 py-3 bg-white border border-gray-300 focus:ring-2 focus:ring-pink-500 outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Contact */}
              <div className="space-y-4">
                <h3 className="font-semibold">Informations de contact</h3>
                <input 
                  type="email" 
                  placeholder="Email de contact" 
                  value={contact.email}
                  required
                  onChange={e => setContact({ ...contact, email: e.target.value })}
                  className="w-full rounded-full px-4 py-3 bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-pink-500 outline-none"
                />
                <input 
                  placeholder="Téléphone de contact" 
                  pattern="[0-9]{8,15}"
                  required
                  value={contact.telephone}
                  onChange={e => setContact({ ...contact, telephone: e.target.value })}
                  className="w-full rounded-full px-4 py-3 bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-pink-500 outline-none"
                />
              </div>

              {/* Bouton */}
              <button
                type="submit"
                disabled={submitting}
                className={`w-full py-3 rounded-full font-semibold text-white transition
                ${submitting ? 'bg-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-pink-500 to-blue-600 hover:brightness-110 active:scale-95'}`}
              >
                {submitting
                  ? <FiLoader className="inline-block animate-spin" />
                  : `Payer ${prixTotal.toLocaleString('fr-FR')} FCFA`
                }
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
