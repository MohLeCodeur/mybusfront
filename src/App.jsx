// src/App.jsx (VERSION FINALE OPTIMISÉE)

import React, { Suspense } from 'react'; // <-- Importer Suspense
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';

// --- CONTEXT PROVIDERS ---
import { AuthProvider } from './context/AuthContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';

// --- LAYOUTS ---
import PublicLayout from './layouts/PublicLayout.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';

// --- COMPOSANTS DE PROTECTION ---
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ClientProtectedRoute from './components/ClientProtectedRoute.jsx';
import { FiLoader } from 'react-icons/fi';

// ====================================================================
// --- DÉBUT : LAZY LOADING DES PAGES ---
// On utilise React.lazy pour ne charger le code de chaque page qu'au besoin.
// ====================================================================
const HomePage = React.lazy(() => import('./pages/public/HomePage.jsx'));
const SearchPage = React.lazy(() => import('./pages/public/SearchPage.jsx'));
const ContactPage = React.lazy(() => import('./pages/public/ContactPage.jsx'));
const PublicColisTrackingPage = React.lazy(() => import('./pages/public/PublicColisTrackingPage.jsx'));
const ClientDashboardPage = React.lazy(() => import('./pages/public/ClientDashboardPage.jsx'));
const ReservationPage = React.lazy(() => import('./pages/public/ReservationPage.jsx'));
const ConfirmationPage = React.lazy(() => import('./pages/public/ConfirmationPage.jsx'));
const PaymentFailedPage = React.lazy(() => import('./pages/public/PaymentFailedPage.jsx'));
const TrackingMapPage = React.lazy(() => import('./pages/public/TrackingMapPage.jsx'));

const LoginPage = React.lazy(() => import('./pages/auth/LoginPage.jsx'));
const RegisterPage = React.lazy(() => import('./pages/auth/RegisterPage.jsx'));

const DashboardPage = React.lazy(() => import('./pages/admin/DashboardPage.jsx'));
const BusListPage = React.lazy(() => import('./pages/admin/BusListPage.jsx'));
const BusFormPage = React.lazy(() => import('./pages/admin/BusFormPage.jsx'));
const ChauffeurListPage = React.lazy(() => import('./pages/admin/ChauffeurListPage.jsx'));
const ChauffeurFormPage = React.lazy(() => import('./pages/admin/ChauffeurFormPage.jsx'));
const TrajetListPage = React.lazy(() => import('./pages/admin/TrajetListPage.jsx'));
const TrajetFormPage = React.lazy(() => import('./pages/admin/TrajetFormPage.jsx'));
const ReservationListPage = React.lazy(() => import('./pages/admin/ReservationListPage.jsx'));
const ReservationFormPage = React.lazy(() => import('./pages/admin/ReservationFormPage.jsx'));
const ColisDashboardPage = React.lazy(() => import('./pages/admin/ColisDashboardPage.jsx'));
const ColisFormPage = React.lazy(() => import('./pages/admin/ColisFormPage.jsx'));
const StatsPage = React.lazy(() => import('./pages/admin/StatsPage.jsx'));

// On garde l'ErrorBoundary pour la sécurité
class ErrorBoundary extends React.Component {
  // ... (le code de l'ErrorBoundary reste le même qu'avant)
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return <div className="p-4 text-center text-red-600">Une erreur est survenue. Veuillez rafraîchir.</div>;
    }
    return this.props.children;
  }
}

// Composant de chargement à afficher pendant que les pages "lazy" se chargent.
const LoadingFallback = () => (
  <div className="flex justify-center items-center h-screen w-screen">
    <FiLoader className="animate-spin text-4xl text-blue-500" />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <ErrorBoundary>
            {/* Suspense est nécessaire pour utiliser React.lazy */}
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                {/* --- LAYOUT PUBLIC --- */}
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
                <Route path="/tracking/map/:liveTripId" element={<ClientProtectedRoute><TrackingMapPage /></ClientProtectedRoute>} />

                {/* --- LAYOUT ADMIN PROTÉGÉ --- */}
                <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
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
                        <Link to="/" className="mt-6 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">Retour à l'accueil</Link>
                    </div>
                } />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;