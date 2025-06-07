// src/pages/public/PaymentFailedPage.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiAlertTriangle, FiRefreshCw, FiArrowLeft } from 'react-icons/fi';

const PaymentFailedPage = () => {
  const location = useLocation();
  // Essayez de récupérer l'ID de réservation pour le lien "Réessayer"
  const reservationId = location.state?.reservationId;

  return (
    <main className="min-h-screen py-16 px-4 bg-gray-50 flex items-center justify-center">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-red-500 to-pink-600 py-6 px-8 text-white">
          <div className="flex items-center gap-3">
            <FiAlertTriangle className="text-3xl" />
            <h1 className="text-2xl font-bold">Échec du paiement</h1>
          </div>
        </div>
        <div className="p-8">
          <p className="text-gray-700 mb-6">
            Votre paiement n'a pas pu être traité. Votre réservation n'a pas été confirmée.
          </p>
          <div className="mb-8 p-4 bg-gray-50 rounded-xl">
            <h2 className="font-semibold mb-2">Que faire ?</h2>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              <li>Vérifiez le solde de votre compte mobile money.</li>
              <li>Assurez-vous d'avoir une bonne connexion réseau.</li>
              <li>Réessayez le paiement.</li>
            </ul>
          </div>
          <div className="space-y-4">
            {reservationId && (
              <Link to={`/reservation/${reservationId}`} className="w-full py-3 px-6 rounded-full bg-gradient-to-r from-pink-500 to-blue-600 flex items-center justify-center gap-2 text-white font-medium hover:brightness-110 transition">
                <FiRefreshCw /> Réessayer le paiement
              </Link>
            )}
            <Link to="/search" className="w-full py-3 px-6 rounded-full border border-gray-300 flex items-center justify-center gap-2 text-gray-700 hover:bg-gray-50 transition">
              <FiArrowLeft /> Rechercher un autre voyage
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PaymentFailedPage;