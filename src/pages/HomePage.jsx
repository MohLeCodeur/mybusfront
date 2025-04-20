import React from 'react';
import { Box, Container, Typography, Button, Paper, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import heroImage from '../assets/malibus.png';

const HomePage = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          backgroundImage: `
            linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
            url(${heroImage})
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '500px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Container>
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Voyagez en toute sérénité au Mali
          </Typography>
          <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
            Réservez vos billets de bus en quelques clics
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            component={Link}
            to="/search"
            sx={{ px: 4, py: 2 }}
          >
            Réserver maintenant
          </Button>
        </Container>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
          Pourquoi choisir notre service ?
        </Typography>
        <Grid container spacing={4} sx={{ mt: 4 }}>
          {[
            {
              title: 'Réservation facile',
              description: 'Réservez votre billet en quelques minutes depuis chez vous.',
            },
            {
              title: 'Confort garanti',
              description: 'Des bus modernes et confortables pour vos trajets.',
            },
            {
              title: 'Service client',
              description: 'Une équipe disponible pour répondre à vos questions.',
            },
          ].map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper elevation={3} sx={{ p: 4, height: '100%' }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {feature.title}
                </Typography>
                <Typography>{feature.description}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage;
