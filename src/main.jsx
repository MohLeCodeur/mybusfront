// src/main.jsx (NOUVEAU CODE À COLLER)

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import 'leaflet/dist/leaflet.css'; // Votre importation pour Leaflet est conservée

// --- DÉBUT : LOGS DE DÉBOGAGE GLOBAUX ---
// Ce bloc est ajouté pour attraper les erreurs qui pourraient causer un écran blanc.
console.log("🚀 [main.jsx] Le script est en cours d'exécution.");

// Cet écouteur attrape TOUTES les erreurs non capturées dans le code.
// C'est le plus susceptible d'attraper l'erreur qui cause l'écran blanc.
window.onerror = function (message, source, lineno, colno, error) {
  console.error("💥 ERREUR GLOBALE NON CAPTURÉE:", {
    message,
    source,
    lineno,
    colno,
    errorObject: error
  });
  // Affiche un message d'erreur simple directement dans la page pour l'utilisateur
  document.body.innerHTML = '<div style="padding: 20px; font-family: sans-serif; text-align: center;"><h1>Une erreur critique est survenue.</h1><p>Veuillez rafraîchir la page ou contacter le support.</p></div>';
  return true; // Empêche le comportement par défaut (qui est d'afficher l'erreur dans la console)
};

// Cet écouteur attrape les rejets de promesses non gérés (ex: un appel API qui échoue sans .catch())
window.onunhandledrejection = function(event) {
  console.error("🚫 REJET DE PROMESSE NON GÉRÉ:", event.reason);
};
// --- FIN : LOGS DE DÉBOGAGE GLOBAUX ---

// Le `try...catch` autour du rendu initial de React est une sécurité supplémentaire.
try {
  console.log("⏳ [main.jsx] Tentative de rendu de l'application React...");
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
  console.log("✅ [main.jsx] Rendu de l'application React réussi !");
} catch (error) {
  console.error("🔥 [main.jsx] ERREUR CRITIQUE PENDANT LE RENDU INITIAL DE REACT:", error);
  // Affiche une erreur directement dans le DOM si React lui-même échoue à se monter
  const rootDiv = document.getElementById('root');
  if (rootDiv) {
    rootDiv.innerHTML = `<div style="padding: 20px; font-family: sans-serif; text-align: center;"><h1>Erreur critique au démarrage de React.</h1><p>Consultez la console pour les détails.</p><pre>${error.stack}</pre></div>`;
  }
}