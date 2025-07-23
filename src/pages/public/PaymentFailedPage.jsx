// src/pages/public/PaymentFailedPage.jsx

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiAlertTriangle, FiRefreshCw, FiArrowLeft, FiHelpCircle, FiLoader } from 'react-icons/fi';
import api from '../../api';

const PaymentFailedPage = () => {
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    // 1. Récupérer l'ID de la réservation que l'on vient de tenter de payer
    const reservationId = localStorage.getItem('lastReservationId');
    
    if (!reservationId) {
      // S'il n'y a pas d'ID, on arrête la vérification et on affiche la page d'échec
      setIsVerifying(false);
      return;
    }

    let attempts = 0;
    const maxAttempts = 5; // Tenter 5 fois (total de 10 secondes)
    const pollInterval = 2000; // Toutes les 2 secondes

    // 2. Lancer un intervalle pour interroger le serveur
    const intervalId = setInterval(async () => {
      if (attempts >= maxAttempts) {
        clearInterval(intervalId);
        setIsVerifying(false);
        localStorage.removeItem('lastReservationId'); // Nettoyer le localStorage
        return;
      }

      try {
        // 3. Appeler le nouvel endpoint pour obtenir le statut réel
        const { data } = await api.get(`/reservations/status/${reservationId}`);
        
        // 4. Si le statut est "confirmée", c'est un succès !
        if (data.statut === 'confirmée') {
          clearInterval(intervalId);
          localStorage.removeItem('lastReservationId'); // Nettoyer
          // Rediriger vers la page de confirmation
          navigate(`/confirmation/${reservationId}`, { replace: true });
        }
      } catch (error) {
        console.error("Erreur de polling (ignorée pour l'UX):", error);
      }
      
      attempts++;
    }, pollInterval);

    // 5. Nettoyer l'intervalle si l'utilisateur quitte la page
    return () => clearInterval(intervalId);
  }, [navigate]);

  // --- Écran de chargement pendant la vérification ---
  if (isVerifying) {
    return (
      <main className="min-h-screen py-16 px-4 bg-gray-50 flex items-center justify-center text-center">
        <div>
          <FiLoader className="animate-spin text-5xl text-blue-500 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-700">Vérification du statut final du paiement...</h1>
          <p className="text-gray-500">Veuillez patienter un instant, nous nous assurons que tout est en ordre.</p>
        </div>
      </main>
    );
  }

  // --- Écran d'échec si la vérification confirme l'échec ---
  const possibleReasons = [
    "Solde insuffisant sur votre compte mobile money.",
    "Problème de connexion avec le service de paiement.",
    "Transaction refusée par votre opérateur mobile.",
    "Session de paiement expirée ou temps de réponse trop long."
  ];

  return (
    <main className="min-h-screen py-16 px-4 bg-gray-50 flex items-center justify-center">
      <div className="max-w-lg w-full">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden animate-fade-in">
          <div className="bg-gradient-to-r from-red-500 to-pink-600 py-6 px-8 text-white">
            <div className="flex items-center gap-3">
              <FiAlertTriangle className="text-3xl" />
              <h1 className="text-2xl font-bold">Échec du paiement</h1>
            </div>
          </div>
          
          <div className="p-8">
            <p className="text-gray-700 mb-6">
              Nous avons vérifié et votre paiement n'a malheureusement pas pu être traité. Votre réservation n'est pas confirmée.
            </p>
            
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <FiHelpCircle className="text-pink-500" />
                Raisons possibles :
              </h2>
              <ul className="bg-gray-50 rounded-xl p-4 space-y-2">
                {possibleReasons.map((reason, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-600 text-sm">
                    <span className="text-pink-500 font-bold mt-1">•</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={() => navigate(-1)}
                className="w-full py-3 px-6 rounded-full bg-gradient-to-r from-pink-500 to-blue-600 flex items-center justify-center gap-2 text-white font-medium hover:brightness-110 active:scale-95 transition"
              >
                <FiRefreshCw />
                Réessayer
              </button>
              
              <Link
                to="/search"
                className="w-full py-3 px-6 rounded-full border border-gray-300 flex items-center justify-center gap-2 text-gray-700 hover:bg-gray-50 transition"
              >
                <FiArrowLeft />
                Trouver un autre voyage
              </Link>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="bg-blue-50 rounded-xl p-4 text-blue-800">
                <h3 className="font-semibold mb-1">Besoin d'aide ?</h3>
                <p className="text-sm">
                  Notre équipe est disponible pour vous aider.
                  Contactez-nous au +223 91 23 45 67 ou par email à support@mybus.ml
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PaymentFailedPage;