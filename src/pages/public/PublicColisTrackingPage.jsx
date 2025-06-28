// src/pages/public/PublicColisTrackingPage.jsx (CODE COMPLET ET CORRIGÉ)

import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import AuthContext from '../../context/AuthContext';
// --- LIGNE MODIFIÉE : Ajout de l'icône FaRoute ---
import { FiSearch, FiLoader, FiXCircle, FiPackage, FiUser, FiPhone, FiThumbsUp, FiSend, FiCheckCircle } from 'react-icons/fi';
import { FaRoute } from 'react-icons/fa';
import StatusStepper from '../../components/admin/StatusStepper.jsx';

// --- Composant pour l'alerte de statut (inchangé) ---
const StatusAlert = ({ status }) => {
    const statusInfo = {
        'enregistré': {
            icon: <FiThumbsUp className="text-blue-500 text-2xl" />,
            title: "Colis enregistré avec succès !",
            message: "Nous avons bien reçu votre colis. Il est en attente de préparation pour l'expédition.",
            bgColor: "bg-blue-50",
            borderColor: "border-blue-500",
        },
        'encours': {
            icon: <FiSend className="text-orange-500 text-2xl" />,
            title: "Votre colis est en route !",
            message: "Veuillez patienter, votre colis est actuellement en cours de livraison vers sa destination.",
            bgColor: "bg-orange-50",
            borderColor: "border-orange-500",
        },
        'arrivé': {
            icon: <FiCheckCircle className="text-green-500 text-2xl" />,
            title: "Votre colis est arrivé !",
            message: "Bonne nouvelle ! Votre colis est arrivé à destination et est prêt à être récupéré.",
            bgColor: "bg-green-50",
            borderColor: "border-green-500",
        }
    };
    const info = statusInfo[status];
    if (!info) return null;
    return (
        <div className={`p-4 rounded-lg border-l-4 ${info.bgColor} ${info.borderColor}`}>
            <div className="flex items-center gap-4">
                <div className="shrink-0">{info.icon}</div>
                <div>
                    <h4 className="font-bold text-gray-800">{info.title}</h4>
                    <p className="text-sm text-gray-600">{info.message}</p>
                </div>
            </div>
        </div>
    );
};


const PublicColisTrackingPage = () => {
  const [code, setCode] = useState('');
  const [colis, setColis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    if (!user) {
        navigate('/login', { state: { from: { pathname: '/track-colis' } } });
        return;
    }
    setLoading(true);
    setError('');
    setColis(null);
    try {
      // Cet appel va maintenant recevoir les données du trajet grâce à la modif du backend
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
        
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
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

        <div className="mt-8">
            {error && (
              <div className="p-4 bg-red-100 text-red-800 rounded-lg flex items-center gap-3 animate-fade-in">
                  <FiXCircle /><span>{error}</span>
              </div>
            )}
            
            {colis && (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 animate-fade-in-up">
                <div className="p-6">
                    <StatusAlert status={colis.statut} />
                </div>

                <div className="p-6 border-t">
                    <h3 className="text-center font-semibold mb-6 text-gray-600">Progression détaillée</h3>
                    <StatusStepper currentStatus={colis.statut} />
                </div>

                {/* ========================================================== */}
                {/* === NOUVELLE SECTION POUR LES DÉTAILS DU TRAJET === */}
                {/* ========================================================== */}
                {colis.trajet && (
                  <div className="p-6 bg-gray-50/50 border-t">
                      <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <FaRoute className="text-blue-500"/>
                        Informations du Trajet
                      </h4>
                      <div className="text-sm space-y-1 pl-8">
                        <p><strong>Itinéraire :</strong> {colis.trajet.villeDepart} → {colis.trajet.villeArrivee}</p>
                        <p><strong>Date de départ prévue :</strong> {new Date(colis.trajet.dateDepart).toLocaleDateString('fr-FR')}</p>
                        
                      </div>
                  </div>
                )}
                
                <div className="p-6 bg-gray-50/50 grid md:grid-cols-2 gap-6 border-t">
                    <div>
                        <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2"><FiUser/> Expéditeur</h4>
                        <div className="text-sm space-y-1"><p>{colis.expediteur_nom}</p><p className="text-gray-500 flex items-center gap-2"><FiPhone size={12}/> {colis.expediteur_telephone}</p></div>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2"><FiUser/> Destinataire</h4>
                        <div className="text-sm space-y-1"><p>{colis.destinataire_nom}</p><p className="text-gray-500 flex items-center gap-2"><FiPhone size={12}/> {colis.destinataire_telephone}</p></div>
                    </div>
                </div>

                <div className="p-6 border-t text-sm text-gray-600 grid grid-cols-2 gap-4">
                    <p><strong>Code Suivi:</strong><br/><span className="font-mono text-blue-600">{colis.code_suivi}</span></p>
                    <p className="text-right"><strong>Prix:</strong><br/><span className="font-bold text-pink-600">{colis.prix?.toLocaleString('fr-FR')} FCFA</span></p>
                    <p className="col-span-2"><strong>Description:</strong><br/>{colis.description}</p>
                    <p className="col-span-2 text-xs text-gray-400">Enregistré le: {new Date(colis.date_enregistrement).toLocaleString('fr-FR')}</p>
                </div>
              </div>
            )}
        </div>
      </div>
    </main>
  );
};

export default PublicColisTrackingPage;