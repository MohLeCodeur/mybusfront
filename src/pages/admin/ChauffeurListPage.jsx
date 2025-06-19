// src/pages/admin/ChauffeurListPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { FiPlus, FiEdit, FiTrash2, FiLoader, FiUser, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const ChauffeurListPage = () => {
  const [allChauffeurs, setAllChauffeurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // --- États pour la pagination ---
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 7;

  const fetchChauffeurs = () => {
    setLoading(true);
    api.get('/admin/chauffeurs')
      .then(res => setAllChauffeurs(Array.isArray(res.data) ? res.data : []))
      .catch(err => setError(err.response?.data?.message || 'Erreur serveur'))
      .finally(() => setLoading(false));
  };
  
  useEffect(fetchChauffeurs, []);

  const handleDelete = async (id, nomComplet) => {
    if (window.confirm(`Supprimer le chauffeur ${nomComplet} ?`)) {
      try {
        await api.delete(`/admin/chauffeurs/${id}`);
        fetchChauffeurs();
      } catch (err) {
        alert("Erreur: " + (err.response?.data?.message || "Impossible de supprimer le chauffeur."));
      }
    }
  };

  // --- Logique de pagination ---
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentChauffeurs = allChauffeurs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(allChauffeurs.length / ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Gestion des Chauffeurs</h1>
            <p className="text-gray-500 mt-1">Ajoutez, modifiez ou supprimez les informations de vos chauffeurs.</p>
        </div>
        <Button onClick={() => navigate('/admin/chauffeurs/new')} className="bg-gradient-to-r from-pink-500 to-blue-500 text-white shadow-lg hover:shadow-blue-500/50">
          <FiPlus className="mr-2" /> Ajouter un Chauffeur
        </Button>
      </div>

      <Card className="shadow-xl border-t-4 border-green-500">
        <CardHeader>
          <CardTitle>Liste des Chauffeurs ({allChauffeurs.length})</CardTitle>
          <CardDescription>Consultez la liste de tous les chauffeurs enregistrés.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading && <div className="text-center p-8"><FiLoader className="animate-spin mx-auto text-3xl text-blue-500" /></div>}
          {error && <p className="text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>}
          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">Nom Complet</th>
                    <th className="px-6 py-3 text-left">Téléphone</th>
                    <th className="px-6 py-3 text-left">Bus Affecté</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentChauffeurs.length > 0 ? currentChauffeurs.map(ch => (
                    <tr key={ch._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded-full flex items-center justify-center">
                            <FiUser className="text-gray-500"/>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800">{ch.prenom} {ch.nom}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">{ch.telephone}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {ch.bus ? (
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                            {ch.bus.numero}
                          </span>
                        ) : (
                          <span className="text-gray-400 italic">Aucun</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={() => navigate(`/admin/chauffeurs/${ch._id}/edit`)}><FiEdit/></Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(ch._id, `${ch.prenom} ${ch.nom}`)}><FiTrash2/></Button>
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
        {totalPages > 1 && (
            <CardFooter className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Page {currentPage} sur {totalPages}</span>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>
                        <FiChevronLeft/> Précédent
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
                        Suivant <FiChevronRight/>
                    </Button>
                </div>
            </CardFooter>
        )}
      </Card>
    </div>
  );
};
export default ChauffeurListPage;