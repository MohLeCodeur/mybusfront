// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layouts
import PublicLayout from './layouts/PublicLayout.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';

// Components de protection
import ProtectedRoute from './components/ProtectedRoute.jsx'; // Pour les admins
import ClientProtectedRoute from './components/ClientProtectedRoute.jsx'; // Pour les clients

// Pages Publiques
import HomePage from './pages/public/HomePage.jsx';
import SearchPage from './pages/public/SearchPage.jsx';
import ReservationPage from './pages/public/ReservationPage.jsx';
import ConfirmationPage from './pages/public/ConfirmationPage.jsx';
import PaymentFailedPage from './pages/public/PaymentFailedPage.jsx';
import PublicColisTrackingPage from './pages/public/PublicColisTrackingPage.jsx';
import ClientDashboardPage from './pages/public/ClientDashboardPage.jsx'; // La page du dashboard client

// Pages d'Authentification
import LoginPage from './pages/auth/LoginPage.jsx';
import RegisterPage from './pages/auth/RegisterPage.jsx';

// Pages Admin
import DashboardPage from './pages/admin/DashboardPage.jsx';
import BusListPage from './pages/admin/BusListPage.jsx';
import BusFormPage from './pages/admin/BusFormPage.jsx';
import ChauffeurListPage from './pages/admin/ChauffeurListPage.jsx';
import ChauffeurFormPage from './pages/admin/ChauffeurFormPage.jsx';
import TrajetListPage from './pages/admin/TrajetListPage.jsx';
import TrajetFormPage from './pages/admin/TrajetFormPage.jsx';
import ReservationListPage from './pages/admin/ReservationListPage.jsx';
import ReservationFormPage from './pages/admin/ReservationFormPage.jsx';
import ColisDashboardPage from './pages/admin/ColisDashboardPage.jsx';
import ColisFormPage from './pages/admin/ColisFormPage.jsx';
import StatsPage from './pages/admin/StatsPage.jsx';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* --- ROUTES PUBLIQUES ET CLIENT --- */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/track-colis" element={<PublicColisTrackingPage />} />
            
            {/* Routes qui nécessitent d'être connecté (client ou admin) */}
            <Route path="/reservation/:id" element={<ClientProtectedRoute><ReservationPage /></ClientProtectedRoute>} />
            <Route path="/confirmation/:id" element={<ClientProtectedRoute><ConfirmationPage /></ClientProtectedRoute>} />
            <Route path="/payment-failed" element={<ClientProtectedRoute><PaymentFailedPage /></ClientProtectedRoute>} />
            <Route path="/dashboard" element={<ClientProtectedRoute><ClientDashboardPage /></ClientProtectedRoute>} />
          </Route>

          {/* --- SECTION ADMIN PROTÉGÉE --- */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute> {/* Ce composant vérifie que role === 'admin' */}
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="bus" element={<BusListPage />} />
            <Route path="bus/new" element={<BusFormPage />} />
            <Route path="bus/:id/edit" element={<BusFormPage />} />
            <Route path="chauffeurs" element={<ChauffeurListPage />} />
            <Route path="chauffeurs/new" element={<ChauffeurFormPage />} />
            <Route path="chauffeurs/:id/edit" element={<ChauffeurFormPage />} />
            <Route path="trajets" element={<TrajetListPage />} />
            <Route path="trajets/new" element={<TrajetFormPage />} />
            <Route path="trajets/:id/edit" element={<TrajetFormPage />} />
            <Route path="reservations" element={<ReservationListPage />} />
            <Route path="reservations/:id/edit" element={<ReservationFormPage />} />
            <Route path="colis" element={<ColisDashboardPage />} />
            <Route path="colis/new" element={<ColisFormPage />} />
            <Route path="colis/:id/edit" element={<ColisFormPage />} />
            <Route path="paiements" element={<StatsPage />} />
          </Route>

          <Route path="*" element={<div>404 - Page Non Trouvée</div>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;