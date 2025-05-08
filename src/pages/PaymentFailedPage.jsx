// src/pages/PaymentFailedPage.jsx
import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

export default function PaymentFailedPage() {
  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 8 }}>
      <Typography variant="h4" color="error" gutterBottom>
        Paiement échoué
      </Typography>
      <Typography sx={{ mb: 4 }}>
        Votre paiement n'a pas pu être effectué. Veuillez réessayer ou nous contacter.
      </Typography>
      <Button component={Link} to="/" variant="contained">
        Retour à l'accueil
      </Button>
    </Container>
  );
}