// src/pages/admin/ChauffeurListPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { FiPlus, FiEdit, FiTrash2, FiLoader } from 'react-icons/fi';

const ChauffeurListPage = () => {
  const [chauffeurs, setChauffeurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fonction pour récupérer les données, réutilisable pour rafraîchir
  const fetchChauffeurs = () => {
    setLoading(true);
    api.get('/admin/chauffeurs')
      .then(res => {
        if (Array.isArray(res.data)) {
          setChauffeurs(res.data);
        } else {
          setChauffeurs([]);
        }
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Erreur lors du chargement des chauffeurs.');
        setChauffeurs([]);
      })
      .finally(() => setLoading(false));
  };
  
  // Appel initial
  useEffect(() => {
    fetchChauffeurs();
  }, []);

  // Fonction pour gérer la suppression d'un chauffeur
  const handleDelete = async (id, nomComplet) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le chauffeur ${nomComplet} ?`)) {
      try {
        await api.delete(`/admin/chauffeurs/${id}`);
        // Rafraîchir la liste après la suppression
        fetchChauffeurs();
      } catch (err) {
        alert("Erreur: " + (err.response?.data?.message || "Impossible de supprimer le chauffeur."));
        console.error(err);
      }
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Gestion des Chauffeurs</CardTitle>
        <Button onClick={() => navigate('/admin/chauffeurs/new')}>
          <FiPlus className="mr-2" /> Ajouter un chauffeur
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
                  <th className="px-6 py-3 text-left">Nom Complet</th>
                  <th className="px-6 py-3 text-left">Téléphone</th>
                  <th className="px-6 py-3 text-left">Bus Affecté</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {chauffeurs.length > 0 ? chauffeurs.map(ch => (
                  <tr key={ch._id}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{ch.prenom} {ch.nom}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{ch.telephone}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {ch.bus ? (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                          {ch.bus.numero}
                        </span>
                      ) : (
                        <span className="text-gray-500">Non affecté</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end items-center gap-2">
                        <Button size="sm" variant="outline" onClick={() => navigate(`/admin/chauffeurs/${ch._id}/edit`)}>
                          <FiEdit className="mr-1 h-3 w-3"/> Modifier
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(ch._id, `${ch.prenom} ${ch.nom}`)}>
                          <FiTrash2 className="mr-1 h-3 w-3"/> Supprimer
                        </Button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="4" className="text-center py-10 text-gray-500">Aucun chauffeur trouvé.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
export default ChauffeurListPage;