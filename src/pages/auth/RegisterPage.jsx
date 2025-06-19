// src/pages/auth/RegisterPage.jsx
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { FiUserPlus, FiLoader, FiCheck, FiX } from 'react-icons/fi';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ prenom: '', nom: '', email: '', telephone: '', mot_de_passe: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // --- NOUVEAU : État pour la validation en temps réel ---
  const [validation, setValidation] = useState({
      pwdLength: false,
      pwdMatch: false,
      phoneFormat: true, // Vrai par défaut, devient faux si invalide
  });
  // ----------------------------------------------------

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  // Effet pour mettre à jour la validation à chaque changement du formulaire
  useEffect(() => {
    const { mot_de_passe, confirmPassword, telephone } = formData;
    setValidation({
        pwdLength: mot_de_passe.length >= 8,
        pwdMatch: mot_de_passe !== '' && mot_de_passe === confirmPassword,
        // Le numéro est valide s'il est vide OU s'il a 8 chiffres
        phoneFormat: telephone === '' || /^[0-9]{8}$/.test(telephone),
    });
  }, [formData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // On vérifie la validité avant d'envoyer
    if (!validation.pwdLength || !validation.pwdMatch || !validation.phoneFormat) {
        setError("Veuillez corriger les erreurs dans le formulaire.");
        return;
    }
    setLoading(true);
    setError('');
    try {
      await register({ ...formData }); // on envoie toutes les données
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  const ValidationItem = ({ isValid, text }) => (
    <li className={`flex items-center text-sm ${isValid ? 'text-green-600' : 'text-gray-500'}`}>
        {isValid ? <FiCheck className="mr-2"/> : <FiX className="mr-2"/>} {text}
    </li>
  );

  return (
    <div className="flex-grow flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-3xl p-8 md:p-12 w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-center text-pink-600 mb-8 font-playfair">Créer un compte</h2>
        {error && <p className="text-red-500 bg-red-50 text-center p-3 rounded-lg mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input name="prenom" value={formData.prenom} onChange={handleChange} placeholder="Prénom" required className="w-full border p-3 rounded-lg"/>
            <input name="nom" value={formData.nom} onChange={handleChange} placeholder="Nom" required className="w-full border p-3 rounded-lg" />
          </div>
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required className="w-full border p-3 rounded-lg" />
          <input type="tel" name="telephone" value={formData.telephone} onChange={handleChange} placeholder="Téléphone (8 chiffres, optionnel)" className={`w-full border p-3 rounded-lg ${!validation.phoneFormat ? 'border-red-500' : ''}`} />
          <input type="password" name="mot_de_passe" value={formData.mot_de_passe} onChange={handleChange} placeholder="Mot de passe" required className="w-full border p-3 rounded-lg" />
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirmer le mot de passe" required className="w-full border p-3 rounded-lg" />
          
          {/* --- NOUVEAU : Affichage des règles de validation --- */}
          <ul className="space-y-1 pt-2">
            <ValidationItem isValid={validation.pwdLength} text="Au moins 8 caractères" />
            <ValidationItem isValid={validation.pwdMatch} text="Les mots de passe correspondent" />
            <ValidationItem isValid={validation.phoneFormat} text="Format téléphone correct (8 chiffres)" />
          </ul>
          {/* ---------------------------------------------------- */}
          
          <button type="submit" disabled={loading || !validation.pwdLength || !validation.pwdMatch || !validation.phoneFormat} className="w-full ...">
            {/* ... */}
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-6">Déjà un compte ? <Link to="/login" className="font-semibold text-blue-600 hover:underline">Connectez-vous</Link></p>
      </div>
    </div>
  );
};
export default RegisterPage;