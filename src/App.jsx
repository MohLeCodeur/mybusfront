// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import ReservationPage from './pages/ReservationPage';
import ConfirmationPage from './pages/ConfirmationPage';
import PaymentFailedPage from './pages/PaymentFailedPage';
import CancelPage from './pages/CancelPage';

const theme = createTheme({
  palette: {
    primary:   { main: '#2E7D32' },
    secondary: { main: '#FFC107' },
    background:{ default: '#F5F5F5' }
  },
  typography: { fontFamily: '"Roboto", sans-serif' }
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <Router>
        <Navbar/>
        <Routes>
          <Route path="/"                          element={<HomePage/>} />
          <Route path="/search"                    element={<SearchPage/>} />
          <Route path="/reservation/:trajetId"     element={<ReservationPage/>} />
          <Route path="/confirmation/:reservationId" element={<ConfirmationPage/>} />
          <Route path="/payment-failed"            element={<PaymentFailedPage/>} />
          <Route path="/cancel/:reservationId"     element={<CancelPage/>} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
