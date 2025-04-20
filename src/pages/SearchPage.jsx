import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Button, 
  Grid,
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TrajetCard from '../components/TrajetCard';

const SearchPage = () => {
  const [trajets, setTrajets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Charger les trajets disponibles au premier rendu
  useEffect(() => {
    const fetchTrajets = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/trajets');
        setTrajets(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Erreur lors du chargement');
      } finally {
        setLoading(false);
      }
    };
    fetchTrajets();
  }, []);

  const handleReservation = (trajetId) => {
    navigate(`/reserver/${trajetId}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button 
          variant="contained" 
          sx={{ mt: 2 }}
          onClick={() => window.location.reload()}
        >
          Réessayer
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ 
        fontWeight: 'bold',
        mb: 4,
        color: 'primary.main'
      }}>
        Trajets disponibles
      </Typography>

      <Grid container spacing={3}>
        {trajets.map((trajet) => (
          <Grid item xs={12} key={trajet._id}>
            <TrajetCard 
              trajet={trajet} 
              onReserve={() => handleReservation(trajet._id)} 
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default SearchPage;