
// src/pages/CancelPage.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';

export default function CancelPage() {
  const { reservationId } = useParams();
  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 8 }}>
      <Typography variant="h4" color="warning" gutterBottom>
        Paiement annulé
      </Typography>
      <Typography sx={{ mb: 4 }}>
        Vous avez annulé le paiement pour la réservation #{reservationId}. Vous pouvez réessayer.
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button component={Link} to={`/reservation/${reservationId}`} variant="outlined">
          Réessayer le paiement
        </Button>
        <Button component={Link} to="/" variant="contained">
          Accueil
        </Button>
      </Box>
    </Container>
  );
}