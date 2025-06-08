// src/App.jsx
import React from 'react';
// LIGNE CORRIGÉE : Ajout de 'Link' à l'import
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

// Components
import ProtectedRoute from './components/ProtectedRoute';

// --- Pages Publiques ---
import HomePage from './pages/public/HomePage';
import SearchPage from './pages/public/SearchPage';
import ReservationPage from './pages/public/ReservationPage';
import ConfirmationPage from './pages/public/ConfirmationPage';
import PaymentFailedPage from './pages/public/PaymentFailedPage';
import PublicColisTrackingPage from './pages/public/PublicColisTrackingPage';

// --- Pages d'Authentification ---
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// --- Pages Admin ---
import DashboardPage from './pages/admin/DashboardPage';
import BusListPage from './pages/admin/BusListPage';
import BusFormPage from './pages/admin/BusFormPage';
import ChauffeurListPage from './pages/admin/ChauffeurListPage';
import ChauffeurFormPage from './pages/admin/ChauffeurFormPage';
import TrajetListPage from './pages/admin/TrajetListPage';
import TrajetFormPage from './pages/admin/TrajetFormPage';
import ReservationListPage from './pages/admin/ReservationListPage';
import ReservationFormPage from './pages/admin/ReservationFormPage';
import ColisDashboardPage from './pages/admin/ColisDashboardPage';
import ColisFormPage from './pages/admin/ColisFormPage';
import StatsPage from './pages/admin/StatsPage';
import ClientDashboardPage from './pages/public/ClientDashboardPage';
import TrackingMapPage from './pages/public/TrackingMapPage';
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* --- Section Publique --- */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/reservation/:id" element={<ReservationPage />} />
            <Route path="/confirmation/:id" element={<ConfirmationPage />} />
            <Route path="/payment-failed" element={<PaymentFailedPage />} />
            <Route path="/track-colis" element={<PublicColisTrackingPage />} />
             <Route path="/dashboard" element={<ProtectedRoute><ClientDashboardPage /></ProtectedRoute>} />
    <Route path="/tracking/map/:liveTripId" element={<ProtectedRoute><TrackingMapPage /></ProtectedRoute>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* --- Section Admin Protégée --- */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
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

            <Route path="stats" element={<StatsPage />} />
          </Route>

          {/* Page non trouvée */}
          <Route path="*" element={
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h1 className="text-4xl font-bold">404 - Page Non Trouvée</h1>
                    <p className="text-gray-500 mt-2">La page que vous cherchez n'existe pas.</p>
                    {/* C'est ici que Link était utilisé sans être importé */}
                    <Link to="/" className="text-white bg-blue-600 hover:bg-blue-700 font-semibold py-2 px-4 rounded-lg mt-6 inline-block">
                        Retour à l'accueil
                    </Link>
                </div>
            </div>
          } />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;