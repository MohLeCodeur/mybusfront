// src/pages/ReservationPage.jsx

import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
  Grid
} from '@mui/material';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

// URL fixe de votre back‐end
const API_BASE = 'https://mybusback.onrender.com';

export default function ReservationPage() {
  const { trajetId } = useParams();
  const navigate    = useNavigate();

  const [trajet, setTrajet]       = useState(null);
  const [formData, setFormData]   = useState({ nom:'', prenom:'', email:'', telephone:'' });
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // 1) Charger les détails du trajet
  useEffect(() => {
    axios.get(`${API_BASE}/api/trajets/${trajetId}`)
      .then(res => setTrajet(res.data))
      .catch(() => setError('Impossible de charger les détails du trajet'))
      .finally(() => setLoading(false));
  }, [trajetId]);

  // 2) Soumettre la réservation + rediriger vers VitePay
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await axios.post(
        `${API_BASE}/api/reservations`,
        { trajetId, client: formData, placesReservees:1 }
      );

      // DEBUG: inspecter la réponse du back‐end
      console.log('→ Reservation response data:', res.data);

      // Récupération de l’URL de paiement
      const redirectUrl =
        res.data.checkoutUrl      ||
        res.data.redirect_url     ||
        res.data.redirectUrl      ||
        (typeof res.data === 'string' ? res.data : null);

      if (!redirectUrl) {
        throw new Error('Aucune URL de paiement reçue (voir console)');
      }

      // Redirection vers l’interface VitePay
      window.location.assign(redirectUrl);

    } catch (err) {
      console.error('handleSubmit error:', err.response?.data ?? err.message);
      setError(err.response?.data?.message || err.message || 'Échec de la réservation');
    } finally {
      setSubmitting(false);
    }
  };

  // 3) Affichages d’état
  if (loading) {
    return (
      <Box sx={{ display:'flex', justifyContent:'center', mt:8 }}>
        <CircularProgress size={60}/>
      </Box>
    );
  }

  if (error && !trajet) {
    return (
      <Container maxWidth="sm" sx={{ mt:4, textAlign:'center' }}>
        <Alert severity="error">{error}</Alert>
        <Button variant="contained" sx={{ mt:2 }} onClick={()=>navigate('/')}>
          Retour à l'accueil
        </Button>
      </Container>
    );
  }

  // 4) Rendu final du formulaire
  return (
    <Container maxWidth="md" sx={{ py:4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight:'bold' }}>
        Finaliser votre réservation
      </Typography>

      <Grid container spacing={4}>
        {/* Détails du trajet */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p:3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight:'bold' }}>
              Détails du trajet
            </Typography>
            <Box sx={{ mb:2 }}>
              <Typography>
                <strong>Itinéraire :</strong> {trajet.villeDepart} → {trajet.villeArrivee}
              </Typography>
              <Typography>
                <strong>Date :</strong>{' '}
                {new Date(trajet.dateDepart).toLocaleDateString('fr-FR',{
                  weekday:'long', day:'numeric', month:'long'
                })}
              </Typography>
              <Typography>
                <strong>Heure :</strong> {trajet.heureDepart}
              </Typography>
              <Typography>
                <strong>Prix :</strong> {trajet.prix.toLocaleString('fr-FR')} FCFA
              </Typography>
            </Box>
            <Alert severity="info">
              Vous réservez 1 place sur le bus {trajet.bus.numero}
            </Alert>
          </Paper>
        </Grid>

        {/* Formulaire client */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p:3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight:'bold' }}>
              Vos informations
            </Typography>
            {error && trajet && (
              <Alert severity="error" sx={{ mb:2 }}>{error}</Alert>
            )}
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Nom"
                    value={formData.nom}
                    onChange={e=>setFormData({...formData,nom:e.target.value})}
                    fullWidth required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Prénom"
                    value={formData.prenom}
                    onChange={e=>setFormData({...formData,prenom:e.target.value})}
                    fullWidth required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={e=>setFormData({...formData,email:e.target.value})}
                    fullWidth required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Téléphone"
                    value={formData.telephone}
                    onChange={e=>setFormData({...formData,telephone:e.target.value})}
                    fullWidth required
                    inputProps={{pattern:'[0-9]{8,15}'}}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={submitting}
                    sx={{ mt:2 }}
                  >
                    {submitting
                      ? <CircularProgress size={24}/>
                      : 'Payer maintenant'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
