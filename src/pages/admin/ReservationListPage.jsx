// src/pages/admin/ReservationListPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { FiLoader, FiEdit, FiCheckCircle } from 'react-icons/fi';

const ReservationListPage = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fonction pour charger ou recharger les données
  const fetchReservations = () => {
    setLoading(true);
    api.get('/admin/reservations/all')
      .then(res => {
        if (Array.isArray(res.data)) {
          setReservations(res.data);
        } else {
          setReservations([]);
        }
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Erreur lors du chargement des réservations.');
        setReservations([]);
      })
      .finally(() => setLoading(false));
  };

  // Chargement initial des données
  useEffect(() => {
    fetchReservations();
  }, []); // Le tableau vide assure que cela ne se lance qu'une fois au montage

  // Fonction pour confirmer manuellement une réservation
  const handleConfirm = async (id) => {
    if (window.confirm("Voulez-vous vraiment confirmer cette réservation ? Cela simulera un paiement réussi.")) {
      try {
        await api.post(`/admin/reservations/${id}/confirm`);
        // Recharger la liste pour afficher le nouveau statut
        fetchReservations(); 
      } catch (err) {
        alert(err.response?.data?.message || "Une erreur est survenue lors de la confirmation.");
      }
    }
  };
  
  // Fonction pour déterminer la couleur du badge de statut
  const getStatusBadge = (status) => {
    switch (status) {
        case 'confirmée': return 'bg-green-100 text-green-800';
        case 'en_attente': return 'bg-yellow-100 text-yellow-800';
        case 'annulée': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Liste des Réservations</CardTitle>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="text-center p-4">
            <FiLoader className="animate-spin mx-auto text-2xl text-blue-500" />
          </div>
        )}
        {error && (
          <p className="text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>
        )}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trajet</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Rés.</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Places</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reservations.length > 0 ? (
                  reservations.map(r => (
                    <tr key={r._id}>
                      <td className="px-6 py-4 whitespace-nowrap">{r.client?.prenom} {r.client?.nom}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{r.trajet?.villeDepart} → {r.trajet?.villeArrivee}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{new Date(r.dateReservation).toLocaleDateString('fr-FR')}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">{r.placesReservees}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(r.statut)}`}>
                            {r.statut.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end items-center gap-2">
                            {/* Le bouton "Confirmer" n'apparaît que si le statut est 'en_attente' */}
                            {r.statut === 'en_attente' && (
                                <Button 
                                  size="sm" 
                                  onClick={() => handleConfirm(r._id)}
                                  className="bg-green-500 hover:bg-green-600 text-white"
                                >
                                    <FiCheckCircle className="mr-1 h-3 w-3"/> Confirmer
                                </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigate(`/admin/reservations/${r._id}/edit`)}
                            >
                              <FiEdit className="mr-1 h-3 w-3" /> Modifier
                            </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-gray-500">
                      Aucune réservation n'a été trouvée.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReservationListPage;