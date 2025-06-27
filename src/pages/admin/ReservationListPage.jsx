// src/pages/admin/ReservationListPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import api from '../../api';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { FiLoader, FiEdit, FiTrash2, FiCheckCircle, FiUser, FiCalendar, FiTag, FiChevronLeft, FiChevronRight, FiSearch, FiRefreshCw } from 'react-icons/fi';

// --- Composant interne ReservationCard (Inchangé) ---
const ReservationCard = ({ reservation, onConfirm, onDelete, onEdit }) => {
    // Le montant est maintenant calculé au backend et inclus dans la réponse (montantTotal)
    const montantTotal = reservation.montantTotal || ((reservation.trajet?.prix || 0) * reservation.placesReservees);

    const getStatusInfo = (status) => {
        switch (status) {
            case 'confirmée': return { text: 'Confirmée', color: 'text-green-800', bg: 'bg-green-100' };
            case 'en_attente': return { text: 'En attente', color: 'text-yellow-800', bg: 'bg-yellow-100' };
            case 'annulée': return { text: 'Annulée', color: 'text-red-800', bg: 'bg-red-100' };
            default: return { text: status, color: 'text-gray-800', bg: 'bg-gray-100' };
        }
    };
    const statusInfo = getStatusInfo(reservation.statut);

    return (
        <div className="bg-white p-4 rounded-lg border hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start mb-2">
                    <p className="font-bold text-gray-800 truncate" title={`${reservation.trajet?.villeDepart} → ${reservation.trajet?.villeArrivee}`}>{reservation.trajet?.villeDepart} → {reservation.trajet?.villeArrivee}</p>
                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${statusInfo.bg} ${statusInfo.color}`}>{statusInfo.text}</span>
                </div>
                <div className="text-sm text-gray-500 space-y-1">
                    <p className="flex items-center gap-2"><FiUser size={14}/> {reservation.client?.prenom} {reservation.client?.nom}</p>
                    <p className="flex items-center gap-2"><FiCalendar size={14}/> {new Date(reservation.trajet?.dateDepart).toLocaleDateString('fr-FR')}</p>
                </div>
            </div>
            <div className="border-t mt-4 pt-4 flex justify-between items-center">
                <div className="flex items-center gap-2 text-blue-600 font-bold">
                    <FiTag/>
                    <span>{montantTotal.toLocaleString('fr-FR')} FCFA</span>
                    <span className="text-gray-400 font-normal text-sm">({reservation.placesReservees} place{reservation.placesReservees > 1 ? 's' : ''})</span>
                </div>
                <div className="flex gap-2">
                    {reservation.statut === 'en_attente' && (
                        <Button size="sm" className="bg-green-500 text-white hover:bg-green-600" onClick={onConfirm} title="Confirmer le paiement"><FiCheckCircle/></Button>
                    )}
                    <Button size="sm" variant="outline" onClick={onEdit} title="Modifier"><FiEdit/></Button>
                    <Button size="sm" variant="destructive" onClick={onDelete} title="Supprimer"><FiTrash2/></Button>
                </div>
            </div>
        </div>
    );
};

// --- Composant principal de la page (Entièrement revu) ---
const ReservationListPage = () => {
    const navigate = useNavigate();
    const [data, setData] = useState({ docs: [], total: 0, pages: 1 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [filters, setFilters] = useState({
        statut: '',
        search: '',
        sortBy: 'date_desc',
        page: 1,
    });
    const [debouncedSearch] = useDebounce(filters.search, 500);

    const fetchReservations = useCallback(() => {
        setLoading(true);
        const params = new URLSearchParams({
            statut: filters.statut,
            search: debouncedSearch,
            sortBy: filters.sortBy,
            page: filters.page,
            limit: 9,
        });

        api.get(`/admin/reservations/all?${params.toString()}`)
            .then(res => setData(res.data))
            .catch(err => setError(err.response?.data?.message || 'Erreur serveur'))
            .finally(() => setLoading(false));
    }, [filters.statut, debouncedSearch, filters.sortBy, filters.page]);

    useEffect(fetchReservations, [fetchReservations]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
    };

    const handlePageChange = (newPage) => {
        setFilters(prev => ({ ...prev, page: newPage }));
    };

    const handleConfirm = async (id) => {
        if (window.confirm("Voulez-vous vraiment confirmer cette réservation manuellement ?")) {
            try { await api.post(`/admin/reservations/${id}/confirm`); fetchReservations(); }
            catch (err) { alert(err.response?.data?.message || "Une erreur est survenue."); }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm(`Supprimer la réservation ID: ${id} ?`)) {
          try { await api.delete(`/admin/reservations/${id}`); fetchReservations(); }
          catch (err) { alert("Erreur: " + (err.response?.data?.message || "Impossible de supprimer.")); }
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Gestion des Réservations</h1>
                <p className="text-gray-500 mt-1">Consultez, confirmez et gérez toutes les réservations.</p>
            </div>
            <Card className="shadow-xl">
                <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <CardTitle>Liste des Réservations ({loading ? '...' : data.total})</CardTitle>
                        </div>
                        <div className="relative w-full md:w-auto">
                           <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                           <input 
                                type="text"
                                placeholder="Rechercher (client, ville...)"
                                value={filters.search}
                                onChange={e => handleFilterChange('search', e.target.value)}
                                className="pl-10 pr-4 py-2 w-full md:w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                           />
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 mt-4 pt-4 border-t border-gray-100">
                        <select value={filters.statut} onChange={e => handleFilterChange('statut', e.target.value)} className="border-gray-300 rounded-md text-sm p-2 bg-white">
                            <option value="">Tous les statuts</option>
                            <option value="confirmée">Confirmées</option>
                            <option value="en_attente">En attente</option>
                            <option value="annulée">Annulées</option>
                        </select>
                         <select value={filters.sortBy} onChange={e => handleFilterChange('sortBy', e.target.value)} className="border-gray-300 rounded-md text-sm p-2 bg-white">
                            <option value="date_desc">Trier par : Date (récente)</option>
                            <option value="date_asc">Trier par : Date (ancienne)</option>
                            <option value="amount_desc">Trier par : Montant (élevé)</option>
                            <option value="amount_asc">Trier par : Montant (faible)</option>
                        </select>
                        <Button variant="outline" size="sm" onClick={() => setFilters({ statut: '', search: '', sortBy: 'date_desc', page: 1 })}>
                            <FiRefreshCw className="mr-1"/>Réinitialiser
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? <div className="text-center p-8"><FiLoader className="animate-spin mx-auto text-3xl text-blue-500"/></div> :
                     error ? <p className="text-red-500 bg-red-50 p-3 rounded-lg">{error}</p> :
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {data.docs.length > 0 ? data.docs.map(r => (
                            <ReservationCard 
                                key={r._id} 
                                reservation={r}
                                onConfirm={() => handleConfirm(r._id)}
                                onDelete={() => handleDelete(r._id)}
                                onEdit={() => navigate(`/admin/reservations/${r._id}/edit`)}
                            />
                        )) : <p className="col-span-full text-center py-16 text-gray-500">Aucune réservation ne correspond à vos filtres.</p>}
                    </div>}
                </CardContent>
                {data.pages > 1 && (
                    <CardFooter className="flex justify-between items-center border-t">
                        <span className="text-sm text-gray-500">Page {filters.page} sur {data.pages}</span>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handlePageChange(filters.page - 1)} disabled={filters.page === 1}>
                                <FiChevronLeft className="mr-1"/>Précédent
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handlePageChange(filters.page + 1)} disabled={filters.page >= data.pages}>
                                Suivant <FiChevronRight className="ml-1"/>
                            </Button>
                        </div>
                    </CardFooter>
                )}
            </Card>
        </div>
    );
};

export default ReservationListPage;