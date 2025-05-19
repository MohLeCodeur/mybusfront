import React from 'react'
import { FaUserAlt, FaLock } from 'react-icons/fa'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-pink-100 via-white to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-3xl p-8 md:p-12 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-pink-600 mb-6 font-playfair">Connexion à MyBus</h2>

        <form className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Nom d'utilisateur</label>
            <div className="flex items-center border rounded-xl px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-400">
              <FaUserAlt className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Entrez votre nom"
                className="w-full outline-none text-gray-800 bg-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Mot de passe</label>
            <div className="flex items-center border rounded-xl px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-pink-400">
              <FaLock className="text-gray-400 mr-2" />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full outline-none text-gray-800 bg-transparent"
              />
            </div>
          </div>

        

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-blue-500 text-white py-2 rounded-xl shadow-lg hover:opacity-90 transition"
          >
            Se connecter
          </button>
        </form>

       
      </div>
    </div>
  )
}
