// src/pages/auth/RegisterPage.jsx
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { FiUserPlus, FiLoader, FiCheck, FiX } from 'react-icons/fi';

// Petit composant interne pour afficher une ligne de validation
const ValidationItem = ({ isValid, text }) => (
    <li className={`flex items-center text-sm transition-colors duration-300 ${isValid ? 'text-green-600' : 'text-gray-500'}`}>
        {isValid ? 
            <FiCheck className="mr-2 text-green-600 shrink-0"/> : 
            <FiX className="mr-2 text-gray-400 shrink-0"/>
        }
        <span>{text}</span>
    </li>
);


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
  
  // État pour la validation des champs en temps réel
  const [validation, setValidation] = useState({
      pwdLength: false,
      pwdMatch: false,
      phoneFormat: true, // Vrai par défaut, devient faux si le format est incorrect
  });

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  // useEffect pour mettre à jour la validation à chaque changement dans le formulaire
  useEffect(() => {
    const { mot_de_passe, confirmPassword, telephone } = formData;
    setValidation({
        pwdLength: mot_de_passe.length >= 8,
        pwdMatch: mot_de_passe !== '' && mot_de_passe === confirmPassword,
        // Le numéro est considéré comme valide s'il est vide OU s'il contient exactement 8 chiffres
        phoneFormat: telephone === '' || /^[0-9]{8}$/.test(telephone),
    });
  }, [formData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // On vérifie une dernière fois la validité avant d'envoyer
    if (!validation.pwdLength || !validation.pwdMatch || !validation.phoneFormat) {
        setError("Veuillez corriger les erreurs indiquées dans le formulaire.");
        return;
    }

    setLoading(true);
    setError('');
    try {
      const user = await register({
        prenom: formData.prenom,
        nom: formData.nom,
        email: formData.email,
        telephone: formData.telephone,
        mot_de_passe: formData.mot_de_passe
      });
      
      // Redirection après succès
      if (user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }

    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue lors de l\'inscription.');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = validation.pwdLength && validation.pwdMatch && validation.phoneFormat;

  return (
    <div className="flex-grow flex items-center justify-center p-4 bg-gradient-to-br from-pink-50 via-blue-50 to-white">
      <div className="bg-white shadow-2xl rounded-3xl p-8 md:p-12 w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-center text-pink-600 mb-8 font-playfair">
          Créer votre compte MyBus
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
            placeholder="Téléphone (8 chiffres, optionnel)" 
            className={`w-full border p-3 rounded-lg outline-none transition-all ${!validation.phoneFormat ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300 focus:ring-2 focus:ring-blue-400'}`} 
          />
          <input type="password" name="mot_de_passe" value={formData.mot_de_passe} onChange={handleChange} placeholder="Mot de passe" required className="w-full border-gray-300 border p-3 rounded-lg focus:ring-2 focus:ring-pink-400 outline-none" />
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirmer le mot de passe" required className="w-full border-gray-300 border p-3 rounded-lg focus:ring-2 focus:ring-pink-400 outline-none" />
          
          <ul className="space-y-1 pt-2">
            <ValidationItem isValid={validation.pwdLength} text="Au moins 8 caractères" />
            <ValidationItem isValid={validation.pwdMatch} text="Les mots de passe correspondent" />
            <ValidationItem isValid={validation.phoneFormat} text="Format téléphone correct (ou vide)" />
          </ul>
          
          <button 
            type="submit" 
            disabled={loading || !isFormValid} 
            className="w-full bg-gradient-to-r from-pink-500 to-blue-500 text-white font-semibold py-3 rounded-xl shadow-lg hover:opacity-90 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
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