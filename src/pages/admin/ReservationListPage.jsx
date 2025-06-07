// src/pages/admin/ReservationListPage.jsx
import React, { useState, useEffect } from 'react';
import api from '@/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card.jsx';
import { FiLoader } from 'react-icons/fi';

const ReservationListPage = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/admin/reservations/all') // URL CORRIGÉE
      .then(res => setReservations(res.data))
      .catch(err => setError(err.response?.data?.message || 'Erreur serveur'))
      .finally(() => setLoading(false));
  }, []);
  
  const getStatusBadge = (status) => {
    switch (status) {
        case 'confirmée': return 'bg-green-100 text-green-800';
        case 'en_attente': return 'bg-yellow-100 text-yellow-800';
        case 'annulée': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Liste des Réservations</CardTitle>
      </CardHeader>
      <CardContent>
        {loading && <div className="text-center p-4"><FiLoader className="animate-spin mx-auto text-2xl" /></div>}
        {error && <p className="text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">Client</th>
                  <th className="px-6 py-3 text-left">Trajet</th>
                  <th className="px-6 py-3 text-left">Date Rés.</th>
                  <th className="px-6 py-3 text-left">Places</th>
                  <th className="px-6 py-3 text-left">Statut</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reservations.map(r => (
                  <tr key={r._id}>
                    <td className="px-6 py-4">{r.client?.prenom} {r.client?.nom}</td>
                    <td className="px-6 py-4">{r.trajet?.villeDepart} → {r.trajet?.villeArrivee}</td>
                    <td className="px-6 py-4">{new Date(r.dateReservation).toLocaleDateString()}</td>
                    <td className="px-6 py-4">{r.placesReservees}</td>
                    <td className="px-6 py-4">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(r.statut)}`}>
                            {r.statut}
                        </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
export default ReservationListPage;