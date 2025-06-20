// src/pages/public/HomePage.jsx (VERSION DE DÉBOGAGE)

import React from 'react';
import Hero from '../../components/public/Hero';
import FeatureCard from '../../components/public/FeatureCard';
// import DestinationCarousel from '../../components/public/DestinationCarousel'; // <-- COMMENTÉ
// import LiveMap from '../../components/public/LiveMap'; // <-- COMMENTÉ
import { FiSmartphone, FiMapPin } from 'react-icons/fi';
import { FaBoxOpen } from 'react-icons/fa';

const HomePage = () => {
  console.log("✅ [HomePage.jsx] Rendu en cours..."); // Log de débogage supplémentaire

  return (
    <div className="overflow-x-hidden bg-gray-50">
      <Hero />

      <section id="services" className="py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-gray-800 mb-4">
            Pourquoi choisir MyBus ?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Profitez de la réservation par mobile money, du suivi de colis et de notre géolocalisation en temps réel.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<FiSmartphone size={36} />}
            title="Réservation Mobile Money"
            description="Payez et recevez votre billet en quelques secondes grâce à l’intégration sécurisée des paiements mobiles."
            color="from-orange-500 to-amber-600"
          />
          <FeatureCard
            icon={<FaBoxOpen size={36} />}
            title="Suivi de colis"
            description="Expédiez vos paquets et suivez leur état (en chargement, en route, livré) directement depuis notre site."
            color="from-purple-600 to-fuchsia-600"
          />
          <FeatureCard
            icon={<FiMapPin size={36} />}
            title="Suivi en temps réel"
            description="Géolocalisez votre bus et obtenez l’heure d’arrivée estimée, minute par minute."
            color="from-blue-500 to-indigo-600"
          />
        </div>
      </section>

      {/* 
      // ==========================================================
      // === SECTION DU CARROUSEL MISE EN COMMENTAIRE POUR LE TEST ===
      // ==========================================================
      <section id="destinations" className="py-24 bg-gradient-to-br from-white to-indigo-50">
        <div className="px-4 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-gray-800 mb-4">
              Nos destinations populaires
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Parcourez les principales villes desservies par MyBus.
            </p>
          </div>
          <DestinationCarousel />
        </div>
      </section>
      */}

      {/*
      // ==========================================================
      // === SECTION DE LA CARTE MISE EN COMMENTAIRE POUR LE TEST ===
      // ==========================================================
      <section id="suivi" className="py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-gray-800 mb-4">
            Suivi en temps réel
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Suivez votre bus ou vos colis sur notre carte interactive.
          </p>
        </div>
        <LiveMap />
      </section>
      */}

      {/* Ajoutons une section simple pour confirmer que la page se rend jusqu'au bout */}
      <div className="text-center py-10 bg-gray-200">
        <p>Test de rendu de fin de page.</p>
      </div>

    </div>
  );
};

export default HomePage;