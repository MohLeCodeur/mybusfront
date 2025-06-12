// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// --- CONTEXT PROVIDERS ---
// Ils doivent envelopper toute l'application pour que les états soient partagés.
import { AuthProvider } from './context/AuthContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';

// --- LAYOUTS ---
// Les layouts définissent la structure visuelle des pages (ex: avec ou sans sidebar).
import PublicLayout from './layouts/PublicLayout.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';

// --- COMPOSANTS DE PROTECTION DE ROUTES ---
import ProtectedRoute from './components/ProtectedRoute.jsx'; // Pour les admins
import ClientProtectedRoute from './components/ClientProtectedRoute.jsx'; // Pour les clients connectés

// --- PAGES PUBLIQUES ET CLIENT ---
import HomePage from './pages/public/HomePage.jsx';
import SearchPage from './pages/public/SearchPage.jsx';
import ContactPage from './pages/public/ContactPage.jsx';
import PublicColisTrackingPage from './pages/public/PublicColisTrackingPage.jsx';
import ClientDashboardPage from './pages/public/ClientDashboardPage.jsx';
import ReservationPage from './pages/public/ReservationPage.jsx';
import ConfirmationPage from './pages/public/ConfirmationPage.jsx';
import PaymentFailedPage from './pages/public/PaymentFailedPage.jsx';
import TrackingMapPage from './pages/public/TrackingMapPage.jsx';

// --- PAGES D'AUTHENTIFICATION ---
import LoginPage from './pages/auth/LoginPage.jsx';
import RegisterPage from './pages/auth/RegisterPage.jsx';

// --- PAGES ADMIN ---
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
      <NotificationProvider>
        <BrowserRouter>
          <Routes>
            {/* --- LAYOUT PUBLIC --- */}
            {/* Toutes les pages ici auront la Navbar et le Footer standards */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/track-colis" element={<PublicColisTrackingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Pages nécessitant d'être connecté (client ou admin) */}
              <Route path="/dashboard" element={<ClientProtectedRoute><ClientDashboardPage /></ClientProtectedRoute>} />
              <Route path="/reservation/:id" element={<ClientProtectedRoute><ReservationPage /></ClientProtectedRoute>} />
              <Route path="/confirmation/:id" element={<ClientProtectedRoute><ConfirmationPage /></ClientProtectedRoute>} />
              <Route path="/payment-failed" element={<ClientProtectedRoute><PaymentFailedPage /></ClientProtectedRoute>} />
            </Route>

            {/* --- PAGE DE SUIVI EN PLEIN ÉCRAN --- */}
            {/* Cette route est en dehors du PublicLayout pour ne pas avoir de Navbar/Footer */}
            <Route path="/tracking/map/:liveTripId" element={<ClientProtectedRoute><TrackingMapPage /></ClientProtectedRoute>} />

            {/* --- LAYOUT ADMIN PROTÉGÉ --- */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute> {/* Vérifie que role === 'admin' */}
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

            {/* Route pour les pages non trouvées */}
            <Route path="*" element={
                <div className="flex flex-col items-center justify-center min-h-screen text-center">
                    <h1 className="text-6xl font-bold text-blue-600">404</h1>
                    <p className="text-xl font-medium text-gray-700 mt-2">Page Non Trouvée</p>
                    <p className="text-gray-500 mt-1">Désolé, la page que vous cherchez n'existe pas.</p>
                    <Link to="/" className="mt-6 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
                        Retour à l'accueil
                    </Link>
                </div>
            } />
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;