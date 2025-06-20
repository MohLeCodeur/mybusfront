// src/layouts/LegalPageLayout.jsx

import React from 'react';
import { motion } from 'framer-motion';

const LegalPageLayout = ({ title, lastUpdated, children }) => {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-blue-50/50 min-h-screen">
      <div className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold font-playfair text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-500">
              {title}
            </h1>
            <p className="mt-3 text-sm text-gray-500">Dernière mise à jour : {lastUpdated}</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 border border-gray-100">
            {/* Le 'prose' de Tailwind Typography est parfait pour styler du texte long */}
            <div className="prose prose-lg max-w-none prose-h2:font-playfair prose-h2:text-gray-800 prose-a:text-blue-600 hover:prose-a:text-pink-600 prose-strong:text-gray-700">
                {children}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LegalPageLayout;