// src/components/public/Footer.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  // On simplifie les liens en deux colonnes principales
  const footerLinks = [
    {
      title: 'Navigation',
      links: [
        { name: 'Réserver un Billet', path: '/search' },
        { name: 'Suivre un Colis', path: '/track-colis' },
        { name: 'Nos Destinations', path: '/#destinations' },
        { name: 'Aide & Contact', path: '/#contact' }
      ]
    },
    {
      title: 'Légal',
      links: [
        { name: 'À Propos de MyBus', path: '/about' },
        { name: 'Conditions Générales', path: '/terms' },
        { name: 'Politique de Confidentialité', path: '/privacy' },
      ]
    }
  ];

  const socialLinks = [
    { icon: FaFacebookF, name: 'Facebook', url: 'https://facebook.com/mybusmali' },
    { icon: FaTwitter,  name: 'Twitter',  url: 'https://twitter.com/mybusmali' },
    { icon: FaInstagram,name: 'Instagram',url: 'https://instagram.com/mybusmali' },
    { icon: FaLinkedinIn, name: 'LinkedIn', url: 'https://linkedin.com/company/mybusmali' }
  ];

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="relative text-white bg-gradient-to-b from-gray-900 via-gray-900 to-black"
    >
      <div className="max-w-7xl mx-auto pt-20 pb-12 px-4">
        {/* Grille principale simplifiée */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Colonne 1 : Logo et Social (prend plus de place) */}
          <div className="md:col-span-1 space-y-6">
            <Link to="/">
              <img src="/assets/mybus.webp" alt="MyBus Logo" className="h-20 w-auto object-contain" />
            </Link>
            <p className="font-inter text-gray-400 leading-relaxed text-sm">
              Votre partenaire de confiance pour voyager à travers le Mali. Fiabilité, confort et sécurité.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map(({ icon: Icon, name, url }) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="group h-10 w-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-pink-600 transition-all duration-300"
                >
                  <Icon className="text-gray-400 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Colonnes 2 & 3 : Liens (prend le reste de la place) */}
          <div className="md:col-span-2 grid grid-cols-2 gap-8">
            {footerLinks.map(section => (
              <div key={section.title}>
                <h3 className="font-playfair text-lg font-semibold mb-6 tracking-wide">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map(link => (
                    <li key={link.name}>
                      <Link
                        to={link.path}
                        className="font-inter text-gray-400 hover:text-white transition-colors duration-200"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>

        {/* Barre inférieure avec copyright */}
        <div className="mt-16 border-t border-gray-800 pt-8 text-center">
          <p className="font-inter text-gray-500 text-sm">
            © {new Date().getFullYear()} MyBus Mali. Tous droits réservés.
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;