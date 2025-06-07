// src/components/admin/StatusStepper.jsx
import React from 'react';

const STEPS = ['enregistré', 'encours', 'arrivé'];

const StatusStepper = ({ currentStatus }) => {
  const currentIndex = STEPS.indexOf(currentStatus);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between relative">
        {/* Ligne de progression */}
        <div className="absolute left-0 top-1/2 w-full h-0.5 bg-gray-200" style={{ transform: 'translateY(-50%)' }}>
          <div
            className="h-full bg-blue-500 transition-all duration-500"
            style={{ width: `${(currentIndex / (STEPS.length - 1)) * 100}%` }}
          />
        </div>

        {/* Étapes */}
        {STEPS.map((step, i) => {
          const isCompleted = i < currentIndex;
          const isCurrent = i === currentIndex;
          const isFuture = i > currentIndex;

          let ringColor = 'ring-gray-300';
          let bgColor = 'bg-gray-300';
          let textColor = 'text-gray-500';

          if (isCompleted) {
            ringColor = 'ring-green-500';
            bgColor = 'bg-green-500';
            textColor = 'text-green-600 font-semibold';
          } else if (isCurrent) {
            ringColor = 'ring-blue-500';
            bgColor = 'bg-blue-500';
            textColor = 'text-blue-600 font-semibold';
          }

          return (
            <div key={step} className="z-10 flex flex-col items-center">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ring-4 transition-colors duration-500 ${ringColor} ${isFuture ? 'bg-white' : bgColor}`}
              >
                {isCompleted && <span className="text-white text-xs">✓</span>}
              </div>
              <span className={`mt-2 text-xs text-center capitalize ${textColor}`}>
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatusStepper;