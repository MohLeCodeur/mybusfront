// src/pages/public/AboutPage.jsx

import React from 'react';
import { FiTarget, FiZap, FiUsers } from 'react-icons/fi';

const AboutPage = () => {
  return (
    <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* En-tête */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 font-playfair">
            À Propos de <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-500">MyBus</span>
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Moderniser le transport au Mali, un voyage à la fois.
          </p>
        </div>

        {/* Notre Mission */}
        <div className="mt-16 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <FiTarget className="text-blue-500" /> Notre Mission
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Face aux défis du secteur du transport au Mali – gestion manuelle des réservations, absence de suivi en temps réel et organisation perfectible des colis – nous avons créé MyBus. Notre projet est né d'une ambition simple : développer une solution numérique centralisée pour révolutionner l'expérience des voyageurs et l'efficacité des compagnies de transport.
          </p>
          <p className="mt-4 text-lg text-gray-700 leading-relaxed">
            MyBus vise à optimiser les opérations, à améliorer la transparence et à renforcer la qualité du service offert aux usagers. Nous croyons en un avenir où la réservation d'un billet, le suivi d'un bus ou l'envoi d'un colis se font en quelques clics, avec confiance et sérénité.
          </p>
        </div>

        {/* Nos Valeurs */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Nos Engagements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            
            <div className="p-6">
              <div className="flex items-center justify-center h-16 w-16 mx-auto bg-blue-100 rounded-full">
                <FiZap className="text-3xl text-blue-600" />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-gray-900">Efficacité</h3>
              <p className="mt-2 text-gray-600">
                Automatiser les processus pour réduire les erreurs humaines, diminuer les temps d'attente et garantir une ponctualité améliorée grâce au suivi GPS.
              </p>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-center h-16 w-16 mx-auto bg-pink-100 rounded-full">
                <FiUsers className="text-3xl text-pink-600" />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-gray-900">Satisfaction Client</h3>
              <p className="mt-2 text-gray-600">
                Offrir une interface simple, accessible et des informations fiables pour que chaque voyageur et expéditeur de colis ait une visibilité complète et une expérience positive.
              </p>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-center h-16 w-16 mx-auto bg-green-100 rounded-full">
                 <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.49A10.019 10.019 0 0112 2a10 10 0 0110 10c0 3.142-1.44 5.962-3.704 7.795a.75.75 0 00-.518.695v.618a.75.75 0 01-.75.75H6.622a.75.75 0 01-.75-.75v-.618a.75.75 0 00-.518-.695A10.019 10.019 0 012 12c0-4.963 3.53-9.064 8.205-9.882a.75.75 0 01.813.687z" /></svg>
              </div>
              <h3 className="mt-5 text-xl font-semibold text-gray-900">Fiabilité et Sécurité</h3>
              <p className="mt-2 text-gray-600">
                Garantir la robustesse de notre système grâce à des technologies éprouvées (Node.js, React, MongoDB) et sécuriser les transactions via des partenaires de paiement reconnus.
              </p>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;