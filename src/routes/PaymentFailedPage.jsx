import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiAlertTriangle, FiRefreshCw, FiArrowLeft, FiHelpCircle } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PaymentFailedPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const reservationId = location.state?.reservationId;

  // Common payment failure reasons
  const possibleReasons = [
    "Solde insuffisant sur votre compte",
    "Problème de connexion avec le service de paiement",
    "Transaction refusée par votre opérateur mobile",
    "Session de paiement expirée"
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen py-16 px-4 bg-gradient-to-br from-white to-indigo-50 flex items-center justify-center">
        <div className="max-w-lg w-full">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            {/* Red header bar */}
            <div className="bg-gradient-to-r from-red-500 to-pink-600 py-6 px-8 text-white">
              <div className="flex items-center gap-3">
                <FiAlertTriangle className="text-3xl" />
                <h1 className="text-2xl font-bold">Échec du paiement</h1>
              </div>
            </div>
            
            <div className="p-8">
              <p className="text-gray-700 mb-6">
                Votre paiement n'a pas pu être traité. Votre réservation est en attente 
                jusqu'à la réception du paiement.
              </p>
              
              {/* Possible reasons */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <FiHelpCircle className="text-pink-500" />
                  Raisons possibles:
                </h2>
                <ul className="bg-gray-50 rounded-xl p-4 space-y-2">
                  {possibleReasons.map((reason, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700">
                      <span className="text-pink-500 font-bold text-sm mt-1">•</span>
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Action buttons */}
              <div className="space-y-4">
                {reservationId && (
                  <Link
                    to={`/reservation/${reservationId}`}
                    className="w-full py-3 px-6 rounded-full bg-gradient-to-r from-pink-500 to-blue-600 flex items-center justify-center gap-2 text-white font-medium hover:brightness-110 active:scale-95 transition"
                  >
                    <FiRefreshCw />
                    Réessayer le paiement
                  </Link>
                )}
                
                <button
                  onClick={() => navigate(-1)}
                  className="w-full py-3 px-6 rounded-full border border-gray-300 flex items-center justify-center gap-2 text-gray-700 hover:bg-gray-50 transition"
                >
                  <FiArrowLeft />
                  Retour à la page précédente
                </button>
              </div>
              
              {/* Contact support */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="bg-blue-50 rounded-xl p-4 text-blue-700">
                  <h3 className="font-medium mb-1">Besoin d'aide ?</h3>
                  <p className="text-sm">
                    Notre équipe de support est disponible pour vous aider avec tout problème de paiement.
                    Contactez-nous au +223 91 23 45 67 ou par email à support@mybus.ml
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-6">
            <Link to="/search" className="text-blue-600 hover:underline">
              Rechercher un autre voyage
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
