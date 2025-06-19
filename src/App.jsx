// src/App.jsx

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';

// --- CONTEXT PROVIDERS ---
import { AuthProvider } from './context/AuthContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';

// --- LAYOUTS ---
import PublicLayout from './layouts/PublicLayout.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';

// --- COMPOSANTS DE PROTECTION DE ROUTES ---
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ClientProtectedRoute from './components/ClientProtectedRoute.jsx';

// --- PAGES ---
// (Toutes vos importations de pages restent ici, inchangées)
import HomePage from './pages/public/HomePage.jsx';
import SearchPage from './pages/public/SearchPage.jsx';
import ContactPage from './pages/public/ContactPage.jsx';
import PublicColisTrackingPage from './pages/public/PublicColisTrackingPage.jsx';
// import ClientDashboardPage from './pages/public/ClientDashboardPage.jsx';
import ReservationPage from './pages/public/ReservationPage.jsx';
import ConfirmationPage from './pages/public/ConfirmationPage.jsx';
import PaymentFailedPage from './pages/public/PaymentFailedPage.jsx';
import TrackingMapPage from './pages/public/TrackingMapPage.jsx';
import LoginPage from './pages/auth/LoginPage.jsx';
import RegisterPage from './pages/auth/RegisterPage.jsx';
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

// ====================================================================
// --- DÉBUT : COMPOSANT DE GESTION D'ERREURS (ERROR BOUNDARY) ---
// Ce composant doit être une classe, c'est une des rares exceptions en React moderne.
// ====================================================================
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
    console.log("✅ [ErrorBoundary] Initialisé.");
  }

  // Cette méthode est appelée quand une erreur est levée dans un composant enfant.
  // Elle met à jour l'état pour que le prochain rendu affiche l'UI de secours.
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  // Cette méthode est aussi appelée après une erreur dans un enfant.
  // Elle est parfaite pour enregistrer des informations sur l'erreur.
  componentDidCatch(error, errorInfo) {
    console.error("❌ ERREUR CAPTURÉE PAR L'ERROR BOUNDARY:", error, errorInfo);
    this.setState({ errorInfo });
    // Ici, vous pourriez envoyer l'erreur à un service de logging comme Sentry, LogRocket, etc.
  }

  render() {
    if (this.state.hasError) {
      // --- AFFICHAGE DE L'INTERFACE DE SECOURS ---
      return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center bg-red-50 p-4">
          <h1 className="text-3xl font-bold text-red-600">Oups ! Une erreur est survenue.</h1>
          <p className="text-lg text-gray-700 mt-2">Notre application a rencontré un problème inattendu.</p>
          <p className="text-gray-500 mt-1">Veuillez essayer de rafraîchir la page.</p>
          
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700"
          >
            Rafraîchir la page
          </button>
          
          {/* On affiche les détails de l'erreur seulement en mode développement */}
          {import.meta.env.DEV && (
            <details className="w-full max-w-2xl mt-8 text-left bg-white p-4 rounded-lg shadow-md">
              <summary className="font-semibold cursor-pointer">Détails de l'erreur (mode DEV)</summary>
              <pre className="mt-2 text-sm text-red-800 whitespace-pre-wrap overflow-auto" style={{ maxHeight: '300px' }}>
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    // Si pas d'erreur, on rend les composants enfants normalement.
    return this.props.children;
  }
}
// ====================================================================
// --- FIN : COMPOSANT DE GESTION D'ERREURS ---
// ====================================================================


function App() {
  // Log pour vérifier que le composant App lui-même est bien en cours de rendu
  console.log("✅ [App.jsx] Le composant App commence son rendu.");

  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          {/* On enveloppe TOUTES les routes dans notre ErrorBoundary */}
          <ErrorBoundary> 
            <Routes>
              {/* --- LAYOUT PUBLIC --- */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/track-colis" element={<PublicColisTrackingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

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

              {/* --- ROUTE 404 --- */}
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
          </ErrorBoundary>
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;