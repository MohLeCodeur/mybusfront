// src/App.jsx (VERSION MINIMALISTE DE DÉBOGAGE)

import React from 'react';

// On importe uniquement la page d'accueil pour le test
import HomePage from './pages/public/HomePage.jsx';

// On importe le CSS global, c'est important
import './index.css'; 

// L'ErrorBoundary est notre filet de sécurité, on le garde.
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, errorInfo) {
    console.error("❌ ERREUR CAPTURÉE PAR L'ERROR BOUNDARY:", error, errorInfo);
    this.setState({ errorInfo });
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center bg-red-50 p-4">
          <h1 className="text-3xl font-bold text-red-600">Oups ! Une erreur est survenue.</h1>
          <p className="text-lg text-gray-700 mt-2">Notre application a rencontré un problème inattendu.</p>
          <button onClick={() => window.location.reload()} className="mt-6 px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700">Rafraîchir la page</button>
          {import.meta.env.DEV && (
            <details className="w-full max-w-2xl mt-8 text-left bg-white p-4 rounded-lg shadow-md">
              <summary className="font-semibold cursor-pointer">Détails de l'erreur (mode DEV)</summary>
              <pre className="mt-2 text-sm text-red-800 whitespace-pre-wrap overflow-auto" style={{ maxHeight: '300px' }}>
                {this.state.error && this.state.error.toString()}<br />
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  console.log("✅ [App.jsx minimaliste] Rendu en cours...");

  return (
    <ErrorBoundary>
      {/*
        Nous enlevons TOUT : BrowserRouter, les Providers, les Routes, etc.
        On affiche directement et uniquement la page d'accueil.
      */}
      <HomePage />
    </ErrorBoundary>
  );
}

export default App;