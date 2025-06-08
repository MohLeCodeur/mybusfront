// src/components/admin/StatusStepper.jsx
import React from 'react';

// On définit les étapes dans un ordre logique
const STEPS = ['enregistré', 'encours', 'arrivé'];

const StatusStepper = ({ currentStatus }) => {
  // On trouve l'index (la position) du statut actuel dans notre tableau STEPS.
  // Si le statut n'est pas trouvé, on met -1.
  const currentIndex = STEPS.indexOf(currentStatus);

  return (
    <div className="w-full">
      <div className="flex items-start justify-between relative">
        
        {/* Ligne de progression derrière les bulles */}
        <div className="absolute left-0 top-3 w-full h-0.5 bg-gray-200">
          <div
            className="h-full bg-green-500 transition-all duration-500"
            // La barre verte va jusqu'au milieu de la bulle actuelle
            style={{ width: `calc(${(currentIndex / (STEPS.length - 1)) * 100}% - 1rem)` }}
          />
        </div>

        {/* Boucle pour afficher chaque étape (bulle + texte) */}
        {STEPS.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;

          // Définition des couleurs en fonction de l'état de l'étape
          let ringColor = 'ring-gray-300';
          let bgColor = 'bg-white';
          let textColor = 'text-gray-500';
          let iconContent = null;

          if (isCompleted) {
            // Étape terminée
            ringColor = 'ring-green-500';
            bgColor = 'bg-green-500';
            textColor = 'text-gray-700';
            iconContent = <span className="text-white text-xs font-bold">✓</span>;
          } else if (isCurrent) {
            // Étape actuelle
            ringColor = 'ring-blue-500';
            bgColor = 'bg-blue-500';
            textColor = 'font-semibold text-blue-600';
            // On affiche un point animé pour montrer que c'est l'étape active
            iconContent = <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>;
          }
          // Pour les étapes futures, les couleurs par défaut (grises) sont utilisées

          return (
            <div key={step} className="z-10 flex flex-col items-center w-20">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ring-4 transition-colors duration-500 ${ringColor} ${bgColor}`}
              >
                {iconContent}
              </div>
              <p className={`mt-2 text-xs text-center capitalize transition-colors duration-500 ${textColor}`}>
                {step.replace('_', ' ')}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatusStepper;