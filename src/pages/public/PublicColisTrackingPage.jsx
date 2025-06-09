// src/pages/public/PublicColisTrackingPage.jsx
import React, { useState } from 'react';
import api from '../../api';
import { FiSearch, FiLoader, FiXCircle, FiPackage, FiUser, FiPhone, FiDollarSign } from 'react-icons/fi';
import StatusStepper from '../../components/admin/StatusStepper.jsx';

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
      const { data } = await api.get(`/public/colis/track/${code}`);
      setColis(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Colis introuvable ou code invalide.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        
        {/* === SECTION DE RECHERCHE === */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6 transform transition-all duration-500">
          <div className="text-center">
            <FiPackage className="mx-auto text-5xl text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-500 mb-2"/>
            <h1 className="text-3xl font-bold text-gray-800 font-playfair">Suivi de votre Colis</h1>
            <p className="text-gray-500 mt-1">Entrez votre code pour connaître l'avancement de votre envoi.</p>
          </div>
          <form onSubmit={handleTrack} className="flex gap-3">
            <input 
              type="text" 
              placeholder="Ex: 8H7K5L3P" 
              value={code} 
              onChange={(e) => setCode(e.target.value.toUpperCase().trim())} 
              className="flex-grow text-lg font-mono tracking-widest border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-pink-400 transition" 
              required 
            />
            <button 
              type="submit" 
              disabled={loading} 
              className="px-6 bg-gradient-to-r from-pink-500 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <FiLoader className="animate-spin" /> : <FiSearch />}
            </button>
          </form>
        </div>

        {/* === SECTION DES RÉSULTATS === */}
        <div className="mt-8">
            {error && (
              <div className="p-4 bg-red-100 text-red-800 rounded-lg flex items-center gap-3 animate-fade-in">
                  <FiXCircle /><span>{error}</span>
              </div>
            )}
            
            {colis && (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 animate-fade-in-up">
                {/* En-tête du résultat */}
                <div className="p-6 border-b-2 border-dashed">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-gray-500">Code de suivi</p>
                            <p className="text-2xl font-bold font-mono tracking-wider text-blue-600">{colis.code_suivi}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Prix du transport</p>
                            <p className="text-2xl font-bold text-pink-600">{colis.prix?.toLocaleString('fr-FR')} FCFA</p>
                        </div>
                    </div>
                </div>

                {/* Statut du colis */}
                <div className="p-6">
                    <h3 className="text-center font-semibold mb-6">Statut de la livraison</h3>
                    <StatusStepper currentStatus={colis.statut} />
                </div>
                
                {/* Informations Expéditeur / Destinataire */}
                <div className="p-6 bg-gray-50/50 grid md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2"><FiUser/> Expéditeur</h4>
                        <div className="text-sm space-y-1">
                            <p>{colis.expediteur_nom}</p>
                            <p className="text-gray-500 flex items-center gap-2"><FiPhone size={12}/> {colis.expediteur_telephone}</p>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2"><FiUser/> Destinataire</h4>
                        <div className="text-sm space-y-1">
                            <p>{colis.destinataire_nom}</p>
                            <p className="text-gray-500 flex items-center gap-2"><FiPhone size={12}/> {colis.destinataire_telephone}</p>
                        </div>
                    </div>
                </div>

                {/* Détails supplémentaires */}
                <div className="p-6 border-t text-sm text-gray-600">
                    <p><strong>Description :</strong> {colis.description}</p>
                    <p><strong>Enregistré le :</strong> {new Date(colis.date_enregistrement).toLocaleString('fr-FR')}</p>
                </div>
              </div>
            )}
        </div>
      </div>
    </main>
  );
};
export default PublicColisTrackingPage;