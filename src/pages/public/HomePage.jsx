// src/pages/public/HomePage.jsx (VERSION MINIMALISTE FINALE)

import React from 'react';

// On importe uniquement les composants les plus simples
import Hero from '../../components/public/Hero';
import FeatureCard from '../../components/public/FeatureCard';
import { FiSmartphone, FiMapPin } from 'react-icons/fi';
import { FaBoxOpen } from 'react-icons/fa';

const HomePage = () => {
  console.log("✅ [HomePage.jsx minimaliste] Rendu en cours...");

  return (
    // La div principale n'utilise plus de classe d'animation
    <div className="overflow-x-hidden bg-gray-50">
      
      {/* 
        Le composant Hero est conservé, mais il faudra peut-être 
        aussi le simplifier si l'erreur persiste.
      */}
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
        Les composants complexes (Carousel, Map) sont complètement retirés pour ce test.
      */}

      <div className="text-center py-10 bg-gray-200">
        <h1>Ceci est la page d'accueil minimaliste.</h1>
        <p>Si vous voyez ce message, le problème vient d'un composant plus complexe.</p>
      </div>

    </div>
  );
};

export default HomePage;