// src/pages/public/ReservationPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiLoader, FiInfo, FiUser, FiUsers, FiMail, FiPhone } from 'react-icons/fi';
import api from '../../api';
import AuthContext from '../../context/AuthContext';

const ReservationPage = () => {
  const { id: trajetId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [trajet, setTrajet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // State pour les passagers
  const [passagers, setPassagers] = useState([{ nom: '', prenom: '' }]);
  
  // State pour les infos de contact
  const [contact, setContact] = useState({ email: '', telephone: '' });

  useEffect(() => {
    api.get(`/public/trajets/${trajetId}`)
      .then(res => setTrajet(res.data))
      .catch(() => setError('Impossible de charger les détails du trajet.'))
      .finally(() => setLoading(false));
  }, [trajetId]);

  useEffect(() => {
    // Si l'utilisateur est connecté, on pré-remplit les champs
    if (user) {
      setPassagers([{ nom: user.nom || '', prenom: user.prenom || '' }]);
      setContact({ email: user.email || '', telephone: user.telephone || '' });
    }
  }, [user]);

  const handlePassagersCountChange = (count) => {
    const newCount = Math.max(1, Math.min(count, trajet?.placesDisponibles || 1));
    setPassagers(prev => Array.from({ length: newCount }, (_, i) => prev[i] || { nom: '', prenom: '' }));
  };

  const handlePassagerInfoChange = (index, field, value) => {
    const newPassagers = [...passagers];
    newPassagers[index][field] = value;
    setPassagers(newPassagers);
  };

  const handleContactChange = (e) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!contact.email.trim() || !contact.telephone.trim()) {
        setError("L'email et le téléphone de contact sont requis.");
        return false;
    }
    for (let p of passagers) {
      if (!p.nom.trim() || !p.prenom.trim()) {
        setError("Les noms et prénoms de tous les passagers sont requis.");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!user) {
      setError("Veuillez vous connecter pour réserver.");
      navigate('/login', { state: { from: `/reservation/${trajetId}` } });
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Construction du payload exactement comme attendu par le backend
      const payload = { 
        trajetId, 
        passagers,
        contactEmail: contact.email,
        contactTelephone: contact.telephone
      };
      
      const { data } = await api.post('/reservations', payload);
      
      const redirectUrl = data.checkoutUrl || data.redirect_url;
      if (!redirectUrl) throw new Error("Aucune URL de paiement n'a été reçue.");
      
      window.location.href = redirectUrl;
    } catch (err) {
      setError(err.response?.data?.message || "Une erreur est survenue lors de l'initiation du paiement.");
      setSubmitting(false);
    }
  };
  
  if (loading) return <div className="flex justify-center items-center h-screen"><FiLoader className="animate-spin text-5xl text-pink-500" /></div>;
  if (!trajet) return <div className="text-center p-8 text-red-500">{error || "Trajet non trouvé."}</div>;

  const prixTotal = trajet.prix * passagers.length;

  return (
    <main className="bg-gray-50 text-gray-800 py-16 px-4">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10">
        <div className="bg-white rounded-3xl shadow-xl p-8 ring-1 ring-gray-100 self-start">
          <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-600">Détails du trajet</h2>
          <ul className="space-y-3 mb-6 text-lg">
            <li><strong>Compagnie:</strong> {trajet.compagnie}</li>
            <li><strong>Itinéraire:</strong> {trajet.villeDepart} → {trajet.villeArrivee}</li>
            <li><strong>Date:</strong> {new Date(trajet.dateDepart).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</li>
            <li><strong>Heure:</strong> {trajet.heureDepart}</li>
            <li><strong>Total:</strong> {prixTotal.toLocaleString('fr-FR')} FCFA</li>
          </ul>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 ring-1 ring-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold mb-2">Informations de réservation</h2>
            {!user && (<div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg flex gap-3 items-center text-sm"><FiInfo className="text-xl flex-shrink-0"/>Veuillez vous <a href="/login" className="font-bold underline">connecter</a> pour une réservation plus simple.</div>)}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de billets</label>
              <select value={passagers.length} onChange={e => handlePassagersCountChange(parseInt(e.target.value))} className="w-full rounded-full px-4 py-3 bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-pink-500 outline-none">
                {Array.from({ length: trajet.placesDisponibles }, (_, i) => i + 1).map(n => (<option key={n} value={n}>{n} billet{n > 1 && 's'}</option>))}
              </select>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Détails des passagers</h3>
              {passagers.map((p, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FiUser/> Passager {idx + 1}
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input placeholder="Nom" value={p.nom} required onChange={e => handlePassagerInfoChange(idx, 'nom', e.target.value)} className="w-full rounded-lg px-4 py-2 bg-white border border-gray-300 focus:ring-2 focus:ring-pink-500 outline-none" />
                    <input placeholder="Prénom" value={p.prenom} required onChange={e => handlePassagerInfoChange(idx, 'prenom', e.target.value)} className="w-full rounded-lg px-4 py-2 bg-white border border-gray-300 focus:ring-2 focus:ring-pink-500 outline-none" />
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
                <h3 className="font-semibold text-lg">Informations de contact</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                    <div className="relative">
                        <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="email" name="email" value={contact.email} onChange={handleContactChange} placeholder="Email de contact" required className="w-full rounded-lg pl-10 pr-4 py-2 bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                    <div className="relative">
                        <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="tel" name="telephone" value={contact.telephone} onChange={handleContactChange} placeholder="Téléphone de contact" required className="w-full rounded-lg pl-10 pr-4 py-2 bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                </div>
            </div>

            {error && <p className="text-sm text-red-600 text-center bg-red-50 p-3 rounded-lg">{error}</p>}

            <button type="submit" disabled={submitting} className="w-full py-3 rounded-full font-semibold text-white transition bg-gradient-to-r from-pink-500 to-blue-600 hover:brightness-110 active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed">
              {submitting ? <FiLoader className="inline-block animate-spin" /> : `Procéder au paiement (${prixTotal.toLocaleString('fr-FR')} FCFA)`}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default ReservationPage;