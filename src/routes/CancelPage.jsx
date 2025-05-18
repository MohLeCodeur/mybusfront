import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiX, FiArrowLeft, FiSearch } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function CancelPage() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <main className="min-h-screen py-16 px-4 bg-gradient-to-br from-white to-indigo-50 flex items-center justify-center">
        <div className="max-w-lg w-full">
          <div className="bg-white rounded-3xl shadow-xl p-8 text-center relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-blue-600"></div>
            <div className="h-20 w-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
              <FiX className="text-4xl text-red-500" />
            </div>

            <h1 className="text-3xl font-bold mb-4">Réservation annulée</h1>
            
            <p className="text-gray-600 mb-8">
              Votre processus de réservation a été annulé. 
              Aucun paiement n'a été effectué et aucune place n'a été réservée.
            </p>
            
            <div className="space-y-4">
              <button
                onClick={() => navigate(-1)}
                className="w-full py-3 px-6 rounded-full border border-gray-300 flex items-center justify-center gap-2 text-gray-700 hover:bg-gray-50 transition"
              >
                <FiArrowLeft />
                Retourner à la page précédente
              </button>
              
              <Link
                to="/search"
                className="w-full py-3 px-6 rounded-full bg-gradient-to-r from-pink-500 to-blue-600 flex items-center justify-center gap-2 text-white font-medium hover:brightness-110 active:scale-95 transition"
              >
                <FiSearch />
                Rechercher un nouveau trajet
              </Link>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Si vous avez des questions ou besoin d'assistance,
                n'hésitez pas à contacter notre service client.
              </p>
              <p className="text-sm font-medium text-gray-700 mt-2">
                support@mybus.ml | +223 91 23 45 67
              </p>
            </div>
          </div>
          
          <div className="text-center mt-6">
            <Link to="/" className="text-blue-600 hover:underline">
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
