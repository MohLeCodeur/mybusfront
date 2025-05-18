import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FiMenu, FiX, FiUser } from 'react-icons/fi'
import { Link } from 'react-router-dom'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  const navLinks = [
    { name: 'Services', path: '/#services' },
    { name: 'Destinations', path: '/#destinations' },
    { name: 'Réservations', path: '/search' },
    { name: 'Contact', path: '/#contact' }
  ]

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <motion.div whileHover={{ scale: 1.05 }} className="h-19 w-32 relative">
              <img src="/assets/mybus.webp" alt="MyBus Logo" className="h-full w-full object-contain" />
            </motion.div>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center ml-10 space-x-8">
            {navLinks.map(link => (
              <motion.div key={link.name} whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                <Link
                  to={link.path}
                  className="relative font-medium text-gray-700 hover:text-primary transition-colors duration-300 group"
                  aria-label={link.name}
                >
                  {link.name}
                  <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary group-hover:w-full transition-all duration-300" />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Connexion – poussé tout à droite */}
          <div className="hidden md:flex ml-auto">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/login"
                className="flex items-center gap-2 px-5 py-2 rounded-full font-medium text-white bg-gradient-to-r from-pink-500 via-fuchsia-500 to-blue-500 hover:shadow-lg transition-all duration-300"
              >
                <FiUser />
                Connexion
              </Link>
            </motion.div>
          </div>

          {/* Mobile buttons */}
          <div className="md:hidden ml-auto flex items-center gap-4">
            <Link
              to="/login"
              className="sm:flex hidden items-center gap-1 px-3 py-1.5 rounded-full text-sm text-white bg-gradient-to-r from-pink-500 via-fuchsia-500 to-blue-500"
            >
              <FiUser size={16} />
            </Link>

            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-700 hover:text-primary focus:outline-none"
              aria-label="Menu"
            >
              {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-white shadow-lg overflow-hidden"
        >
          <div className="px-4 pt-2 pb-6 space-y-3">
            {navLinks.map(link => (
              <Link
                key={link.name}
                to={link.path}
                className="block px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-indigo-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            <Link
              to="/login"
              className="mt-3 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium text-white bg-gradient-to-r from-pink-500 via-fuchsia-500 to-blue-500"
              onClick={() => setIsOpen(false)}
            >
              <FiUser />
              Connexion
            </Link>
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}

export default Navbar
