// src/components/public/Navbar.jsx
import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { FiMenu, FiX, FiUser, FiLogOut, FiGrid, FiLayout, FiSearch, FiPackage, FiPhone } from 'react-icons/fi';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  // Nouveaux liens de navigation plus directs et pertinents
  const navLinks = [
    { name: 'Réserver un Billet', path: '/search', icon: <FiSearch/> },
    { name: 'Suivre un Colis', path: '/track-colis', icon: <FiPackage/> },
    { name: 'Aide & Contact', path: '/contact', icon: <FiPhone/> }, // Garde le lien d'ancre
  ];

  // Style pour un NavLink actif
  const activeLinkStyle = {
    color: '#db2777', // Rose/fuchsia pour correspondre au dégradé
    fontWeight: '600',
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* LOGO (tout à gauche) */}
          <div className="flex-shrink-0">
            <Link to="/">
              <img src="/assets/mybus.webp" alt="MyBus Logo" className="h-20 w-auto object-contain" />
            </Link>
          </div>

          {/* LIENS DE NAVIGATION (au centre) */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              link.path.startsWith('/#') ? (
                <a key={link.name} href={link.path} className="font-medium text-gray-600 hover:text-pink-600 transition-colors flex items-center gap-2">
                  {link.icon} {link.name}
                </a>
              ) : (
                <NavLink 
                  key={link.name} 
                  to={link.path} 
                  className="font-medium text-gray-600 hover:text-pink-600 transition-colors flex items-center gap-2"
                  style={({ isActive }) => isActive ? activeLinkStyle : undefined}
                >
                  {link.icon} {link.name}
                </NavLink>
              )
            ))}
          </div>
          
          {/* ACTIONS UTILISATEUR (tout à droite) */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                {user.role === 'admin' ? (
                  <Link to="/admin/dashboard" className="flex items-center gap-2 px-4 py-2 rounded-full font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition">
                    <FiGrid /> Admin
                  </Link>
                ) : (
                  <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 rounded-full font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition">
                    <FiLayout /> Mon Compte
                  </Link>
                )}
                <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-full font-medium text-white bg-red-500 hover:bg-red-600 transition">
                  <FiLogOut /> Déconnexion
                </button>
              </>
            ) : (
              <Link to="/login" className="flex items-center gap-2 px-5 py-2 rounded-full font-medium text-white bg-gradient-to-r from-pink-500 via-fuchsia-500 to-blue-500 hover:shadow-lg transition">
                <FiUser /> Connexion
              </Link>
            )}
          </div>
          
          {/* BOUTON MOBILE */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-md text-gray-700">
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* MENU MOBILE */}
      {isOpen && (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-white shadow-lg py-4 px-4 absolute w-full"
        >
            {navLinks.map((link) => (
                <NavLink key={link.name} to={link.path} onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">
                    {link.icon} {link.name}
                </NavLink>
            ))}
            <div className="border-t pt-4 mt-2 space-y-2">
                {user ? (
                    <>
                        {user.role === 'admin' ? (
                            <Link to="/admin/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-3 w-full px-4 py-3 rounded-md font-medium text-gray-700 bg-gray-100 hover:bg-gray-200">
                                <FiGrid /> Admin
                            </Link>
                        ) : (
                            <Link to="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-3 w-full px-4 py-3 rounded-md font-medium text-gray-700 bg-gray-100 hover:bg-gray-200">
                                <FiLayout /> Mon Compte
                            </Link>
                        )}
                        <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 rounded-md font-medium text-white bg-red-500 hover:bg-red-600">
                            <FiLogOut /> Déconnexion
                        </button>
                    </>
                ) : (
                    <Link to="/login" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-md font-medium text-white bg-gradient-to-r from-pink-500 via-fuchsia-500 to-blue-500">
                        <FiUser /> Connexion / Inscription
                    </Link>
                )}
            </div>
        </motion.div>
      )}
    </motion.nav>
  );
};
export default Navbar;