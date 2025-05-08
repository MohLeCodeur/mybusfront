// src/pages/ReservationPage.jsx

import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Alert,
  CircularProgress
} from '@mui/material';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ReservationPage = () => {
  const { trajetId } = useParams();
  const navigate = useNavigate();

  const [trajet, setTrajet] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Chargement des détails du trajet
  useEffect(() => {
    const fetchTrajet = async () => {
      try {
        const response = await axios.get(
          `https://mybusback.onrender.com/api/trajets/${trajetId}`
        );
        setTrajet(response.data);
      } catch {
        setError('Impossible de charger les détails du trajet');
      } finally {
        setLoading(false);
      }
    };
    fetchTrajet();
  }, [trajetId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await axios.post('https://mybusback.onrender.com/api/reservations', {
        trajetId,
        client: formData,
        placesReservees: 1
      });
      // On récupère l'URL de checkout et on redirige
      window.location.href = response.data.checkoutUrl;
    } catch (err) {
      setError(err.response?.data?.message || 'Échec de la réservation');
    } finally {
      setSubmitting(false);
    }
  };
  

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error && !trajet) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => navigate('/')}
        >
          Retour à l'accueil
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ fontWeight: 'bold', mb: 4, color: 'primary.main' }}
      >
        Finaliser votre réservation
      </Typography>

      <Grid container spacing={4}>
        {/* Détails du trajet */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Détails du trajet
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography>
                <strong>Itinéraire :</strong> {trajet.villeDepart} → {trajet.villeArrivee}
              </Typography>
              <Typography>
                <strong>Date :</strong>{' '}
                {new Date(trajet.dateDepart).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long'
                })}
              </Typography>
              <Typography>
                <strong>Heure de départ :</strong> {trajet.heureDepart}
              </Typography>
              <Typography>
                <strong>Prix :</strong> {trajet.prix?.toLocaleString('fr-FR')} FCFA
              </Typography>
            </Box>
            <Alert severity="info">
              Vous réservez 1 place sur le bus {trajet.bus?.numero}
            </Alert>
          </Paper>
        </Grid>

        {/* Formulaire client */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Vos informations
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Nom"
                    fullWidth
                    required
                    value={formData.nom}
                    onChange={(e) =>
                      setFormData({ ...formData, nom: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Prénom"
                    fullWidth
                    required
                    value={formData.prenom}
                    onChange={(e) =>
                      setFormData({ ...formData, prenom: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Téléphone"
                    fullWidth
                    required
                    value={formData.telephone}
                    onChange={(e) =>
                      setFormData({ ...formData, telephone: e.target.value })
                    }
                    inputProps={{ pattern: '[0-9]{8,15}' }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    disabled={submitting}
                    sx={{ mt: 2, py: 1.5 }}
                  >
                    {submitting ? <CircularProgress size={24} /> : 'Payer maintenant'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ReservationPage;
