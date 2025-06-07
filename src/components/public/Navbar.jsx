// src/components/public/Navbar.jsx
import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { FiMenu, FiX, FiUser, FiLogOut, FiGrid } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
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

  const navLinks = [
    { name: 'Services', path: '/#services' },
    { name: 'Destinations', path: '/#destinations' },
    { name: 'Réservations', path: '/search' },
    { name: 'Contact', path: '/#contact' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex-shrink-0">
            <img src="/assets/mybus.webp" alt="MyBus Logo" className="h-16 w-auto object-contain" />
          </Link>

          {/* Navigation Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path} className="font-medium text-gray-700 hover:text-pink-600 transition-colors">
                {link.name}
              </Link>
            ))}
          </div>
          
          {/* Section Droite : Authentification ou Profil */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link to="/admin" className="flex items-center gap-2 px-4 py-2 rounded-full font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition">
                    <FiGrid />
                    Dashboard
                  </Link>
                )}
                <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-full font-medium text-white bg-red-500 hover:bg-red-600 transition">
                  <FiLogOut />
                  Déconnexion
                </button>
              </>
            ) : (
              <Link to="/login" className="flex items-center gap-2 px-5 py-2 rounded-full font-medium text-white bg-gradient-to-r from-pink-500 via-fuchsia-500 to-blue-500 hover:shadow-lg transition">
                <FiUser />
                Connexion
              </Link>
            )}
          </div>
          
          {/* Bouton Menu Mobile */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-md text-gray-700">
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      {isOpen && (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-white shadow-lg py-4 px-4 space-y-2"
        >
            {navLinks.map((link) => (
                <Link key={link.name} to={link.path} onClick={() => setIsOpen(false)} className="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100">
                    {link.name}
                </Link>
            ))}
            <div className="border-t pt-4 mt-2 space-y-2">
                {user ? (
                    <>
                        {user.role === 'admin' && (
                            <Link to="/admin" onClick={() => setIsOpen(false)} className="flex items-center gap-2 w-full px-4 py-2 rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200">
                                <FiGrid /> Dashboard
                            </Link>
                        )}
                        <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-2 rounded-md text-white bg-red-500 hover:bg-red-600">
                            <FiLogOut /> Déconnexion
                        </button>
                    </>
                ) : (
                    <Link to="/login" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-md text-white bg-gradient-to-r from-pink-500 via-fuchsia-500 to-blue-500">
                        <FiUser /> Connexion
                    </Link>
                )}
            </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;