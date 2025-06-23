// src/pages/admin/TrajetListPage.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPlus, FaBus, FaPlay, FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaArrowRight, FaEdit, FaTrash } from 'react-icons/fa';
import { getAllTrajets, deleteTrajet, updateTrajet } from '../../api';
import { useNotification } from '../../context/NotificationContext';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const TrajetListPage = () => {
  const [trajets, setTrajets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('aVenir');
  const { addNotification } = useNotification();

  useEffect(() => {
    const fetchTrajets = async () => {
      try {
        const data = await getAllTrajets();
        setTrajets(data.sort((a, b) => new Date(a.dateDepart) - new Date(b.dateDepart)));
      } catch (error) {
        addNotification('Erreur lors de la récupération des trajets', 'error');
        console.error("Erreur API:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrajets();
  }, [addNotification]);
  
  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce trajet ?")) {
      try {
        await deleteTrajet(id);
        setTrajets(trajets.filter(t => t._id !== id));
        addNotification('Trajet supprimé avec succès', 'success');
      } catch (error) {
        addNotification('Erreur lors de la suppression du trajet', 'error');
      }
    }
  };

  const handleStartTrajet = async (id) => {
    try {
      const updatedTrajet = await updateTrajet(id, { statut: 'en cours' });
      setTrajets(trajets.map(t => t._id === id ? { ...t, statut: 'en cours' } : t));
      addNotification('Le trajet a démarré !', 'success');
    } catch (error) {
      addNotification('Erreur lors du démarrage du trajet', 'error');
    }
  };

  const handleFinishTrajet = async (id) => {
    try {
      await updateTrajet(id, { statut: 'terminé' });
      setTrajets(trajets.map(t => t._id === id ? { ...t, statut: 'terminé' } : t));
      addNotification('Le trajet est terminé.', 'info');
    } catch (error) {
      addNotification('Erreur lors de la finalisation du trajet', 'error');
    }
  };

  // --- NOUVELLE LOGIQUE DE TRI AMÉLIORÉE ---
  const now = new Date();

  const { aVenir, enCours, passes } = trajets.reduce((acc, trajet) => {
    const dateDepart = new Date(trajet.dateDepart);

    if (trajet.statut === 'terminé' || trajet.statut === 'annulé') {
        acc.passes.push(trajet);
    } else if (trajet.statut === 'en cours') {
        acc.enCours.push(trajet);
    } else if (trajet.statut === 'en attente') {
        // Si la date de départ est strictement dans le futur
        if (dateDepart > now) {
            acc.aVenir.push(trajet);
        } else {
            // Si la date de départ est passée mais qu'il est "en attente",
            // il est considéré comme un trajet passé qui nécessite une action.
            acc.passes.push(trajet);
        }
    }
    return acc;
  }, { aVenir: [], enCours: [], passes: [] });
  
  const renderTrajetList = (list) => {
    if (list.length === 0) {
      return <p className="text-center text-gray-500 py-8">Aucun trajet dans cette catégorie.</p>;
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.map(trajet => (
          <motion.div
            key={trajet._id}
            className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="p-5">
              <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-gray-800">{trajet.depart} <FaArrowRight className="inline mx-2" /> {trajet.destination}</h3>
                  <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
                      trajet.statut === 'en attente' ? 'bg-yellow-200 text-yellow-800' :
                      trajet.statut === 'en cours' ? 'bg-blue-200 text-blue-800' :
                      'bg-gray-200 text-gray-800'
                  }`}>
                      {trajet.statut}
                  </span>
              </div>
              <p className="text-gray-600 mt-2">
                {format(new Date(trajet.dateDepart), 'eeee dd MMMM yyyy \'à\' HH:mm', { locale: fr })}
              </p>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p><strong>Bus:</strong> {trajet.bus?.nom || 'N/A'} ({trajet.bus?.immatriculation || 'N/A'})</p>
                <p><strong>Chauffeur:</strong> {trajet.chauffeur?.nom || 'N/A'}</p>
                <p><strong>Prix:</strong> {trajet.prix} FCFA</p>
                <p><strong>Places restantes:</strong> {trajet.placesDisponibles}</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 justify-end">
                {/* --- LOGIQUE DU BOUTON CORRIGÉE --- */}
                {trajet.statut === 'en attente' && new Date(trajet.dateDepart) <= now && (
                    <button onClick={() => handleStartTrajet(trajet._id)} className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-3 rounded">
                        <FaPlay /> Démarrer
                    </button>
                )}
                {trajet.statut === 'en cours' && (
                    <button onClick={() => handleFinishTrajet(trajet._id)} className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 rounded">
                        <FaCheckCircle /> Terminer
                    </button>
                )}
                 <Link to={`/admin/trajets/edit/${trajet._id}`} className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-3 rounded">
                    <FaEdit /> Modifier
                </Link>
                <button onClick={() => handleDelete(trajet._id)} className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded">
                    <FaTrash /> Supprimer
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div></div>;
  }

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gestion des Trajets</h1>
        <Link to="/admin/trajets/new" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105">
          <FaPlus /> Nouveau Trajet
        </Link>
      </div>

      <div className="mb-6">
          <div className="flex border-b border-gray-300">
              <button onClick={() => setActiveTab('aVenir')} className={`py-2 px-4 text-lg font-medium ${activeTab === 'aVenir' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'}`}>À venir ({aVenir.length})</button>
              <button onClick={() => setActiveTab('enCours')} className={`py-2 px-4 text-lg font-medium ${activeTab === 'enCours' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}>En cours ({enCours.length})</button>
              <button onClick={() => setActiveTab('passes')} className={`py-2 px-4 text-lg font-medium ${activeTab === 'passes' ? 'border-b-2 border-gray-500 text-gray-600' : 'text-gray-500'}`}>Passés & Archivés ({passes.length})</button>
          </div>
      </div>
      
      <div>
          {activeTab === 'aVenir' && renderTrajetList(aVenir)}
          {activeTab === 'enCours' && renderTrajetList(enCours)}
          {activeTab === 'passes' && renderTrajetList(passes)}
      </div>

    </div>
  );
};

export default TrajetListPage;