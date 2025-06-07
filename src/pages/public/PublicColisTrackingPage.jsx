// src/pages/public/PublicColisTrackingPage.jsx
import React, { useState } from 'react';
import api from '../../api';
import { FiSearch, FiLoader, FiXCircle } from 'react-icons/fi';
import StatusStepper from '../../components/admin/StatusStepper';

const PublicColisTrackingPage = () => {
  const [code, setCode] = useState('');
  const [colis, setColis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setError('');
    setColis(null);
    try {
      const { data } = await api.get(`/public/colis/track/${code}`); // URL CORRIGÉE
      setColis(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Colis introuvable ou code invalide.');
    } finally {
      setLoading(false);
    }
  };

  // Le reste du JSX est déjà correct
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 space-y-8">
        <div><h1 className="text-3xl font-bold text-center text-gray-800 mb-2 font-playfair">Suivi de Colis</h1><p className="text-center text-gray-500">Entrez votre code de suivi pour voir l'état de votre envoi.</p></div>
        <form onSubmit={handleTrack} className="flex space-x-4">
          <input type="text" placeholder="Entrez votre code de suivi" value={code} onChange={(e) => setCode(e.target.value.toUpperCase().trim())} className="flex-grow border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition" required />
          <button type="submit" disabled={loading} className="px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300">
            {loading ? <FiLoader className="animate-spin" /> : 'Suivre'}
          </button>
        </form>
        {error && (<div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-3"><FiXCircle /><span>{error}</span></div>)}
        {colis && (
          <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 animate-fade-in">
            <h2 className="text-xl font-semibold mb-4">Résultat pour : {colis.code_suivi}</h2>
            <StatusStepper currentStatus={colis.statut} />
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div><strong className="block text-gray-500">Description</strong> {colis.description}</div>
                <div><strong className="block text-gray-500">Prix</strong> {colis.prix.toLocaleString('fr-FR')} XOF</div>
                <div><strong className="block text-gray-500">Expéditeur</strong> {colis.expediteur_nom}</div>
                <div><strong className="block text-gray-500">Destinataire</strong> {colis.destinataire_nom}</div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
export default PublicColisTrackingPage;