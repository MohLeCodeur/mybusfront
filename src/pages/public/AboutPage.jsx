// src/pages/public/AboutPage.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { FiTarget, FiZap, FiUsers, FiCheckCircle } from 'react-icons/fi';

// Variants pour les animations d'apparition
const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const FeatureCard = ({ icon, title, children }) => (
  <motion.div variants={fadeInUp} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
    <div className="flex items-center gap-4 mb-4">
      <div className="flex-shrink-0 h-14 w-14 flex items-center justify-center bg-gradient-to-br from-pink-500 to-blue-500 rounded-full text-white shadow-lg">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-gray-800 font-playfair">{title}</h3>
    </div>
    <p className="text-gray-600 leading-relaxed">{children}</p>
  </motion.div>
);

const AboutPage = () => {
  return (
    <div className="bg-gray-50/50">
      {/* Section Hero */}
      <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 text-white py-24 sm:py-32 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/bus-hero.webp')] bg-cover bg-center opacity-10" />
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl md:text-6xl font-extrabold font-playfair tracking-tight">
            Notre Histoire
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-xl text-indigo-200">
            Transformer le transport au Mali grâce à l'innovation et la technologie.
          </p>
        </motion.div>
      </div>

      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="max-w-5xl mx-auto"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={stagger}
        >
          {/* Notre Mission */}
          <FeatureCard icon={<FiTarget size={28} />} title="Notre Mission">
            Face aux défis du secteur du transport au Mali – gestion manuelle, absence de suivi, organisation perfectible – nous avons créé MyBus. Notre ambition est simple : développer une solution numérique centralisée pour révolutionner l'expérience des voyageurs et l'efficacité des compagnies. Nous visons à optimiser les opérations, améliorer la transparence et renforcer la qualité du service.
          </FeatureCard>

          <hr className="my-16 border-dashed border-gray-300" />
          
          {/* Nos Engagements */}
          <div className="text-center mb-12">
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold font-playfair text-gray-800">Nos Engagements</motion.h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FeatureCard icon={<FiZap size={28} />} title="Efficacité et Fiabilité">
              Automatiser les processus pour réduire les erreurs, diminuer les temps d'attente et garantir une ponctualité améliorée grâce au suivi GPS précis et à une plateforme robuste.
            </FeatureCard>
            <FeatureCard icon={<FiUsers size={28} />} title="Centré sur l'Utilisateur">
              Offrir une interface simple et accessible, des informations fiables et une visibilité complète pour que chaque voyageur et expéditeur de colis vive une expérience positive et sereine.
            </FeatureCard>
          </div>

          <hr className="my-16 border-dashed border-gray-300" />

          {/* Pourquoi nous choisir */}
          <motion.div variants={fadeInUp} className="bg-gradient-to-br from-pink-500 to-blue-600 text-white p-10 rounded-3xl shadow-2xl">
              <h2 className="text-3xl font-bold font-playfair mb-4">La promesse MyBus</h2>
              <p className="text-lg text-pink-100/90 leading-relaxed">
                  Chaque fonctionnalité de MyBus a été conçue en pensant à vous. De la réservation instantanée à la tranquillité d'esprit que procure le suivi en temps réel, nous nous engageons à rendre vos voyages plus simples, plus sûrs et plus agréables.
              </p>
              <ul className="mt-6 space-y-2">
                  <li className="flex items-center gap-3"><FiCheckCircle/> Paiements mobiles sécurisés.</li>
                  <li className="flex items-center gap-3"><FiCheckCircle/> Suivi GPS précis de votre bus.</li>
                  <li className="flex items-center gap-3"><FiCheckCircle/> Gestion transparente des colis.</li>
              </ul>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;