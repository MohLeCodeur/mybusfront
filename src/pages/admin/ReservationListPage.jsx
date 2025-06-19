// src/pages/admin/ReservationListPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { FiLoader, FiEdit, FiTrash2, FiCheckCircle, FiUser, FiCalendar, FiDollarSign, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

// Composant interne pour afficher une seule carte de réservation
const ReservationCard = ({ reservation, onConfirm, onDelete, onEdit }) => {
    // Calcul du montant total pour cette réservation
    const montantTotal = (reservation.trajet?.prix || 0) * reservation.placesReservees;

    // Fonction pour obtenir les styles du badge de statut
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
                    <p className="font-bold text-gray-800">{reservation.trajet?.villeDepart} → {reservation.trajet?.villeArrivee}</p>
                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${statusInfo.bg} ${statusInfo.color}`}>{statusInfo.text}</span>
                </div>
                <div className="text-sm text-gray-500 space-y-1">
                    <p className="flex items-center gap-2"><FiUser size={14}/> {reservation.client?.prenom} {reservation.client?.nom}</p>
                    <p className="flex items-center gap-2"><FiCalendar size={14}/> {new Date(reservation.trajet?.dateDepart).toLocaleDateString('fr-FR')}</p>
                </div>
            </div>
            <div className="border-t mt-4 pt-4 flex justify-between items-center">
                <div className="flex items-center gap-2 text-blue-600 font-bold">
                    <FiDollarSign/>
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


// Composant principal de la page
const ReservationListPage = () => {
    const [allReservations, setAllReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    
    const [statusFilter, setStatusFilter] = useState(''); // '' pour toutes
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 9; // 3x3 grid

    const fetchReservations = useCallback(() => {
        setLoading(true);
        api.get(`/admin/reservations/all?statut=${statusFilter}`)
            .then(res => {
                if (Array.isArray(res.data)) {
                    setAllReservations(res.data);
                } else {
                    setAllReservations([]);
                }
            })
            .catch(err => setError(err.response?.data?.message || 'Erreur serveur'))
            .finally(() => setLoading(false));
    }, [statusFilter]);

    useEffect(fetchReservations, [fetchReservations]);

    const handleConfirm = async (id) => {
        if (window.confirm("Voulez-vous vraiment confirmer cette réservation manuellement ?")) {
            try {
                await api.post(`/admin/reservations/${id}/confirm`);
                fetchReservations(); 
            } catch (err) {
                alert(err.response?.data?.message || "Une erreur est survenue.");
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm(`Supprimer la réservation ID: ${id} ?`)) {
          try {
            await api.delete(`/admin/reservations/${id}`);
            fetchReservations();
          } catch (err) {
            alert("Erreur: " + (err.response?.data?.message || "Impossible de supprimer."));
          }
        }
    };

    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentReservations = allReservations.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(allReservations.length / ITEMS_PER_PAGE);

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
                            <CardTitle>Liste des Réservations ({allReservations.length})</CardTitle>
                        </div>
                        <div className="flex items-center gap-2">
                            <label htmlFor="status-filter" className="text-sm font-medium">Filtrer par statut :</label>
                            <select id="status-filter" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }} className="border-gray-300 rounded-md text-sm p-2 bg-white focus:ring-blue-500">
                                <option value="">Toutes</option>
                                <option value="confirmée">Confirmées</option>
                                <option value="en_attente">En attente</option>
                                <option value="annulée">Annulées</option>
                            </select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? <div className="text-center p-8"><FiLoader className="animate-spin mx-auto text-3xl text-blue-500"/></div> :
                     error ? <p className="text-red-500 bg-red-50 p-3 rounded-lg">{error}</p> :
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {currentReservations.length > 0 ? currentReservations.map(r => (
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
                {totalPages > 1 && (
                    <CardFooter className="flex justify-between items-center border-t">
                        <span className="text-sm text-gray-500">Page {currentPage} sur {totalPages}</span>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>
                                <FiChevronLeft className="mr-1"/>Précédent
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
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