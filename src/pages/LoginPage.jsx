import React from 'react'
import { FaUserAlt, FaLock } from 'react-icons/fa'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tr from-pink-100 via-white to-blue-100">
      {/* Navbar */}
      <Navbar />

      {/* Contenu principal */}
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white shadow-2xl rounded-3xl p-8 md:p-12 w-full max-w-md">
          <h2 className="text-3xl font-extrabold text-center text-pink-600 mb-8 font-playfair">
            Connexion à MyBus
          </h2>

          <form className="space-y-6">
            {/* Nom d'utilisateur */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Nom d'utilisateur
              </label>
              <div className="flex items-center border border-pink-200 rounded-xl px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-400">
                <FaUserAlt className="text-pink-400 mr-2" />
                <input
                  type="text"
                  placeholder="Entrez votre nom"
                  className="w-full outline-none text-gray-800 bg-transparent"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Mot de passe
              </label>
              <div className="flex items-center border border-blue-200 rounded-xl px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-pink-400">
                <FaLock className="text-blue-400 mr-2" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full outline-none text-gray-800 bg-transparent"
                />
              </div>
            </div>

            {/* Bouton connexion */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-blue-500 text-white py-3 rounded-xl shadow-lg hover:opacity-90 transition-all duration-200"
            >
              Se connecter
            </button>
          </form>
        </div>
      </div>

    </div>
  )
}
