// src/pages/auth/RegisterPage.jsx
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { FiUserPlus, FiLoader } from 'react-icons/fi';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    mot_de_passe: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simple vérification de la correspondance des mots de passe côté client
    if (formData.mot_de_passe !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    setError('');
    try {
      // On envoie les données directement au backend.
      // C'est le backend qui validera tout (longueur mdp, format email, format tel, etc.)
      const user = await register({
        prenom: formData.prenom,
        nom: formData.nom,
        email: formData.email,
        telephone: formData.telephone,
        mot_de_passe: formData.mot_de_passe
      });
      
      // Redirection si succès
      if (user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }

    } catch (err) {
      // On affiche le message d'erreur renvoyé par le backend
      setError(err.response?.data?.message || 'Une erreur est survenue lors de l\'inscription.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center p-4 bg-gradient-to-br from-pink-50 via-blue-50 to-white">
      <div className="bg-white shadow-2xl rounded-3xl p-8 md:p-12 w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-center text-pink-600 mb-8 font-playfair">
          Créer vun compte
        </h2>
        
        {error && <p className="text-red-600 bg-red-50 text-center p-3 rounded-lg mb-4">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input name="prenom" value={formData.prenom} onChange={handleChange} placeholder="Prénom" required className="w-full border-gray-300 border p-3 rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"/>
            <input name="nom" value={formData.nom} onChange={handleChange} placeholder="Nom" required className="w-full border-gray-300 border p-3 rounded-lg focus:ring-2 focus:ring-pink-400 outline-none" />
          </div>
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required className="w-full border-gray-300 border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" />
          <input 
            type="tel" 
            name="telephone" 
            value={formData.telephone} 
            onChange={handleChange} 
            placeholder="Téléphone (8 chiffres)" 
            className="w-full border-gray-300 border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" 
          />
          <input type="password" name="mot_de_passe" value={formData.mot_de_passe} onChange={handleChange} placeholder="Mot de passe (8 caractères min.)" required className="w-full border-gray-300 border p-3 rounded-lg focus:ring-2 focus:ring-pink-400 outline-none" />
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirmer le mot de passe" required className="w-full border-gray-300 border p-3 rounded-lg focus:ring-2 focus:ring-pink-400 outline-none" />
          
          {/* La liste de validation en temps réel a été supprimée */}
          
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-gradient-to-r from-pink-500 to-blue-500 text-white font-semibold py-3 rounded-xl shadow-lg hover:opacity-90 transition-all duration-200 flex items-center justify-center disabled:opacity-50"
          >
            {loading ? <FiLoader className="animate-spin" /> : <><FiUserPlus className="mr-2" /> S'inscrire</>}
          </button>
        </form>
        
        <p className="text-center text-sm text-gray-600 mt-6">
          Déjà un compte ? <Link to="/login" className="font-semibold text-blue-600 hover:underline">Connectez-vous</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;