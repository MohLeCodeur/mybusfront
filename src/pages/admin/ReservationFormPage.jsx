// src/pages/admin/ReservationFormPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { FiSave, FiLoader } from 'react-icons/fi';

const ReservationFormPage = () => {
  const { id } = useParams(); // L'ID de la réservation à modifier
  const navigate = useNavigate();

  const [reservation, setReservation] = useState(null);
  const [formData, setFormData] = useState({ statut: 'en_attente' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // On ne charge la réservation que si on est en mode édition
    if (id) {
      api.get(`/reservations/${id}`) // Utilise la route publique pour obtenir les détails
        .then(res => {
          setReservation(res.data);
          setFormData({ statut: res.data.statut }); // On ne permet de modifier que le statut pour l'instant
        })
        .catch(err => {
          setError('Impossible de charger la réservation.');
          console.error(err);
        })
        .finally(() => setLoading(false));
    } else {
        // Mode création non supporté depuis l'admin pour l'instant
        navigate('/admin/reservations');
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api.put(`/admin/reservations/${id}`, formData); // Appelle la route admin de mise à jour
      navigate('/admin/reservations');
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Chargement de la réservation...</div>;
  if (error) return <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Modifier la Réservation</CardTitle>
        <p className="text-sm text-gray-500">ID: {reservation?._id}</p>
      </CardHeader>
      <CardContent>
        {/* Affichage des informations non modifiables */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-2">
            <p><strong>Client:</strong> {reservation?.client?.prenom} {reservation?.client?.nom}</p>
            <p><strong>Trajet:</strong> {reservation?.trajet?.villeDepart} → {reservation?.trajet?.villeArrivee}</p>
            <p><strong>Date:</strong> {new Date(reservation?.trajet?.dateDepart).toLocaleDateString()}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Statut de la réservation</label>
            <select
              name="statut"
              value={formData.statut}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
            >
              <option value="en_attente">En attente</option>
              <option value="confirmée">Confirmée</option>
              <option value="annulée">Annulée</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
                Attention: Changer le statut n'affecte pas le paiement. Utilisez ceci pour des ajustements manuels.
            </p>
          </div>
          
          {/* A FAIRE: Ajouter ici d'autres champs si vous voulez permettre de modifier plus de choses */}
          {/* Par exemple, le nom d'un passager, etc. */}

          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => navigate('/admin/reservations')}>Annuler</Button>
            <Button type="submit" disabled={saving}>
              {saving ? <FiLoader className="animate-spin mr-2" /> : <FiSave className="mr-2" />}
              Enregistrer les modifications
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReservationFormPage;