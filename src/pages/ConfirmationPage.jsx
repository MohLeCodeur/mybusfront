import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Box, Typography, Button, Paper, Grid } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ConfirmationPage = () => {
  const { reservationId } = useParams();
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const response = await axios.get(`https://mybusback.onrender.com/api/reservations/${reservationId}`);
        setReservation(response.data);
      } catch (err) {
        console.error('Erreur lors du chargement de la réservation:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReservation();
  }, [reservationId]);

  if (loading) return <div>Chargement...</div>;
  if (!reservation) return <div>Réservation non trouvée</div>;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <CheckCircleIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Réservation confirmée !
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Merci pour votre réservation, {reservation.client.prenom} {reservation.client.nom}
        </Typography>
        
        <Box sx={{ my: 4, p: 3, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
          <Grid container spacing={2} textAlign="left">
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Référence:</strong> {reservation._id}
              </Typography>
              <Typography variant="body1">
                <strong>Date:</strong> {new Date(reservation.dateReservation).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Trajet:</strong> {reservation.trajet.villeDepart} → {reservation.trajet.villeArrivee}
              </Typography>
              <Typography variant="body1">
                <strong>Places réservées:</strong> {reservation.placesReservees}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Typography variant="body1" sx={{ mb: 4 }}>
          Un email de confirmation a été envoyé à <strong>{reservation.client.email}</strong> avec les détails de votre réservation.
        </Typography>

        <Button
          variant="contained"
          color="primary"
          size="large"
          component={Link}
          to="/"
          sx={{ px: 4, py: 2 }}
        >
          Retour à l'accueil
        </Button>
      </Paper>
    </Container>
  );
};

export default ConfirmationPage;