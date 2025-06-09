// src/pages/public/ContactPage.jsx
import React, { useState } from 'react';
import { FiHelpCircle, FiMail, FiPhone, FiMessageSquare, FiSend } from 'react-icons/fi';

// Composant pour une question/réponse de la FAQ
const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left text-lg font-semibold text-gray-800"
      >
        <span>{question}</span>
        <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>
      <div
        className={`grid transition-all duration-500 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <p className="pt-2 text-gray-600">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
};

// Composant principal de la page
const ContactPage = () => {
    // Questions et réponses pour la FAQ
    const faqs = [
        {
            question: "Comment puis-je suivre mon colis ?",
            answer: "Vous pouvez suivre votre colis directement depuis notre site en utilisant le code de suivi qui vous a été fourni lors de l'enregistrement. Rendez-vous sur la page 'Suivre un Colis' et entrez votre code."
        },
        {
            question: "Quels sont les moyens de paiement acceptés ?",
            answer: "Nous acceptons principalement les paiements par mobile money (Orange Money, Moov Money, etc.) via notre partenaire de paiement sécurisé. Le paiement en espèces est également possible dans nos agences."
        },
        {
            question: "Puis-je modifier ou annuler ma réservation ?",
            answer: "Pour toute modification ou annulation de réservation de billet, veuillez contacter notre service client par téléphone au moins 24 heures avant le départ prévu. Des frais peuvent s'appliquer."
        },
        {
            question: "Que faire si mon bus est en retard ?",
            answer: "Vous pouvez suivre la position de votre bus en temps réel depuis votre tableau de bord client si vous avez une réservation. En cas de retard important, notre service client vous contactera par SMS ou téléphone."
        }
    ];

    return (
        <div className="bg-gradient-to-br from-pink-50 via-blue-50 to-white py-16 px-4">
            <div className="max-w-6xl mx-auto">
                {/* En-tête de la page */}
                <div className="text-center mb-16">
                    <FiHelpCircle className="mx-auto text-6xl text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-500 mb-4"/>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 font-playfair">Besoin d'aide ?</h1>
                    <p className="text-lg text-gray-500 mt-2">Nous sommes là pour vous aider. Trouvez des réponses ou contactez-nous.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Colonne de gauche : FAQ */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Foire Aux Questions</h2>
                        <div className="space-y-2">
                            {faqs.map((faq, index) => (
                                <FaqItem key={index} question={faq.question} answer={faq.answer} />
                            ))}
                        </div>
                    </div>

                    {/* Colonne de droite : Formulaire et autres contacts */}
                    <div className="space-y-8">
                        <div className="bg-white p-8 rounded-2xl shadow-lg">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2"><FiMessageSquare/> Envoyez-nous un message</h2>
                            <form className="space-y-4">
                                <input type="text" placeholder="Votre Nom" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400"/>
                                <input type="email" placeholder="Votre Email" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400"/>
                                <textarea placeholder="Votre message..." rows="5" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400"></textarea>
                                <button type="submit" className="w-full py-3 font-semibold text-white bg-gradient-to-r from-pink-500 to-blue-500 rounded-lg hover:shadow-lg hover:brightness-110 transition">
                                    <FiSend className="inline mr-2"/> Envoyer
                                </button>
                            </form>
                        </div>
                        
                        <div className="bg-white p-8 rounded-2xl shadow-lg">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Autres moyens de nous joindre</h2>
                            <div className="space-y-3">
                                <a href="tel:+22391234567" className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition">
                                    <FiPhone className="text-blue-500"/>
                                    <span>+223 91 23 45 67</span>
                                </a>
                                <a href="mailto:support@mybus.ml" className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition">
                                    <FiMail className="text-blue-500"/>
                                    <span>support@mybus.ml</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;