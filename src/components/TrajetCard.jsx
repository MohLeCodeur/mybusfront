import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Stack, 
  Divider, 
  Chip,
  Box
} from '@mui/material';
import { 
  AccessTime, 
  Place, 
  Event, 
  ConfirmationNumber,
  DirectionsBus
} from '@mui/icons-material';

const TrajetCard = ({ trajet, onReserve }) => {
  const formatDate = (dateString) => {
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  return (
    <Card sx={{ 
      borderLeft: '4px solid',
      borderColor: 'primary.main',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-3px)',
        boxShadow: 3
      }
    }}>
      <CardContent>
        <Stack spacing={2}>
          {/* Ligne 1 : Villes et Prix */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              <Place color="primary" sx={{ verticalAlign: 'middle', mr: 1 }} />
              {trajet.villeDepart} → {trajet.villeArrivee}
            </Typography>
            
            <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
              {trajet.prix?.toLocaleString('fr-FR') || '--'} FCFA
            </Typography>
          </Box>

          <Divider />

          {/* Ligne 2 : Détails */}
          <Box sx={{ 
            display: 'flex',
            flexWrap: 'wrap',
            gap: 3,
            alignItems: 'center'
          }}>
            <Typography>
              <Event color="action" sx={{ verticalAlign: 'middle', mr: 1 }} />
              {formatDate(trajet.dateDepart)}
            </Typography>
            
            <Typography>
              <AccessTime color="action" sx={{ verticalAlign: 'middle', mr: 1 }} />
              Départ: {trajet.heureDepart}
            </Typography>
            
            <Typography>
              <DirectionsBus color="action" sx={{ verticalAlign: 'middle', mr: 1 }} />
              Bus: {trajet.bus?.numero}
            </Typography>
            
            <Chip 
              icon={<ConfirmationNumber />}
              label={`${trajet.placesDisponibles} places restantes`}
              color={trajet.placesDisponibles < 10 ? 'warning' : 'success'}
              variant="outlined"
            />
          </Box>

          {/* Bouton de réservation */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => onReserve()}
              disabled={trajet.placesDisponibles <= 0}
              sx={{ 
                px: 4,
                fontWeight: 'bold',
                fontSize: '1rem'
              }}
            >
              {trajet.placesDisponibles > 0 ? 'Réserver maintenant' : 'Complet'}
            </Button>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default TrajetCard;