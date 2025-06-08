// src/pages/admin/TrajetListPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { FiPlus, FiEdit, FiTrash2, FiLoader } from 'react-icons/fi';

const TrajetListPage = () => {
  const [trajets, setTrajets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fonction pour charger ou rafraîchir les données
  const fetchTrajets = () => {
    setLoading(true);
    api.get('/admin/trajets')
      .then(res => {
        if (Array.isArray(res.data)) {
          setTrajets(res.data);
        } else {
          setTrajets([]);
        }
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Erreur lors du chargement des trajets.');
        setTrajets([]);
      })
      .finally(() => setLoading(false));
  };
  
  // Appel initial
  useEffect(() => {
    fetchTrajets();
  }, []);

  // Fonction pour gérer la suppression d'un trajet
  const handleDelete = async (id, nomTrajet) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le trajet ${nomTrajet} ?`)) {
      try {
        await api.delete(`/admin/trajets/${id}`);
        // Rafraîchir la liste après suppression
        fetchTrajets();
      } catch (err) {
        alert("Erreur: " + (err.response?.data?.message || "Impossible de supprimer le trajet."));
        console.error(err);
      }
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Gestion des Trajets</CardTitle>
        <Button onClick={() => navigate('/admin/trajets/new')}>
          <FiPlus className="mr-2" /> Ajouter un trajet
        </Button>
      </CardHeader>
      <CardContent>
        {loading && <div className="text-center p-4"><FiLoader className="animate-spin mx-auto text-2xl text-blue-500" /></div>}
        {error && <p className="text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">Itinéraire</th>
                  <th className="px-6 py-3 text-left">Compagnie</th>
                  <th className="px-6 py-3 text-left">Date & Heure</th>
                  <th className="px-6 py-3 text-left">Prix</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {trajets.length > 0 ? trajets.map(t => (
                  <tr key={t._id}>
                    <td className="px-6 py-4 font-medium">{t.villeDepart} → {t.villeArrivee}</td>
                    <td className="px-6 py-4">{t.compagnie}</td>
                    <td className="px-6 py-4">{new Date(t.dateDepart).toLocaleDateString('fr-FR')} - {t.heureDepart}</td>
                    <td className="px-6 py-4">{t.prix.toLocaleString('fr-FR')} FCFA</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center gap-2">
                        <Button size="sm" variant="outline" onClick={() => navigate(`/admin/trajets/${t._id}/edit`)}>
                          <FiEdit className="mr-1 h-3 w-3"/> Modifier
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(t._id, `${t.villeDepart} → ${t.villeArrivee}`)}>
                          <FiTrash2 className="mr-1 h-3 w-3"/> Supprimer
                        </Button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="5" className="text-center py-10 text-gray-500">Aucun trajet trouvé.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
export default TrajetListPage;