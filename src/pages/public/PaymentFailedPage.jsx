// src/pages/public/PaymentFailedPage.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiAlertTriangle, FiRefreshCw, FiArrowLeft, FiHelpCircle } from 'react-icons/fi';

const PaymentFailedPage = () => {
  const navigate = useNavigate();

  // Raisons communes d'échec de paiement
  const possibleReasons = [
    "Solde insuffisant sur votre compte mobile money.",
    "Problème de connexion avec le service de paiement.",
    "Transaction refusée par votre opérateur mobile.",
    "Session de paiement expirée ou temps de réponse trop long."
  ];

  return (
    <main className="min-h-screen py-16 px-4 bg-gray-50 flex items-center justify-center">
      <div className="max-w-lg w-full">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* En-tête rouge */}
          <div className="bg-gradient-to-r from-red-500 to-pink-600 py-6 px-8 text-white">
            <div className="flex items-center gap-3">
              <FiAlertTriangle className="text-3xl" />
              <h1 className="text-2xl font-bold">Échec du paiement</h1>
            </div>
          </div>
          
          <div className="p-8">
            <p className="text-gray-700 mb-6">
              Votre paiement n'a malheureusement pas pu être traité. Votre réservation n'est pas encore confirmée.
            </p>
            
            {/* Raisons possibles */}
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
            
            {/* Boutons d'action */}
            <div className="space-y-4">
              <button
                onClick={() => navigate(-1)} // Retourne à la page précédente (probablement la page de réservation)
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
            
            {/* Contact support */}
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