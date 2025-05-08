import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import ReservationPage from './pages/ReservationPage';
import ConfirmationPage from './pages/ConfirmationPage';
import PaymentFailedPage from './pages/PaymentFailedPage';
import CancelPage from './pages/CancelPage';
import Navbar from './components/Navbar';

const theme = createTheme({
  palette: {
    primary: { main: '#2E7D32' }, // Vert foncé
    secondary: { main: '#FFC107' }, // Jaune
    background: { default: '#F5F5F5' }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 600 }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/reservation/:trajetId" element={<ReservationPage />} />
          <Route path="/confirmation/:reservationId" element={<ConfirmationPage />} />
          <Route path="/payment-failed" element={<PaymentFailedPage />} />
          <Route path="/reservation/:reservationId" element={<CancelPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
